# Jev Légifrance Impact

**Détecte quelles dispositions juridiques modifiées peuvent affecter une activité déclarée.**

[![Tests](https://github.com/gbesse/jev-legifrance-impact/actions/workflows/test.yml/badge.svg)](https://github.com/gbesse/jev-legifrance-impact/actions/workflows/test.yml) [MIT](LICENSE) · Node.js 22+ · v0.1.4 · Documentation française

Le moteur calcule d’abord les modifications exactes entre deux versions d’un texte. Jev évalue ensuite uniquement ces changements par rapport à un profil d’activité borné, en conservant les références de source.

## Démarrage rapide

```sh
git clone https://github.com/gbesse/jev-legifrance-impact.git
cd jev-legifrance-impact
npm install
npm run demo
```

La démonstration utilise uniquement des données et probabilités synthétiques. Elle n’effectue aucun appel réseau et ne constitue pas une mesure de qualité de Jev.

## Exemple exécutable

Cet exemple compare deux versions d’une règle de conservation. Il utilise un fournisseur Jev simulé : aucune clé API ni connexion réseau n’est nécessaire. L’assertion intégrée fait échouer la commande si le comportement attendu change.

Le code complet de [`examples/demo.mjs`](examples/demo.mjs) est directement copiable :

```js
// Objectif : démontrer la frontière de décision sans appel réseau.
import assert from "node:assert/strict";
import { analyzeVersions } from "../src/index.mjs";
import { createFakeProvider } from "../src/jev.mjs";
const p = createFakeProvider(() => ({
  model: "jev-1.13.0",
  answers: {
    impact: {
      type: "choice",
      choice: "direct",
      probabilities: {
        direct: 0.88,
        indirect: 0.07,
        none: 0.02,
        unknown: 0.03,
      },
      confidence: 0.88,
    },
  },
  usage: { input_tokens: 110, output_tokens: 0 },
}));
const resultat = await analyzeVersions(
  [
    {
      id: "R1",
      text: "Conserver les justificatifs pendant deux ans.",
      sourceId: "LEGIA",
    },
  ],
  [
    {
      id: "R1",
      text: "Conserver les justificatifs pendant cinq ans.",
      sourceId: "LEGIB",
    },
  ],
  { activity: "place de marché en ligne" },
  p,
);
assert.equal(resultat[0].assessment.impact, "direct");
console.log(JSON.stringify(resultat, null, 2));
```

Lancez-le avec :

```sh
npm run demo:principal
```

Résultat à repérer : `impact: direct`.

### Cas limite à tester

Le diff structurel repère ajouts, modifications et suppressions sans modèle. Le code se trouve dans [`examples/cas-limite.mjs`](examples/cas-limite.mjs).

```sh
npm run demo:limite
```

Résultat à repérer : `types: added, modified, removed`. La commande `npm run demo` exécute les deux exemples.

## Utilisation de la bibliothèque

Importez les fonctions métier depuis `@gbesse/jev-legifrance-impact`. Fournissez soit `createJevClient()` depuis l’export `./jev`, soit `createFakeProvider()` pour les tests hors ligne.

Les noms de l’API JavaScript restent stables pour préserver la compatibilité avec les versions précédentes. La documentation, les exemples et les explications destinées aux utilisateurs sont en français.

## Frontière de décision

Le dépôt ne donne pas d’interprétation juridique, n’établit pas la conformité et ne fournit pas de conseil juridique. L’authentification à l’API Légifrance reste gérée par un adaptateur externe.

La question exacte envoyée à Jev est versionnée dans [`src/index.mjs`](src/index.mjs). Les identifiants, dates, calculs, filtres, seuils et transitions d’état restent gérés par du code ordinaire.

## Sources

- [https://www.legifrance.gouv.fr](https://www.legifrance.gouv.fr)
- [https://piste.gouv.fr](https://piste.gouv.fr)

Conservez l’attribution amont, les identifiants d’origine, les URL de source et les dates de récupération avec chaque enregistrement dérivé.

## Appels Jev réels

Les appels réels sont facultatifs et payants. Le client fixe le modèle `jev-1.13.0`, valide l’identité du modèle et toutes les probabilités, refuse les redirections, ne retente que les erreurs réseau et les réponses HTTP 429/529, puis bloque les requêtes dépassant une estimation prudente de 24 000 jetons.

```sh
TYPESAFE_API_KEY=... node scripts/live-smoke.mjs
```

N’envoyez jamais de secret, de donnée personnelle ni de dossier sensible non expurgé. Évaluez le comportement sur un jeu représentatif de cas français avant tout usage opérationnel.

## Parcours comparatif

`npm run demo:parcours` produit un rapport JSON partageable pour **jev-legifrance-impact** : le scénario principal et la frontière déterministe. Chaque scénario garde sa sortie propre et échoue si son assertion ne passe plus. Les données et probabilités sont synthétiques ; aucun appel Jev n’est effectué.

Cette vue permet de comparer rapidement les chemins de décision et de choisir quel exemple adapter à vos propres données sourcées.

## Validation

```sh
npm run check
npm run typecheck
npm test
npm run demo
```

La CI exécute ces vérifications sous Node.js 22 et 24.

Projet indépendant, sans affiliation avec TypeSafe AI ni avec l’administration française. Consultez la [documentation de l’API Jev](https://docs.typesafe.ai/api) et les [limites du modèle](https://docs.typesafe.ai/model-jaggedness/jev-1.13).
