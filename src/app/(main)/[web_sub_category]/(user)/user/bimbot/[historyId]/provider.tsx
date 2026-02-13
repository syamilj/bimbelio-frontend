import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';

export default function ChatProvider({ children }: { children: ReactNode }) {
  const [isMinimized, setIsMinimized] = useState(true); // Start minimized on mobile
  // Counter that increments when chat history should be refreshed (e.g. AI-generated title)
  const [historyVersion, setHistoryVersion] = useState(0);

  const refreshHistory = useCallback(() => {
    setHistoryVersion((v) => v + 1);
  }, []);

  // Handle responsive behavior
  useEffect(() => {
    const handleResize = () => {
      // On mobile, keep current state
      // On desktop, sidebar is always visible (not minimized)
      if (window.innerWidth >= 768) {
        // Desktop - sidebar always visible, but we keep the state for mobile switching
        return;
      }
      // Mobile - keep current minimized state
    };

    // Set initial state
    handleResize();

    // Listen for resize events
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const Context = {
    isMinimized,
    setIsMinimized,
    historyVersion,
    refreshHistory,
  };

  return (
    <ChatContext.Provider value={Context}>{children}</ChatContext.Provider>
  );
}

interface ChatContextProps {
  isMinimized: boolean;
  setIsMinimized: Dispatch<SetStateAction<boolean>>;
  historyVersion: number;
  refreshHistory: () => void;
}

const ChatContext = createContext<ChatContextProps | null>(null);

export const useChatContext = () => {
  const context = useContext(ChatContext);

  if (!context) {
    throw new Error('useChatContext must be use in ChatContext.Provider');
  }

  return context;
};
