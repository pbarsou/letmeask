import { ReactNode } from 'react';
import './style.scss';

type QuestionProps = {
  content: string;
  author: {
    name: string;
    avatar: string;
  };
  children?: ReactNode;
  // que recebe os nossos botões de interação com as perguntas tanto no lado do usuário quanto do admin
  /* 'ReactNode' é um tipo que serve para diversas coisas existentes no 'React', ou mesmo para
  qualquer coisa aceitável num return, desde um ou mais componentes á código html */
  isAnswered?: boolean;
  isHighlighted?: boolean;
}

export function Question({ 
  content, 
  author, 
  children, 
  isAnswered = false, // valor padrão
  isHighlighted = false, // valor padrão
}: QuestionProps) {
  return (
    <div className={`question ${isAnswered ? 'answered' : ''} ${isHighlighted && !isAnswered ? 'highlighted' : ''}`}>
      <p>{content}</p>
      <footer>
        <div className="user-info">
          <img src={author.avatar} alt={author.name}/>
          <span>{author.name}</span>
        </div>
        <div>
          {children}
        </div>
      </footer>
    </div>
  )

  /* '{`question ${isAnswered ? 'answered' : ''} ${isHighlighted ? 'highlighted' : ''}' insere uma 
  nova classe 'answered' além da 'question' caso 'isAnswered' seja true, senão, insere ' '' ' . 
  O mesmo acontece com 'highlighted'. */
  // 'isHighlighted && !isAnswered' porque só deve permanecer com o highlight se não estiver respondida
}