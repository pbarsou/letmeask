/* componente criado devido a termos botões iguais (2) durante a aplicação, mudando apenas algumas
propriedades */

import { ButtonHTMLAttributes } from "react"; // tipagem de um botão estilo botão HTML

import '../styles/button.scss';

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement>;
// passando tipagem de um botão estilo HTML para 'ButtonProps'

export function Button(props: ButtonProps) { /* props sendo do tipo 'ButtonProps' possui tipagem de 
  um botão HTML */
  return (
    <button className="button" {...props}/>
  )
} // '{...props}' faz com que todas as props sejam repassadas para dentro do botão
  // as 'props' que passamos em 'Home' e 'NewRoom' são apenas o tipo do botão e o seu conteúdo