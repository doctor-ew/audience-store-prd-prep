import { AudienceWithOwner } from '@/lib/data'
import Link from 'next/link'

interface AudienceCardProps {
  audience: AudienceWithOwner
}

export function AudienceCard({ audience }: AudienceCardProps) {
  return (
    <Link
      href={`/audience/${audience.id}`}
      className="block p-6 bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow"
    >
      <h3 className="mb-2 text-xl font-semibold text-gray-900">
        {audience.name}
      </h3>
      <p className="mb-4 text-gray-600 line-clamp-2">
        {audience.description}
      </p>
      <div className="flex justify-between items-center">
        <div className="text-sm text-gray-500">
          Owner: {audience.owner.name || audience.owner.email}
        </div>
        <div className="text-lg font-bold text-green-600">
          {audience.price} credits
        </div>
      </div>
    </Link>
  )
}