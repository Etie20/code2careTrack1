### 📁 `application/service` — README

Le package `application/service` contient les **services applicatifs** qui orchestrent les cas d’usage métier. Ces
classes coordonnent les interactions entre la logique métier (`domain`), la persistence, et les autres services
techniques.

---

## 🎯 Objectifs principaux

* Implémenter des **use cases** métiers concrets (ex : créer un utilisateur, passer une commande).
* Orchestrer les appels aux **domain services**, **repositories**, et autres composants nécessaires.
* Gérer la **logique de flux** (transactions, validations simples, appels à plusieurs domaines).
* Fournir une API claire pour les adaptateurs (REST, messaging, UI).

---

## 🧱 Rôle des Services Applicatifs

| Fonction                              | Description                                                    |
|---------------------------------------|----------------------------------------------------------------|
| Orchestrer les appels métiers         | Appeler plusieurs domain services, gérer la séquence d’actions |
| Servir de façade pour les contrôleurs | Exposer une API métier simplifiée aux couches externes         |
| Gérer les opérations non métier       | Validation simple, gestion des erreurs, transactions           |

---

## ✅ Bonnes pratiques appliquées

* Classes avec une méthode claire, souvent nommée `execute()` ou `handle()`.
* Utiliser l’injection de dépendances via constructeur.
* Pas d’annotations Spring directement (pour testabilité et pureté).
* Aucune logique métier complexe dans ces services, déléguée au `domain`.
* Facilement testables avec mocks des dépendances.

---

## 📌 Exemple simplifié

```kotlin
class CreateUserService(
    private val userRepository: UserRepository,
    private val userDomainService: UserDomainService
) {
    fun execute(name: String, email: String): UUID {
        if (!userDomainService.isEmailUnique(Email(email))) {
            throw IllegalArgumentException("Email already used")
        }
        val user = User(UUID.randomUUID(), name, Email(email))
        userRepository.save(user)
        return user.id
    }
}
```

---

## 🧪 Tests

Les services applicatifs peuvent être testés par des tests unitaires, en simulant les `domain service` et `repository`.

---
