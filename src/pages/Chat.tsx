import { ChatConfigProvider } from "@/hooks/useChatConfig";
import { MabotChat } from "../components/MabotChat";

const Chat = () => {
  return (
    <ChatConfigProvider>
      <div className="min-h-screen">
        <MabotChat />
      </div>
    </ChatConfigProvider>
  );
};

export default Chat;
