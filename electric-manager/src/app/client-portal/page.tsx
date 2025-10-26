import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { PrismaClient } from "@prisma/client"
import Link from "next/link"

const prisma = new PrismaClient()

// Force dynamic rendering
export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function ClientPortalPage() {
  const session = await auth()

  if (!session?.user) {
    redirect("/login")
  }

  // Récupérer le client associé à l'utilisateur
  const client = await prisma.client.findUnique({
    where: { userId: parseInt(session.user.id) },
    include: {
      jobs: {
        orderBy: { createdAt: 'desc' },
        include: {
          assignedTo: {
            select: {
              name: true,
              firstName: true,
              lastName: true
            }
          }
        }
      },
      quotes: {
        orderBy: { createdAt: 'desc' }
      },
      invoices: {
        orderBy: { createdAt: 'desc' }
      }
    }
  })

  if (!client) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-4">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 max-w-md">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Profil client non trouvé</h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Votre compte utilisateur n'est pas encore associé à un profil client. Veuillez contacter l'administrateur.
          </p>
          <Link href="/login" className="inline-block px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition">
            Retour à la connexion
          </Link>
        </div>
      </div>
    )
  }

  // Statistiques rapides
  const stats = {
    totalJobs: client.jobs.length,
    pendingJobs: client.jobs.filter(j => j.status === 'scheduled' || j.status === 'in_progress').length,
    totalQuotes: client.quotes.length,
    pendingQuotes: client.quotes.filter(q => q.status === 'sent' || q.status === 'draft').length,
    totalInvoices: client.invoices.length,
    unpaidInvoices: client.invoices.filter(i => i.status === 'sent' || i.status === 'draft').length
  }

  // Fonction pour obtenir le badge de statut
  const getStatusBadge = (status: string, type: 'job' | 'quote' | 'invoice') => {
    const styles: Record<string, string> = {
      // Job statuses
      scheduled: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300',
      in_progress: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300',
      completed: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300',
      cancelled: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300',
      // Quote statuses
      draft: 'bg-gray-100 dark:bg-gray-900/30 text-gray-700 dark:text-gray-300',
      sent: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300',
      approved: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300',
      rejected: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300',
      // Invoice statuses
      paid: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300'
    }

    const labels: Record<string, string> = {
      scheduled: 'Planifiée',
      in_progress: 'En cours',
      completed: 'Terminée',
      cancelled: 'Annulée',
      draft: 'Brouillon',
      sent: 'Envoyé',
      approved: 'Approuvé',
      rejected: 'Refusé',
      paid: 'Payée'
    }

    return (
      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${styles[status] || styles.draft}`}>
        {labels[status] || status}
      </span>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        {/* Header */}
        <div className="py-6 sm:py-8">
          <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
            Bienvenue {client.name}
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Gérez vos interventions, devis et factures en un seul endroit
          </p>
        </div>

        {/* Statistiques rapides */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-4">
            <div className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">{stats.totalJobs}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Interventions</div>
            {stats.pendingJobs > 0 && (
              <div className="text-xs text-orange-600 dark:text-orange-400 mt-1">{stats.pendingJobs} en cours</div>
            )}
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-4">
            <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">{stats.totalQuotes}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Devis</div>
            {stats.pendingQuotes > 0 && (
              <div className="text-xs text-orange-600 dark:text-orange-400 mt-1">{stats.pendingQuotes} en attente</div>
            )}
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-4">
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">{stats.totalInvoices}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Factures</div>
            {stats.unpaidInvoices > 0 && (
              <div className="text-xs text-red-600 dark:text-red-400 mt-1">{stats.unpaidInvoices} impayées</div>
            )}
          </div>
          <div className="bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl shadow-lg p-4 text-white cursor-pointer hover:shadow-xl transition">
            <div className="text-sm font-semibold mb-1">Nouvelle demande</div>
            <div className="text-xs opacity-90">Contactez-nous</div>
            <div className="text-xl font-bold mt-2">📞</div>
          </div>
        </div>

        {/* Mes Interventions */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <svg className="w-7 h-7 text-indigo-600 dark:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              Mes Interventions
            </h2>
          </div>

          {client.jobs.length === 0 ? (
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-12 text-center">
              <svg className="w-16 h-16 text-gray-400 dark:text-gray-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              <p className="text-gray-600 dark:text-gray-400 text-lg">Aucune intervention pour le moment</p>
              <p className="text-gray-500 dark:text-gray-500 text-sm mt-2">Contactez-nous pour planifier une intervention</p>
            </div>
          ) : (
            <div className="grid gap-4">
              {client.jobs.map((job) => (
                <div key={job.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-5 hover:shadow-xl transition">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        {job.interventionNumber && (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-500 dark:to-purple-500 text-white text-xs font-bold shadow-sm">
                            {job.interventionNumber}
                          </span>
                        )}
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white">{job.title}</h3>
                      </div>
                      {job.description && (
                        <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">{job.description}</p>
                      )}
                    </div>
                    <div className="flex-shrink-0">
                      {getStatusBadge(job.status, 'job')}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
                    {job.scheduledAt && (
                      <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                        <svg className="w-4 h-4 text-indigo-600 dark:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span>{new Date(job.scheduledAt).toLocaleString('fr-FR', { dateStyle: 'short', timeStyle: 'short' })}</span>
                      </div>
                    )}
                    {job.address && (
                      <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                        <svg className="w-4 h-4 text-indigo-600 dark:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <span className="truncate">{job.address}</span>
                      </div>
                    )}
                    {job.assignedTo && (
                      <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                        <svg className="w-4 h-4 text-indigo-600 dark:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        <span>{job.assignedTo.name || `${job.assignedTo.firstName} ${job.assignedTo.lastName}`}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Grid pour Devis et Factures */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Mes Devis */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <svg className="w-7 h-7 text-orange-600 dark:text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Mes Devis
              </h2>
            </div>

            {client.quotes.length === 0 ? (
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-8 text-center">
                <svg className="w-12 h-12 text-gray-400 dark:text-gray-600 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <p className="text-gray-600 dark:text-gray-400">Aucun devis</p>
              </div>
            ) : (
              <div className="space-y-3">
                {client.quotes.map((quote) => (
                  <div key={quote.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-4 hover:shadow-xl transition">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <div className="font-semibold text-gray-900 dark:text-white">Devis #{quote.id}</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          {new Date(quote.createdAt).toLocaleDateString('fr-FR')}
                        </div>
                      </div>
                      {getStatusBadge(quote.status, 'quote')}
                    </div>
                    <div className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
                      {quote.total.toFixed(2)} €
                    </div>
                    {quote.pdfUrl && (
                      <a href={quote.pdfUrl} target="_blank" rel="noopener noreferrer" className="mt-3 inline-flex items-center gap-2 text-sm text-indigo-600 dark:text-indigo-400 hover:underline">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        Télécharger PDF
                      </a>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Mes Factures */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <svg className="w-7 h-7 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Mes Factures
              </h2>
            </div>

            {client.invoices.length === 0 ? (
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-8 text-center">
                <svg className="w-12 h-12 text-gray-400 dark:text-gray-600 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <p className="text-gray-600 dark:text-gray-400">Aucune facture</p>
              </div>
            ) : (
              <div className="space-y-3">
                {client.invoices.map((invoice) => (
                  <div key={invoice.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-4 hover:shadow-xl transition">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <div className="font-semibold text-gray-900 dark:text-white">{invoice.invoiceNumber}</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          {new Date(invoice.createdAt).toLocaleDateString('fr-FR')}
                        </div>
                      </div>
                      {getStatusBadge(invoice.status, 'invoice')}
                    </div>
                    <div className="text-2xl font-bold text-green-600 dark:text-green-400 mb-2">
                      {invoice.total.toFixed(2)} € TTC
                    </div>
                    {invoice.dueDate && !invoice.paidAt && (
                      <div className="text-xs text-gray-600 dark:text-gray-400 mb-2">
                        Échéance: {new Date(invoice.dueDate).toLocaleDateString('fr-FR')}
                      </div>
                    )}
                    {invoice.paidAt && (
                      <div className="text-xs text-green-600 dark:text-green-400 mb-2">
                        Payée le {new Date(invoice.paidAt).toLocaleDateString('fr-FR')}
                      </div>
                    )}
                    {invoice.pdfUrl && (
                      <a href={invoice.pdfUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-sm text-green-600 dark:text-green-400 hover:underline">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        Télécharger PDF
                      </a>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Contact rapide */}
        <div className="mt-8 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-2xl shadow-xl p-6 sm:p-8 text-white">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="flex-shrink-0">
              <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 24 24">
                <path d="M13 9h-2V7h2m0 10h-2v-6h2m-1-9A10 10 0 002 12a10 10 0 0010 10 10 10 0 0010-10A10 10 0 0012 2z" />
              </svg>
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-bold mb-2">
                Besoin d'une intervention ou d'un devis ?
              </h3>
              <p className="text-white/90 text-sm sm:text-base">
                Notre équipe est à votre disposition du lundi au vendredi de 8h à 18h
              </p>
            </div>
            <div className="flex flex-col gap-2 w-full sm:w-auto">
              <a href="tel:0123456789" className="px-6 py-3 bg-white text-indigo-600 rounded-lg font-semibold hover:bg-gray-100 transition text-center">
                📞 01 23 45 67 89
              </a>
              <a href="mailto:contact@electropro.com" className="px-6 py-3 bg-white/10 backdrop-blur-sm text-white rounded-lg font-semibold hover:bg-white/20 transition text-center">
                ✉️ contact@electropro.com
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
