import { useParams } from 'react-router-dom';

import logoImg from '../assets/images/logo.svg';

import { Button } from '../components/Button';
import { Question } from '../components/Question';
import { RoomCode } from '../components/RoomCode';
// import { useAuth } from '../hooks/useAuth';
import { useRoom } from '../hooks/useRoom';

import '../styles/room.scss';

type RoomParams = {
  id: string;
}

export function AdminRoom() {

  // const { user } = useAuth();
  // pegando 'user' da resposta do 'AuthContext' 

  const params = useParams<RoomParams>();
  // 'useParams' nos devolve os parâmetros da rota (o que vem depois do '/')
  // '< >' uso de generics para que a função saiba quais os parâmetros que ela irá receber
  const roomId = params.id;

  const { title, questions}= useRoom(roomId);
  /* usando o hook que criamos para armazenar o que há em comum entre a visualização da sala entre
  o user e o admin */

  return (
    <div id="page-room">
      <header>
        <div className="content">
          <img src={logoImg} alt="Letmeask"/>
          <div>
            <RoomCode code={roomId}/>
            <Button isOutlined>Encerrar sala</Button>
          </div>
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
        
        <div className="question-list">
          {questions.map(question => {
            return (
              <Question
                key={question.id} 
                content={question.content}
                author={question.author}
              />
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