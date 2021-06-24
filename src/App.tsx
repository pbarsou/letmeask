// 'App.tsx' é a nossa 'single-page', todas as outras páginas são geradas a partir dela

import { BrowserRouter, Route } from 'react-router-dom'; // importação de componentes para roteamento
import { AuthContextProvider } from './contexts/AuthContext';

import { Home } from './pages/Home';
import { NewRoom } from "./pages/NewRoom";

function App() {
  return (
    <BrowserRouter>
      <AuthContextProvider>
        <Route path="/" exact component={Home} /> 
        <Route path="/rooms/new" component={NewRoom} />
      </AuthContextProvider>
    </BrowserRouter>
  );
} // simplificação de 'exact={true}', booleans quando não especificados, são true por default
  // 'exact' diz que para que essa página seja acessada, o endereço tem que necessáriamente ser '/'

export default App;

