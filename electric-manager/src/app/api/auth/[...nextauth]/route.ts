/**
 * Route API NextAuth
 *
 * Ce fichier crée les endpoints d'authentification:
 * - GET/POST /api/auth/signin - Page de connexion
 * - GET/POST /api/auth/signout - Déconnexion
 * - GET /api/auth/session - Récupérer la session
 * - GET /api/auth/csrf - Token CSRF
 * - etc.
 *
 * Le [...nextauth] signifie que cette route capture tous les chemins
 * sous /api/auth/* (c'est un "catch-all route")
 */

import { handlers } from "@/auth"

// Export des handlers GET et POST
// NextAuth gère automatiquement toutes les routes nécessaires
export const { GET, POST } = handlers
