import { useHistory, useParams } from 'react-router-dom';

import logoImg from '../assets/images/logo.svg';
import logoDark from '../assets/images/logo-dark.svg';
import deleteImg from '../assets/images/delete.svg';
import checkImg from '../assets/images/check.svg';
import answerImg from '../assets/images/answer.svg';

import { Button } from '../components/Button';
import { Question } from '../components/Question';
import { RoomCode } from '../components/RoomCode';
import { useRoom } from '../hooks/useRoom';

import { database } from '../services/firebase';

import '../styles/room.scss';

import { useContext } from 'react';
import { ThemeContext } from '../contexts/ThemeContext';
import { Toggle } from '../components/Toggle';

type RoomParams = {
  id: string;
}

export function AdminRoom() {

  // const { user } = useAuth();
  // pegando 'user' da resposta do 'AuthContext' 

  const history = useHistory();
  const params = useParams<RoomParams>();
  // 'useParams' nos devolve os parâmetros da rota (o que vem depois do '/')
  // '< >' uso de generics para que a função saiba quais os parâmetros que ela irá receber
  const roomId = params.id;

  const { title, questions}= useRoom(roomId);
  /* usando o hook que criamos para armazenar o que há em comum entre a visualização da sala entre
  o user e o admin */

  async function handleEndRoom() {
  // função para lidar com finalização da sala
    await database.ref(`/rooms/${roomId}`).update({
      closedAt: new Date(),
      // a página passa a ter como informação apenas o 'endedAt', que é a data em que foi finalizada
    });

    history.push('/');
    // leva o usuário até a home page
  }

  async function handleDeleteQuestion(questionId: string) {
  // função para lidar com remoção de uma questão
    if (window.confirm('Tem certeza que você deseja excluir essa pergunta?')) {
      await database.ref(`/rooms/${roomId}/questions/${questionId}`).remove();
      // remove a 'question'
    }
  }

  async function handleCheckQuestionAsAnswered(questionId: string) {
    await database.ref(`/rooms/${roomId}/questions/${questionId}`).update({
      isAnswered: true,
      // damos um update setando como true
    });
  }

  async function handleHighlightQuestion(questionId: string) {
    await database.ref(`/rooms/${roomId}/questions/${questionId}`).update({
      isHighlighted: true,
      // damos um update setando como true
    });
  }

  const { theme } = useContext(ThemeContext);

  return (
      <div id="page-room" className={theme}>
        <header>
          <div className="content">
            <img src={theme === 'light' ? logoImg : logoDark} alt="Letmeask"/>
            <div>
              <RoomCode code={roomId}/>
              <Button isOutlined onClick={handleEndRoom}>Encerrar sala</Button>
            </div>
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
                  <>
                    <button
                      type="button"
                      onClick={() => handleCheckQuestionAsAnswered(question.id)}
                    >
                      <img src={checkImg} alt="Marcar pergunta como respondida"/>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleHighlightQuestion(question.id)}
                    >
                      <img src={answerImg} alt="Dar destaque a pergunta"/>
                    </button>
                  </>)}
                  
                  <button
                    type="button"
                    onClick={() => handleDeleteQuestion(question.id)}
                  >
                    <img src={deleteImg} alt="Remove pergunta"/>
                  </button>
                </Question>
              );
            })}
          </div>
        </main>
      </div>
  )
  // 'questions.length > 0 && ...', '&&' é usado no ternário quando não temos condição para o 'se não'
  /* 'key={question.id}' necessária quando usamos '.map' no react. Usada para identificar qual a 
  informação única entre as perguntas */
}