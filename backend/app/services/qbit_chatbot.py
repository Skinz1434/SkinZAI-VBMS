"""
QBit - Quantum Benefits Intelligence Transformer
Secure chatbot with M21/CFR knowledge and navigation capabilities
"""

import asyncio
import json
import hashlib
from typing import Dict, Any, List, Optional, Tuple
from datetime import datetime
import structlog
from enum import Enum

from app.core.security import input_sanitizer
from app.services.knowledge_base import KnowledgeBaseService
from app.services.agent_orchestrator import AgentOrchestrator

logger = structlog.get_logger()

class MessageType(Enum):
    """Message types for QBit interactions"""
    CHAT = "chat"
    NAVIGATION = "navigation"
    CLAIM_ASSISTANCE = "claim_assistance"
    KNOWLEDGE_QUERY = "knowledge_query"
    NOTIFICATION = "notification"
    SYSTEM = "system"

class QBitChatbot:
    """Main QBit chatbot with security and knowledge integration"""
    
    def __init__(self, kb_service: KnowledgeBaseService, orchestrator: AgentOrchestrator):
        self.kb_service = kb_service
        self.orchestrator = orchestrator
        self.conversation_cache = {}
        
    async def process_message(
        self,
        user_id: str,
        session_id: str,
        message: str,
        message_type: MessageType = MessageType.CHAT,
        context: Optional[Dict[str, Any]] = None
    ) -> Dict[str, Any]:
        """Process user message with security and context awareness"""
        
        # Sanitize input
        sanitized_message = input_sanitizer.sanitize_string(message, max_length=2000)
        
        # Log interaction (without storing sensitive data)
        message_hash = hashlib.sha256(sanitized_message.encode()).hexdigest()[:8]
        logger.info(
            "QBit processing message",
            user_id=user_id,
            session_id=session_id,
            message_type=message_type.value,
            message_hash=message_hash
        )
        
        try:
            # Determine intent and route appropriately
            intent = await self._analyze_intent(sanitized_message, context)
            
            # Process based on intent
            if intent["type"] == "navigation":
                response = await self._handle_navigation(sanitized_message, context)
            elif intent["type"] == "claim_query":
                response = await self._handle_claim_query(sanitized_message, user_id, context)
            elif intent["type"] == "knowledge":
                response = await self._handle_knowledge_query(sanitized_message, context)
            else:
                response = await self._handle_general_chat(sanitized_message, user_id, session_id, context)
            
            # Add security metadata
            response["metadata"] = {
                "processed_at": datetime.utcnow().isoformat(),
                "intent": intent["type"],
                "confidence": intent["confidence"]
            }
            
            return response
            
        except Exception as e:
            logger.error(
                "Error processing QBit message",
                error=str(e),
                user_id=user_id
            )
            
            return {
                "type": "error",
                "message": "I encountered an issue processing your request. Please try again.",
                "error_code": "PROCESSING_ERROR"
            }
    
    async def _analyze_intent(self, message: str, context: Optional[Dict[str, Any]]) -> Dict[str, Any]:
        """Analyze user intent from message"""
        message_lower = message.lower()
        
        # Navigation intent patterns
        navigation_patterns = [
            "take me to", "navigate to", "go to", "open",
            "show me", "where is", "how do i get to"
        ]
        
        # Claim-related patterns
        claim_patterns = [
            "claim", "rating", "disability", "compensation",
            "c&p", "exam", "evidence", "nexus", "service connection"
        ]
        
        # Knowledge query patterns
        knowledge_patterns = [
            "what is", "explain", "tell me about", "how does",
            "m21", "cfr", "regulation", "policy", "procedure"
        ]
        
        # Check patterns
        if any(pattern in message_lower for pattern in navigation_patterns):
            return {"type": "navigation", "confidence": 0.9}
        elif any(pattern in message_lower for pattern in claim_patterns):
            return {"type": "claim_query", "confidence": 0.85}
        elif any(pattern in message_lower for pattern in knowledge_patterns):
            return {"type": "knowledge", "confidence": 0.8}
        else:
            return {"type": "general", "confidence": 0.7}
    
    async def _handle_navigation(self, message: str, context: Optional[Dict[str, Any]]) -> Dict[str, Any]:
        """Handle navigation requests"""
        
        # Navigation mappings
        navigation_map = {
            "claims": "/claims",
            "dashboard": "/",
            "appeals": "/appeals",
            "quality": "/quality",
            "metrics": "/metrics",
            "ai orchestration": "/ai-orchestration",
            "documents": "/documents",
            "efolder": "/efolder",
            "veterans": "/veterans",
            "settings": "/settings",
            "help": "/help",
            "reports": "/reports"
        }
        
        message_lower = message.lower()
        
        # Find matching navigation
        for key, path in navigation_map.items():
            if key in message_lower:
                return {
                    "type": "navigation",
                    "action": "navigate",
                    "path": path,
                    "message": f"I'll take you to the {key.title()} section.",
                    "navigation_data": {
                        "path": path,
                        "name": key.title(),
                        "description": self._get_section_description(key)
                    }
                }
        
        return {
            "type": "navigation",
            "action": "suggest",
            "message": "I'm not sure which section you want to navigate to. Here are the available options:",
            "suggestions": list(navigation_map.keys())
        }
    
    async def _handle_claim_query(
        self,
        message: str,
        user_id: str,
        context: Optional[Dict[str, Any]]
    ) -> Dict[str, Any]:
        """Handle claim-related queries with M21/CFR knowledge"""
        
        # Query knowledge base for relevant information
        kb_results = await self.kb_service.query(
            query=message,
            categories=["M21-1", "38CFR", "claims_processing"],
            top_k=3
        )
        
        # Use appropriate agent for claim assistance
        agent_response = await self.orchestrator.process_with_agent(
            agent_type="claims_processor",
            task={
                "query": message,
                "kb_results": kb_results,
                "user_context": context
            },
            user_id=user_id
        )
        
        return {
            "type": "claim_assistance",
            "message": agent_response["response"],
            "references": kb_results.get("references", []),
            "confidence": agent_response.get("confidence", 0.8),
            "suggested_actions": agent_response.get("suggested_actions", [])
        }
    
    async def _handle_knowledge_query(
        self,
        message: str,
        context: Optional[Dict[str, Any]]
    ) -> Dict[str, Any]:
        """Handle knowledge base queries"""
        
        # Query all relevant knowledge categories
        kb_results = await self.kb_service.query(
            query=message,
            categories=["M21-1", "38CFR", "VA_procedures", "best_practices"],
            top_k=5
        )
        
        if not kb_results.get("results"):
            return {
                "type": "knowledge",
                "message": "I couldn't find specific information about that topic. Could you please rephrase or provide more details?",
                "suggestions": self._get_related_topics(message)
            }
        
        # Format response with citations
        response = self._format_knowledge_response(kb_results)
        
        return {
            "type": "knowledge",
            "message": response["text"],
            "citations": response["citations"],
            "related_topics": response["related_topics"]
        }
    
    async def _handle_general_chat(
        self,
        message: str,
        user_id: str,
        session_id: str,
        context: Optional[Dict[str, Any]]
    ) -> Dict[str, Any]:
        """Handle general conversation"""
        
        # Use general purpose agent
        agent_response = await self.orchestrator.process_with_agent(
            agent_type="general_assistant",
            task={
                "message": message,
                "context": context,
                "session_id": session_id
            },
            user_id=user_id
        )
        
        return {
            "type": "chat",
            "message": agent_response["response"],
            "follow_up_suggestions": agent_response.get("suggestions", [])
        }
    
    def _get_section_description(self, section: str) -> str:
        """Get description for navigation sections"""
        descriptions = {
            "claims": "Manage and process disability compensation claims",
            "dashboard": "View system overview and key metrics",
            "appeals": "Handle appeals and review cases",
            "quality": "Quality review and assurance tools",
            "metrics": "Performance analytics and KPI monitoring",
            "ai orchestration": "Monitor AI agent performance and configuration",
            "documents": "Document management and processing",
            "efolder": "Access veteran electronic folders",
            "veterans": "Veteran profiles and information",
            "settings": "System and user settings",
            "help": "Help center and documentation",
            "reports": "Generate and view reports"
        }
        return descriptions.get(section, "System section")
    
    def _format_knowledge_response(self, kb_results: Dict[str, Any]) -> Dict[str, Any]:
        """Format knowledge base results into readable response"""
        results = kb_results.get("results", [])
        
        if not results:
            return {
                "text": "No relevant information found.",
                "citations": [],
                "related_topics": []
            }
        
        # Build response text
        response_parts = []
        citations = []
        
        for i, result in enumerate(results[:3], 1):
            response_parts.append(f"{result['content']}")
            
            citation = {
                "id": i,
                "source": result.get("source", "Unknown"),
                "section": result.get("section", ""),
                "confidence": result.get("score", 0)
            }
            citations.append(citation)
        
        response_text = "\n\n".join(response_parts)
        
        # Add citation references
        if citations:
            response_text += "\n\nReferences:"
            for cite in citations:
                response_text += f"\n[{cite['id']}] {cite['source']} - {cite['section']}"
        
        return {
            "text": response_text,
            "citations": citations,
            "related_topics": kb_results.get("related_topics", [])
        }
    
    def _get_related_topics(self, query: str) -> List[str]:
        """Get related topics for a query"""
        # This would use semantic similarity in production
        topics = [
            "Disability rating criteria",
            "Evidence requirements",
            "C&P examination process",
            "Service connection requirements",
            "Secondary conditions",
            "Effective dates",
            "Appeals process",
            "TDIU eligibility"
        ]
        
        # Return top 3 most relevant (simplified for now)
        return topics[:3]