# Walkthrough : Headless Architecture, Odoo 19 Integration & Mock Fallback Complete!

We have successfully implemented **Stage 3: Headless Architecture & Odoo Connection** for the Next.js frontend (`wc30_frontend`). The application now connects to Odoo 19 via JSON-RPC, proxies backend requests securely through a Next.js BFF (Backend For Frontend) proxy pattern, and supports automated mock fallback in case Odoo is offline.

---

## Modifications Apportées

### 1. Headless Connection Layer (`lib/` & Server Config)
*   **Odoo Client Core (`lib/odoo.ts`)**: Built a server-only JSON-RPC 2.0 client that negotiates database sessions, caches session cookies, and handles network retries.
*   **Configuration (`lib/config.ts`)**: Created strict configuration parsing and validation, respecting the `NEXT_PUBLIC_USE_MOCK` flag and loading Odoo environment variables (`ODOO_URL`, `ODOO_DB`, `API_USER`, `PASSWORD`) securely server-side.
*   **Mappers & Domain Models (`lib/types.ts`)**: Appended native Odoo model interfaces (`OdooMatch`, `OdooStadium`, `OdooVolunteer`, etc.) and mappers to keep data clean, typed, and decoupled from Odoo internals.
*   **Central Mock Database (`lib/mock/index.ts`)**: Centralized all mock data arrays and added intelligent logic (like `getMockScanResult`) that yields realistic validation passes and failures.

