import { createContext, ReactNode, useState} from 'react';

type Theme = 'light' | 'dark';

type ThemeContextType = {
  theme: Theme;
  toggleTheme: () => void;
}

type ThemeContextProviderProps = {
  children: ReactNode;
  // quando o que vamos receber é algo que vem do React, seu tipo é 'ReactNode'
}

export const ThemeContext = createContext({} as ThemeContextType);

export function ThemeContextProvider(props: ThemeContextProviderProps) {

  const [theme, setTheme] = useState<Theme>('light');

  function toggleTheme()  {
    setTheme(theme === 'light' ? 'dark' : 'light');
    // se tema estiver em 'light', muda pra 'dark', se 'dark', muda pra 'light'
    console.log(theme);
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme}}>
      {props.children}
    </ThemeContext.Provider>
  );
}
