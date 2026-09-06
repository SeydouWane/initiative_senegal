# Communes Transparentes

Site vitrine de l'Initiative citoyenne pour la transparence des communes (Sénégal).

## Structure

```
initiative_senegal/
├── index.html                 page unique du site
├── css/styles.css              styles (couleurs, typographie, mise en page)
├── js/data.js                   données : 46 départements (carte) + 553 communes (suivi)
├── js/app.js                     logique de la carte, des filtres et des fiches
├── js/config.js                  identifiant FormSubmit (formulaire référent)
├── images/                      logo, favicon, écran d'entrée, photos
├── scripts/
│   ├── project-map.js            génère le tracé + les coordonnées des départements
│   ├── parse-communes.js         génère la liste des 553 communes (voir ci-dessous)
│   ├── communes_raw.wiki         source : wikitexte de la page Wikipédia (EN) "Communes of Senegal"
│   └── communes_parsed.json      sortie structurée région → département → communes
└── README.md
```

## Ouvrir le site

Ouvrez simplement `index.html` dans un navigateur (double-clic), ou lancez un
petit serveur local depuis ce dossier, par exemple :

```
python -m http.server 8000
```

puis ouvrez `http://localhost:8000`.

## Modèle de données : départements (carte) vs communes (suivi)

Le Sénégal compte 14 régions, 46 départements (depuis la création du
département de Keur Massar en 2021) et 557 communes — le territoire est
intégralement communalisé depuis l'Acte III de la décentralisation (loi
n° 2013-10). Chaque commune est une collectivité territoriale avec son
propre maire élu, son conseil municipal, son budget — c'est donc bien le
niveau **commune** qui porte le suivi citoyen (statut, maire, référent,
documents), comme le prévoit la loi citée sur le site (article 6).

Pour que la carte reste lisible (557 points sur une carte à l'échelle du
pays serait illisible), le site fonctionne à **deux niveaux** :

- **`DEPARTEMENTS`** (46, dans `js/data.js`) : uniquement pour le tracé de
  la carte. Chaque point cliquable filtre la liste sur les communes de ce
  département — il n'a pas de statut ni de fiche propre.
- **`COMMUNES`** (553, dans `js/data.js`) : l'unité de suivi réelle, avec
  région, département, statut, et éventuellement une fiche détaillée dans
  `COMMUNE_DETAILS`.

## Données communales : fiabilité et sources

La liste des 553 communes est générée à partir du wikitexte de la page
Wikipédia (anglais) *"Communes of Senegal"* (`scripts/communes_raw.wiki`),
elle-même basée sur les décrets de création successifs des communes et sur
le découpage post-Acte III. Pour la régénérer ou la mettre à jour :

```
node scripts/parse-communes.js
```

Le script relit `communes_raw.wiki` et régénère
`scripts/communes_parsed.json` (région → département → liste de communes),
qu'il faut ensuite reformater en tableaux `[nom, département, région, "doc"]`
dans `js/data.js` (variable `COMMUNES`).

**⚠️ Cette liste compte 553 entrées, pas 557 pile** — l'écart (~4 communes)
vient probablement de créations très récentes pas encore reflétées sur
Wikipédia. **Avant toute publication officielle**, recoupez cette liste
avec une source officielle (ANSD, Journal officiel, ou liste du ministère
des Collectivités territoriales) pour combler l'écart et corriger
d'éventuelles erreurs de rattachement département/région.

Note technique : deux communes distinctes peuvent porter le même nom dans
des départements différents (ex. deux communes appelées à l'origine
« Vélingara », l'une chef-lieu du département de Vélingara, l'autre dans
Ranérou Ferlo — renommée ici « Vélingara Ferlo » pour éviter toute
confusion). C'est pourquoi `COMMUNE_DETAILS` (les fiches maire) est indexé
par la clé composite `"Nom|Département"`, pas seulement par nom.

## La carte

