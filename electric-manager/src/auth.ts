/**
 * Configuration NextAuth (Auth.js v5)
 *
 * Ce fichier configure l'authentification pour toute l'application.
 * Il gère la connexion, l'inscription, et les sessions utilisateurs.
 */

import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { PrismaClient } from "@prisma/client"
import bcrypt from "bcryptjs"
import type { AccountType } from "@prisma/client"

const prisma = new PrismaClient()

/**
 * Configuration NextAuth
 */
export const { handlers, auth, signIn, signOut } = NextAuth({
  // Adapter pour connecter NextAuth à Prisma
  adapter: PrismaAdapter(prisma),

  // Pages personnalisées
  pages: {
    signIn: '/login',  // Redirection vers notre page login
  },

  // Session basée sur JWT (plus rapide que database sessions)
  session: {
    strategy: "jwt",
  },

  // Providers d'authentification
  providers: [
    // Provider Credentials pour email/password
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
        accountType: { label: "Account Type", type: "text" }
      },

      /**
       * Fonction authorize - Vérifie les credentials
       * Appelée quand un utilisateur essaie de se connecter
       */
      async authorize(credentials) {
        // Vérifier que les credentials existent
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email et mot de passe requis")
        }

        // Chercher l'utilisateur dans la base de données
        const user = await prisma.user.findUnique({
          where: {
            email: credentials.email as string,
          },
        })

        // Si l'utilisateur n'existe pas ou n'a pas de mot de passe
        if (!user || !user.password) {
          throw new Error("Email ou mot de passe incorrect")
        }

        // Vérifier le mot de passe avec bcrypt
        const isPasswordValid = await bcrypt.compare(
          credentials.password as string,
          user.password
        )

        if (!isPasswordValid) {
          throw new Error("Email ou mot de passe incorrect")
        }

        // Vérifier le type de compte si spécifié
        if (credentials.accountType) {
          const requestedType = credentials.accountType as string

          // Si on demande PRO mais que c'est un CLIENT, refuser
          if (requestedType === 'pro' && user.accountType === 'CLIENT') {
            throw new Error("Accès réservé aux professionnels")
          }

          // Si on demande CLIENT mais que c'est un PRO/ADMIN, refuser
          if (requestedType === 'client' && (user.accountType === 'PRO' || user.accountType === 'ADMIN')) {
            throw new Error("Utilisez la connexion professionnelle")
          }
        }

        // Retourner l'utilisateur (sans le mot de passe!)
        return {
          id: user.id.toString(),
          email: user.email,
          name: user.name || `${user.firstName || ''} ${user.lastName || ''}`.trim(),
          accountType: user.accountType,
          image: user.image,
        }
      },
    }),
  ],

  /**
   * Callbacks - Modifient les tokens et sessions
   */
  callbacks: {
    /**
     * Callback JWT - Ajoute des infos au token
     * Le token est stocké côté client (crypté)
     */
    async jwt({ token, user }) {
      // Si c'est une nouvelle connexion, ajouter les infos user au token
      if (user) {
        token.id = user.id
        token.accountType = (user as any).accountType
      }
      return token
    },

    /**
     * Callback Session - Ajoute des infos à la session
     * La session est accessible partout dans l'app
     */
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string
        session.user.accountType = token.accountType as AccountType
      }
      return session
    },

    /**
     * Callback Authorized - Vérifie si l'utilisateur peut accéder à une page
     * Utilisé par le middleware
     */
    async authorized({ auth, request }) {
      const { pathname } = request.nextUrl

      // Pages publiques - accessibles sans authentification
      const publicPages = ['/', '/login', '/signup', '/forgot-password']
      if (publicPages.includes(pathname)) {
        return true
      }

      // Pour les autres pages, vérifier l'authentification
      const isLoggedIn = !!auth?.user

      // Si pas connecté, rediriger vers login
      if (!isLoggedIn) {
        return Response.redirect(new URL(`/login?callbackUrl=${pathname}`, request.url))
      }

      const accountType = (auth.user as any).accountType

      // Page utilisateurs - réservée aux ADMIN uniquement
      if (pathname.startsWith('/utilisateurs') && accountType !== 'ADMIN') {
        return Response.redirect(new URL('/dashboard', request.url))
      }

      // Pages protégées pour les PRO/ADMIN
      const isAdminRoute = pathname.startsWith('/dashboard') ||
          pathname.startsWith('/interventions') ||
          pathname.startsWith('/chantiers') ||
          pathname.startsWith('/marchandise') ||
          pathname.startsWith('/agenda')

      if (isAdminRoute && accountType !== 'PRO' && accountType !== 'ADMIN') {
        return Response.redirect(new URL('/client-portal', request.url))
      }

      // Portail client - réservé aux clients
      if (pathname.startsWith('/client-portal') && accountType !== 'CLIENT') {
        return Response.redirect(new URL('/dashboard', request.url))
      }

      return true
    },
  },
})
