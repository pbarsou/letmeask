/* hook que criamos para armazenar o que há em comum entre a visualização da sala entre o user
e o admin */

import { useEffect, useState } from "react";
import { database } from "../services/firebase";

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

type QuestionType = {
  id: string;
  author: {
    name: string;
    avatar: string;
  }
  content: string;
  isAnswered: boolean; // se a pergunta foi respondida
  isHighlighted: boolean; // se a pergunta foi destacada
};

export function useRoom(roomId: string) {
  const [questions, setQuestions] = useState<QuestionType[]>([]);
  // informamos que 'questions' armazena um array de 'QuestionType' usando generics e que inicia vazio
  const [title, setTitle] = useState('');

  useEffect(() => {
    const roomRef = database.ref(`rooms/${roomId}`);
    // acesso a nossa página no bd

    roomRef.on('value', room => {
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
      /* '.entries' retorna o objeto em formato de array pra gente, e como explicado no 
      'FirebaseQuestions' retorna uma string (id da questão) e um objeto (seu conteúdo) */
      // '.map' para percorrer dentro do array

      setTitle(databaseRoom.title);
      // 'databaseRoom' armazena os dados da nossa página
      // setando o 'title' da nossa sala numa variável já que vamos exibí-lo em tela
      setQuestions(parsedQuestions);
      // setando as questions no nosso array de 'questions'
    })
  }, [roomId])
  // monitora o 'roomId' (nossa sala)
  return { questions, title };
}