#!/usr/bin/env python3
"""
Tests de performance pour le module d'optimisation
"""

import time
import statistics
from app.optimizer import BloodInventoryOptimizer
from app.models import *


def benchmark_optimization():
    """Benchmark de la fonction d'optimisation"""
    print("🏁 Benchmark de l'optimisation")
    optimizer = BloodInventoryOptimizer()
    execution_times = []
    # Générer des données de test de tailles variables
    test_sizes = [1, 2, 4, 8]  # Nombre de groupes sanguins
    for size in test_sizes:
        print(f"\n📊 Test avec {size} groupe(s) sanguin(s)")
        blood_types = list(BloodType)[:size]
        stocks = [
            CurrentStock(
                blood_type=bt,
                current_units=100 + i * 10,
                expiring_units=i + 1,
                storage_location=f"Réfrigérateur {i+1}"
            )
            for i, bt in enumerate(blood_types)
        ]
        forecasts = [
            DemandForecast(
                blood_type=bt,
                forecast_days=7,
                predicted_demand=50.0 + i * 10,
                min_forecast=40.0 + i * 10,
                max_forecast=60.0 + i * 10,
                confidence=0.90
            )
            for i, bt in enumerate(blood_types)
        ]
        times_for_size = []
        for _ in range(5):  # 5 exécutions par taille
            start_time = time.time()
            optimizer.optimize_orders(stocks, forecasts, 7)
            end_time = time.time()
            execution_time = (end_time - start_time) * 1000  # en ms
            times_for_size.append(execution_time)
        avg_time = statistics.mean(times_for_size)
        std_time = statistics.stdev(times_for_size) if len(times_for_size) > 1 else 0
        print(f"  Temps moyen: {avg_time:.2f}ms")
        print(f"  Écart-type: {std_time:.2f}ms")
        print(f"  Temps min: {min(times_for_size):.2f}ms")
        print(f"  Temps max: {max(times_for_size):.2f}ms")
        execution_times.extend(times_for_size)
    print(f"\n🎯 Performance globale:")
    print(f"  Temps moyen global: {statistics.mean(execution_times):.2f}ms")
    print(f"  Temps médian: {statistics.median(execution_times):.2f}ms")
    print(f"  95e percentile: {sorted(execution_times)[int(len(execution_times)*0.95)]:.2f}ms")


def stress_test():
    """Test de stress avec de nombreuses requêtes"""
    print("\n💪 Test de Stress")
    optimizer = BloodInventoryOptimizer()
    num_iterations = 50
    successful_runs = 0
    start_time = time.time()
    for i in range(num_iterations):
        try:
            result = optimizer.simulate_with_dummy_data()
            if result and "recommendations" in result:
                successful_runs += 1
        except Exception as e:
            print(f"❌ Erreur à l'itération {i+1}: {e}")
    end_time = time.time()
    total_time = end_time - start_time
    print(f"  Exécutions réussies: {successful_runs}/{num_iterations}")
    print(f"  Taux de succès: {(successful_runs/num_iterations)*100:.1f}%")
    print(f"  Temps total: {total_time:.2f}s")
    print(f"  Temps moyen par exécution: {(total_time/num_iterations)*1000:.2f}ms")
    print(f"  Throughput: {num_iterations/total_time:.2f} requêtes/seconde")


if __name__ == "__main__":
    print("🩸 Tests de Performance - Module d'Optimisation")
    benchmark_optimization()
    stress_test()
    print("\n✅ Tests de performance terminés!")