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
            if os.getenv("OLLAMA_BASE_URL"):
                self.provider = "ollama"
                self.api_key = "local-ollama"
            else:
                raise ValueError("AI API Key or Ollama configuration is required")

        # Set optimal models based on provider
        if self.provider == "gemini":
            self.model = os.getenv("GEMINI_MODEL", "gemma-4-26b-a4b-it")
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

            # Provider: Ollama
            if self.provider == "ollama":
                gen = OllamaGenerator(model=target_model)
                return gen.generate(prompt, system=system_prompt, options={"temperature": temperature})

            # Provider: Gemini via Google GenAI SDK (direct & resilient)
            if self.provider == "gemini":
                client = genai.Client(api_key=self.api_key)
                combined_prompt = f"{system_prompt}\n\n{prompt}" if system_prompt else prompt

                candidates = [
                    target_model.replace("gemini/", ""),
                    "gemma-4-26b-a4b-it",
                    "gemini-3.8-flash",
                    "gemini-flash-latest"
                ]
                candidates = list(dict.fromkeys(candidates))

                last_ex = None
                for candidate in candidates:
                    try:
                        res = client.models.generate_content(
                            model=candidate,
                            contents=combined_prompt
                        )
                        if res and res.text:
                            return res.text
                    except Exception as ex:
                        last_ex = ex
                        err_str = str(ex).lower()
                        # If transient capacity spike (503) or model unavailable, try next candidate
                        if any(k in err_str for k in ["503", "unavailable", "404", "not_found", "high demand", "internal", "500"]):
                            logger.warning(f"Google GenAI ({candidate}) transient error: {ex}. Falling back...")
                            continue
                        raise ex
                if last_ex:
                    raise last_ex

            # Other providers via litellm (OpenAI, Anthropic, etc.)
            model_string = target_model if "/" in target_model else f"{self.provider}/{target_model}"
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
            error_msg = str(e)
            err_lower = error_msg.lower()

            if "api_key_invalid" in err_lower or "401" in err_lower or "unregistered callers" in err_lower:
                error_msg = f"The {self.provider.upper()} API key is invalid or has been revoked."
            elif "leaked" in err_lower:
                error_msg = f"Your {self.provider.upper()} API key was reported as leaked. Please update your key in .env."
            elif "rate_limit" in err_lower or "429" in err_lower or "resource_exhausted" in err_lower:
                error_msg = f"The {self.provider.upper()} API rate limit or quota was exceeded. Please wait a moment."
            elif any(k in err_lower for k in ["503", "unavailable", "high demand"]):
                error_msg = "Google Gemini is currently experiencing a temporary server demand spike. Please try again shortly."

            raise RuntimeError(f"Generation failed ({self.provider}): {error_msg}")
