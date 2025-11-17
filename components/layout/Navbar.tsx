'use client';

import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/lib/context/AuthContext';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';

export function Navbar() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  const isActive = (path: string) => pathname === path;

  if (!user) return null;

  const navItems = [
    { href: '/dashboard', label: 'Dashboard', icon: '📊' },
    { href: '/wallet', label: 'Wallet', icon: '💳' },
    { href: '/loans', label: 'Loans', icon: '💰', matchPrefix: true },
    { href: '/kyc', label: 'KYC', icon: '✅' },
    { href: '/profile', label: 'Profile', icon: '👤' },
  ];

  return (
    <nav className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg shadow-lg border-b border-gray-200 dark:border-gray-700 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20">
          <div className="flex items-center">
            <Link
              href="/dashboard"
              className="flex items-center gap-3 group"
            >
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/50 group-hover:shadow-xl group-hover:shadow-indigo-500/70 transition-all duration-300 group-hover:scale-110">
                <span className="text-white text-xl font-bold">CL</span>
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Credit-Link
              </span>
            </Link>
            <div className="hidden md:flex ml-12 space-x-2">
              {navItems.map((item) => {
                const active = item.matchPrefix
                  ? pathname.startsWith(item.href)
                  : isActive(item.href);

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`relative inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-xl transition-all duration-300 ${
                      active
                        ? 'text-white bg-gradient-to-r from-indigo-600 to-purple-600 shadow-lg shadow-indigo-500/30'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                    }`}
                  >
                    <span className="text-base">{item.icon}</span>
                    {item.label}
                    {active && (
                      <span className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1 w-1 h-1 bg-white rounded-full" />
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-3 px-4 py-2 bg-gradient-to-r from-gray-50 to-indigo-50 dark:from-gray-800 dark:to-indigo-950 rounded-xl border border-gray-200 dark:border-gray-700">
              <div className="text-right">
                <p className="text-sm font-semibold text-gray-900 dark:text-white">{user.name}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Welcome back</p>
              </div>
              <Badge variant="gradient" size="sm">
                {user.role}
              </Badge>
            </div>
            <Button variant="outline" size="sm" onClick={handleLogout}>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Logout
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}
