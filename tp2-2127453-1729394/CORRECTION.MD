# Correction

Vous serez corrigés sur le respect des exigences fonctionnelles de l’énoncé ainsi que la qualité du JavaScript.

Quelques astuces :
- Lisez **attentivement** l'énoncé, le code fourni et les commentaires dans le code.
- Utilisez les outils de développement de votre navigateur web pour vous aider à déboguer votre code JS (raccourci <kbd>F12</kbd>).
- Respectez la convention de codage établie par _ESLint_. Utilisez la commande `npm run lint` pour valider cet aspect.
- Utilisez les méthodes des tableaux JS (`map`, `filter`, `find`, `reduce`, etc.) au lieu des boucles `for` classiques.
- Exécutez les tests fournis souvent afin de valider votre code. 

## Grille de correction

| **Exigences**                                                   | **Note** | **Points** |
| -------------------------------------------------               | :------: | :--------: |
| Page principale : chargement des données par défaut             |    1     |     1      |
| Page principale : affichage du journal                          |    1     |     1      |
| Page principale : gestion de la persistance et réinitialisation |    2     |     2      |
| Page principale : ajout de nouveau message                      |    1     |     1      |
| Fichier `storageManager.js`                                     |    1     |     1      |
| Fichier `logger`                                                |    3     |     3      |
| Page de détails : affichage des statistiques                    |    1     |     1      |
| Page de détails : affichage des messages du journal             |    2     |     2      |
| Page de détails : barre de recherche                            |    1     |     1      |
| Page de détails : filtres de date,niveau et session             |    0     |     3      |
| Implémentation de `CapLogger`                                   |    2     |     2      |
| Qualité et clarté du code JS                                    |    1     |     2      |
| Bonus                                                           |    0     |     1      |
| **Total**                                                       |  **16**   |   **20**   |


**Note** : Des points peuvent être retirés pour une mauvaise utilisation des méthodes de manipulation du DOM ou du langage JS. Par exemple : l'utilisation de `innerHTML` pour la génération du HTML sera pénalisée.