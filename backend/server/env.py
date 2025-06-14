from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
    )

    ####################################################################################
    # Basic web server settings
    DEBUG: bool = False
    VERSION: str
    SECRET_KEY: str

    ####################################################################################
    # SQL database settings
    PG_DB: str
    PG_USER: str
    PG_PASSWORD: str
    PG_HOST: str

    ####################################################################################
    # GitHub OAuth settings
    GITHUB_OAUTH_CLIENT_ID: str
    GITHUB_OAUTH_CLIENT_SECRET: str

    ####################################################################################
    # API keys
    OPENAI_API_KEY: str


# Settings derived from .env or env vars
SETTINGS: Settings = Settings()  # ty: ignore[missing-argument]
