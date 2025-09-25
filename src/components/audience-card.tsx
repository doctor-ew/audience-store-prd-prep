import { Globe } from 'lucide-react';

interface AudienceCardProps {
  audience: {
    id: string;
    name: string;
    price: number;
    owner: {
      name: string | null;
    } | null;
  };
}

export function AudienceCard({ audience }: AudienceCardProps) {
  return (
    <div className="relative flex h-full flex-col overflow-hidden rounded-lg border border-gray-700 bg-gray-800 shadow-lg transition-transform duration-300 hover:scale-105">
      <div className="flex flex-col p-6">
        <div className="mb-4 flex items-center space-x-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-700">
            <Globe className="h-5 w-5 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-white">{audience.name}</h3>
        </div>
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-400">
            Owner: {audience.owner?.name ?? 'N/A'}
          </p>
          <p className="rounded-full bg-green-900/50 px-3 py-1 text-sm font-medium text-green-400">
            ${audience.price}
          </p>
        </div>
      </div>
    </div>
  );
}
