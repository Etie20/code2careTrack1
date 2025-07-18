### 📁 `infrastructure/controller` — README

Le package `controller` contient les **adaptateurs Web** de l’application, notamment les **contrôleurs REST**. Ces
classes utilisent les annotations Spring comme `@RestController` et reçoivent les **requêtes HTTP** provenant des
clients (navigateur, app mobile, etc.).

---

## 🎯 Objectif

* Exposer des **endpoints HTTP** pour accéder aux fonctionnalités métier.
* **Transférer les données** (via DTOs) entre l’extérieur et les services applicatifs.
* Appeler les **use cases** définis dans le module `application`.

---

## ✅ Bonnes pratiques appliquées

| Bonne pratique                         | Description                                                      |
|----------------------------------------|------------------------------------------------------------------|
| ✅ @RestController uniquement ici       | Les couches `domain` et `application` ne dépendent pas de Spring |
| ✅ DTOs spécifiques à la couche Web     | Séparation claire des objets métier et des objets exposés        |
| ✅ Mapping explicite request → use case | Le contrôleur ne contient aucune logique métier                  |
| ✅ Validation côté entrée               | Utilisation de `@Valid`, `@RequestBody`, `@PathVariable`...      |

---

## 📌 Exemple

```kotlin
@RestController
@RequestMapping("/users")
class UserController(
    private val createUserService: CreateUserService,
    private val getUserUseCase: GetUserUseCase
) {

    @PostMapping
    fun createUser(@RequestBody @Valid request: CreateUserRequest): ResponseEntity<UUID> {
        val id = createUserService.execute(request.name, request.email)
        return ResponseEntity.ok(id)
    }

    @GetMapping("/{id}")
    fun getUser(@PathVariable id: UUID): ResponseEntity<UserResponse> {
        val user = getUserUseCase.execute(id)
        return ResponseEntity.ok(UserResponse.from(user))
    }
}
```

---

## 📦 Contenu typique du package

| Fichier                          | Rôle                                                         |
|----------------------------------|--------------------------------------------------------------|
| `UserController.kt`              | Contrôleur REST exposant les endpoints liés aux utilisateurs |
| `CreateUserRequest.kt`           | DTO représentant le corps de la requête POST                 |
| `UserResponse.kt`                | DTO représentant la réponse envoyée au client                |
| `@ExceptionHandler` (facultatif) | Pour la gestion des erreurs spécifiques HTTP                 |

---

## 🚫 Ce qu’on **ne fait pas** ici

* ❌ Pas de logique métier (elle est dans les `use cases`)
* ❌ Pas de gestion technique des données (ex : JPA, SQL)
* ❌ Pas de mapping de modèle métier : on délègue au `service` ou à un `mapper`

---

Envoie `+` pour que je génère maintenant le README du sous-package `infrastructure/repository`.
