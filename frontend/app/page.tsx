'use client';

import React, { useState, useEffect } from 'react';
import { Code, Zap, Users, Trophy, ArrowRight } from 'lucide-react';

interface CodeSymbol {
  id: number;
  x: number;
  y: number;
  symbol: string;
  delay: number;
}

function LandingPage() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [codeSymbols, setCodeSymbols] = useState<CodeSymbol[]>([]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);

    // Generate floating code symbols
    const symbols = ['</>', '{...}', '()', '[]', '<>', '==', '=>', '{}'];
    const generatedSymbols = Array.from({ length: 15 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      symbol: symbols[Math.floor(Math.random() * symbols.length)],
      delay: Math.random() * 5
    }));
    setCodeSymbols(generatedSymbols);

    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="min-h-screen bg-gray-950 text-white relative overflow-hidden">
      {/* Animated Background Gradient */}
      <div
        className="absolute inset-0 opacity-30 transition-all duration-300"
        style={{
          background: `radial-gradient(circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(59, 130, 246, 0.15), transparent 50%)`
        }}
      />

      {/* Floating Code Symbols */}
      {codeSymbols.map((item) => (
        <div
          key={item.id}
          className="absolute text-blue-500/10 font-mono text-2xl pointer-events-none animate-float"
          style={{
            left: `${item.x}%`,
            top: `${item.y}%`,
            animationDelay: `${item.delay}s`
          }}
        >
          {item.symbol}
        </div>
      ))}

      {/* Grid Pattern Overlay */}
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `linear-gradient(rgba(59, 130, 246, 0.3) 1px, transparent 1px),
                           linear-gradient(90deg, rgba(59, 130, 246, 0.3) 1px, transparent 1px)`,
          backgroundSize: '50px 50px'
        }}
      />

      {/* Navigation */}
      <nav className="relative z-10 flex items-center justify-between px-6 py-6 max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <div className="flex gap-1">
            <div className="w-2 h-8 bg-blue-600 rounded-full" />
            <div className="w-2 h-8 bg-blue-500 rounded-full" />
            <div className="w-2 h-8 bg-blue-400 rounded-full" />
          </div>
          <h1 className="text-2xl font-bold">
            Byte<span className="text-blue-500">Camp</span>
          </h1>
        </div>

        <div className="flex items-center gap-4">
          <a
            href="/contact"
            className="px-4 sm:px-6 py-2 text-gray-300 hover:text-white transition-colors duration-200"
          >
            Contact
          </a>
          <a
            href="/login"
            className="hidden sm:flex px-6 py-2 bg-blue-600 rounded-lg hover:bg-blue-700 transition-all duration-200 shadow-lg hover:shadow-blue-600/50 items-center gap-2 group"
          >
            Get Started
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </a>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="relative z-10 max-w-7xl mx-auto px-6 pt-20 pb-32">
        <div className="text-center space-y-8">
          {/* Code Animation Badge */}
          <div className="inline-flex items-center gap-3 px-4 py-2 bg-blue-500/10 border border-blue-500/20 rounded-full text-blue-400 text-sm backdrop-blur-sm">
            <div className="relative flex items-center">
              <span className="font-mono text-lg animate-pulse">&lt;</span>
              <span className="font-mono text-lg animate-bounce mx-1">/</span>
              <span className="font-mono text-lg animate-pulse">&gt;</span>
            </div>
            <span className="font-mono">Code Your Future</span>
          </div>

          {/* Main Heading */}
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold leading-tight">
            Learn to Code,
            <br />
            <span className="bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600 bg-clip-text text-transparent">
              Build the Future
            </span>
          </h1>

          {/* Subheading */}
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Master programming with interactive courses, real-world projects, and a supportive community.
            From beginner to pro, we've got you covered.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <a
              href="/login"
              className="px-8 py-4 bg-blue-600 rounded-lg hover:bg-blue-700 transition-all duration-200 shadow-lg hover:shadow-blue-600/50 font-medium text-lg flex items-center gap-2 group w-full sm:w-auto justify-center"
            >
              Start Learning Free
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </a>
            <a
              href="#features"
              className="px-8 py-4 bg-gray-800 border border-gray-700 rounded-lg hover:bg-gray-700 hover:border-gray-600 transition-all duration-200 font-medium text-lg w-full sm:w-auto text-center"
            >
              Explore Features
            </a>
          </div>
        </div>

        {/* Features Section */}
        <div id="features" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-32">
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 hover:border-blue-500/50 transition-all duration-300 group">
            <div className="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-blue-500/20 transition-colors">
              <Code className="text-blue-500" size={24} />
            </div>
            <h3 className="text-xl font-semibold mb-2">Interactive Courses</h3>
            <p className="text-gray-400">
              Learn by doing with hands-on coding exercises and real-time feedback.
            </p>
          </div>

          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 hover:border-blue-500/50 transition-all duration-300 group">
            <div className="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-blue-500/20 transition-colors">
              <Zap className="text-blue-500" size={24} />
            </div>
            <h3 className="text-xl font-semibold mb-2">Fast-Track Learning</h3>
            <p className="text-gray-400">
              Accelerate your progress with structured learning paths and expert guidance.
            </p>
          </div>

          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 hover:border-blue-500/50 transition-all duration-300 group">
            <div className="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-blue-500/20 transition-colors">
              <Users className="text-blue-500" size={24} />
            </div>
            <h3 className="text-xl font-semibold mb-2">Active Community</h3>
            <p className="text-gray-400">
              Connect with fellow learners, share projects, and grow together.
            </p>
          </div>

          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 hover:border-blue-500/50 transition-all duration-300 group">
            <div className="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-blue-500/20 transition-colors">
              <Trophy className="text-blue-500" size={24} />
            </div>
            <h3 className="text-xl font-semibold mb-2">Track Progress</h3>
            <p className="text-gray-400">
              Monitor your achievements, earn badges, and celebrate milestones.
            </p>
          </div>
        </div>

        {/* Final CTA */}
        <div className="mt-32 text-center">
          <div className="bg-gradient-to-r from-blue-600/10 via-blue-500/10 to-blue-600/10 border border-blue-500/20 rounded-2xl p-12 backdrop-blur-sm">
            <h2 className="text-4xl font-bold mb-4">Ready to Start Your Journey?</h2>
            <p className="text-xl text-gray-400 mb-8">
              Join thousands of learners who are already coding their dreams into reality.
            </p>
            <a
              href="/login"
              className="inline-flex items-center gap-2 px-8 py-4 bg-blue-600 rounded-lg hover:bg-blue-700 transition-all duration-200 shadow-lg hover:shadow-blue-600/50 font-medium text-lg group"
            >
              Get Started for Free
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </a>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-gray-800 mt-20">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="flex gap-1">
                <div className="w-2 h-6 bg-blue-600 rounded-full" />
                <div className="w-2 h-6 bg-blue-500 rounded-full" />
                <div className="w-2 h-6 bg-blue-400 rounded-full" />
              </div>
              <span className="text-lg font-bold">
                Byte<span className="text-blue-500">Camp</span>
              </span>
            </div>
            <p className="text-gray-400 text-sm">
              © 2025 ByteCamp. All rights reserved.
            </p>
          </div>
        </div>
      </footer>

      <style jsx>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0) translateX(0) rotate(0deg);
            opacity: 0.05;
          }
          25% {
            opacity: 0.1;
          }
          50% {
            transform: translateY(-30px) translateX(20px) rotate(180deg);
            opacity: 0.15;
          }
          75% {
            opacity: 0.1;
          }
        }
 
        .animate-float {
          animation: float 8s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}

export default LandingPage;