Le tracé du Sénégal (`SENEGAL_OUTLINE`) et la position de chaque
département dans `js/data.js` sont calculés par projection équirectangulaire
de vraies coordonnées géographiques (frontière officielle Natural Earth
pour le pays, coordonnées Wikipédia/officielles pour les chefs-lieux de
département). Si vous devez recalculer ces coordonnées (nouveau
département, correction d'une position), modifiez la liste `towns` dans
`scripts/project-map.js` puis :

```
node scripts/project-map.js
```

Le script affiche le nouveau `SENEGAL_OUTLINE` et le nouveau tableau
`DEPARTEMENTS` à recopier dans `js/data.js`.

## Mettre à jour le statut d'une commune

Tout est dans `js/data.js`, variable `COMMUNES` (`[nom, département,
région, statut]`). Statuts possibles :

- `doc` — à documenter (statut par défaut de toutes les communes
  actuellement : aucune démarche réelle n'a encore été engagée)
- `env` — demande envoyée
- `obt` — réponse obtenue
- `ref` — refus opposé

## Fiches détaillées par commune

Les fiches (ouvertes en cliquant une commune dans la liste) affichent :

- **Maire** — renseigné dans `COMMUNE_DETAILS` (clé `"Nom|Département"`)
  pour 135 communes, à partir de recherches documentaires sur les élections
  locales de janvier 2022 (et remplacements connus depuis — décès,
  démissions, révocations). Les régions de Dakar (42 communes) et de Thiès
  (l'essentiel des 50 communes des 3 départements) sont bien couvertes,
  ainsi que la région de Diourbel (10 communes, dont Touba) ; ailleurs,
  seules les grandes villes le sont.
  Certaines entrées portent une note explicite quand les sources se
  contredisent ou datent d'avant/après un remplacement en cours de mandat
  (ex. Kayar, Pout, Sébikhotane, Rufisque Ouest) — à trancher en priorité.
  **Toutes les entrées sont à vérifier avant toute publication
  officielle** — un mandat peut avoir changé de titulaire sans que cela ait
  été retrouvé lors de la recherche. Note : les grandes « Villes » à statut
  particulier (Dakar, Pikine, Guédiawaye, Rufisque, Thiès) n'ont pas
  elles-mêmes d'entrée : le maire de ville n'a pas de correspondance 1:1
  avec une seule commune, chaque commune d'arrondissement ayant son propre
  maire (déjà renseignés séparément). La grande majorité des 553 communes
  n'a pas de maire renseigné (aucune base de données publique centralisée
  des résultats commune par commune n'a été trouvée) : à compléter au format
  ```js
  "Nom de la commune|Nom du département": { maire: "Nom Prénom", note: "source / précision" }
  ```
- **Référent local** et **Documents obtenus** — volontairement laissés à
  « Poste à pourvoir » / « Aucun document répertorié » : le réseau de
  référents n'est pas encore constitué et aucune démarche réelle n'a encore
  abouti. À ajouter dans `COMMUNE_DETAILS` (et adapter `openModal()` dans
  `js/app.js`) au fil des vraies démarches, plutôt que d'inventer des
  informations sur de vraies communes.

## Formulaire référent (« Se porter volontaire »)

Le bouton « Se porter volontaire » ouvre une popup (nom, prénom, téléphone,
email, région, commune, description). À l'envoi, un email est transmis via
[FormSubmit](https://formsubmit.co/) — aucun backend à héberger, et
l'adresse de destination n'apparaît nulle part dans le code.

**Configuration (à faire une seule fois) :**

1. Une confirmation FormSubmit a déjà été envoyée à l'adresse de contact de
   l'initiative — ouvrez cet email et cliquez sur *« Activate Form »*.
2. Le même email contient une **chaîne alphanumérique** (« Invisible
   email ») à utiliser à la place de l'adresse — c'est ce qui permet de ne
   jamais exposer l'email dans le site.
3. Copiez cette chaîne dans `js/config.js`, à la place de
   `REMPLACER_PAR_VOTRE_ID_FORMSUBMIT` :
   ```js
   const FORM_ENDPOINT = "votre-chaine-formsubmit";
   ```
4. Tant que `js/config.js` n'est pas complété, le formulaire affiche un
   message d'erreur explicite au lieu d'échouer silencieusement.

Le formulaire inclut un champ piège anti-spam (`_honey`, invisible) et
envoie un objet d'email fixe. Pour changer le texte d'intro, les champs ou
le style, voir la section `#refModalBack` de `index.html`, `.ref-form` dans
`css/styles.css`, et la fin de `js/app.js`.

## Écran d'entrée et photos

- `.cover` (`images/image.png`) : écran plein écran affiché à l'arrivée sur
  le site, avec liseré tricolore (vert/jaune/rouge), titre, tagline et
  flèche de défilement vers le reste du site.
- Section `#photos` : deux photos de terrain (`images/pirogues-1.jpg`,
  `images/pirogues-2.jpg`).

## Ressources pédagogiques

Les trois ressources (modèle de lettre d'accès à l'information, guide de
lecture d'un budget communal, guide de lecture d'un procès-verbal de
conseil) sont rédigées et consultables directement sur la page (cartes
dépliables dans la section « Ressources »).

## Couleurs

Couleur principale : blanc. Couleurs secondaires : vert, jaune et rouge du
drapeau sénégalais, définies comme variables CSS en haut de `css/styles.css`
(`--green`, `--yellow`, `--red`) — modifiables à un seul endroit.
