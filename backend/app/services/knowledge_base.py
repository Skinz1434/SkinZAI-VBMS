"""
Knowledge Base Service with M21/CFR regulations
Secure, indexed knowledge retrieval system
"""

import asyncio
from typing import Dict, Any, List, Optional
import json
import hashlib
import numpy as np
from datetime import datetime
import structlog

logger = structlog.get_logger()

class KnowledgeBaseService:
    """Service for managing and querying VA knowledge base"""
    
    def __init__(self):
        self.knowledge_store = {}
        self.embeddings = {}
        self.index_version = "1.0.0"
        self.initialized = False
        
    async def initialize(self):
        """Initialize knowledge base with M21/CFR content"""
        logger.info("Initializing knowledge base")
        
        # Load M21-1 content
        await self._load_m21_content()
        
        # Load 38 CFR content
        await self._load_cfr_content()
        
        # Load VA procedures
        await self._load_va_procedures()
        
        # Build search index
        await self._build_search_index()
        
        self.initialized = True
        logger.info("Knowledge base initialized successfully")
    
    async def _load_m21_content(self):
        """Load M21-1 manual content"""
        self.knowledge_store["M21-1"] = {
            "III.iv.4.A.1": {
                "title": "Exam Requirements for Service Connection",
                "content": "A VA examination is required when: (1) The evidence is not sufficient to make a decision, (2) There is a current disability, (3) Evidence suggests an association between disability and service.",
                "category": "examinations",
                "tags": ["c&p", "exam", "service connection"]
            },
            "III.iv.4.B.2": {
                "title": "Evidence Development Procedures",
                "content": "All relevant evidence must be obtained before scheduling an examination. This includes service treatment records, VA medical records, and identified private medical records.",
                "category": "evidence",
                "tags": ["evidence", "development", "records"]
            },
            "III.iv.4.C.3": {
                "title": "Rating Decision Requirements",
                "content": "Rating decisions must include: evaluation of all evidence, application of benefit of doubt, clear rationale for decision, and proper effective date determination.",
                "category": "rating",
                "tags": ["rating", "decision", "requirements"]
            },
            "IV.ii.1.B.1": {
                "title": "PTSD Rating Criteria",
                "content": "PTSD ratings: 0% - diagnosis without symptoms, 10% - mild symptoms, 30% - occupational impairment with occasional symptoms, 50% - reduced reliability and productivity, 70% - deficiencies in most areas, 100% - total impairment.",
                "category": "mental_health",
                "tags": ["ptsd", "mental health", "rating criteria"]
            },
            "IV.ii.2.C.1": {
                "title": "Musculoskeletal Ratings",
                "content": "Range of motion must be tested for pain on both active and passive motion, in weight-bearing and non-weight-bearing. Consider functional loss due to pain, weakness, fatigue.",
                "category": "musculoskeletal",
                "tags": ["range of motion", "musculoskeletal", "pain"]
            }
        }
    
    async def _load_cfr_content(self):
        """Load 38 CFR content"""
        self.knowledge_store["38CFR"] = {
            "3.303": {
                "title": "Principles of Service Connection",
                "content": "Service connection requires: (1) current disability, (2) in-service incurrence or aggravation, (3) nexus between current disability and in-service event.",
                "category": "service_connection",
                "tags": ["service connection", "nexus", "requirements"]
            },
            "3.307": {
                "title": "Presumptive Service Connection",
                "content": "Certain chronic diseases manifesting to 10% within one year of separation are presumed service-connected. Includes arthritis, diabetes, hypertension.",
                "category": "presumptive",
                "tags": ["presumptive", "chronic disease", "one year"]
            },
            "3.309": {
                "title": "Agent Orange Presumptions",
                "content": "Veterans exposed to herbicides in Vietnam are presumed service-connected for: diabetes type 2, ischemic heart disease, Parkinson's, various cancers.",
                "category": "presumptive",
                "tags": ["agent orange", "vietnam", "presumptive"]
            },
            "4.71a": {
                "title": "Musculoskeletal Ratings Schedule",
                "content": "Spine ratings: 10% - forward flexion greater than 60 degrees, 20% - forward flexion 30-60 degrees, 40% - forward flexion 30 degrees or less.",
                "category": "rating_schedule",
                "tags": ["spine", "back", "rating schedule"]
            },
            "4.130": {
                "title": "Mental Disorders Rating Schedule",
                "content": "General rating formula for mental disorders based on occupational and social impairment. Symptoms must be documented and impact functioning.",
                "category": "rating_schedule",
                "tags": ["mental health", "rating schedule", "occupational impairment"]
            }
        }
    
    async def _load_va_procedures(self):
        """Load VA procedures and best practices"""
        self.knowledge_store["VA_procedures"] = {
            "fast_track": {
                "title": "Fully Developed Claims Process",
                "content": "Claims can be fast-tracked when all evidence is submitted upfront. No development needed. Decision within 125 days.",
                "category": "procedures",
                "tags": ["fdc", "fast track", "fully developed"]
            },
            "duty_to_assist": {
                "title": "VA's Duty to Assist",
                "content": "VA must make reasonable efforts to obtain relevant records, provide medical examinations when necessary, and ensure claims are fully developed.",
                "category": "procedures",
                "tags": ["duty to assist", "development", "va responsibility"]
            },
            "effective_dates": {
                "title": "Effective Date Rules",
                "content": "Generally the date of claim receipt. Earlier effective date if claim filed within 1 year of discharge. Liberalizing law provisions may apply.",
                "category": "procedures",
                "tags": ["effective date", "claim date", "retroactive"]
            },
            "tdiu": {
                "title": "Total Disability Individual Unemployability",
                "content": "TDIU granted when veteran unable to secure gainful employment due to service-connected disabilities. Requires 60% single or 70% combined with one at 40%.",
                "category": "benefits",
                "tags": ["tdiu", "unemployability", "total disability"]
            }
        }
    
    async def _build_search_index(self):
        """Build search index for efficient retrieval"""
        # In production, this would use vector embeddings
        # For now, we'll create a simple inverted index
        self.search_index = {}
        
        for source, content in self.knowledge_store.items():
            for key, item in content.items():
                # Index by tags
                for tag in item.get("tags", []):
                    if tag not in self.search_index:
                        self.search_index[tag] = []
                    self.search_index[tag].append({
                        "source": source,
                        "key": key,
                        "title": item["title"]
                    })
                
                # Index by words in title and content
                words = (item["title"] + " " + item["content"]).lower().split()
                for word in set(words):
                    if len(word) > 3:  # Only index words longer than 3 chars
                        if word not in self.search_index:
                            self.search_index[word] = []
                        self.search_index[word].append({
                            "source": source,
                            "key": key,
                            "title": item["title"]
                        })
    
    async def query(
        self,
        query: str,
        categories: Optional[List[str]] = None,
        top_k: int = 5
    ) -> Dict[str, Any]:
        """Query knowledge base with security and relevance ranking"""
        
        if not self.initialized:
            await self.initialize()
        
        query_lower = query.lower()
        query_words = query_lower.split()
        
        # Find matching documents
        matches = []
        seen = set()
        
        for word in query_words:
            if word in self.search_index:
                for match in self.search_index[word]:
                    match_key = f"{match['source']}:{match['key']}"
                    if match_key not in seen:
                        seen.add(match_key)
                        
                        # Get full content
                        content = self.knowledge_store[match["source"]][match["key"]]
                        
                        # Check category filter
                        if categories and content["category"] not in categories:
                            continue
                        
                        # Calculate relevance score (simplified)
                        score = self._calculate_relevance(query_lower, content)
                        
                        matches.append({
                            "source": f"{match['source']} {match['key']}",
                            "title": content["title"],
                            "content": content["content"],
                            "category": content["category"],
                            "tags": content["tags"],
                            "score": score,
                            "section": match["key"]
                        })
        
        # Sort by relevance and return top K
        matches.sort(key=lambda x: x["score"], reverse=True)
        top_matches = matches[:top_k]
        
        # Generate summary if matches found
        summary = ""
        if top_matches:
            summary = f"Found {len(matches)} relevant regulations. "
            summary += f"Top result: {top_matches[0]['title']} from {top_matches[0]['source']}."
        
        return {
            "results": top_matches,
            "total_found": len(matches),
            "summary": summary,
            "query": query,
            "timestamp": datetime.utcnow().isoformat()
        }
    
    def _calculate_relevance(self, query: str, content: Dict[str, Any]) -> float:
        """Calculate relevance score for content"""
        score = 0.0
        query_words = set(query.split())
        
        # Title match
        title_words = set(content["title"].lower().split())
        title_overlap = len(query_words & title_words)
        score += title_overlap * 2.0
        
        # Content match
        content_words = set(content["content"].lower().split())
        content_overlap = len(query_words & content_words)
        score += content_overlap * 1.0
        
        # Tag match
        for tag in content["tags"]:
            if any(word in tag.lower() for word in query_words):
                score += 1.5
        
        # Normalize by query length
        if len(query_words) > 0:
            score = score / len(query_words)
        
        return min(score, 10.0)  # Cap at 10
    
    async def add_document(
        self,
        source: str,
        key: str,
        document: Dict[str, Any]
    ) -> bool:
        """Add new document to knowledge base"""
        
        # Validate document structure
        required_fields = ["title", "content", "category", "tags"]
        if not all(field in document for field in required_fields):
            logger.error("Invalid document structure")
            return False
        
        # Add to knowledge store
        if source not in self.knowledge_store:
            self.knowledge_store[source] = {}
        
        self.knowledge_store[source][key] = document
        
        # Update search index
        for tag in document["tags"]:
            if tag not in self.search_index:
                self.search_index[tag] = []
            self.search_index[tag].append({
                "source": source,
                "key": key,
                "title": document["title"]
            })
        
        logger.info(f"Added document {source}:{key}")
        return True
    
    def get_categories(self) -> List[str]:
        """Get all available categories"""
        categories = set()
        for source in self.knowledge_store.values():
            for item in source.values():
                categories.add(item["category"])
        return sorted(list(categories))
    
    def get_stats(self) -> Dict[str, Any]:
        """Get knowledge base statistics"""
        total_documents = sum(
            len(content) for content in self.knowledge_store.values()
        )
        
        return {
            "total_documents": total_documents,
            "sources": list(self.knowledge_store.keys()),
            "categories": self.get_categories(),
            "index_size": len(self.search_index),
            "version": self.index_version
        }