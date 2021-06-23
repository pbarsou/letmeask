import { useHistory } from 'react-router'; // para nos auxiliar na navegação entre páginas usando botões
import { auth, firebase } from '../services/firebase';

import illustrationImg from '../assets/images/illustration.svg';
import logoImg from '../assets/images/logo.svg';
import googleIconImg from '../assets/images/google-icon.svg';

import { Button } from '../components/Button';

import '../styles/auth.scss';

export function Home() {
  const history = useHistory();
  /* 'useHistory' é um hook, e hooks utilizam informações de dentro do contexto do componente, por 
  isso necessáriamente ele tem que estar dentro do componente */
  
  function handleCreateRoom() {
    const provider = new firebase.auth.GoogleAuthProvider(); 
    // instância de autenticação do firebase com o Google

    auth.signInWithPopup(provider).then(result => {
    // autenticação por popup
      console.log(result);
    })

    history.push('/rooms/new');
    // nos leva até a página de '/rooms/new' (página de nova sala)
  }

  return(
    <div id="page-auth">
      <aside>
        <img src={illustrationImg} alt="Ilustração simbolizando perguntas e respostas"/>
        <strong>Crie salas de Q&amp;A ao-vivo</strong>
        <p>Tire as dúvidas da sua audiência em tempo-real.</p>
      </aside>
      <main>
        <div className="main-content">
          <img src={logoImg} alt="Letmeask"/>
          <button onClick={handleCreateRoom} className="create-room">
            <img src={googleIconImg} alt="Logo do Google"/>
            Crie sua sala com o Google
          </button>
          <div className="separator">ou entre em uma sala</div>
          <form>
            <input 
              type="text"
              placeholder="Digite o código da sala"
            />
            <Button type="submit">
            Entrar na sala
            </Button>        
          </form>
        </div>
      </main>
    </div>
  );
  // 'aside' sendo a parte lateral
}