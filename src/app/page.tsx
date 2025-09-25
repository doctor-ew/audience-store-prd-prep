import { AudienceCard } from '@/components/audience-card'
import { Header } from '@/components/header'
import { getAudiencesForSale } from '@/lib/data'

export default async function Home() {
  const audiences = await getAudiencesForSale()

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-8">
          Marketplace
        </h2>

        {audiences.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">
              No audiences available for sale at the moment.
            </p>
            <p className="text-gray-500 mt-2">
              Check back later for new listings.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {audiences.map((audience) => (
              <AudienceCard key={audience.id} audience={audience} />
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
