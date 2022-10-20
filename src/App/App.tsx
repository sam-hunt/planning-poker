import { ThemeProvider } from './ThemeProvider';
import { Header } from './Header';
import { RoomPage } from './RoomPage/RoomPage';
import './App.css';

const App = () => (
  <ThemeProvider>
    <Header />
    <RoomPage />
  </ThemeProvider>
);

export default App;
