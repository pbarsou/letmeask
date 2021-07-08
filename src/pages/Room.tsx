import { FormEvent, useState } from 'react';
import { useParams } from 'react-router-dom';

import logoImg from '../assets/images/logo.svg';
import logoDark from '../assets/images/logo-dark.svg';

import { Button } from '../components/Button';
import { Question } from '../components/Question';
import { RoomCode } from '../components/RoomCode';
import { useAuth } from '../hooks/useAuth';
import { useRoom } from '../hooks/useRoom';

import { database } from '../services/firebase';

import { Toggle } from '../components/Toggle';

import '../styles/room.scss';

import { useContext } from 'react';
import { ThemeContext } from '../contexts/ThemeContext';

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
  const { title, questions}= useRoom(roomId);
  /* usando o hook que criamos para armazenar o que há em comum entre a visualização da sala entre
  o user e o admin */

  async function handleSendQuestion(event: FormEvent) {
  // função para lidar com a criação de perguntas
    event.preventDefault();

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

  async function handleLikeQuestion(questionId: string, likeId: string | undefined) {
    if (likeId) {
    /* se existe um 'likeId' (lembrando que 'likeId' só existirá se o 'id' do autor do like for igual 
    ao 'id' do usuário autenticado) */
      await database.ref(`/rooms/${roomId}/questions/${questionId}/likes/${likeId}`).remove();
      // deletando o like
    } else {
        await database.ref(`/rooms/${roomId}/questions/${questionId}/likes`).push({
          authorId: user?.id,
        })
        // criando 'likes' em 'questions' no nosso bd, com propriedade 'authorId'
        // 'authorId' vai nos ajudar a saber quem deu o like
      }
  }

  const { theme } = useContext(ThemeContext);

  return (
      <div id="page-room" className={theme}>   
        <header>
          <div className="content">
            <img src={theme === 'light' ? logoImg : logoDark} alt="Letmeask"/>
            <RoomCode code={roomId}/>
          </div>
        </header>

        <Toggle />

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
          
          <div className="question-list">
            {questions.map(question => {
              return (
                <Question
                  key={question.id} 
                  content={question.content}
                  author={question.author}
                  isAnswered={question.isAnswered}
                  isHighlighted={question.isHighlighted}
                >
                  { !question.isAnswered && (
                    <button
                    className={`like-button ${question.likeId ? 'liked' : ''} `}
                    type="button"
                    aria-label="Marcar como gostei"
                    onClick={() => handleLikeQuestion(question.id, question.likeId)}
                    >
                      { question.likeCount > 0 && <span>{question.likeCount}</span> }
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M7 22H4C3.46957 22 2.96086 21.7893 2.58579 21.4142C2.21071 21.0391 2 20.5304 2 20V13C2 12.4696 2.21071 11.9609 2.58579 11.5858C2.96086 11.2107 3.46957 11 4 11H7M14 9V5C14 4.20435 13.6839 3.44129 13.1213 2.87868C12.5587 2.31607 11.7956 2 11 2L7 11V22H18.28C18.7623 22.0055 19.2304 21.8364 19.5979 21.524C19.9654 21.2116 20.2077 20.7769 20.28 20.3L21.66 11.3C21.7035 11.0134 21.6842 10.7207 21.6033 10.4423C21.5225 10.1638 21.3821 9.90629 21.1919 9.68751C21.0016 9.46873 20.7661 9.29393 20.5016 9.17522C20.2371 9.0565 19.9499 8.99672 19.66 9H14Z" stroke="#737380" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </button> )
                  }
                </Question>
              );
            })}
          </div>
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
  /* 'key={question.id}' necessária quando usamos '.map' no react. Usada para identificar qual a 
  informação única entre as perguntas */
  // button de like sendo passado como 'children' no componente de 'Question'
  /* quando vamos indicar uma função pro 'onClick' e ela espera um parâmetro, deve ser passada numa 
  como função anônima no formato de arrow function */
  /* '{`like-button ${question.hasLiked ? 'liked' : ''} `}}' insere uma nova classe 'liked' além 
  da 'like-button' caso 'question.hasLiked' seja true, senão, insere ' '' ' */
}