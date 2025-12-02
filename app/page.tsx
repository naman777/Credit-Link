'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/context/AuthContext';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';

export default function Home() {
  const router = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && user) {
      router.push('/dashboard');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-indigo-50/30 to-violet-50/30 dark:from-gray-950 dark:via-indigo-950/20 dark:to-violet-950/20">
        <div className="text-center">
          <div className="w-12 h-12 border-3 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-indigo-50/30 dark:from-gray-950 dark:via-gray-900 dark:to-indigo-950/20">
      {/* Navigation */}
      <nav className="fixed top-0 inset-x-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-b border-gray-200/50 dark:border-gray-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="w-9 h-9 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20 group-hover:shadow-xl group-hover:shadow-indigo-500/30 transition-all duration-300">
                <span className="text-white text-sm font-bold">CL</span>
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
                Credit-Link
              </span>
            </Link>
            <div className="flex items-center gap-3">
              <Link href="/login">
                <Button variant="ghost" size="sm">Sign In</Button>
              </Link>
              <Link href="/register">
                <Button size="sm">Get Started</Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 overflow-hidden">
        {/* Background decorations */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-[500px] h-[500px] bg-indigo-200 dark:bg-indigo-900/30 rounded-full blur-3xl opacity-30 animate-blob"></div>
          <div className="absolute -bottom-40 -left-40 w-[500px] h-[500px] bg-violet-200 dark:bg-violet-900/30 rounded-full blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-fuchsia-200 dark:bg-fuchsia-900/30 rounded-full blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
        </div>

        <div className="max-w-5xl mx-auto text-center relative">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 dark:bg-indigo-950/50 rounded-full text-sm text-indigo-600 dark:text-indigo-400 font-medium mb-8 animate-fadeIn">
            <span className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse"></span>
            Peer-to-peer micro-lending platform
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white leading-tight animate-fadeInUp">
            Micro-lending{' '}
            <span className="bg-gradient-to-r from-indigo-600 via-violet-600 to-fuchsia-600 bg-clip-text text-transparent">
              Made Simple
            </span>
          </h1>

          <p className="mt-6 text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto animate-fadeInUp animation-delay-1000">
            Connect borrowers and lenders directly. Get fair interest rates, build your credit history, and achieve your financial goals.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 animate-fadeInUp animation-delay-2000">
            <Link href="/register">
              <Button size="lg" variant="gradient">
                Apply for a Loan
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Button>
            </Link>
            <Link href="/register">
              <Button size="lg" variant="outline">
                Become a Lender
              </Button>
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 mt-16 max-w-2xl mx-auto">
            <div className="p-4">
              <div className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">$10M+</div>
              <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">Loans Funded</div>
            </div>
            <div className="p-4 border-x border-gray-200 dark:border-gray-800">
              <div className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">98%</div>
              <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">Approval Rate</div>
            </div>
            <div className="p-4">
              <div className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">24hrs</div>
              <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">Avg. Funding</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Why Credit-Link?</h2>
            <p className="mt-3 text-gray-600 dark:text-gray-400">Everything you need for peer-to-peer lending</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {/* Feature 1 */}
            <div className="group p-6 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
              <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-950/50 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <svg className="w-6 h-6 text-indigo-600 dark:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Secure & Verified</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                KYC verification and secure transactions ensure safe lending and borrowing
              </p>
            </div>

            {/* Feature 2 */}
            <div className="group p-6 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
              <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-950/50 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <svg className="w-6 h-6 text-emerald-600 dark:text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Fast Processing</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Quick loan applications and instant fund transfers to your wallet
              </p>
            </div>

            {/* Feature 3 */}
            <div className="group p-6 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
              <div className="w-12 h-12 bg-violet-100 dark:bg-violet-950/50 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <svg className="w-6 h-6 text-violet-600 dark:text-violet-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Build Credit</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Track your credit score and build history with on-time payments
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-4 bg-gray-50 dark:bg-gray-900/50">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">How It Works</h2>
            <p className="mt-3 text-gray-600 dark:text-gray-400">Get started in just a few steps</p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { step: '1', title: 'Create Account', desc: 'Sign up and verify your identity' },
              { step: '2', title: 'Complete KYC', desc: 'Submit documents for verification' },
              { step: '3', title: 'Add Funds', desc: 'Deposit money to your wallet' },
              { step: '4', title: 'Start Lending', desc: 'Apply for loans or fund borrowers' },
            ].map((item, i) => (
              <div key={i} className="relative p-5 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800">
                <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-violet-500 rounded-lg flex items-center justify-center mb-3">
                  <span className="text-white text-sm font-bold">{item.step}</span>
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-1">{item.title}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="relative overflow-hidden bg-gradient-to-r from-indigo-500 via-violet-500 to-fuchsia-500 rounded-2xl p-8 md:p-12 text-center text-white">
            <div className="absolute inset-0 bg-black/10"></div>
            <div className="relative">
              <h2 className="text-2xl md:text-3xl font-bold mb-4">
                Ready to get started?
              </h2>
              <p className="text-white/80 mb-8 max-w-lg mx-auto">
                Join thousands of users who trust Credit-Link for their lending needs
              </p>
              <Link href="/register">
                <Button size="lg" variant="glass" className="text-white border-white/30 hover:bg-white/20">
                  Create Free Account
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 border-t border-gray-200 dark:border-gray-800">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-lg flex items-center justify-center">
              <span className="text-white text-xs font-bold">CL</span>
            </div>
            <span className="text-sm font-semibold text-gray-900 dark:text-white">Credit-Link</span>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            &copy; {new Date().getFullYear()} Credit-Link. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
