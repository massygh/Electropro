import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

/**
 * Génère un numéro d'intervention unique au format INT-YYYY-XXX
 * où YYYY est l'année en cours et XXX est un numéro séquentiel sur 3 chiffres
 *
 * Exemples: INT-2025-001, INT-2025-002, INT-2025-150
 */
export async function generateInterventionNumber(): Promise<string> {
  const currentYear = new Date().getFullYear()
  const prefix = `INT-${currentYear}-`

  // Trouver la dernière intervention de l'année en cours
  const lastIntervention = await prisma.job.findFirst({
    where: {
      interventionNumber: {
        startsWith: prefix
      }
    },
    orderBy: {
      interventionNumber: 'desc'
    }
  })

  let nextNumber = 1

  if (lastIntervention?.interventionNumber) {
    // Extraire le numéro de la dernière intervention (ex: INT-2025-042 -> 42)
    const lastNumberStr = lastIntervention.interventionNumber.split('-')[2]
    const lastNumber = parseInt(lastNumberStr, 10)
    nextNumber = lastNumber + 1
  }

  // Formater le numéro avec 3 chiffres (001, 002, ..., 999)
  const formattedNumber = nextNumber.toString().padStart(3, '0')

  return `${prefix}${formattedNumber}`
}
