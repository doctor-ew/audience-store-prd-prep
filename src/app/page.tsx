import { Header } from '@/components/header';
import { AudienceCard } from '@/components/audience-card';
import { getAudiencesForSale } from '@/lib/data';
import { AlertTriangle } from 'lucide-react';

export default async function Home() {
  const audiences = await getAudiencesForSale();

  return (
    <div className="flex min-h-screen w-full flex-col bg-gray-950 text-white">
      <Header />
      <main className="flex-1">
        <div className="container mx-auto max-w-4xl px-4 py-8">
          <h1 className="mb-6 text-2xl font-bold tracking-tight text-gray-200">
            Available Audiences
          </h1>
          {audiences.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {audiences.map((audience) => (
                <AudienceCard key={audience.id} audience={audience} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-700 bg-gray-900 p-12 text-center">
              <AlertTriangle className="mx-auto h-12 w-12 text-gray-500" />
              <h3 className="mt-4 text-lg font-semibold text-gray-200">
                No Audiences for Sale
              </h3>
              <p className="mt-2 text-sm text-gray-400">
                Check back later to see new audiences available for purchase.
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}