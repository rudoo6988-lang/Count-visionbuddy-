/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { WaitlistCounter } from './components/WaitlistCounter';
import { Features } from './components/Features';
import { Footer } from './components/Footer';
import { AdminDashboard } from './components/AdminDashboard';
import { CursorGlow } from './components/CursorGlow';

function Home() {
  const [counterTrigger, setCounterTrigger] = useState(0);

  const handleJoin = () => {
    setCounterTrigger(prev => prev + 1);
  };

  return (
    <div className="relative min-h-screen">
      <Navbar />
      <main>
        <Hero onJoin={handleJoin} />
        <WaitlistCounter key={counterTrigger} />
        <Features />
      </main>
      <Footer />
      <CursorGlow />
    </div>
  );
}

export default function App() {
  const [route, setRoute] = useState(window.location.pathname);

  useEffect(() => {
    const handlePopState = () => setRoute(window.location.pathname);
    window.addEventListener('popstate', handlePopState);
    
    // Polyfill for internal navigation
    const originalPushState = window.history.pushState;
    window.history.pushState = function(...args) {
      originalPushState.apply(this, args);
      setRoute(window.location.pathname);
    };

    return () => {
      window.removeEventListener('popstate', handlePopState);
      window.history.pushState = originalPushState;
    };
  }, []);

  if (route === '/admin') {
    return <AdminDashboard />;
  }

  return <Home />;
}

