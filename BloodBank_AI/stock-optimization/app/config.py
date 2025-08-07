import os
import yaml
from typing import Dict

from .models import ConfigSettings


class Config:
    def __init__(self):
        self.settings = ConfigSettings()
        self.load_config()

    def load_config(self):
        """Charge la configuration depuis un fichier YAML ou les variables d'environnement."""
        config_file = os.getenv('CONFIG_FILE', 'config.yaml')

        if os.path.exists(config_file):
            try:
                with open(config_file, 'r', encoding='utf-8') as f:
                    config_data = yaml.safe_load(f)
                    self.settings = ConfigSettings(**config_data)
            except Exception as e:
                print(f"Erreur lors du chargement du fichier de config: {e}")
                print("Utilisation des paramètres par défaut")

    def update_settings(self, new_settings: Dict):
        """Met à jour les paramètres de configuration."""
        current_dict = self.settings.dict()
        current_dict.update(new_settings)
        self.settings = ConfigSettings(**current_dict)

    def get_z_score(self) -> float:
        """Retourne le Z-score correspondant au niveau de service."""
        z_scores = {
            0.90: 1.28, 0.91: 1.34, 0.92: 1.41, 0.93: 1.48, 0.94: 1.55,
            0.95: 1.65, 0.96: 1.75, 0.97: 1.88, 0.98: 2.05, 0.99: 2.33
        }
        return z_scores.get(self.settings.service_level, 1.65)


config = Config()