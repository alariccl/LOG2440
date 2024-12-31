## Cypress et tests bout en bout (`e2e`)

La bibliothèque <a href="https://www.cypress.io/">Cypress</a> est utilisée dans ce travail pratique, tout comme le TP1. Pour exécuter l'ensemble des tests, vous avez la possibilité d'utiliser `npm run test` ou `npm run test:headless`. Si vous décidez d'utiliser `npm run test`, vous devriez voir une nouvelle fenêtre apparaître.

Plusieurs tests d'intégration, d'acceptation et de bout en bout vous sont fournis dans le répertoire [e2e](./site/cypress/e2e/) pour vous aider à compléter votre travail. Les tests fournis sont les suivants :

- [Main](./site/cypress/e2e/main.cy.js): suite de tests pour la page principale du site et l'interaction avec les éléments de la page.
- [Details](./site/cypress/e2e/details.cy.js): suite de tests pour la page de détails du site et l'interaction avec les messages du journal.
- [Filters](./site/cypress/e2e/filters.cy.js): suite de tests pour les différents filtres applicables sur le journal.
- [Search](./site/cypress/e2e/search.cy.js): suite de tests pour la recherche de messages dans le journal.
- [Stats](./site/cypress/e2e/stats.cy.js): suite de tests pour les statistiques du journal.

Ces tests vérifient les différents parties du travail à compléter. Il est fortement conseillé de bien les lire pour comprendre le fonctionnement attendu de l'application.

Le fichier [e2e](./site/cypress/e2e/e2e.cy.js) contient des tests bout en bout qui testent l'application dans son ensemble (l'interaction entre les deux pages). Ils sont utilisés pour tester le comportement de l'application en simulant l'interaction de l'utilisateur avec l'interface graphique.

**Note** : les tests ont une certaine flexibilité. Les tests fournis ne couvrent pas 100% des requis du TP. Certains éléments seront évalués manuellement. Lest tests de bout en bout couvrent les cas d'utilisation principaux de l'application.

## Jest et tests unitaires

La bibliothèque <a href="https://jestjs.io/">Jest</a> est également utilisée dans ce travail pratique. Pour exécuter les tests unitaires de jest, vous pouvez utiliser la commande `npm run test:unit` qui va exécuter vos tests dans le terminal.

Comme les tests de bout en bout qui vous sont fournis, les tests unitaires vous aideront à compléter une partie de votre travail.

# Implémentation de la classe `CapLogger`

## *Test Driven Development (TDD)*

Le développement piloté par les tests (_TDD_) est une approche de développement logiciel qui consiste à écrire les tests avant d'écrire le code. Pour ce travail pratique, vous devez utiliser cette approche pour implémenter la classe `CapLogger` en vous basant sur les tests fournis dans le fichier [capLogger.spec.js](./site/jest/capLogger.spec.js). Vous ne pouvez pas modifier l'implémentation fournie des tests. 

`CapLogger` est une extension de `Logger` du TP avec une contrainte supplémentaire : le journal ne peut pas contenir plus de `maxSize` entrées. Si le nombre d'entrées dépasse `maxSize`, l'entrée la plus ancienne doit être supprimée. Si la valeur de `maxSize` est modifiée, le `CapLogger` doit ajuster la quantité d'entrées contenues en conséquence : si `maxSize` est réduite de `n`, les `n` entrées les plus anciennes doivent être supprimées.

La valeur de `maxSize` est définie lors de la création de l'instance de `CapLogger` ou à travers une méthode de la classe. `maxSize` a la valeur par défaut de `Infinity` (pas de limite) et ne peut pas être inférieure à 1. Une tentative de la définir à une valeur inférieure à 1 doit la mettre à sa valeur par défaut.


**Note** : Tous les tests fournis doivent passer lors de la remise.