### 📁 `domain/service` — README

Le package `service` dans le module `domain` contient les **services métier**. Il représente une couche de logique
métier **complexe ou transverse**, qui ne peut pas être placée directement dans une entité ou un value object.

---

## 🎯 Objectif

* Regrouper les **règles métier** trop complexes ou transverses pour une seule entité.
* Fournir des **interfaces métier** claires et testables, sans dépendance à la technologie.
* Encapsuler des opérations **métier pures** (ex : calculs, vérifications métier, interactions entre agrégats).

---

## 🧱 Composition typique

| Élément               | Rôle                                                                        |
|-----------------------|-----------------------------------------------------------------------------|
| `UserDomainService`   | Gère des règles comme l’unicité d’un email, l’activation d’un compte, etc.  |
| `OrderPolicyService`  | Contient des règles métier de validation d’une commande                     |
| `NotificationService` | Définit l’intention métier d’envoyer une notification (sans savoir comment) |

---

## ✅ Bonnes pratiques appliquées

* ✅ Les services sont **stateless** autant que possible (pas de dépendance à une base).
* ✅ S’ils ont des dépendances, ce sont **d'autres interfaces métier** ou **repositories**.
* ✅ Ils ne doivent pas contenir de code technique (pas de `@Service`, pas de `Logger`, pas de `HttpClient`, etc.).
* ✅ Leur API est conçue pour **exprimer une règle métier claire**, non technique.

---

## 📌 Exemple

```kotlin
interface UserValidator {
    fun isEmailValid(email: Email): Boolean
    fun isEligibleForRegistration(user: User): Boolean
}
```

```kotlin
class UserDomainService(
    private val userRepository: UserRepository
) {
    fun isEmailUnique(email: Email): Boolean {
        return !userRepository.existsByEmail(email.value)
    }
}
```

> L'infrastructure fournit une implémentation de `UserRepository`, mais la logique métier reste dans ce service.

---

## 🧪 Tests

Les services du domaine sont **très faciles à tester unitairement**, en mockant simplement les dépendances comme les
`repository`.

---
