import React, { useState, useCallback, useEffect } from "react";
import useWebSocket, { ReadyState } from "react-use-websocket";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";

export const App = () => {
  // const [socketUrl, setSocketUrl] = useState("wss://echo.websocket.org");
  const [socketUrl, setSocketUrl] = useState("ws://localhost:8001");
  const [messageHistory, setMessageHistory] = useState<MessageEvent<any>[]>([]);

  const { sendMessage, lastMessage, readyState } = useWebSocket(socketUrl);

  useEffect(() => {
    if (lastMessage !== null) {
      // setMessageHistory((prev) => prev.concat(lastMessage));
      // toast(JSON.stringify(lastMessage, null, 2));
      const { data } = lastMessage;
      toast(data);
      console.table({ lastMessage });
      setMessageHistory((prev) => [lastMessage, ...prev].slice(0, 200));
    }
  }, [lastMessage, setMessageHistory]);

  const handleClickChangeSocketUrl = useCallback(
    () => setSocketUrl("wss://demos.kaazing.com/echo"),
    []
  );

  const handleClickSendMessage = useCallback(() => sendMessage("Hello"), []);
  const handleAddJob = useCallback(
    async () => await axios.post("http://localhost:8001/job", {}),
    []
  );
  const connectionStatus = {
    [ReadyState.CONNECTING]: "Connecting",
    [ReadyState.OPEN]: "Open",
    [ReadyState.CLOSING]: "Closing",
    [ReadyState.CLOSED]: "Closed",
    [ReadyState.UNINSTANTIATED]: "Uninstantiated",
  }[readyState];

  return (
    <div>
      <div>
        <button onClick={handleClickChangeSocketUrl}>
          Click Me to change Socket Url
        </button>
        <button
          onClick={handleClickSendMessage}
          disabled={readyState !== ReadyState.OPEN}
        >
          Click Me to send 'Hello'
        </button>
      </div>
      <div>
        <button onClick={handleAddJob}>add background job</button>
      </div>
      <span>The WebSocket is currently {connectionStatus}</span>
      {lastMessage ? <span>Last message: {lastMessage.data}</span> : null}
      <ul>
        {messageHistory.map((message, idx) => (
          <li key={idx}>
            <span>{message ? message.data : null}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};
