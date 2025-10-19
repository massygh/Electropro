/**
 * Extensions des types NextAuth
 *
 * Ce fichier étend les types de NextAuth pour inclure nos champs personnalisés.
 * Sinon TypeScript ne saurait pas que `accountType` existe.
 */

import { AccountType } from "@prisma/client"
import "next-auth"
import "next-auth/jwt"

// Étendre le module next-auth
declare module "next-auth" {
  /**
   * Interface User - L'utilisateur retourné par authorize()
   */
  interface User {
    id: string
    email: string
    name?: string | null
    image?: string | null
    accountType: AccountType
  }

  /**
   * Interface Session - La session accessible dans l'app
   */
  interface Session {
    user: {
      id: string
      email: string
      name?: string | null
      image?: string | null
      accountType: AccountType
    }
  }
}

// Étendre le module next-auth/jwt
declare module "next-auth/jwt" {
  /**
   * Interface JWT - Le token JWT
   */
  interface JWT {
    id: string
    accountType: AccountType
  }
}
