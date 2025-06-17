import os

from pydantic_settings import BaseSettings, SettingsConfigDict

DEBUG = os.environ.get("DEBUG")


class Settings(BaseSettings):
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


class LocalSettings(Settings):
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
    )


# Settings derived from .env or env vars
SETTINGS: Settings = (
    LocalSettings() if DEBUG else Settings()  # ty: ignore[missing-argument]
)
