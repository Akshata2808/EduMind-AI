import { useNavigate } from 'react-router-dom';
import { ChatBubbleOvalLeftEllipsisIcon } from '@heroicons/react/24/outline';

const ChatFloatingButton = () => {
  const nav = useNavigate();
  const goChat = () => nav('/ai');
  return (
    <button onClick={goChat} aria-label="Open AI chat" className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-full bg-palegreen/95 px-4 py-3 shadow-lg backdrop-blur transition hover:scale-105">
      <ChatBubbleOvalLeftEllipsisIcon className="h-5 w-5 text-slate-900" />
      <span className="hidden md:inline font-medium text-slate-900">AI Chat</span>
    </button>
  );
};

export default ChatFloatingButton;
