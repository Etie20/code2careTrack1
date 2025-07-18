### 📁 `infrastructure/exception` — README

Le package `exception` contient la **gestion centralisée des erreurs** dans l’application. Il permet d’**intercepter les
exceptions**, de **standardiser les réponses d’erreur** envoyées aux clients, et de mieux séparer la logique métier de
la gestion des cas d’erreurs techniques ou fonctionnels.

---

## 🎯 Objectifs

* Gérer les erreurs d’une manière **claire, propre et centralisée**.
* Intercepter les exceptions et retourner des réponses **uniformes** (souvent au format JSON).
* Distinguer les erreurs **fonctionnelles (métier)** des erreurs **techniques**.
* Faciliter le **debug**, le **logging**, et le **traitement frontend** des erreurs.

---

## 📦 Structure typique

| Fichier                                        | Rôle                                                                         |
|------------------------------------------------|------------------------------------------------------------------------------|
| `GlobalExceptionHandler`                       | Classe annotée avec `@ControllerAdvice` qui intercepte toutes les exceptions |
| `CustomException` (ex: `BusinessException`)    | Exception métier personnalisée                                               |
| `ErrorResponse`                                | Structure de réponse JSON retournée en cas d’erreur                          |
| `NotFoundException`, `ConflictException`, etc. | Exceptions spécifiques aux cas d’erreur fréquents                            |

---

## ✅ Bonnes pratiques appliquées

* ✅ On ne lance **pas directement `RuntimeException` ou `Exception`** dans les couches métier.
* ✅ Les erreurs métier utilisent des **exceptions spécifiques** : claires et intentionnelles.
* ✅ La couche REST (contrôleur) ne connaît pas les détails des erreurs internes.
* ✅ Les messages retournés sont **explicites**, bien formatés, et logués proprement.

---

## 📌 Exemple

### Exception personnalisée

```kotlin
class EmailAlreadyUsedException(email: String) :
    RuntimeException("L'email $email est déjà utilisé.")
```

### Structure de réponse d’erreur

```kotlin
data class ErrorResponse(
    val message: String,
    val status: Int,
    val timestamp: LocalDateTime = LocalDateTime.now()
)
```

### Handler global

```kotlin
@RestControllerAdvice
class GlobalExceptionHandler {

    @ExceptionHandler(EmailAlreadyUsedException::class)
    fun handleEmailException(ex: EmailAlreadyUsedException): ResponseEntity<ErrorResponse> =
        ResponseEntity
            .status(HttpStatus.CONFLICT)
            .body(ErrorResponse(ex.message ?: "Conflit", 409))

    @ExceptionHandler(Exception::class)
    fun handleUnknownException(ex: Exception): ResponseEntity<ErrorResponse> =
        ResponseEntity
            .status(HttpStatus.INTERNAL_SERVER_ERROR)
            .body(ErrorResponse("Erreur inconnue", 500))
}
```

---

## 🔧 Intégration avec d'autres couches

* Le contrôleur n'a **rien à faire** : il laisse l'exception se propager.
* La réponse est interceptée automatiquement par `GlobalExceptionHandler`.

---

Souhaites-tu maintenant un README pour un autre package (comme `messaging`, `bootstrap`, etc.) ou écrire `fin` pour
conclure ?
