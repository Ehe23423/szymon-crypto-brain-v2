import { Routes, Route } from 'react-router-dom';
import { UnifiedTerminal } from './components/UnifiedTerminal';
import { LanguageProvider } from './lib/LanguageContext';
import './index.css';

export default function App() {
  return (
    <LanguageProvider>
      <div style={{ height: '100vh', overflow: 'hidden' }}>
        <Routes>
          <Route path="/" element={<UnifiedTerminal />} />
          <Route path="*" element={<UnifiedTerminal />} />
        </Routes>
      </div>
    </LanguageProvider>
  );
}
