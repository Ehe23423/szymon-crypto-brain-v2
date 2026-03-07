import { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { UnifiedTerminal } from './components/UnifiedTerminal';
import { LanguageProvider } from './lib/LanguageContext';
import './index.css';

export default function App() {
  useEffect(() => {
    const DEPLOY_VERSION = "2.0.FINAL_GOLD_v1";
    console.log(`%c [SYSTEM] ${DEPLOY_VERSION} LOADED`, 'background: #00d2ff; color: #000; font-weight: bold;');

    const body = document.body;
    const html = document.documentElement;

    const forceUnlock = () => {
      // Force individual styles
      body.style.setProperty('overflow-y', 'visible', 'important');
      body.style.setProperty('overflow-x', 'visible', 'important');
      body.style.setProperty('height', 'auto', 'important');
      body.style.setProperty('position', 'static', 'important');

      html.style.setProperty('overflow-y', 'visible', 'important');
      html.style.setProperty('overflow-x', 'visible', 'important');
      html.style.setProperty('height', 'auto', 'important');
      html.style.setProperty('position', 'static', 'important');

      body.classList.remove('antigravity-scroll-lock');

      // Ensure the marker is there for subagent to find
      if (!document.getElementById('deploy-ver')) {
        const div = document.createElement('div');
        div.id = 'deploy-ver';
        div.style.display = 'none';
        div.innerText = DEPLOY_VERSION;
        body.appendChild(div);
      }
    };

    forceUnlock();
    const timer = setInterval(forceUnlock, 500);
    window.addEventListener('resize', forceUnlock);

    return () => {
      clearInterval(timer);
      window.removeEventListener('resize', forceUnlock);
    };
  }, []);

  return (
    <LanguageProvider>
      <Routes>
        <Route path="/" element={<UnifiedTerminal />} />
        <Route path="*" element={<UnifiedTerminal />} />
      </Routes>
    </LanguageProvider>
  );
}
