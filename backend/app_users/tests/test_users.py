import pytest

from app_users.models import User


@pytest.mark.integration
@pytest.mark.django_db()
def test_create_user_success(user_email: str) -> None:
    # Create the user
    user = User.objects.create_user(
        name="Test User",
        email=user_email,
    )

    # Check settings
    assert user.email == user_email

    assert not user.is_staff
    assert not user.is_superuser
    assert user.is_active


@pytest.mark.integration
@pytest.mark.django_db()
def test_create_user_failure_no_name(user_email: str) -> None:
    with pytest.raises(ValueError):
        User.objects.create_user(
            name="",
            email=user_email,
        )


@pytest.mark.integration
@pytest.mark.django_db()
def test_create_user_failure_no_email() -> None:
    with pytest.raises(ValueError):
        User.objects.create_user(
            name="Test User",
            email="",
        )


@pytest.mark.integration
@pytest.mark.django_db()
def test_create_superuser_success(user_email: str) -> None:
    # Create the user
    user = User.objects.create_superuser(
        name="Test User",
        email=user_email,
    )

    # Check settings
    assert user.email == user_email

    assert user.is_staff
    assert user.is_superuser
    assert user.is_active
