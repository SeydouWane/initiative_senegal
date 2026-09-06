# Communes Transparentes

Site vitrine de l'Initiative citoyenne pour la transparence des communes (Sénégal).

## Structure

```
initiative_senegal/
├── index.html               page unique du site
├── css/styles.css            styles (couleurs, typographie, mise en page)
├── js/data.js                 données des 45 communes + fiches (maire...) + tracé de la carte
├── js/app.js                   logique de la carte, des filtres et des fiches commune
├── images/logo.png            votre logo
├── scripts/project-map.js      script utilisé pour générer les coordonnées de js/data.js
└── README.md
```

## Ouvrir le site

Ouvrez simplement `index.html` dans un navigateur (double-clic), ou lancez un
petit serveur local depuis ce dossier, par exemple :

```
python -m http.server 8000
```

puis ouvrez `http://localhost:8000`.

## La carte

Le tracé du Sénégal (`SENEGAL_OUTLINE`) et la position de chaque commune dans
`js/data.js` sont calculés par projection équirectangulaire de vraies
coordonnées géographiques (frontière officielle Natural Earth pour le pays,
coordonnées Wikipédia/officielles pour les 45 communes) — ce n'est plus un
dessin approximatif. Chaque point (pin) est cliquable et ouvre la fiche de la
commune, sur la carte comme dans la liste.

Si vous devez recalculer les coordonnées (nouvelle commune, correction d'une
position), modifiez la liste `towns` dans `scripts/project-map.js` puis :

```
node scripts/project-map.js
```

Le script affiche le nouveau `SENEGAL_OUTLINE` et le nouveau tableau
`COMMUNES` à recopier dans `js/data.js`.

## Mettre à jour les communes

Toutes les données affichées sur la carte (nom, région, statut, position)
sont dans `js/data.js`. Les statuts possibles sont :

- `doc` — à documenter (statut par défaut de toutes les communes actuellement :
  aucune démarche réelle n'a encore été engagée)
- `env` — demande envoyée
- `obt` — réponse obtenue
- `ref` — refus opposé

Mettez à jour le statut d'une commune dans `COMMUNES` au fil des démarches
réelles suivies par vos référents.

## Fiches détaillées par commune

Les fiches (ouvertes en cliquant sur une commune) affichent :

- **Maire** — renseigné dans `js/data.js` (objet `COMMUNE_DETAILS`) pour 28
  des 45 communes, à partir de recherches documentaires sur les élections
  locales de janvier 2022 (et leurs remplacements connus depuis : Dakar,
  Ziguinchor). **Ces informations doivent être vérifiées avant toute
  publication officielle** — un mandat peut avoir changé de titulaire
  (décès, destitution, démission) sans que cela ait été retrouvé lors de la
  recherche. Les 17 communes restantes n'ont pas de maire renseigné
  (aucune source fiable trouvée) : complétez `COMMUNE_DETAILS` au fur et à
  mesure de vos vérifications.
- **Référent local** et **Documents obtenus** — volontairement laissés à
  « Poste à pourvoir » / « Aucun document répertorié » : le réseau de
  référents n'est pas encore constitué et aucune démarche réelle n'a encore
  abouti. Une fois que ces données existeront, il faudra les ajouter à
  `COMMUNE_DETAILS` (dans `js/data.js`) et adapter `openModal()` dans
  `js/app.js` pour les afficher, plutôt que d'inventer des informations sur
  de vraies communes.

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

## Ressources pédagogiques

Les trois ressources (modèle de lettre d'accès à l'information, guide de
lecture d'un budget communal, guide de lecture d'un procès-verbal de
conseil) sont rédigées et consultables directement sur la page (cartes
dépliables dans la section « Ressources »).

## Couleurs

Couleur principale : blanc. Couleurs secondaires : vert, jaune et rouge du
drapeau sénégalais, définies comme variables CSS en haut de `css/styles.css`
(`--green`, `--yellow`, `--red`) — modifiables à un seul endroit.
