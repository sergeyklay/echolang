import { Link, useLocation } from 'react-router-dom';

export function Header() {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="bg-white border-b border-gray-200">
      <nav className="container mx-auto px-4 py-4">
        <div className="flex space-x-6">
          <Link
            to="/"
            className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
              isActive('/')
                ? 'bg-gray-100 text-gray-900'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
            }`}
          >
            Translator
          </Link>
          <Link
            to="/history"
            className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
              isActive('/history')
                ? 'bg-gray-100 text-gray-900'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
            }`}
          >
            History
          </Link>
          <Link
            to="/settings"
            className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
              isActive('/settings')
                ? 'bg-gray-100 text-gray-900'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
            }`}
          >
            Settings
          </Link>
        </div>
      </nav>
    </header>
  );
}

