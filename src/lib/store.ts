import { create } from 'zustand';

// Jembatan antara PDF reader dan panel chat: PDF reader mengirim teks pilihan
// ke chat yang sedang terbuka.
interface ChatMessageStore {
  sendMessage: null | ((message: string) => void);
  setSendMessage: (sendMessage: (message: string) => void) => void;
}

export const useChatStore = create<ChatMessageStore>((set) => ({
  sendMessage: null,
  setSendMessage: (sendMessage) => set({ sendMessage }),
}));
