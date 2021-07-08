// hook responsável por persistir o estado do nosso tema

import { useEffect, useState } from "react";

function usePersistedState(key: string, initialState: any) {
  /* precisamos de uma chave para saber que identificará o que vai ser gravado e um estado inicial
  natural do 'useState' */

  const [state, setState] = useState(() => {
    /* o que setaremos como tema inicial, será o valor já armazenado no local storage se existir.
    Assim, ao atualizarmos a página, o tema irá persistir */

    const storageValue = localStorage.getItem(key);
    // pegando o valor do tema armazenado

    if (storageValue) {
      return JSON.parse(storageValue);
      // usando 'parse' converte de volta para o formato original (antes de virar um JSON)
    } else {
      return initialState;
      // se não existir, o valor inicial será o que foi passado por parâmetro
    }
  });

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(state));
    // salvando informações no nosso 'localStorage'
    // 'JSON.stringify' tentará transformar qualquer tipo de informação que recebermos em 'state' em JSON
  }, [key, state]);
  // nosso 'useEffect' observa/ouve/inspeciona 'key' e 'state'

  return [state, setState];
  // retorno do estado e sua função de modificação

}

export default usePersistedState;