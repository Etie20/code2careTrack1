
---

## 📘 **1. Objectif métier principal**

> Concevoir un système intégré permettant aux établissements de santé de :

* recueillir les feedbacks des patients via plusieurs modes (texte, voix, emojis, étoiles),
* analyser automatiquement les sentiments exprimés et les thèmes abordés,
* envoyer des rappels multilingues de rendez-vous ou de médication,
* avec accessibilité pour tous (langues locales, zones à faible connectivité).

---

## 🎯 **2. Exigences métier fonctionnelles**

| ID  | Exigence                                                                               |
| --- | -------------------------------------------------------------------------------------- |
| F1  | Le patient doit pouvoir soumettre un feedback en texte, emoji, étoile ou voix          |
| F2  | Le patient peut recevoir des rappels de rendez-vous et de prise de médicaments         |
| F3  | Les rappels doivent être envoyés par SMS, notification, ou message vocal               |
| F4  | L'application doit permettre la reconnaissance vocale et la synthèse vocale            |
| F5  | Le système doit supporter plusieurs langues : Français, Anglais, Douala, Bassa, Ewondo |
| F6  | Le personnel médical (ou l’admin) peut consulter les feedbacks et statistiques         |
| F7  | Chaque feedback est analysé pour extraire le **sentiment** (positif, neutre, négatif)  |
| F8  | Chaque feedback est catégorisé par **thème** : accueil, délai, soins, hygiène…         |
| F9  | L'utilisateur doit pouvoir s'authentifier dans l’application mobile (patient ou staff) |
| F10 | Le patient doit pouvoir sélectionner sa langue préférée à l'inscription                |

---

## ❗ **3. Contraintes techniques (liées au métier)**

| ID | Contrainte                                                                                                                   |
| -- | ---------------------------------------------------------------------------------------------------------------------------- |
| C1 | Le système doit fonctionner dans des zones à **faible bande passante (2G/3G)**                                               |
| C2 | Le système doit fonctionner **offline temporairement** avec synchronisation différée                                         |
| C3 | L’envoi de rappels doit respecter les **préférences de langue et de canal** du patient                                       |
| C4 | Le système doit être conforme aux normes de **confidentialité des données de santé** (ex. RGPD, anonymisation des feedbacks) |
| C5 | Le système ne doit pas dépendre uniquement d’un accès à Internet haut débit                                                  |
| C6 | Les messages vocaux ou écrits doivent être **traduisibles dans les langues locales**                                         |
| C7 | Les feedbacks ne doivent pas être modifiables par l’utilisateur une fois soumis                                              |
| C8 | Les rappels doivent être programmés automatiquement **à partir des prescriptions ou RDV médicaux**                           |

---

## 📏 **4. Règles de gestion**

| ID | Règle de gestion                                                              |
| -- | ----------------------------------------------------------------------------- |
| R1 | Un patient ne peut recevoir un rappel que s’il est enregistré dans le système |
| R2 | Un feedback est toujours associé à un patient identifié                       |
| R3 | Un rappel de type `appointment` peut être lié à un médecin                    |
| R4 | Les feedbacks vocaux sont convertis en texte pour l’analyse sémantique        |
| R5 | Chaque patient ne peut avoir qu’**une seule langue préférée**                 |
| R6 | Un même patient peut recevoir plusieurs rappels dans la journée               |
| R7 | Un même patient peut soumettre plusieurs feedbacks                            |

---

## 🧪 **5. Exigences non fonctionnelles**

| ID  | Exigence                                                                                                 |
| --- | -------------------------------------------------------------------------------------------------------- |
| NF1 | Le système doit être utilisable sur Android et Web                                                       |
| NF2 | L’interface doit être accessible à des patients peu alphabétisés (emoji, voix)                           |
| NF3 | Le traitement des feedbacks (analyse NLP) doit se faire en < 10 secondes                                 |
| NF4 | Les notifications doivent être livrées au moins 90 % du temps                                            |
| NF5 | Le backend doit être **modulaire** pour faciliter l’intégration future (ex : ajout de nouvelles langues) |
| NF6 | Le système doit pouvoir évoluer jusqu'à **plusieurs milliers d’utilisateurs**                            |
| NF7 | Les données doivent être sauvegardées quotidiennement                                                    |
| NF8 | Le système doit répondre à des pannes de connectivité sans perte d’information                           |

---

## ✅ **6. Indicateurs de réussite du projet (KPIs)**

| KPI                           | Objectif cible               |
| ----------------------------- | ---------------------------- |
| Taux de feedback journalier   | ≥ 60 % des patients          |
| Délai moyen d’analyse NLP     | ≤ 5 secondes                 |
| Taux de livraison des rappels | ≥ 90 %                       |
| Satisfaction utilisateur      | ≥ 80 % (via auto-évaluation) |
| Disponibilité du système      | ≥ 99 %                       |

---
