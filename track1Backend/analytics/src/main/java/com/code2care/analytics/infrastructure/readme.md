Très bien, nous passons maintenant au module `infrastructure`, qui est la couche **la plus externe** dans l'architecture
en oignon. Elle contient tous les **adaptateurs techniques** et les **implémentations concrètes**.

---

### 📁 `infrastructure/` — README

Le module `infrastructure` contient les **implémentations concrètes** des ports définis dans le module `domain`. Il
connecte le cœur de l’application aux **dépendances techniques** : base de données, web (REST), messagerie (RabbitMQ,
Kafka), stockage, services tiers, etc.

---

## 🎯 Objectif

* **Fournir des adaptateurs** (entrants/sortants) entre le métier (`domain`) et le monde extérieur.
* Implémenter les **interfaces (ports)** définies dans le domaine.
* Contenir la **configuration Spring Boot**, les contrôleurs REST, les adaptateurs de persistance, etc.

---

## 📦 Structure typique des sous-packages :

| Package                 | Rôle                                                                    |
|-------------------------|-------------------------------------------------------------------------|
| `controller`            | Adaptateurs REST : reçoit les requêtes HTTP et appelle les use cases    |
| `repository`            | Implémentations concrètes des interfaces de persistence (via JPA, etc.) |
| `config`                | Configuration technique Spring Boot (Beans, @Configuration, etc.)       |
| `messaging` (optionnel) | Adaptateurs RabbitMQ, Kafka, etc.                                       |
| `exception` (optionnel) | Gestion centralisée des erreurs (ex : `@ControllerAdvice`)              |

---

## ✅ Bonnes pratiques appliquées

* ✅ Le **code Spring Boot reste ici uniquement** (ex : `@RestController`, `@Repository`, `@Configuration`).
* ✅ Ne contient **aucune logique métier**.
* ✅ Les classes implémentent **les ports du domaine**, en respectant l’Inversion de dépendance (principe D).
* ✅ Bonne séparation entre **contrôleurs REST** (adaptateurs entrants) et **repositories** (adaptateurs sortants).

---

## 🧩 Exemple d’interaction

* `UserRepositoryImpl` implémente `UserRepository` défini dans `domain.repository`.
* `UserController` reçoit une requête HTTP et appelle `CreateUserService` du module `application`.
* `JpaUserRepository` est une interface Spring `JpaRepository<UserEntity, UUID>` injectée dans `UserRepositoryImpl`.

---

## 📌 Exemple simplifié

```kotlin
// infrastructure/repository/UserRepositoryImpl.kt
@Repository
class UserRepositoryImpl(
    private val jpa: JpaUserRepository
) : UserRepository {
    override fun save(user: User) {
        jpa.save(user.toEntity())
    }
}
```

```kotlin
// infrastructure/controller/UserController.kt
@RestController
@RequestMapping("/users")
class UserController(
    private val createUserService: CreateUserService
) {
    @PostMapping
    fun create(@RequestBody dto: CreateUserRequest): ResponseEntity<UUID> {
        val id = createUserService.execute(dto.name, dto.email)
        return ResponseEntity.ok(id)
    }
}
```

---

Tu peux maintenant envoyer `+` pour que je génère le README du sous-package `infrastructure/controller`.
