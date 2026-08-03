import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import PlatformPage from './pages/platform/page';
import EmailsPage from './pages/finalui/page';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/platform" element={<PlatformPage />} />
        <Route path="/server" element={<EmailsPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
