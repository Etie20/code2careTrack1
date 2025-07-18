### 📁 `infrastructure/repository` — README

Le package `repository` contient les **adaptateurs de persistence**. Il implémente les **interfaces (ports)** définies
dans le module `domain.repository` à l’aide de technologies comme **Spring Data JPA**, **MongoDB**, ou tout autre
mécanisme de stockage.

---

## 🎯 Objectif

* Fournir une **implémentation technique** des interfaces de dépôt métier définies dans `domain`.
* Gérer la **conversion** entre les **entités métier** et les **entités de persistence (Entity / Document)**.
* Utiliser des outils comme Spring Data pour effectuer les opérations CRUD.

---

## 🧱 Composition typique

| Élément               | Rôle                                                                  |
|-----------------------|-----------------------------------------------------------------------|
| `JpaRepository`       | Interface Spring pour les opérations CRUD                             |
| `Entity`              | Représente une table ou un document                                   |
| `RepositoryImpl`      | Implémentation métier de l’interface définie dans `domain.repository` |
| `Mapper` (facultatif) | Convertit entre entités JPA et objets du domaine                      |

---

## ✅ Bonnes pratiques appliquées

* ✅ Les classes **implémentent uniquement** les interfaces du `domain` (inversion de dépendance).
* ✅ Le code Spring/JPA ne sort pas de cette couche.
* ✅ Les entités de persistence (`@Entity`) ne sont **pas** exposées en dehors de cette couche.
* ✅ **Mapping clair** entre entités JPA ↔ objets métier.

---

## 📌 Exemple

### Interface JPA

```kotlin
interface JpaUserRepository : JpaRepository<UserEntity, UUID> {
    fun findByEmail(email: String): UserEntity?
}
```

### Entité de persistence

```kotlin
@Entity
@Table(name = "users")
data class UserEntity(
    @Id val id: UUID,
    val name: String,
    val email: String
) {
    fun toDomain() = User(id, name, Email(email))
    companion object {
        fun fromDomain(user: User) =
            UserEntity(user.id, user.name, user.email.value)
    }
}
```

### Implémentation du repository métier

```kotlin
@Repository
class UserRepositoryImpl(
    private val jpa: JpaUserRepository
) : UserRepository {
    override fun findById(id: UUID): User? =
        jpa.findById(id).orElse(null)?.toDomain()

    override fun save(user: User) {
        jpa.save(UserEntity.fromDomain(user))
    }
}
```

---

## 🚫 Ce qu’on **ne fait pas** ici

* ❌ Aucun appel à un service applicatif.
* ❌ Pas de logique métier ici.
* ❌ Ne pas injecter directement `JpaRepository` dans un contrôleur ou service métier.

---

Envoie `+` pour que je génère le README du sous-package `infrastructure/config` ou un autre de ton choix.
