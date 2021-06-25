import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import logoImg from '../assets/images/logo.svg';

import { Button } from '../components/Button';
import { RoomCode } from '../components/RoomCode';
import { useAuth } from '../hooks/useAuth';

import { database } from '../services/firebase';

import '../styles/room.scss';


type FirebaseQuestions = Record<string, {
  author: {
    name: string;
    avatar: string;
  }
  content: string;
  isAnswered: boolean; // se a pergunta foi respondida
  isHighlighted: boolean; // se a pergunta foi destacada
}>;
// Record é a tipagem para objetos no typescript
/* type 'FirebaseQuestions' espera o retorno de um objeto onde o primeiro elemento é uma string e
o segundo é um objeto, já que 'questions' do nosso bd retorna o seu 'id' como primeiro parâmetro e 
o seu conteúdo como segundo */

type Question = {
  id: string;
  author: {
    name: string;
    avatar: string;
  }
  content: string;
  isAnswered: boolean; // se a pergunta foi respondida
  isHighlighted: boolean; // se a pergunta foi destacada
};

type RoomParams = {
  id: string;
}

export function Room() {

  const { user } = useAuth();
  // pegando 'user' da resposta do 'AuthContext' 

  const params = useParams<RoomParams>();
  // 'useParams' nos devolve os parâmetros da rota (o que vem depois do '/')
  // '< >' uso de generics para que a função saiba quais os parâmetros que ela irá receber
  const roomId = params.id;
  const [newQuestion, setNewQuestion] = useState('');
  const [questions, setQuestions] = useState<Question[]>([]);
  // informamos que 'question' armazena um array de 'Question' usando generics e que inicia vazio
  const [title, setTitle] = useState('');

  useEffect(() => {
    const roomRef = database.ref(`rooms/${roomId}`);
    // acesso a nossa página no bd

    roomRef.once('value', room => {
    /* 'once' ouve o evento ('value' é um dos eventos que o firebase disponibiliza, o qual 
    monitora todos os valores) apenas uma vez, 'on' fica ouvindo qualquer modificação feita 
    no evento */ 
      const databaseRoom = room.val();
      // 'room.val()' são os dados da página
      const firebaseQuestions: FirebaseQuestions = databaseRoom.questions ?? {}; 
      // ou podia ser 'databaseRoom.questions as FirebaseQuestions'
      // 'firebaseQuestions' recebe as perguntas armazenadas em nossa pág
      // '?? {}', é para se o objeto 'questions' for vazio, retornar '{}' (vazio)
      const parsedQuestions = Object.entries(firebaseQuestions).map(([key, value]) => {
        return {
          id: key,
          content: value.content,
          author: value.author,
          isAnswered: value.isAnswered,
          isHighlighted: value.isHighlighted,
        }
      });
      
      setTitle(databaseRoom.title);
      // 'databaseRoom' armazena os dados da nossa página
      // setando o 'title' da nossa sala numa variável já que vamos exibí-lo em tela
      setQuestions(parsedQuestions);
      // setando as questions no nosso array de 'questions'
    })
  }, [roomId])
  /* '.entries' retorna o objeto em formato de array pra gente, e como explicado no 
      'FirebaseQuestions' retorna uma string (id da questão) e um objeto (seu conteúdo) */
      // '.map' para percorrer dentro do array 

  async function handleSendQuestion() {
    if (newQuestion.trim() === '') {
      return;
    }

    if (!user) {
    // se usuário não estiver logado, 'user' não vai existir
      throw new Error('You must be logged in');
    }

    const question = {
      content: newQuestion,
      author: {
        name: user.name,
        avatar: user.avatar,
      },
      isAnswered: false, // se a pergunta foi respondida
      isHighlighted: false, // se a pergunta foi destacada
    }

    await database.ref(`rooms/${roomId}/questions`).push(question);
    /* cria uma nova informação na sala criada no nosso bd no firebase de nome 'questions' e estamos
    inserindo 'question' nela */

    setNewQuestion('');
    // para limpar o 'textarea'
  }

  return (
    <div id="page-room">
      <header>
        <div className="content">
          <img src={logoImg} alt="Letmeask"/>
          <RoomCode code={roomId}/>
        </div>
      </header>

      <main>
        <div className="room-title">
          <h1>Sala {title}</h1>
          { questions.length === 1 ? 
            <span>{questions.length} pergunta</span> 
          : (<> 
            {questions.length > 0 && <span>{questions.length} perguntas</span>} 
          </>)}
        </div>

        <form onSubmit={handleSendQuestion}>
          <textarea 
          placeholder="O que você quer perguntar?"
          onChange={event => setNewQuestion(event.target.value)}
          value={newQuestion}
          />
          
          <div className="form-footer">
            { user ? (
              <div className="user-info">
                <img src={user.avatar} alt={user.name}/>
                <span>{user.name}</span>
              </div>
            ) : (
              <span>Para enviar uma pergunta, <button>faça seu login</button>.</span>
            ) }
            <Button type="submit">
              Enviar pergunta
            </Button>
          </div>
        </form>
      </main>
    </div>
  )
  /* no 'form', 'onChange' observa qualquer mudança que aconteça dentro do 'textarea' e caso haja, 
  seta o novo valor de 'newQuestion' usando 'SetNewQuestion' // 'value={newQuestion}' salva o valor 
  de 'newQuestion' */
  // podemos criar blocos de códigos js dentro do código html, foi isso oq fizemos em '{user ? : }' 
  /* '{user ? : }' é um Operador Ternário. É uma forma curta de escrever, se 'x' for verdadeiro, 
  'y', se não, 'z' // após a '?', vem o bloco de código de quando verdadeiro, e após o ':', o bloco 
  de código de quando for falso */
  // 'questions.length > 0 && ...', '&&' é usado no ternário quando não temos condição para o 'se não'
}