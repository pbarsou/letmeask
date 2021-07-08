import { useHistory } from 'react-router'; // para nos auxiliar na navegação entre páginas usando botões

import illustrationImg from '../assets/images/illustration.svg';
import logoImg from '../assets/images/logo.svg';
import logoDark from '../assets/images/logo-dark.svg';
import googleIconImg from '../assets/images/google-icon.svg';

import { Button } from '../components/Button';

import '../styles/auth.scss';

import { useAuth } from '../hooks/useAuth';
import { FormEvent, useState, useContext } from 'react';
import { database } from '../services/firebase';

import { Toggle } from '../components/Toggle';
import { ThemeContext } from '../contexts/ThemeContext';


export function Home() {
  const history = useHistory();
  /* 'useHistory' é um hook, e hooks utilizam informações de dentro do contexto do componente, por 
  isso necessáriamente ele tem que estar dentro do componente */

  const { user, signInWithGoogle } = useAuth();
  // usando nosso 'hook' de autenticação que inicializa pra gente o uso do contexto 'AuthContext'

  const [roomCode, setRoomCode] = useState('');
  // inicializando 'roomCode' como string vazia
  /* 'roomCode' é o código da sala que o usuário irá informar. No 'Firebase' é a 'key' que representa
  aquela sala */
  
  async function handleCreateRoom() {
  // função para lidar com criação da sala
  
    if(!user) {
    // se usuário não existir:
      await signInWithGoogle();
      // é chamada a função de autenticação
    }

    history.push('/rooms/new');
    // nos leva até a página de '/rooms/new' (página de nova sala)
  }

  async function handleJoinRoom(event: FormEvent) { // função chamada pelo 'submit'
    event.preventDefault();
    /* quando clicamos no 'submit', por padrão o form atualiza a página ao tentar enviar o usuário 
    para outra tela, porém, como sabemos, o react não trabalha dessa forma, ele não recarrega/renderiza 
    novamente a página inteira, mas sim apenas o conteúdo que interessa ser alterado. Essa função vai
    previnir que isso aconteça. */

    if (roomCode.trim() === '') {
    // '.trim()' tira os espaços vazios na esquerda e na direita
    // se código da sala for vazio:
      return;
      // não entrar na sala
    }

    const roomRef = await database.ref(`/rooms/${roomCode}`).get();
    // verifica se existe uma sala com a 'key' informada e pega os dados se existir

    if(!roomRef.exists()) {
    // se 'roomRef' não existir:
      alert('Room does not exists.');
      // exibe uma alerta em tela
      return;
      // para não continuar
    }
    
    if (roomRef.val().closedAt) {
      alert('Room already closed.');
      return;
      // dessa forma nenhum usuário consegue mais entrar na sala
    }

    history.push(`/rooms/${roomCode}`);
    // direciona para o endereço da sala
  }

  const { theme } = useContext(ThemeContext);

  return(
    <div id="page-auth" className={theme}>
      <aside>
        <img src={illustrationImg} alt="Ilustração simbolizando perguntas e respostas"/>
        <strong>Crie salas de Q&amp;A ao-vivo</strong>
        <p>Tire as dúvidas da sua audiência em tempo-real.</p>
      </aside>

      <Toggle />
      
      <main>
        <div className="main-content">
          <img src={theme === 'light' ? logoImg : logoDark} alt="Letmeask"/>
          <button onClick={handleCreateRoom} className="create-room">
            <img src={googleIconImg} alt="Logo do Google"/>
            Crie sua sala com o Google
          </button>
          <div className="separator">ou entre em uma sala</div>
          <form onSubmit={handleJoinRoom}>
            <input 
              type="text"
              placeholder="Digite o código da sala"
              onChange={event => setRoomCode(event.currentTarget.value)}
              value={roomCode}
            />
            <Button type="submit">
            Entrar na sala
            </Button>        
          </form>
        </div>
      </main>
    </div>
  )
  // 'aside' sendo a parte lateral
  /* no 'form', 'onChange' observa qualquer mudança que aconteça dentro do 'input' e caso haja, seta
  o novo valor de 'roomCode' usando 'SetRoomCode' // 'value={roomCode}' salva o valor de 'roomCode' */
}