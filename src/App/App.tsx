import { ThemeProvider } from './Theme/ThemeProvider';
import { RoomPage } from './RoomPage/RoomPage';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router';
import { HomePage } from './HomePage/HomePage';

const App = () => (
  <ThemeProvider>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/:roomId" element={<RoomPage />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  </ThemeProvider>
);

export default App;
