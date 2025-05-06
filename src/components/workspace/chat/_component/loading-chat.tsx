//src/app/(user)/user/chat/_component/loading-chat.tsx
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Card } from '@/components/ui/card';
import { TextShimmer } from '@/components/ui/text-shimer';
import { getDate, getHours } from '@/lib/utils';
import { BotMessageSquareIcon } from 'lucide-react';
import ChatTools from './chat-tools';

const LoadingChat = () => {
  // const getHours = (date: Date) =>
  //   date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  // const getDate = (date: Date) => date.toLocaleDateString();

  return (
    <Card className="rounded-xl shadow-none bg-transparent mt-4 w-fit">
      <div className="p-4">
        <div className="flex items-start gap-2">
          <Avatar className="h-8 w-8">
            <AvatarFallback className="bg-blue-50 border">
              <BotMessageSquareIcon className="h-5 w-5 text-blue-500" />
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col flex-1">
            <div className="relative justify-between items-center mb-2">
              <p className="font-semibold text-sm">Bimbelio</p>
              <span className="absolute -top-2 left-[-20px] bg-red-500 rounded-full px-[0.35rem] py-1 text-white font-bold text-[0.5rem]">
                AI
              </span>
              <p className="text-xs text-muted-foreground">
                {getHours(new Date())} | {getDate(new Date())}
              </p>
            </div>
            <TextShimmer>Thinking...</TextShimmer>
            <div className="mt-4 flex justify-between items-center text-sm text-muted-foreground">
              <ChatTools role="assistant" />
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default LoadingChat;
