import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import PlatformPage from './pages/platform/page';
import EmailsPage from './pages/finalui/page';

import ProcessResultsPage from './pages/results/page.tsx';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/platform" element={<PlatformPage />} />
        <Route path="/server" element={<EmailsPage />} />
        <Route path="/results" element={<ProcessResultsPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
