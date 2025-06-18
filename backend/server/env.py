from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore",
    )

    ####################################################################################
    # Basic web server settings
    DEBUG: bool = False
    VERSION: str | None = None
    SECRET_KEY: str | None = None

    ####################################################################################
    # SQL database settings
    PG_DB: str | None = None
    PG_USER: str | None = None
    PG_PASSWORD: str | None = None
    PG_HOST: str | None = None

    ####################################################################################
    # Redis settings
    REDIS_HOST: str | None = None

    ####################################################################################
    # GitHub OAuth settings
    GITHUB_OAUTH_CLIENT_ID: str | None = None
    GITHUB_OAUTH_CLIENT_SECRET: str | None = None

    ####################################################################################
    # API keys
    OPENAI_API_KEY: str | None = None


# Settings derived from .env or env vars
SETTINGS: Settings = Settings()  # ty: ignore[missing-argument]
