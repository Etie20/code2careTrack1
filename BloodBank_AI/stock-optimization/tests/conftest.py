import pytest
from app.config import config


@pytest.fixture(autouse=True)
def reset_config():
    """Réinitialise la configuration avant chaque test"""
    # Sauvegarder l'état actuel
    original_settings = config.settings
    # Réinitialiser les paramètres
    config.settings = config.ConfigSettings()
    yield
    # Restaurer l'état initial
    config.settings = original_settings