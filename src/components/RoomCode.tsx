/* componente de 'RoomCode'. Necessário que fosse um componente para que passassemos para que
tivéssemos como passar o código da sala */ 

import copyImg from '../assets/images/copy.svg';

import '../styles/room-code.scss';

type RoomCodeProps = {
  code: string;
}

export function RoomCode(props: RoomCodeProps) {
  // recebe como parâmetro o código da sala
  function copyRoomCodeToClipboard() {
    navigator.clipboard.writeText(props.code);
    // copia o texto para a nossa área de transferência (ctrl + c)
  }

  return (
    <button className="room-code" onClick={copyRoomCodeToClipboard}>
      <div>
        <img src={copyImg} alt="Copy room code"/>
      </div>
      <span>Sala #{props.code}</span>
    </button>
  )
}