// 'App.tsx' é a nossa 'single-page', todas as outras páginas são geradas a partir dela

import { createContext, useState } from 'react';
import { BrowserRouter, Route } from 'react-router-dom'; // importação de componentes para roteamento

import { Home } from './pages/Home';
import { NewRoom } from "./pages/NewRoom";

import { auth, firebase } from './services/firebase';

type User = {
  id: string;
  name: string;
  avatar: string;
}

type AuthContextType = {
  user: User | undefined;
  /* 'user' pode ser undefined porque inicialmente, antes de se fazer a autenticação, seu valor é
  indefinido */
  signInWithGoogle: () => Promise<void>; // é uma promise sem retono
}

export const AuthContext = createContext({} as AuthContextType);
// criação do contexto de autorização

function App() {

  const [user, setUser] = useState<User>();
  // estamos informando que o 'user' é do tipo 'User'

  async function signInWithGoogle() { 
  // função de autenticação

    const provider = new firebase.auth.GoogleAuthProvider(); 
    // instância de autenticação do firebase com o Google

    const result = await auth.signInWithPopup(provider);
    // autenticação por popup

      if (result.user) { 
      // se no resultado existir um 'user'

        const { displayName, photoURL, uid } = result.user;
        /* sendo 'displayName' o nome que o usuário quer ser chamado, 'photoURL' a foto de perfil 
        e 'uid' o identificador único */

        if (!displayName || !photoURL ) {
        // se o usuário não tiver nome ou foto de perfil
          throw new Error('Missing information from Google Account.')
        }

        setUser({
        // preenchimento das informações do nosso 'user'
          id: uid,
          name: displayName,
          avatar: photoURL
        })
      }
    }


  return (
    <BrowserRouter>
      <AuthContext.Provider value={{ user, signInWithGoogle }}>
        <Route path="/" exact component={Home} /> 
        <Route path="/rooms/new" component={NewRoom} />
      </AuthContext.Provider>
    </BrowserRouter>
  );
} // simplificação de 'exact={true}', booleans quando não especificados, são true por default
  // 'exact' diz que para que essa página seja acessada, o endereço tem que necessáriamente ser '/'

export default App;

