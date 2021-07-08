/* componente criado devido a termos botões iguais (2) durante a aplicação, mudando apenas algumas
propriedades */

import { ButtonHTMLAttributes } from "react"; // tipagem de um botão estilo botão HTML

import '../styles/button.scss';


type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  isOutlined?: boolean;
};
// passando tipagem de um botão estilo HTML para 'ButtonProps' + propriedade adicional

export function Button({ isOutlined, ...props }: ButtonProps) { 
  // '...props' (pega todo o restante das props) do tipo 'ButtonProps' possui tipagem de um botão HTML 
  // 'isOutlined' verifica se é o botão da 'room' por visualização do admin
  
  return (
    <button className={`button ${isOutlined ? 'outlined' : ''} `} 
    {...props}
    />
  )
} // '{...props}' faz com que todas as props sejam repassadas para dentro do botão
  // as 'props' que passamos em 'Home' e 'NewRoom' são apenas o tipo do botão e o seu conteúdo
  /* '{`button ${isOutlined ? 'outlined' : ''}`}' insere uma nova classe 'outlined' além da 'button'
  caso receba a propriedade 'isOutlined' como true, senão, insere ' '' ' */