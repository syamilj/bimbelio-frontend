import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useContext,
  useState,
} from 'react';

export default function ChatProvider({ children }: { children: ReactNode }) {
  const [isMinimized, setIsMinimized] = useState(true);

  const Context = {
    isMinimized,
    setIsMinimized,
  };

  return (
    <ChatContext.Provider value={Context}>{children}</ChatContext.Provider>
  );
}

interface ChatContextProps {
  isMinimized: boolean;
  setIsMinimized: Dispatch<SetStateAction<boolean>>;
}

const ChatContext = createContext<ChatContextProps | null>(null);

export const useChatContext = () => {
  const context = useContext(ChatContext);

  if (!context) {
    throw new Error('useChatContext must be use in ChatContext.Provider');
  }

  return context;
};
