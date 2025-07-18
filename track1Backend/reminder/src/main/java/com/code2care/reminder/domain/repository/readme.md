### 📁 `domain/repository` — README

Le package `repository` dans le module `domain` définit les **interfaces de persistence** du domaine. Il joue le rôle de
**port de sortie (Output Port)** dans l’architecture hexagonale ou onion.

---

## 🎯 Objectif

* Définir des **contrats (interfaces)** pour accéder aux données métier (ex : utilisateur, commande, produit).
* Permettre à la couche `application` de travailler avec des abstractions, sans dépendre de la technologie (JPA,
  MongoDB, REST, etc.).
* Laisser la couche `infrastructure` fournir les **implémentations concrètes**.

---

## 🧱 Composition typique

| Élément           | Rôle                                                                       |
|-------------------|----------------------------------------------------------------------------|
| `UserRepository`  | Interface pour charger/enregistrer les utilisateurs                        |
| `OrderRepository` | Interface pour manipuler les commandes                                     |
| `EventStore`      | Interface de persistance des événements de domaine (en DDD Event Sourcing) |

---

## ✅ Bonnes pratiques appliquées

* ✅ Les interfaces ne dépendent d’**aucune technologie** (JPA, SQL, framework…).
* ✅ Les noms des méthodes sont **métier** (ex : `findByEmail`, `save`, `existsById`), pas techniques (`select`, `query`,
  etc.).
* ✅ Les interfaces sont **orientées domaine**, pas base de données.
* ✅ Permet de tester la logique métier avec des **implémentations in-memory** (mock, fake, stub).

---

## 📌 Exemple

```kotlin
interface UserRepository {
    fun findById(id: UUID): User?
    fun findByEmail(email: String): User?
    fun save(user: User)
    fun existsByEmail(email: String): Boolean
}
```

> Ce contrat sera implémenté dans `infrastructure.repository.UserRepositoryImpl`.

---

## 🧪 Tests

Les interfaces ici peuvent être utilisées dans des tests de use cases (`application.service`) via des **mocks** ou des *
*implémentations temporaires** (`InMemoryUserRepository`).

---

