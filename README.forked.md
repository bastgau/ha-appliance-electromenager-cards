# Cartes du fork (`-forked`)

Ce fichier recense les cartes ajoutées par ce fork. **Tout notre code est dans des fichiers à nous** (`src/forked/`, `docs/forked/`, `docs/tests-forked.html`) : les fichiers du projet d'origine (`src/core/*`, `src/cards/*`, `src/i18n/*`, README, `docs/*`, `docs/tests.html`) sont **identiques à `main`**. La seule exception est `build.js` (voir plus bas).

## Les cartes

| Carte | Type | Doc |
|---|---|---|
| TV (ambilight, bouton sommeil) | `custom:appliance-tv-forked-card` | [docs/forked/tv-forked.md](docs/forked/tv-forked.md) |
| Ampli home cinéma (bouton sommeil) | `custom:appliance-av-receiver-forked-card` | [docs/forked/av-receiver-forked.md](docs/forked/av-receiver-forked.md) |
| Philips Hue Play HDMI Sync Box | `custom:appliance-hue-sync-forked-card` | [docs/forked/hue-sync.md](docs/forked/hue-sync.md) |
| Box TV (même logique que la Hue, dessin de box TV) | `custom:appliance-tv-box-forked-card` | [docs/forked/tv-box-forked.md](docs/forked/tv-box-forked.md) |
| Mini-PC / Serveur (System Monitor) | `custom:appliance-mini-pc-forked-card` | [docs/forked/mini-pc.md](docs/forked/mini-pc.md) |

Les cartes TV et ampli **héritent** des cartes d'origine (`custom:appliance-tv-card`, `custom:appliance-av-receiver-card`) : toutes leurs options et les évolutions du projet d'origine fonctionnent telles quelles. Les cartes d'origine ne gèrent **pas** `ambilight`, `ambilight_level` ni `sleep` : pour les utiliser, remplacer le type par la carte `-forked`.

## Comment ça marche

`src/forked/forked-cards.js` est chargé après le cœur. Il récupère les classes déjà enregistrées (`customElements.get("appliance-tv-card")`, `…av-receiver-card`, `…generic-card`) et les étend (sous-classes) en surchargeant `_build`, `_ids`, `_compute`, `_render`, `setConfig` et les statiques `getConfigForm` / `getStubConfig`. Les chaînes traduites sont **inline** dans les fichiers du fork (aucune clé dans `src/i18n/*.json`).

Si l'une de ces méthodes internes disparaît de la classe d'origine, la carte concernée est **désactivée avec un avertissement** dans la console du navigateur, au lieu de planter.

## Fusionner `main` (projet d'origine)

```bash
git fetch origin
git merge origin/main
node build.js          # régénère dist/ (le seul conflit attendu : dist/)
```

- **`dist/ha-appliance-electromenager-cards.js`** : en cas de conflit, ne pas le résoudre à la main, relancer `node build.js`.
- **`build.js`** : notre unique modification tient en 3 endroits, hors des listes `CSS_FILES` / `CARD_FILES` (bloc `FORK_FILES` / `CARDS_ORDERED` avant `let warnings`, ligne `listed`, ligne d'assemblage). Un conflit n'est possible que si le projet d'origine modifie ces mêmes lignes : y garder les deux changements.
- Après la fusion, ouvrir **`docs/tests-forked.html`** : tous les tests doivent passer. Les tests « sentinelles » signalent si une méthode interne dont dépendent nos sous-classes a été renommée.
- `docs/tests.html` (tests d'origine) continue de donner les mêmes résultats qu'avec `main`.

## Ajouter une nouvelle carte au fork

Créer un fichier `src/forked/<nom>.js` (IIFE autonome, chaînes inline) : `build.js` le prend en compte automatiquement, juste avant `picker.js`. Ne pas modifier les fichiers du projet d'origine.

**Règle de nommage : toute carte créée par le fork s'appelle `appliance-<nom>-forked-card`** (et son éditeur `appliance-<nom>-forked-card-editor`). Un nom sans suffixe pourrait entrer en collision avec une future carte du projet d'origine. Concrètement :
- l'entrée `window.customCards` porte `forked: true` ;
- une carte dont le type ne finit pas par `-forked-card` est **refusée à l'exécution** (message d'erreur dans la console) ;
- `docs/tests-forked.html` vérifie les deux (et que les anciens noms sans suffixe ne sont pas enregistrés).
