### 📁 `application/` — README

Le module `application` constitue la **couche d’application** de l’architecture en oignon. Il orchestre la logique
métier en coordonnant les cas d’usage, en appelant les services métier du domaine et les interfaces de persistence.

---

## 🎯 Objectifs principaux

* Implémenter les **cas d’usage métier** (use cases) de l’application.
* Orchestrer les appels aux **domain services**, **repositories**, et autres composants.
* Fournir une API claire et stable aux adaptateurs externes (REST, messaging, UI).
* Garantir l’isolation de la logique métier pure (`domain`) des détails techniques.

---

## 📦 Structure typique

| Package/Sous-module             | Description                                                               |
|---------------------------------|---------------------------------------------------------------------------|
| `service`                       | Contient les classes qui implémentent les cas d’usage métier (use cases). |
| `dto` (optionnel)               | Contient les objets de transfert de données utilisés en interne.          |
| `command` / `query` (optionnel) | Si CQRS, contient la définition des commandes et requêtes métier.         |

---

## ✅ Bonnes pratiques appliquées

* Le module dépend uniquement du module `domain` (pas d’autres modules techniques).
* Chaque service applicatif implémente un cas d’usage métier clair (ex : `CreateUserService`).
* Utilisation de l’injection par constructeur pour faciliter les tests.
* Pas d’annotations spécifiques à Spring pour favoriser la testabilité et la portabilité.
* Pas de logique métier complexe ici — uniquement orchestration.

---

## 📌 Exemple simplifié

```kotlin
class CreateUserService(
    private val userRepository: UserRepository,
    private val userDomainService: UserDomainService
) {
    fun execute(name: String, email: String): UUID {
        if (!userDomainService.isEmailUnique(Email(email))) {
            throw IllegalArgumentException("Email déjà utilisé")
        }
        val user = User(UUID.randomUUID(), name, Email(email))
        userRepository.save(user)
        return user.id
    }
}
```

---

## 🧪 Tests

* Facilement testable via des tests unitaires, en simulant (`mocking`) les dépendances du domaine.
* Aucun besoin de démarrer le contexte Spring pour tester la logique applicative.

---

Tu peux envoyer `+` si tu veux que je génère le README d’un sous-package spécifique du module `application`, ou un autre
package/module.
