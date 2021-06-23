import { ButtonHTMLAttributes } from "react"; // tipagem de um botão estilo botão HTML

import '../styles/button.scss';

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement>;

export function Button(props: ButtonProps) { /* props sendo do tipo 'ButtonProps' possui tipagem de 
  um botão HTML */
  return (
    <button className="button" {...props}/>
  );
} // '{...props}' faz com que todas as props sejam repassadas para dentro do botão