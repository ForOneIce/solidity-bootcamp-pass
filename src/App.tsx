/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import PassGenerator from './components/PassGenerator';
import LoadingScreen from './components/LoadingScreen';
import CustomCursor from './components/CustomCursor';

export default function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading time for the "exploration" feel
    // 2.5 seconds to allow the animation to be enjoyed
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <CustomCursor />
      {loading && <LoadingScreen />}
      {/* We keep the main app mounted but hidden or behind the loader to ensure assets load */}
      <div className={loading ? 'opacity-0 h-0 overflow-hidden' : 'opacity-100 transition-opacity duration-700'}>
        <PassGenerator />
      </div>
    </>
  );
}
