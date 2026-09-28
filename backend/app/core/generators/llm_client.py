import os
import logging
import litellm
from google import genai

# Forced reload for environment variables
from dotenv import load_dotenv
from pathlib import Path
load_dotenv(Path(__file__).resolve().parent.parent.parent.parent / ".env")

from app.utils.ollama_generator import OllamaGenerator

logger = logging.getLogger(__name__)

class LLMClient:
    def __init__(self, api_key="", provider=""):
        # Normalize empty string or junk (dots/spaces) to None
        self.api_key = api_key.strip() if api_key and len(api_key.strip()) > 10 else None
        self.provider = provider.strip().lower() if provider else ""
        
        # Auto-detect AI Provider and API Key
        env_provider = os.getenv("AI_PROVIDER", "").strip().lower()
        
        if not self.provider:
            self.provider = env_provider

        # PRIORITY: 1. Explicit provider, 2. Ollama (if URL exists), 3. Gemini, 4. Others
        if not self.api_key:
            if self.provider == "ollama" or (not self.provider and os.getenv("OLLAMA_BASE_URL")):
                self.provider = "ollama"
                self.api_key = "local-ollama"
                logger.debug("LLMClient: Using local Ollama as primary provider")
            elif self.provider == "gemini" or (not self.provider and os.getenv("GEMINI_API_KEY")):
                self.api_key = os.getenv("GEMINI_API_KEY")
                self.provider = "gemini"
                logger.debug("LLMClient: Loaded GEMINI_API_KEY from env")
            else:
                # Fall back to other providers
                self.api_key = os.getenv("ANTHROPIC_API_KEY") or os.getenv("OPENAI_API_KEY")
                if self.api_key:
                    if os.getenv("ANTHROPIC_API_KEY"):
                        self.provider = "anthropic"
                    else:
                        self.provider = "openai"
                elif os.getenv("OLLAMA_BASE_URL"): # Final fallback to Ollama
                    self.provider = "ollama"
                    self.api_key = "local-ollama"
                else:
                    logger.warning("LLMClient: No AI keys or Ollama URL found")
        
        # Validation
        if not self.api_key and self.provider != "ollama":
            # If we still don't have a key and it's not ollama, try one last check for Ollama
            if os.getenv("OLLAMA_BASE_URL"):
                self.provider = "ollama"
                self.api_key = "local-ollama"
            else:
                raise ValueError("AI API Key or Ollama configuration is required")

        # Set optimal models based on provider
        if self.provider == "gemini":
            self.model = "gemini-2.0-flash"
        elif self.provider == "openai":
            self.model = "gpt-4o-mini"
        elif self.provider == "anthropic":
            self.model = "claude-3-5-sonnet-20241022"
        elif self.provider == "ollama":
            self.model = os.getenv("OLLAMA_MODEL", "llama3")
        else:
            self.model = "default"

    def generate(self, prompt, system_prompt="You are a helpful AI assistant.", model=None, temperature=0.7, max_tokens=4096):
        try:
            target_model = model or self.model
            
            # Use litellm for all providers (including gemini)
            # litellm expects "gemini/gemini-1.5-flash"
            if self.provider == "gemini" and "/" not in target_model:
                model_string = f"gemini/{target_model}"
            else:
                model_string = target_model if "/" in target_model else f"{self.provider}/{target_model}"

            if self.provider == "ollama":
                gen = OllamaGenerator(model=target_model)
                # OllamaGenerator.generate is synchronous
                return gen.generate(prompt, system=system_prompt, options={"temperature": temperature})

            response = litellm.completion(
                model=model_string,
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": prompt}
                ],
                api_key=self.api_key,
                temperature=temperature,
                max_tokens=max_tokens
            )
            return response.choices[0].message.content
        except Exception as e:
            # Specialized error reporting
            error_msg = str(e)
            if "invalid_api_key" in error_msg.lower() or "401" in error_msg or "api key" in error_msg.lower():
                error_msg = f"The {self.provider.upper()} API key is invalid or has been revoked."
            elif "leaked" in error_msg.lower():
                error_msg = f"Your {self.provider.upper()} API key has been reported as leaked and disabled by Google. Please generate a new one at https://aistudio.google.com/ and update your .env file."
            elif "rate_limit" in error_msg.lower():
                error_msg = f"The {self.provider.upper()} API rate limit was hit."
            
            raise RuntimeError(f"Generation failed ({self.provider}): {error_msg}")
