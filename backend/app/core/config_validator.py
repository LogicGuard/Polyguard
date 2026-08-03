import os
import sys
from typing import List


class ConfigValidator:
    """Validates required environment variables at startup.
    
    Ensures that critical secrets and configs are present in production
    to prevent runtime failures or security issues.
    """

    REQUIRED_IN_PRODUCTION = [
        "SECRET_KEY",
        "GEMINI_API_KEY",
        "DATABASE_URL",
        "POLYGON_MAINNET_RPC",
    ]

    REQUIRED_IN_CI = [
        "SECRET_KEY",
    ]

    @classmethod
    def validate(cls, environment: str = None) -> bool:
        """Validate that all required configs are set.
        
        Args:
            environment: 'production', 'development', 'ci'. Defaults to ENVIRONMENT env var.
        
        Raises:
            ValueError: If required configs are missing.
        
        Returns:
            True if validation passes.
        """
        if environment is None:
            environment = os.getenv("ENVIRONMENT", "development")

        if environment == "production":
            missing = cls._check_required(cls.REQUIRED_IN_PRODUCTION)
        elif environment == "ci":
            missing = cls._check_required(cls.REQUIRED_IN_CI)
        else:
            # Development: be lenient, only warn
            missing = cls._check_required(cls.REQUIRED_IN_PRODUCTION)
            if missing:
                print(f"WARNING: Missing configs in {environment}: {', '.join(missing)}")
                return True

        if missing:
            raise ValueError(
                f"FATAL: Missing required environment variables in {environment} mode: "
                f"{', '.join(missing)}. "
                f"Please set these variables via .env, secrets manager, or CI/CD pipeline."
            )

        return True

    @classmethod
    def _check_required(cls, required: List[str]) -> List[str]:
        """Check which required vars are missing.
        
        Returns:
            List of missing variable names.
        """
        missing = []
        for var in required:
            value = os.getenv(var)
            if not value or value.strip() == "":
                missing.append(var)
        return missing
