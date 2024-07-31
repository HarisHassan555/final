import React, { useState } from "react";
import axios from "axios";
import "./App.css";
import "@chatscope/chat-ui-kit-styles/dist/default/styles.min.css";
import {
  MainContainer,
  ChatContainer,
  MessageList,
  Message,
  MessageInput,
  TypingIndicator,
} from "@chatscope/chat-ui-kit-react";

function App() {
  const [clicked, setClicked] = useState(false);
  const [messages, setMessages] = useState([
    {
      message: "Hello I am ChatGPT",
      sender: "ChatGPT",
      direction: "incoming",
    },
  ]);
  const [typing, setTyping] = useState(false);

  const handleSend = async (message) => {
    const newMessage = {
      message: message,
      sender: "user",
      direction: "outgoing",
    };

    setMessages([...messages, newMessage]);
    setTyping(true);

    try {
      // Post to the backend
      const response = await axios.post(
        "https://backend-new-phi.vercel.app/property",
        {
          query: message,
        }
      );
      console.log(response.data.response);
      const newResponse = response.data.response;
      const chatGPTResponse = {
        message: newResponse, // Adjust this according to the actual response structure
        sender: "ChatGPT",
        direction: "incoming",
      };

      setMessages((prevMessages) => [...prevMessages, chatGPTResponse]);
      setTyping(false);
    } catch (error) {
      console.error("There was an error submitting the query!", error);
      setTyping(false);
    }
  };
  let Query = "this a grey coloured building that has 6 stories it has 36 rooms 6 on each floor and it has the capacity to accommodate roughly 144 people at a time cost of resting a room may vary from 45000 pkr to 65000 pkr per month"; 

  const handleClick = async (value) => {
    if (value === "Home") {
      try {
        const response = await axios.post(
          "https://backend-new-phi.vercel.app/property",
          {
            query: Query,
          }
        );
        console.log(response.data.response);
        
      } catch (error) {
        console.error("There was an error submitting the query!", error);
        setTyping(false);
      }

      setClicked(true);
    } else if (value === "cross") {
      setClicked(false);
    }
  };

  return (
    <>
    <div className="absolute z-50">
    <i onClick={() => handleClick("Home")} className="fa-solid fa-message"></i>
    </div>

      {clicked && (
        <div className="relative h-[92vh] w-screen">
          <div className="m-auto p-auto h-10">
            <h1>PropertyVisAR</h1>
            <i
              onClick={() => handleClick("cross")}
              className="fas fa-times absolute z-50 top-4 right-4" // Corrected class name from 'fa-cross' to 'fa-times'
            ></i>
          </div>

          <MainContainer>
            <ChatContainer>
              <MessageList
                typingIndicator={
                  typing ? (
                    <TypingIndicator content="ChatGPT is typing" />
                  ) : null
                }
              >
                {messages.map((message, i) => (
                  <Message key={i} model={message} />
                ))}
              </MessageList>
              <MessageInput
                placeholder="Type message here"
                onSend={handleSend}
              />
            </ChatContainer>
          </MainContainer>
        </div>
      )}
    </>
  );
}

export default App;
