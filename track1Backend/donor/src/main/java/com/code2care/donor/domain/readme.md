### 📁 `domain/` — README

Le module `domain` est le **cœur métier** de l'application. Il représente l'essence du **modèle métier** et des **règles
de gestion** indépendamment de toute technologie. Dans une architecture en oignon (ou DDD), c’est la couche la plus *
*stable**, **testable**, et **centrale**.

---

## 🎯 Objectif du module `domain`

* Définir les **objets métier fondamentaux** : entités, value objects, agrégats.
* Encapsuler la **logique métier pure** et ses règles (invariants, comportements).
* Fournir des **interfaces (ports)** pour la persistence, les services tiers, etc.
* Être totalement **indépendant de Spring, JPA, RabbitMQ, etc.**

---

## 🧱 Structure typique

| Sous-package | Rôle                                                               |
|--------------|--------------------------------------------------------------------|
| `model`      | Contient les entités, agrégats, value objects et enums métiers     |
| `service`    | Contient les services métier (règles complexes ou transverses)     |
| `repository` | Interfaces de persistence métier (à implémenter en infrastructure) |

---

## ✅ Bonnes pratiques respectées

* **Pas d’annotations** Spring ou JPA : le domaine ne connaît aucune technologie.
* **Rich Domain Model** : les objets portent leur propre logique, pas de simple structure de données.
* Les services métier sont **centrés sur les règles**, pas sur l’orchestration.
* Les interfaces (`UserRepository`, `NotificationService`) sont définies ici et implémentées ailleurs.

---

## 📌 Exemple

### Value Object

```kotlin
data class Email(val value: String) {
    init {
        require(value.contains("@")) { "Email invalide" }
    }
}
```

### Entité

```kotlin
class User(
    val id: UUID,
    var name: String,
    val email: Email
) {
    fun updateName(newName: String) {
        require(newName.isNotBlank())
        name = newName
    }
}
```

### Interface de repository

```kotlin
interface UserRepository {
    fun save(user: User)
    fun findById(id: UUID): User?
    fun existsByEmail(email: String): Boolean
}
```

---

## 🧪 Tests

* Les composants du domaine sont **totalement testables sans contexte Spring**.
* Ils peuvent être testés avec des mocks simples pour valider les comportements métier.

---

## 📌 Résumé

Le module `domain` est :

* ✅ Indépendant
* ✅ Stable
* ✅ Recentré sur les règles métier
* ✅ Le fondement de toute l’architecture

---