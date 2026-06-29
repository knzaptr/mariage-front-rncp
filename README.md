# Mariage Front — Site de mariage bilingue

Application web de mariage développée avec **Next.js**, pensée pour présenter les informations de l'événement, gérer les RSVP des invités et administrer le contenu du site en français et en anglais.

Projet réalisé dans le cadre du titre RNCP à [Le Reacteur](https://www.lereacteur.io/).

---

## Fonctionnalités

### Côté invités

- **Accueil** — Présentation du couple, compte à rebours, date, lieu et appel à répondre au RSVP
- **Programme** — Déroulé de la journée avec horaires et activités traduits (FR/EN)
- **RSVP** — Recherche par nom, réponse à l'invitation, choix du repas, allergies et gestion des plus-ones
- **Contact** — Personnes à contacter le jour J (témoins, famille…)
- **FAQ** — Questions fréquentes par langue
- **Internationalisation** — Bascule FR / EN via un sélecteur dans l'en-tête

### Côté administrateur

- Connexion sécurisée (mot de passe hashé avec bcrypt, token Bearer)
- Tableau de bord pour modifier les informations du mariage, le programme, la FAQ et les contacts
- Gestion des invités : ajout, modification, suppression, suivi des réponses RSVP
- Upload d'images via **Cloudinary**

---

## Stack technique

| Couche | Technologie |
|--------|-------------|
| Framework | Next.js 16 (App Router) |
| UI | React 19, Tailwind CSS 4 |
| Base de données | PostgreSQL |
| ORM | Prisma 7 |
| Validation | Zod |
| Images | Cloudinary |
| Tests | Jest, Testing Library |
| Langage | TypeScript |

---

## Prérequis

- **Node.js** 20+
- **npm** (ou yarn / pnpm)
- Une base de données **PostgreSQL** accessible
- Un compte **Cloudinary** (pour l'upload d'images côté admin)

---

## Installation

```bash
# Cloner le dépôt
git clone <url-du-repo>
cd mariage-front-rncp

# Installer les dépendances
npm install

# Configurer les variables d'environnement (voir ci-dessous)
cp .env.example .env   # si un fichier exemple est disponible

# Appliquer les migrations Prisma
npx prisma migrate deploy

# Générer le client Prisma
npx prisma generate

# (Optionnel) Peupler la base avec des données de démo
npm run db:seed
```

---

## Variables d'environnement

Créer un fichier `.env` à la racine du projet :

```env
# Base de données PostgreSQL
DATABASE_URL="postgresql://user:password@localhost:5432/mariage"

# Cloudinary
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME="votre_cloud_name"
CLOUDINARY_API_KEY="votre_api_key"
CLOUDINARY_API_SECRET="votre_api_secret"
```

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | URL de connexion PostgreSQL |
| `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` | Nom du cloud Cloudinary (exposé côté client) |
| `CLOUDINARY_API_KEY` | Clé API Cloudinary |
| `CLOUDINARY_API_SECRET` | Secret API Cloudinary |

---

## Scripts disponibles

| Commande | Description |
|----------|-------------|
| `npm run dev` | Lance le serveur de développement sur [http://localhost:3000](http://localhost:3000) |
| `npm run build` | Compile l'application pour la production |
| `npm run start` | Démarre le serveur de production |
| `npm run lint` | Analyse le code avec ESLint |
| `npm test` | Lance la suite de tests Jest |
| `npm run test:watch` | Lance Jest en mode watch |
| `npm run db:seed` | Peuple la base de données (script local dans `/scripts`) |

---

## Structure du projet

```
mariage-front-rncp/
├── src/
│   ├── app/                    # Pages et routes API (App Router)
│   │   ├── api/                # Endpoints REST
│   │   ├── admin/              # Pages d'administration
│   │   ├── contact/            # Page contact
│   │   ├── faq/                # Page FAQ
│   │   ├── programme/          # Page programme
│   │   ├── rsvp/               # Page RSVP
│   │   └── login/              # Connexion admin
│   ├── components/             # Composants réutilisables
│   ├── context/                # Contexte React (i18n)
│   ├── lib/                    # Client Prisma, Cloudinary, helpers API
│   ├── locales/                # Traductions statiques (fr.json, en.json)
│   ├── middlewares/            # Middleware d'authentification admin
│   ├── prisma/                 # Schéma et migrations
│   ├── queries/                # Requêtes serveur (SSR)
│   ├── schemas/                # Schémas Zod
│   ├── types/                  # Types TypeScript
│   └── utils/                  # Utilitaires
├── public/                     # Assets statiques (images, logo…)
├── test/                       # Tests unitaires et d'intégration
├── prisma.config.ts            # Configuration Prisma
└── jest.config.ts              # Configuration Jest
```

---

## Modèle de données

Le schéma Prisma couvre les entités suivantes :

- **Admin** — Comptes administrateurs
- **WeddingInfo** / **WeddingInfoTranslation** — Informations générales du mariage (bilingue)
- **Activity** / **ActivityTranslation** — Programme de la journée
- **GuestGroup** / **Guest** — Groupes et invités avec statut RSVP
- **Contact** / **ContactTranslation** — Contacts importants
- **Faq** — Questions fréquentes par langue

Voir le schéma complet dans [`src/prisma/schema.prisma`](src/prisma/schema.prisma).

---

## API

Les routes API sont protégées par un token Bearer pour les opérations d'écriture côté admin.

| Route | Méthodes | Description |
|-------|----------|-------------|
| `/api/admin/login` | POST | Connexion administrateur |
| `/api/admin/register` | POST | Création d'un compte admin |
| `/api/weddinginfos` | GET, PUT | Informations du mariage |
| `/api/programme` | GET, POST, PUT, DELETE | Activités du programme |
| `/api/faq` | GET, POST, PUT, DELETE | Questions fréquentes |
| `/api/contact` | GET, POST, PUT, DELETE | Contacts |
| `/api/guests` | GET, POST, PUT | Liste et mise à jour des invités |
| `/api/guests/create` | POST | Création d'invités (admin) |
| `/api/guests/guest` | POST | Soumission RSVP |
| `/api/guests/guest/search` | POST | Recherche d'un invité par nom |
| `/api/guests/guest/[id]` | DELETE | Suppression d'un invité |

Les en-têtes CORS sont configurés pour autoriser les requêtes cross-origin sur `/api/*`.

---

## Authentification admin

1. Se rendre sur `/login`
2. S'authentifier avec email et mot de passe
3. Un token est stocké dans un cookie `adminToken`
4. Les routes API protégées attendent un header `Authorization: Bearer <token>`

---

## Tests

```bash
npm test
```

Les tests couvrent les routes API, les requêtes serveur et les composants. La configuration se trouve dans `jest.config.ts` et `jest.setup.ts`.

---

## Déploiement

L'application peut être déployée sur **Vercel** ou tout hébergeur compatible Next.js.

Avant le déploiement :

1. Configurer les variables d'environnement sur la plateforme
2. Exécuter `npx prisma migrate deploy` sur la base de production
3. Lancer `npm run build` pour vérifier que la compilation passe

---

## Licence

Projet privé — usage personnel / pédagogique.
