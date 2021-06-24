import firebase from "firebase";
import { createContext, ReactNode, useEffect, useState } from "react";
import { auth } from "../services/firebase";

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

type AuthContextProviderProps = {
  children: ReactNode;
  // quando o que vamos receber é algo que vem do React, seu tipo é 'ReactNode'
}

export const AuthContext = createContext({} as AuthContextType);
// criação do contexto de autorização

export function AuthContextProvider(props: AuthContextProviderProps) {
  const [user, setUser] = useState<User>();
  // estamos informando que o 'user' é do tipo 'User'

  useEffect(() => {
  // disparador de efeitos colaterais
    const unsubscribe = auth.onAuthStateChanged(user => {
    // se ele detectar que o usuário já havia sido logado:
      if (user) {
      // se usuário existir:
        const { displayName, photoURL, uid } = user;
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
    })

    return () => {
      unsubscribe();
    }
    /* boa prática. Se estamos ouvindo um evento, em algum momento podemos ter que parar de ouvir.
    Dessa forma, é necessário nos desincrevermos do event listener. */
  }, []);
  /* '[]' vazio ao final do 'useEffect', indica que ele será executado apenas quando 'App.tsx' 
  for aberto (ou recarregado). Dessa forma, não perdemos as informações de credenciamento do 
  usuário ao ele dar reload na página. */

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
    <AuthContext.Provider value={{ user, signInWithGoogle }}>
      {props.children};
    </AuthContext.Provider>
  );
  // 'props.children' recebe o que tá sendo passado dentro do 'AuthContextProvider' em 'App.tsx'
}