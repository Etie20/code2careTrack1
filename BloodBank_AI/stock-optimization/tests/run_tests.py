#!/usr/bin/env python3
"""
Script pour lancer les tests du module d'optimisation des stocks
"""

import subprocess
import sys
import os


def run_command(cmd, description):
    """Exécute une commande et affiche le résultat"""
    print(f"\n{'='*50}")
    print(f"🧪 {description}")
    print('='*50)
    try:
        result = subprocess.run(cmd, shell=True, check=True, capture_output=True, text=True)
        print(result.stdout)
        if result.stderr:
            print("STDERR:", result.stderr)
        return True
    except subprocess.CalledProcessError as e:
        print(f"❌ Erreur: {e}")
        print(f"STDOUT: {e.stdout}")
        print(f"STDERR: {e.stderr}")
        return False


def main():
    """Lance tous les tests et vérifications"""
    print("🩸 Tests du Module d'Optimisation des Stocks - Banque du Sang")

    # Vérifier si pytest est installé
    try:
        import pytest  # noqa: F401
    except ImportError:
        print("❌ pytest n'est pas installé. Installation en cours...")
        subprocess.run([sys.executable, "-m", "pip", "install", "pytest", "pytest-cov"], check=True)

    tests_passed = 0
    total_tests = 0

    # 1. Tests unitaires
    total_tests += 1
    if run_command("python -m pytest tests/test_optimizer.py -v", "Tests Unitaires - Optimizer"):
        tests_passed += 1

    # 2. Tests API
    total_tests += 1
    if run_command("python -m pytest tests/test_api.py -v", "Tests API - Endpoints"):
        tests_passed += 1

    # 3. Tests avec couverture
    total_tests += 1
    if run_command("python -m pytest tests/ --cov=app --cov-report=term-missing", "Tests avec Couverture"):
        tests_passed += 1

    # 4. Test de l'API en live (si elle tourne)
    print(f"\n{'='*50}")
    print("🚀 Test de l'API en Live")
    print('='*50)
    try:
        import requests  # noqa: F401
        response = requests.get("http://localhost:8000/health", timeout=5)
        if response.status_code == 200:
            print("✅ API accessible et fonctionnelle")
            # Test de simulation
            sim_response = requests.get("http://localhost:8000/api/inventory/simulate", timeout=10)
            if sim_response.status_code == 200:
                print("✅ Test de simulation réussi")
                tests_passed += 1
            else:
                print(f"❌ Test de simulation échoué: {sim_response.status_code}")
        else:
            print(f"❌ API inaccessible: {response.status_code}")
    except Exception as e:
        print(f"⚠️  API non accessible (normal si non démarrée): {e}")
    total_tests += 1

    # 5. Validation des modèles Pydantic
    total_tests += 1
    try:
        from app.models import *  # noqa: F401,F403
        # Exemple simple de validation
        stock = CurrentStock(
            blood_type=BloodType.A_POS,
            current_units=100,
            expiring_units=5,
            storage_location="Test"
        )
        forecast = DemandForecast(
            blood_type=BloodType.A_POS,
            forecast_days=7,
            predicted_demand=50.0,
            min_forecast=45.0,
            max_forecast=55.0,
            confidence=0.90
        )
        print("✅ Validation des modèles Pydantic réussie")
        tests_passed += 1
    except Exception as e:
        print(f"❌ Erreur de validation des modèles: {e}")

    # Résumé final
    print(f"\n{'='*50}")
    print("📊 RÉSUMÉ DES TESTS")
    print('='*50)
    print(f"Tests réussis: {tests_passed}/{total_tests}")
    print(f"Taux de réussite: {(tests_passed/total_tests)*100:.1f}%")
    if tests_passed == total_tests:
        print("🎉 Tous les tests sont passés avec succès!")
        return 0
    else:
        print("⚠️  Certains tests ont échoué. Vérifiez les logs ci-dessus.")
        return 1


if __name__ == "__main__":
    sys.exit(main())