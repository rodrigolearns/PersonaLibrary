import { createContext, Dispatch, SetStateAction, useState, ReactNode } from 'react';
import { Message } from '@/types/chat';

interface ButtonContextProps {
  activeButtons: boolean[];
  setActiveButtons: Dispatch<SetStateAction<boolean[]>>;
  messages: Message[];
  setMessages: Dispatch<SetStateAction<Message[]>>;
  loading: boolean;
  setLoading: Dispatch<SetStateAction<boolean>>;
  query: string;
  setQuery: Dispatch<SetStateAction<string>>;
}

const ButtonContext = createContext<ButtonContextProps | undefined>(undefined);

interface ButtonContextProviderProps {
  children: ReactNode;
}

export const ButtonContextProvider: React.FC<ButtonContextProviderProps> = ({ children }) => {
  const [activeButtons, setActiveButtons] = useState<boolean[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [query, setQuery] = useState<string>('');

  return (
    <ButtonContext.Provider
      value={{ activeButtons, setActiveButtons, messages, setMessages, loading, setLoading, query, setQuery }}
    >
      {children}
    </ButtonContext.Provider>
  );
};

export default ButtonContext;
