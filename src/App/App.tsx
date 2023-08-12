import { UserContextProvider } from 'hooks/use-user-context';
import { ThemeProvider } from './ThemeProvider';
import { Header } from './Header';
import { RoomPage } from './RoomPage/RoomPage';
import './App.css';

const App = () => (
  <UserContextProvider>
    <ThemeProvider>
      <Header />
      <RoomPage />
    </ThemeProvider>
  </UserContextProvider>
);

export default App;
