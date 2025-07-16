### 📁 `infrastructure/config` — README

Le package `config` contient toute la **configuration technique** spécifique à l'infrastructure de l’application. Il
centralise la définition des **beans Spring**, des **adapters de configuration**, et les paramètres nécessaires au bon
fonctionnement de l’environnement (base de données, sécurité, messaging, etc.).

---

## 🎯 Objectif

* Fournir les **classes de configuration Spring Boot** nécessaires à l'infrastructure.
* Définir les **beans** qui doivent être injectés dans les autres composants.
* Centraliser les **configurations spécifiques** aux frameworks utilisés : JPA, RabbitMQ, Swagger, etc.

---

## 📦 Contenu typique du package

| Élément                            | Rôle                                                                |
|------------------------------------|---------------------------------------------------------------------|
| `@Configuration` classes           | Déclare des beans ou adapte des configurations Spring               |
| `@Enable*` annotations             | Active des modules Spring (JPA, Scheduling, etc.)                   |
| `Properties` / `Record`            | Contient des configurations typées mappées depuis `application.yml` |
| Initialisation de base de données  | Ajoute des fixtures ou valeurs par défaut au lancement              |
| Mapping et injection personnalisée | Pour mapper des interfaces métier à des implémentations techniques  |

---

## ✅ Bonnes pratiques appliquées

* ✅ Utiliser `@Configuration` pour toute définition manuelle de bean.
* ✅ Éviter d’utiliser des configurations inutiles dans d’autres couches.
* ✅ Préférer des classes de configuration **unitaires et spécialisées** (ex: `SwaggerConfig`, `JpaConfig`,
  `RabbitConfig`).
* ✅ Séparer les **fichiers de propriétés** (`application.yml`) du code de configuration.

---

## 📌 Exemple

```kotlin
@Configuration
class RepositoryConfig {

    @Bean
    fun userRepository(jpa: JpaUserRepository): UserRepository =
        UserRepositoryImpl(jpa)
}
```

```kotlin
@Configuration
@ConfigurationProperties(prefix = "app.security")
data class SecurityProperties(
    var jwtSecret: String = "",
    var expirationMs: Long = 0
)
```

```yaml
# application.yml
app:
  security:
    jwt-secret: mysecretkey
    expiration-ms: 3600000
```

---

## 🚫 Ce qu’on **ne fait pas** ici

* ❌ Pas de logique métier ici.
* ❌ Ne pas mélanger avec les controllers, les services applicatifs ou les entités.

---

Tu peux envoyer `+` pour passer au sous-package suivant (par exemple `messaging`, `exception` s’ils existent), ou un
nouveau nom de package/module.
