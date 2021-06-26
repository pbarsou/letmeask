import { FormEvent, useState } from 'react';
import { Link, useHistory } from 'react-router-dom'; // para nos auxiliar na navegação entre páginas usando um link
import { useAuth } from '../hooks/useAuth';
import { database } from '../services/firebase';

import illustrationImg from '../assets/images/illustration.svg';
import logoImg from '../assets/images/logo.svg';

import { Button } from '../components/Button';


import '../styles/auth.scss';


export function NewRoom() {

  const { user } = useAuth();
  const history = useHistory();
  const [newRoom, setNewRoom] = useState('');
  // inicializando 'newRoom' como string vazia

  async function handleCreateRoom(event: FormEvent) { // função chamada pelo 'submit'
    event.preventDefault(); 
    /* quando clicamos no 'submit', por padrão o form atualiza a página ao tentar enviar o usuário 
    para outra tela, porém, como sabemos, o react não trabalha dessa forma, ele não recarrega/renderiza 
    novamente a página inteira, mas sim apenas o conteúdo que interessa ser alterado. Essa função vai
    previnir que isso aconteça. */

    if (newRoom.trim() === '') {
    // '.trim()' tira os espaços vazios na esquerda e na direita
    // se nome da sala vazia:
      return;
      // não deixa criar a sala
    }

    const roomRef = database.ref('rooms');
    // criando uma referência no nosso banco de dados chamada 'rooms'

    const firebaseRoom = await roomRef.push({
    // inserindo dados dentro dessa ref
      title: newRoom,
      authorId: user?.id,
    })

    history.push(`/admin/rooms/${firebaseRoom.key}`);
    // redireciona para '/rooms/key', sendo 'key' uma chave única gerada pelo firebase
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
          <h2>Crie uma nova sala </h2>
          <form onSubmit={handleCreateRoom}>
            <input 
              type="text"
              placeholder="Nome da sala"
              onChange={event => setNewRoom(event.target.value)}
              value={newRoom}
            />
            <Button type="submit">
              Criar sala
            </Button>        
          </form>
          <p>
            Quer entrar em uma sala existente? <Link to="/">clique aqui</Link>
          </p>
        </div>
      </main>
    </div>
  )
  // 'aside' sendo a parte lateral
  // componente Link sendo usado logo acima
  /* no 'form', 'onChange' observa qualquer mudança que aconteça dentro do 'input' e caso haja, seta
  o novo valor de 'newRoom' usando 'SetNewRoom' // 'value={newRoom}' salva o valor de 'newRoom' */
  
}