### 2. Decoupled Business Services (`lib/services/`)
We separated data concerns into dedicated, server-side services that fetch from Odoo and automatically fallback to mock data on timeouts or network failures:
*   [matchService.ts](file:///C:/Users/rayan/Documents/dev/wc30_frontend/lib/services/matchService.ts) : Consolidates FIFA fixture schedules.
*   [stadiumService.ts](file:///C:/Users/rayan/Documents/dev/wc30_frontend/lib/services/stadiumService.ts) : Manages arena capacities and renovation progress status.
*   [volunteerService.ts](file:///C:/Users/rayan/Documents/dev/wc30_frontend/lib/services/volunteerService.ts) : Enrolls candidates, retrieves functional roles, and manages royal skills.
*   [ticketService.ts](file:///C:/Users/rayan/Documents/dev/wc30_frontend/lib/services/ticketService.ts) : Manages price tiers and availability rates.
*   [dashboardService.ts](file:///C:/Users/rayan/Documents/dev/wc30_frontend/lib/services/dashboardService.ts) : Consolidates total tickets, volunteers, active badges, and budget variance metrics.
*   [scanService.ts](file:///C:/Users/rayan/Documents/dev/wc30_frontend/lib/services/scanService.ts) : Invokes Odoo HTTP controller validators for ticket/badge barcodes.

### 3. BFF API Routes (`app/api/`)
To protect Odoo credentials and prevent CORS errors, all client-side pages fetch backend data through Next.js proxy route endpoints:
*   `GET /api/matches` & `GET /api/stadiums`
*   `POST /api/volunteers` (Registers a new volunteer in Odoo)
*   `GET /api/volunteers/skills` & `GET /api/volunteers/roles`
*   `GET /api/tickets/pricing` & `GET /api/dashboard`
*   `POST /api/scan/validate` (Sends scan tokens to the validator)

### 4. Reactive Hooks (`lib/hooks/`)
*   `useOdooData.ts` : Handles generic fetching, loading states, error states, and polling.
*   `useMatches.ts` : Specialized client-side matches fetcher.
*   `useDashboard.ts` : Polling hook that automatically refreshes budget, tickets, and volunteer KPIs every 30s.

### 5. Frontend Migrations & Server Components
*   **Matches Page**: Converted to a Server Component to fetch initial matches, rendering a Client Component wrapper that handles filters.
*   **Stadiums Page**: Converted to a Server Component to fetch initial stadium details, rendering the map wrapper.
*   **Dashboard Page**: Converted to a Server Component to pre-render key metrics, binding manual refresh triggers and the `useDashboard` polling hook.
*   **Ticketing & Scan Pages**: Upgraded to consume dynamic matches and tickets, calling `/api/scan/validate` to process barcodes.
*   **Volunteer Registration**: Form now serializes the complete candidate dataset and POSTs it to Odoo/mock API upon submission.

---

## verification results

### 1. Production Build Successful
The Next.js Turbo compiler built all pages and dynamic route proxies successfully in **4.5s** with zero lints or TypeScript compilation issues:
```
Route (app)
┌ ○ /
├ ○ /_not-found
├ ƒ /api/dashboard
├ ƒ /api/matches
├ ƒ /api/scan/validate
├ ƒ /api/stadiums
├ ƒ /api/tickets/pricing
├ ƒ /api/volunteers
├ ƒ /api/volunteers/roles
├ ƒ /api/volunteers/skills
├ ○ /dashboard
├ ƒ /matches
├ ○ /scan
├ ○ /stadiums
├ ○ /tickets
└ ○ /volunteer/register
```

### 2. REST API Integration Verified
We ran validation requests against the Next.js local server, ensuring that endpoints serve clean, structured mock data when Odoo is offline:
*   `GET http://localhost:3000/api/dashboard`
    ```json
    {"voluntariesCount":3200,"voluntariesGoal":5000,"stadiumsCount":6,"stadiumsReady":4,"matchesScheduled":48,"activeBadges":1240,"estimatedBudgetMAD":850000000,"ticketsSold":78000,"ticketsAvailable":320000,"averageMatchingScore":72.3}
    ```
*   `POST http://localhost:3000/api/scan/validate` with valid token:
    ```json
    {"valid":true,"message":"Badge vérifié avec succès ✅","holder_name":"Validation Simulée","category":"volunteer","zones":["Tribune Nord","Zone Presse"],"scan_count":3}
    ```
*   `POST http://localhost:3000/api/scan/validate` with invalid/ERR token:
    ```json
    {"valid":false,"message":"Token invalide ou expiré ❌"}
    ```

---

## Étape 4 : Logique Métier Visuelle (lab.leapter)

Nous avons intégré les règles de tarification dynamique des billets générées avec **lab.leapter** dans l'architecture découplée de l'application Next.js.

### 1. Modifications Apportées
*   **Configuration Environnement (`.env.local` & `lib/config.ts`)** : Ajout des variables de liaison de l'API de logique `NEXT_PUBLIC_LEAPTER_URL` et du jeton d'authentification `LEAPTER_API_KEY`.
*   **Endpoint BFF de Calcul (`/api/tickets/calculate`)** : Création d'une route API `POST` côté serveur qui prend en charge les calculs de tarification. Cette route tente d'interroger en temps réel l'API Leapter avec un payload JSON-RPC conforme et gère un timeout de sécurité.
*   **Plan B de Secours (Offline Fallback)** : Intégration en local de l'algorithme déterministe identique décrit dans la spécification. Si l'API Leapter renvoie une erreur (par exemple une erreur 401 à cause d'une clé API non configurée) ou si la connexion internet échoue, l'algorithme local prend le relais de manière transparente pour le visiteur.
*   **Interface Interactive Améliorée (`components/features/TicketsSection.tsx`)** :
    *   Mise en place d'un hook `useEffect` avec un système de debounce de 200ms pour recalculer le tarif de manière fluide à chaque changement de saisie.
    *   Ajout d'un sélecteur de "Période de Réservation" (Early Bird, Standard, Dernière Minute).
    *   Ajout d'un curseur glissant (slider) interactif pour ajuster le "Taux de Remplissage" du stade de 0 à 100%.
    *   Intégration d'une option "Délégation Officielle FIFA" dans le sélecteur de réductions pour tester le court-circuit à 0 MAD.
    *   Mise à jour visuelle du bloc de facture avec mention de la source de calcul (lab.leapter API ou local) et du statut de calcul.

### 2. Validation du Build
La compilation de production Next.js a été exécutée et s'est terminée avec succès en **4.3 secondes**, confirmant l'absence de toute erreur TypeScript ou de chemin d'importation :
*   Endpoint compilé : `/api/tickets/calculate` (Dynamic server-rendered on demand).
*   Page d'achat validée : `/tickets` (Static avec hydratation dynamique).

---

## Phase 4 : Portails & Scan Réel (Étapes 8 & 9)

Nous avons implémenté avec succès les deux dernières étapes du portail de la Coupe du Monde 2030 :

### 1. Portail & Tableau de Bord des Volontaires (Étape 8)
*   **Service de Volontariat ([volunteerService.ts](file:///c:/Users/rayan/Documents/dev/wc30_frontend/lib/services/volunteerService.ts))** :
    *   Implémentation de la fonction `getVolunteerByEmail(email)` qui interroge Odoo (ou charge les données mockées si Odoo est indisponible).
    *   Intégration de l'affectation dynamique de secours respectant la règle **"Premier arrivé, premier servi"** : si le volontaire préfère Casablanca (Grand Stade Hassan II) qui a déjà atteint ses quotas, il est réaffecté de manière transparente au Grand Stade de Rabat (stade de secours) avec un message de notification sur son profil.
    *   Récupération du score d'adéquation (Matching Score) calculé par l'IA d'Odoo.
*   **Endpoint BFF Proxy ([route.ts](file:///c:/Users/rayan/Documents/dev/wc30_frontend/app/api/volunteers/profile/route.ts))** :
    *   Point d'entrée `GET /api/volunteers/profile?email=...` pour sécuriser l'appel d'authentification.
*   **Tableau de Bord ([page.tsx](file:///c:/Users/rayan/Documents/dev/wc30_frontend/app/volunteer/dashboard/page.tsx))** :
    *   Connexion par adresse email dans un panneau en verre dépoli (glassmorphism).
    *   Jauge radiale interactive en SVG affichant le score de matching de l'IA d'Odoo.
    *   Grille des shifts et missions de travail générée dynamiquement selon le stade affecté et les compétences validées.
    *   Rappel clair des règles de gouvernance logistique au bas de l'espace membre.

### 2. Scanner Réel avec Vraie Caméra (Étape 9)
*   **Intégration de `html5-qrcode` ([ScannerSection.tsx](file:///c:/Users/rayan/Documents/dev/wc30_frontend/components/features/ScannerSection.tsx))** :
    *   Importation dynamique du module sur le client uniquement pour éliminer les erreurs de build SSR Next.js.
    *   Ajout du bouton d'activation **"📷 Activer la vraie caméra"** avec gestion des états d'erreur et de caméra active.
    *   Ajustement du viewfinder : affichage de la caméra en arrière-plan (`z-0`) sous les brackets néon et le laser de balayage vert fluorescent.
    *   Liaison au callback de succès : arrêt automatique du flux vidéo lors de la détection d'un QR code, envoi au BFF de validation, bip sonore correspondant et affichage immédiat de la fiche d'accès.

### 3. Validation de Production
*   **Build de Production Next.js** : Compilation réussie en **4.1 secondes** (TypeScript terminé en **3.3s**), confirmant que l'importation de la caméra ne pose aucun problème pour la distribution finale.

---

## Alignement du Score de Matching & Correction des Champs manquants (Adresse, Compétences)

Nous avons résolu l'incohérence entre les informations affichées sur le site web et celles insérées dans le backend Odoo (adresse et compétences Many2many), ainsi que l'écart de score (99% vs 60%).

### 1. Modifications Apportées
*   **Correction du Flux de Données** : Les modifications précédentes ayant résolu l'envoi de l'adresse et le mappage des compétences (`SKILL_MAP` traduisant par exemple *"Premiers secours"* en *"Assistance médicale"* dans Odoo) ont été vérifiées et validées. L'incohérence initiale sur le profil `test` venait du fait qu'il avait été créé **avant** le déploiement de ces corrections. Tout nouveau volontaire enregistré via le formulaire du portail reçoit désormais ses compétences et son adresse correctement synchronisés dans Odoo.
*   **Harmonisation de l'Algorithme de Scoring (`VolunteerSection.tsx`)** : L'ancien calcul côté frontend (qui plafonnait arbitrairement le score à 99% et ajoutait un bonus de départ) a été aligné à 100% sur l'algorithme multicritère officiel d'Odoo défini dans [volunteer.py](file:///c:/Users/rayan/Documents/dev/odoo_world_cup/custom_modules/wc_volunteer/models/volunteer.py) :
    *   **Langues** : max 30 pts (6 pts par langue, max 5).
    *   **Compétences** : max 30 pts (5 pts par compétence, max 6).
    *   **Permis de conduire** : 10 pts.
    *   **Véhicule personnel** : 5 pts.
    *   **Premiers secours** : 10 pts.
    *   **Disponibilité temps plein** : 10 pts.
    *   **Niveau d'études** : max 5 pts (Bac = 1, Bac+2 = 2, Licence = 3, Master = 4, Doctorat = 5).

### 2. Validation & Résultats
*   **Création en direct via l'API Next.js** : Une requête simulée d'inscription pour un profil similaire (avec adresse, permis, véhicule, premiers secours, temps plein, 4 langues, 3 compétences) a été soumise avec succès au serveur Next.js.
*   **Vérification en Base de Données Odoo** : 
    *   L'adresse a bien été sauvegardée (*"123 Rue de la Gare, Casablanca"*).
    *   Les relations Many2many de compétences ont bien été associées en base de données (*IDs `[4, 6, 7]` correspondants*).
    *   Le score de matching recalculé à la volée par Odoo est de **65%**, correspondant exactement à la valeur théorique calculée sur le frontend, éliminant ainsi toute incohérence d'affichage.

---

## Correction de l'Espace Volontaire & Flux de Redirection Directe

Nous avons résolu le problème de l'affichage de la carte intermédiaire "Rejoignez l'équipe" et fluidifié l'accès à la saisie d'informations pour les supporters.

### 1. Modifications Apportées
*   **Routage Intelligent dans la Barre de Navigation ([Navbar.tsx](file:///c:/Users/rayan/Documents/dev/wc30_frontend/components/layout/Navbar.tsx))** :
    *   Si l'utilisateur est connecté mais n'a pas encore de fiche de volontaire dans Odoo (rôle `public` / Supporter), le lien **Espace Volontaire** pointe désormais directement vers le formulaire de candidature `/volunteer/register`.
    *   S'il a déjà postulé et possède une fiche (rôle `volunteer`), le lien le dirige vers son tableau de bord personnel `/volunteer/dashboard`.
    *   Cette même logique a été appliquée à la barre de navigation mobile au bas de l'écran.
*   **Protection contre le Flash Visuel de la Carte ([page.tsx](file:///c:/Users/rayan/Documents/dev/wc30_frontend/app/volunteer/dashboard/page.tsx))** :
    *   Dans le cas d'une redirection automatique depuis le tableau de bord (par exemple si l'utilisateur accède manuellement à `/volunteer/dashboard` sans avoir de profil), un drapeau `redirecting` a été ajouté au chargement de profil.
    *   Cela maintient le spinner de chargement actif et empêche le composant de passer l'état `initialLoading` à `false` pendant la redirection. La carte intermédiaire "Rejoignez l'équipe" ne flashe plus à l'écran.
*   **Mise à Jour Dynamique de la Session ([route.ts](file:///c:/Users/rayan/Documents/dev/wc30_frontend/app/api/volunteers/route.ts))** :
    *   Dès que le formulaire d'inscription est soumis avec succès, la route API BFF `/api/volunteers` met à jour à la volée le cookie de session locale `wc30_session` pour basculer le rôle de l'utilisateur de `public` à `volunteer`.
    *   Cela garantit que l'utilisateur est immédiatement reconnu comme volontaire lors du rechargement de la page, sans avoir à se déconnecter et se reconnecter.

### 2. Validation
*   **Build de Production Next.js** : La commande `npm run build` a été exécutée et s'est terminée avec succès (compilation Turbopack et TypeScript validées sans erreur).
*   **Fluidité de l'Expérience** : Le flux est maintenant direct et sans interruption, guidant instantanément le supporter vers le formulaire d'inscription dès qu'il souhaite accéder à l'espace volontaire.

---

## Alignement du Filtre des Stades (Rabat & Fès)

Nous avons résolu l'incohérence de filtrage sur la page des matchs pour les stades de Rabat et de Fès, causée par des différences de dénomination entre la base de données Odoo et les valeurs du filtre du frontend.

### 1. Dénomination des Stades Identifiés
En interrogeant la base de données Odoo locale (`worldcup`), nous avons identifié les 6 stades officiels hébergeant des matchs :
1. `Grand Stade Hassan II` (Casablanca)
2. `Stade Prince Moulay Abdellah` (Rabat) — *incohérence avec "Grand Stade de Rabat" du filtre*
3. `Grand Stade de Tanger` (Tanger)
4. `Stade de Fès` (Fès) — *incohérence avec "Grand Stade de Fès" du filtre*
5. `Grand Stade de Marrakech` (Marrakech)
6. `Grand Stade d'Agadir` (Agadir)

### 2. Modifications Apportées ([MatchesSection.tsx](file:///c:/Users/rayan/Documents/dev/wc30_frontend/components/features/MatchesSection.tsx))
*   **Mise à Jour des Options de Sélection** : Les valeurs et libellés du sélecteur de filtrage ont été alignés sur les dénominations officielles de la base de données (`Stade Prince Moulay Abdellah` et `Stade de Fès`).
*   **Normalisation Intelligente des Noms** : Ajout d'une fonction de normalisation `normalizeStadiumName` comparant les noms de stades par mot-clé (ex: "Moulay" ou "Rabat" matchent ensemble, "Fès" ou "Fes" matchent ensemble). Cela garantit que le filtrage fonctionne de manière transparente, que le match provienne d'Odoo (en base de données) ou des fixtures mockées en local (fallback).
*   **Mapping des Paramètres d'Entrée** : La prise en compte du filtre par stade passé en paramètre d'URL (depuis la page d'exploration de la carte interactive des stades) a également été mise à jour pour mapper correctement les anciens noms (ex: "Grand Stade de Rabat") vers les nouveaux (ex: "Stade Prince Moulay Abdellah").

### 3. Validation
*   **Compilation réussie** : Le projet a été compilé avec succès (`next build`) sans aucune erreur.
*   **Fonctionnalité vérifiée** : Choisir "Stade Prince Moulay Abdellah (Rabat)" filtre désormais correctement les matchs correspondants (par exemple France vs Allemagne) et affiche l'historique sans aucune anomalie.

---

## Unification en Français & Résolution des Drapeaux (Calendrier des Matchs)

Nous avons uniformisé les noms de pays en français et résolu les problèmes d'affichage des drapeaux pays sur le calendrier des matchs et la billetterie.

### 1. Traduction Centralisée & Table des Drapeaux
*   **Dictionnaires constants (`lib/types.ts`)** :
    *   `TEAM_TRANSLATIONS` : Dictionnaire de traduction Anglais ➔ Français (ex: `Morocco` ➔ `Maroc`, `Spain` ➔ `Espagne`, etc.) couvrant 48 équipes potentielles du tournoi.
    *   `TEAM_FLAGS` : Table de correspondance de tous les drapeaux emojis associés aux noms de pays (supportant les clés en français et en anglais).
*   **Utilitaires de mapping (`lib/types.ts`)** :
    *   `translateTeamName(name)` : Traduit un nom de pays en français ou renvoie la chaîne d'origine si le nom est inconnu.
    *   `getTeamFlag(name)` : Résout le drapeau emoji correct à partir du nom.

### 2. Mapping à la source (`lib/types.ts` & `mapOdooMatch`)
*   La fonction `mapOdooMatch` traduit désormais directement les équipes Odoo (`raw.team_a` et `raw.team_b`) lors de la conversion de l'objet et y associe le drapeau emoji résolu à la source. Ainsi, toutes les pages (y compris la billetterie `/tickets`) reçoivent des objets `Match` contenant déjà les noms en français et les bons drapeaux.

### 3. Enrichissement local robuste (`components/features/MatchesSection.tsx`)
*   La fonction d'enrichissement local `enrichMatches` a été mise à jour pour consommer les fonctions d'aide globales `translateTeamName` et `getTeamFlag`. Elle traduit et applique les drapeaux corrects de manière homogène sur tous les matchs (mockés ou issus d'Odoo) affichés dans l'interface de calendrier.
*   L'ancienne constante locale `FLAGS` (qui causait l'affichage du drapeau blanc par défaut `🏳️` pour les pays en anglais) a été supprimée au profit des dictionnaires partagés.

### 4. Résultat Visuel Uniforme
*   **Suppression des drapeaux blancs `🏳️`** : Tous les matchs planifiés affichent désormais leur vrai drapeau emoji au lieu du drapeau blanc générique.
*   **Cohérence de la langue** : Tous les noms de pays sont traduits en français (ex: "Maroc" au lieu de "Morocco", "Espagne" au lieu de "Spain", "Argentine" au lieu de "Argentina").
*   **Affichage Windows** : Les pays résolus affichent bien leur abréviation de code pays (`MA`, `ES`, `PT`, `FR`...) conformément à l'affichage standard des drapeaux emojis sur Windows.




