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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-indigo-950 dark:to-purple-950">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-indigo-600 border-t-transparent mx-auto shadow-lg"></div>
          <p className="mt-6 text-gray-700 dark:text-gray-300 font-semibold text-lg">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-indigo-950 dark:to-purple-950 overflow-hidden relative">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-300 dark:bg-purple-900 rounded-full mix-blend-multiply dark:mix-blend-soft-light filter blur-3xl opacity-30 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-indigo-300 dark:bg-indigo-900 rounded-full mix-blend-multiply dark:mix-blend-soft-light filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-pink-300 dark:bg-pink-900 rounded-full mix-blend-multiply dark:mix-blend-soft-light filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>
      </div>
      {/* Hero Section */}
      <div className="relative container mx-auto px-4 py-8">
        <nav className="flex justify-between items-center mb-20 animate-fadeIn">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-12 h-12 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-xl shadow-indigo-500/50 group-hover:shadow-2xl group-hover:shadow-indigo-500/70 transition-all duration-300 group-hover:scale-110">
              <span className="text-white text-2xl font-bold">CL</span>
            </div>
            <span className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Credit-Link
            </span>
          </Link>
          <div className="flex gap-3">
            <Link href="/login">
              <Button variant="ghost" size="md">
                Login
              </Button>
            </Link>
            <Link href="/register">
              <Button variant="primary" size="md">
                Get Started
              </Button>
            </Link>
          </div>
        </nav>

        <div className="max-w-5xl mx-auto text-center py-20 animate-fadeIn">
          <div className="inline-block mb-6">
            <span className="px-4 py-2 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400 rounded-full text-sm font-semibold border border-indigo-200 dark:border-indigo-800">
              Trusted by 10,000+ users worldwide
            </span>
          </div>
          <h2 className="text-6xl md:text-7xl font-extrabold text-gray-900 dark:text-white mb-8 leading-tight">
            Micro-lending{' '}
            <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              Made Simple
            </span>
          </h2>
          <p className="text-xl md:text-2xl text-gray-700 dark:text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed">
            Connect borrowers and lenders in a secure, transparent peer-to-peer lending platform.
            Build credit, grow wealth, and achieve financial freedom.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/register">
              <Button variant="primary" size="lg" className="min-w-[200px]">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                Apply for a Loan
              </Button>
            </Link>
            <Link href="/register">
              <Button variant="outline" size="lg" className="min-w-[200px]">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
                Become a Lender
              </Button>
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-20 max-w-4xl mx-auto">
            <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-lg rounded-2xl p-6 border border-gray-200 dark:border-gray-700 shadow-xl">
              <div className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">
                $10M+
              </div>
              <div className="text-gray-600 dark:text-gray-400 font-semibold">Total Loans Funded</div>
            </div>
            <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-lg rounded-2xl p-6 border border-gray-200 dark:border-gray-700 shadow-xl">
              <div className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">
                98%
              </div>
              <div className="text-gray-600 dark:text-gray-400 font-semibold">Approval Rate</div>
            </div>
            <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-lg rounded-2xl p-6 border border-gray-200 dark:border-gray-700 shadow-xl">
              <div className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">
                24hrs
              </div>
              <div className="text-gray-600 dark:text-gray-400 font-semibold">Average Funding Time</div>
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-32 max-w-6xl mx-auto">
          <div className="group bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg p-8 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300">
            <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-indigo-500/50 group-hover:shadow-xl group-hover:shadow-indigo-500/70 group-hover:scale-110 transition-all duration-300">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">Secure & Safe</h3>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
              Bank-level encryption protects your data. Complete KYC verification ensures trust and security for all transactions.
            </p>
          </div>

          <div className="group bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg p-8 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300">
            <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-green-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-emerald-500/50 group-hover:shadow-xl group-hover:shadow-emerald-500/70 group-hover:scale-110 transition-all duration-300">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">Fast Approval</h3>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
              Get lightning-fast loan approvals and instant fund transfers to your wallet. Access your money when you need it.
            </p>
          </div>

          <div className="group bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg p-8 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-purple-500/50 group-hover:shadow-xl group-hover:shadow-purple-500/70 group-hover:scale-110 transition-all duration-300">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">Build Credit</h3>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
              Improve your credit score with on-time payments and responsible borrowing. Build your financial future.
            </p>
          </div>
        </div>

        {/* How It Works */}
        <div className="mt-40 max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400">
              Get started in just 4 simple steps
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="group relative bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg p-8 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
              <div className="absolute -top-6 -left-6 w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 text-white rounded-2xl flex items-center justify-center font-bold text-2xl shadow-xl shadow-indigo-500/50 group-hover:scale-110 transition-all duration-300">
                1
              </div>
              <div className="pl-6">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">Sign Up & Complete KYC</h3>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                  Create your account in seconds and verify your identity with our streamlined KYC process. Your security is our priority.
                </p>
              </div>
            </div>

            <div className="group relative bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg p-8 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
              <div className="absolute -top-6 -left-6 w-16 h-16 bg-gradient-to-br from-emerald-500 to-green-600 text-white rounded-2xl flex items-center justify-center font-bold text-2xl shadow-xl shadow-emerald-500/50 group-hover:scale-110 transition-all duration-300">
                2
              </div>
              <div className="pl-6">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">Browse & Apply</h3>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                  Explore various loan products tailored to your needs and submit your application in just minutes. No paperwork hassle.
                </p>
              </div>
            </div>

            <div className="group relative bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg p-8 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
              <div className="absolute -top-6 -left-6 w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 text-white rounded-2xl flex items-center justify-center font-bold text-2xl shadow-xl shadow-purple-500/50 group-hover:scale-110 transition-all duration-300">
                3
              </div>
              <div className="pl-6">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">Get Funded</h3>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                  Once approved, funds are instantly transferred to your wallet. Access your money immediately and use it as you need.
                </p>
              </div>
            </div>

            <div className="group relative bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg p-8 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
              <div className="absolute -top-6 -left-6 w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-600 text-white rounded-2xl flex items-center justify-center font-bold text-2xl shadow-xl shadow-blue-500/50 group-hover:scale-110 transition-all duration-300">
                4
              </div>
              <div className="pl-6">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">Repay & Build Credit</h3>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                  Make timely repayments and watch your credit score soar. Build a strong financial future with responsible borrowing.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-40 mb-20 relative overflow-hidden bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 rounded-3xl p-16 text-center text-white max-w-5xl mx-auto shadow-2xl">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="relative z-10">
            <h2 className="text-4xl md:text-5xl font-extrabold mb-6">Ready to Get Started?</h2>
            <p className="text-xl md:text-2xl mb-10 text-white/90 max-w-2xl mx-auto">
              Join thousands of users who trust Credit-Link for their lending needs. Start building your financial future today.
            </p>
            <Link href="/register">
              <Button variant="outline" size="xl" className="bg-white text-indigo-600 border-white hover:bg-gray-100 shadow-xl">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                Create Free Account
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
