### 📁 `domain/model` — README

Le package `model` du module `domain` contient les **objets métier fondamentaux** qui représentent le cœur du domaine.
Ces objets modélisent les concepts clés et règles métier principales de l’application.

---

## 🎯 Objectifs principaux

* Représenter les **entités métier**, **value objects** et **agrégats**.
* Garantir que ces objets sont **purs** : pas de dépendances à des frameworks externes (Spring, JPA, etc.).
* Encapsuler la logique métier liée aux propriétés de ces objets (ex : validation, invariants).
* Servir de base stable et testable pour toute la logique métier.

---

## 🧱 Contenu typique

| Élément           | Description                                                                       |
|-------------------|-----------------------------------------------------------------------------------|
| **Entités**       | Objets métier identifiables par un ID unique (ex : `User`, `Order`).              |
| **Value Objects** | Objets immuables sans identité propre (ex : `Email`, `Address`).                  |
| **Aggregates**    | Groupes cohérents d’objets métier sous une racine (ex : `Order` avec ses lignes). |

---

## ✅ Bonnes pratiques appliquées

* Les **Value Objects sont immuables** et validés à la construction.
* La logique métier simple liée aux données est **encapsulée dans les entités** (ex : changement d’état, validation
  interne).
* Pas d’annotations ou dépendances spécifiques à un framework.
* Pas de logique liée à la persistence, qui appartient à la couche `infrastructure`.

---

## 📌 Exemple simplifié

```kotlin
// Value Object
data class Email(val value: String) {
    init {
        require(value.contains("@")) { "Email invalide" }
    }
}

// Entité
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

---

## 🧪 Tests

Les objets métier peuvent être testés par des tests unitaires simples, sans configuration ni dépendance externe.

---