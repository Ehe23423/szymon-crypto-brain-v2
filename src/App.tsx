import { Routes, Route } from 'react-router-dom';
import { UnifiedTerminal } from './components/UnifiedTerminal';
import { LanguageProvider } from './lib/LanguageContext';
import './index.css';

export default function App() {
  return (
    <LanguageProvider>
      <Routes>
        <Route path="/" element={<UnifiedTerminal />} />
        <Route path="*" element={<UnifiedTerminal />} />
      </Routes>
    </LanguageProvider>
  );
}
