"""
Security middleware and utilities
"""

from fastapi import Request, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.responses import Response
import hashlib
import hmac
import time
import re
import structlog
from typing import Optional, Dict, Any
import json

logger = structlog.get_logger()

class SecurityMiddleware(BaseHTTPMiddleware):
    """Security middleware for request/response processing"""
    
    async def dispatch(self, request: Request, call_next):
        # Add security headers
        start_time = time.time()
        
        # Log request
        logger.info(
            "Request received",
            method=request.method,
            path=request.url.path,
            client=request.client.host if request.client else None
        )
        
        # Check for common attack patterns
        if self._detect_attack_patterns(request):
            logger.warning(
                "Potential attack detected",
                method=request.method,
                path=request.url.path,
                client=request.client.host if request.client else None
            )
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid request"
            )
        
        # Process request
        response = await call_next(request)
        
        # Add security headers
        response.headers["X-Content-Type-Options"] = "nosniff"
        response.headers["X-Frame-Options"] = "DENY"
        response.headers["X-XSS-Protection"] = "1; mode=block"
        response.headers["Strict-Transport-Security"] = "max-age=31536000; includeSubDomains"
        response.headers["Content-Security-Policy"] = "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline';"
        response.headers["Referrer-Policy"] = "strict-origin-when-cross-origin"
        response.headers["Permissions-Policy"] = "geolocation=(), microphone=(), camera=()"
        
        # Log response
        process_time = time.time() - start_time
        logger.info(
            "Request completed",
            method=request.method,
            path=request.url.path,
            status_code=response.status_code,
            process_time=process_time
        )
        
        return response
    
    def _detect_attack_patterns(self, request: Request) -> bool:
        """Detect common attack patterns"""
        # Check for SQL injection patterns
        sql_patterns = [
            r"(\b(SELECT|INSERT|UPDATE|DELETE|DROP|UNION|ALTER|CREATE)\b)",
            r"(--|#|\/\*|\*\/)",
            r"(\bOR\b\s*\d+\s*=\s*\d+)",
            r"(\bAND\b\s*\d+\s*=\s*\d+)"
        ]
        
        # Check for XSS patterns
        xss_patterns = [
            r"<script[^>]*>.*?</script>",
            r"javascript:",
            r"on\w+\s*=",
            r"<iframe[^>]*>.*?</iframe>"
        ]
        
        # Check for path traversal
        path_traversal_patterns = [
            r"\.\./",
            r"\.\.\\"
        ]
        
        # Combine all patterns
        all_patterns = sql_patterns + xss_patterns + path_traversal_patterns
        
        # Check URL path and query parameters
        url_str = str(request.url)
        for pattern in all_patterns:
            if re.search(pattern, url_str, re.IGNORECASE):
                return True
        
        return False


class InputSanitizer:
    """Input sanitization utilities"""
    
    @staticmethod
    def sanitize_string(input_str: str, max_length: int = 1000) -> str:
        """Sanitize string input"""
        if not input_str:
            return ""
        
        # Truncate to max length
        input_str = input_str[:max_length]
        
        # Remove null bytes
        input_str = input_str.replace('\x00', '')
        
        # Escape HTML entities
        html_escape_table = {
            "&": "&amp;",
            '"': "&quot;",
            "'": "&apos;",
            ">": "&gt;",
            "<": "&lt;",
        }
        
        return "".join(html_escape_table.get(c, c) for c in input_str)
    
    @staticmethod
    def validate_json(json_str: str) -> Optional[Dict[Any, Any]]:
        """Validate and parse JSON safely"""
        try:
            data = json.loads(json_str)
            # Additional validation can be added here
            return data
        except (json.JSONDecodeError, TypeError):
            return None
    
    @staticmethod
    def validate_file_upload(filename: str, content: bytes, max_size: int = 10 * 1024 * 1024) -> bool:
        """Validate file uploads"""
        # Check file size
        if len(content) > max_size:
            return False
        
        # Check filename
        if not filename or '..' in filename or '/' in filename or '\\' in filename:
            return False
        
        # Check file extension
        allowed_extensions = {'.pdf', '.txt', '.doc', '.docx', '.json', '.csv'}
        ext = filename.lower().split('.')[-1]
        if f".{ext}" not in allowed_extensions:
            return False
        
        # Check file content (magic bytes)
        file_signatures = {
            b'%PDF': 'pdf',
            b'PK': 'docx',
            b'\xd0\xcf\x11\xe0': 'doc'
        }
        
        for signature, file_type in file_signatures.items():
            if content.startswith(signature):
                return True
        
        # Allow plain text files
        try:
            content.decode('utf-8')
            return True
        except UnicodeDecodeError:
            return False


class RateLimiter:
    """Custom rate limiting implementation"""
    
    def __init__(self):
        self.requests = {}
    
    def is_allowed(self, client_id: str, max_requests: int = 60, window: int = 60) -> bool:
        """Check if request is allowed based on rate limit"""
        current_time = time.time()
        
        if client_id not in self.requests:
            self.requests[client_id] = []
        
        # Remove old requests outside the window
        self.requests[client_id] = [
            req_time for req_time in self.requests[client_id]
            if current_time - req_time < window
        ]
        
        # Check if limit exceeded
        if len(self.requests[client_id]) >= max_requests:
            return False
        
        # Add current request
        self.requests[client_id].append(current_time)
        return True


class TokenValidator:
    """JWT token validation with additional security checks"""
    
    @staticmethod
    def validate_token_structure(token: str) -> bool:
        """Validate JWT token structure"""
        parts = token.split('.')
        if len(parts) != 3:
            return False
        
        # Check each part is base64url encoded
        import base64
        for part in parts:
            try:
                # Add padding if necessary
                padding = 4 - len(part) % 4
                if padding != 4:
                    part += '=' * padding
                base64.urlsafe_b64decode(part)
            except Exception:
                return False
        
        return True
    
    @staticmethod
    def extract_claims(token: str) -> Optional[Dict[str, Any]]:
        """Extract claims from JWT token"""
        try:
            parts = token.split('.')
            if len(parts) != 3:
                return None
            
            # Decode payload
            payload = parts[1]
            padding = 4 - len(payload) % 4
            if padding != 4:
                payload += '=' * padding
            
            decoded = base64.urlsafe_b64decode(payload)
            claims = json.loads(decoded)
            
            # Validate required claims
            required_claims = ['sub', 'exp', 'iat']
            if not all(claim in claims for claim in required_claims):
                return None
            
            # Check expiration
            current_time = time.time()
            if claims['exp'] < current_time:
                return None
            
            return claims
        except Exception:
            return None


# Singleton instances
input_sanitizer = InputSanitizer()
rate_limiter = RateLimiter()
token_validator = TokenValidator()