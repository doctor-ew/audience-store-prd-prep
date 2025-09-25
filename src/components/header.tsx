import Link from 'next/link'

export function Header() {
  return (
    <header className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center">
            <h1 className="text-2xl font-bold text-gray-900">Audience Store</h1>
          </Link>
          <nav className="flex items-center space-x-4">
            <Link
              href="/account"
              className="text-gray-600 hover:text-gray-900 font-medium"
            >
              Account (100 credits)
            </Link>
          </nav>
        </div>
      </div>
    </header>
  )
}