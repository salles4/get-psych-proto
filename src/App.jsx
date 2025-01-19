import { useEffect, useState } from 'react'
import './App.css'
import { PencilRuler, SendHorizontal } from 'lucide-react'
import parse from 'html-react-parser'
import Loader from './Loader';
import { addMessage } from './supabase';

function App() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    console.log(localStorage.getItem("messages"));
    const localMessages = localStorage.getItem('messages') || `[{"sender":"ai", "message": "Hey there, future psychologist! 👋 I'm your friendly GetPsyched! chatbot, here to help you ace your studies. Ready to get psyched for your reviews?"}]`
    setMessages(JSON.parse(localMessages))
    scrollDown()
  }, [])
  const sendMessage = () => {
    setLoading(true)
    scrollDown();
    sendAI();
  }
  const sendAI = () => {
    fetch("https://get-psych-backend.vercel.app/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: input,
      }),
    }).then(response => response.json())
    .then(data => {
      console.log(data);
      
      const aiChat = formatAIText(data.response);
      const newMessagesList = [
        ...messages,
        {
          sender: "user",
          message: input,
          time: `${new Date()}`,
        },
        {
          sender: "ai",
          message: aiChat,
          time: `${new Date()}`,
        },
      ];
      console.log(newMessagesList);
      
      localStorage.setItem('messages', JSON.stringify(newMessagesList));
      setMessages(newMessagesList);
      setInput('')
      setLoading(false);
      addMessage(input, aiChat)
      scrollDown();
    })
    .catch(error => console.error(error)
    )
  }
  const formatAIText = (message) => {
    return message
      .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
      .replace(/\*(.+?)/g, '<b class="pt-6">• </b>')
      .replace(/\n/g, "<br>");
  }
  const scrollDown = () => {
    const chatArea = document.getElementById("chat-area");
    // const chatArea = document;
    chatArea.scrollTop = chatArea.scrollTopMax;
  }
  const clearChat = () => {
    localStorage.removeItem("messages");
    setMessages([])
  }
  return (
    <div className="min-h-[100svh] flex-col flex sm:max-w-[640px] mx-auto border">
      <div className="p-6 pb-4 flex items-center justify-between gap-2 sticky top-0 border-b border-s z-10 bg-white">
        <div className="text-2xl font-bold flex items-center gap-2">
          GetPsych
          <PencilRuler />
        </div>
        <button className="btn btn-error btn-sm" onClick={clearChat}>
          Clear Chat
        </button>
      </div>
      <div className="flex-grow px-4 overflow-y-auto" id="chat-area">
        {messages.map(({ message, sender }, index) => (
          <div
            key={index}
            className={`chat ${sender == "user" ? "chat-end" : "chat-start"}`}
          >
            <div
              className={`chat-bubble lg:max-w-[40rem] sm:max-w-[80%] max-w-full ${
                sender == "user"
                  ? "bg-yellow-300 text-black"
                  : "bg-primary text-white"
              } `}
            >
              {sender == "user" ? message : parse(message)}
            </div>
          </div>
        ))}
      </div>
      {loading ? <Loader /> : <></>}

      <div className="message-area flex items-center p-4 gap-4 sticky bottom-0 bg-white">
        <textarea
          rows="4"
          className="flex-grow text-black textarea-bordered textarea"
          placeholder="Type your message here..."
          disabled={loading}
          value={input}
          onChange={(e) => {
            console.log(e.target.value);
            setInput(e.target.value);
          }}
        ></textarea>
        <button className="btn btn-primary" onClick={sendMessage} disabled={loading}>
          <SendHorizontal />
        </button>
      </div>
    </div>
  );
}

export default App
