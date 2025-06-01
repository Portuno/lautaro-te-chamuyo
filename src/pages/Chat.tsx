import NavigationBar from "@/components/NavigationBar";
import { ChatConfigProvider } from "@/hooks/useChatConfig";
import { MabotChat } from "../components/MabotChat";

const Chat = () => {
  return (
    <ChatConfigProvider>
      <div className="min-h-screen">
        <NavigationBar />
        <MabotChat />
      </div>
    </ChatConfigProvider>
  );
};

export default Chat;
