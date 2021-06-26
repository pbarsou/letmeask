import { FormEvent, useState } from 'react';
import { useParams } from 'react-router-dom';

import logoImg from '../assets/images/logo.svg';

import { Button } from '../components/Button';
import { Question } from '../components/Question';
import { RoomCode } from '../components/RoomCode';
import { useAuth } from '../hooks/useAuth';
import { useRoom } from '../hooks/useRoom';

import { database } from '../services/firebase';

import '../styles/room.scss';

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
}