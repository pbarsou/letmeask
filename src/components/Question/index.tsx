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
}

export function Question({ content, author, children }: QuestionProps) {
  return (
    <div className="question">
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
}