import Link from 'next/link';

export function Header() {
  return (
    <header className="bg-gray-900 text-white shadow-md">
      <div className="container mx-auto flex h-16 max-w-4xl items-center justify-between px-4">
        <div className="flex items-center">
          <Link href="/" className="text-xl font-bold">
            Audience Store
          </Link>
        </div>
        <div className="flex items-center space-x-4">
          <p className="text-sm text-gray-400">Balance: $100</p>
        </div>
      </div>
    </header>
  );
}
