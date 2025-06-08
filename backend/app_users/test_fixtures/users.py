import pytest

from app_users.models import User


@pytest.fixture(scope="session")
def user_email() -> str:
    return "test-user@fletcheaston.com"


@pytest.fixture()
@pytest.mark.django_db()
def user(user_email: str) -> User:
    return User.objects.create_user(
        name="Test User",
        email=user_email,
        password="PASSWORD",
    )
