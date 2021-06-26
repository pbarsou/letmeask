// 'App.tsx' é a nossa 'single-page', todas as outras páginas são geradas a partir dela

import { BrowserRouter, Route, Switch } from 'react-router-dom'; // importação de componentes para roteamento
import { AuthContextProvider } from './contexts/AuthContext';

import { Home } from './pages/Home';
import { NewRoom } from "./pages/NewRoom";
import { Room } from './pages/Room';
import { AdminRoom } from './pages/AdminRoom';

function App() {
  return (
    <BrowserRouter>
      <AuthContextProvider>
        <Switch>
          <Route path="/" exact component={Home} /> 
          <Route path="/rooms/new" component={NewRoom} />
          <Route path="/rooms/:id" component={Room} />
          <Route path="/admin/rooms/:id" component={AdminRoom} />
        </Switch>
      </AuthContextProvider>
    </BrowserRouter>
  );
} // simplificação de 'exact={true}', booleans quando não especificados, são true por default
  // 'exact' diz que para que essa página seja acessada, o endereço tem que necessáriamente ser '/'
  /* '<Switch></Switch>', quando uma rota for satisfeita, para de procurar outras rotas que poderiam
  satisfazer aquele endereço */

export default App;

