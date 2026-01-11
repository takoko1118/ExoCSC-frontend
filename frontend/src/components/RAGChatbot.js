import React, { useState, useEffect, useRef } from "react";
import axios from "axios";

const QUICK_SEARCH = [
  { label: "Breast CSC", value: "Breast CSC", color: "#2e3e93" },
  { label: "Colon CSC", value: "Colon CSC", color: "#d9534f" },
  { label: "Lung RNA", value: "Lung RNA", color: "#f0ad4e" },
  { label: "Colon CSC Lipid", value: "Colon CSC Lipid", color: "#5bc0de" },
  { label: "PC-3", value: "PC-3", color: "#5cb85c" },
];

// 🔹 修改成你的 Django RAG API URL
const RAG_API_URL = "http://172.16.146.196:8000/api/lit-search/";

const RAGChatbot = () => {
  const [messages, setMessages] = useState([
    {
      role: "bot",
      text: "Hello! I am ExCSC RAG Assistant. Ask me questions and I will retrieve answers from the database 😊",
    },
  ]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  const sendMessage = async (textToSend) => {
    const messageText = textToSend || input;
    if (!messageText.trim()) return;

    // 1️⃣ 加入使用者訊息
    setMessages((prev) => [...prev, { role: "user", text: messageText }]);
    setInput("");

    // 2️⃣ 呼叫 Django RAG API
    try {
      const response = await axios.post(
        RAG_API_URL,
        { message: messageText },
        { timeout: 60000 } // 60秒
      );

      const botReplyRaw = response.data.reply || "抱歉，找不到相關文獻。";

      // 3️⃣ 將 reply 拆行，保留文獻來源格式
      const formatted = botReplyRaw.split("\n").map((line, idx) => {
        const match = line.match(/^\*\*\[([^\]]+)\]\*\*/); // 文獻來源格式 **[source]**
        if (match) {
          const sourceName = match[1];
          return (
            <div
              key={idx}
              style={{
                margin: "4px 0",
                padding: "4px 8px",
                backgroundColor: "#f5f5f5",
                borderLeft: "4px solid #2e3e93",
                borderRadius: "4px",
              }}
            >
              <strong>[{sourceName}]</strong> {line.replace(`**[${sourceName}]**`, "")}
            </div>
          );
        }
        return <div key={idx}>{line}</div>;
      });

      setMessages((prev) => [...prev, { role: "bot", text: formatted }]);
    } catch (error) {
      console.error("RAG API Error:", error);

      let errorMsg = "Connection failed. Please check if the backend RAG server is running.";
      if (error.response) {
        errorMsg = `Server returned error ${error.response.status}: ${error.response.statusText}`;
      } else if (error.request) {
        errorMsg = "No response from server. Possible CORS/network issue.";
      }

      setMessages((prev) => [...prev, { role: "bot", text: errorMsg }]);
    }
  };

  return (
    <div style={styles.outerWrapper}>
      <div style={styles.container}>
        <div style={styles.header}>ExCSC RAG Chatbot</div>

        <div style={styles.msgBox}>
          {messages.map((m, i) => (
            <div
              key={i}
              style={{
                ...styles.msg,
                alignSelf: m.role === "user" ? "flex-end" : "flex-start",
                background: m.role === "user" ? "#DCF8C6" : "#EAEAEA",
              }}
            >
              {m.text}
            </div>
          ))}
          <div ref={messagesEndRef} style={{ height: "1px" }} />
        </div>

        <div style={{ padding: "10px" }}>
          <span style={{ marginRight: "10px", fontWeight: "bold" }}>Quick Search:</span>
          {QUICK_SEARCH.map((btn, idx) => (
            <button
              key={idx}
              style={{
                backgroundColor: btn.color,
                color: "white",
                border: "none",
                borderRadius: "20px",
                padding: "8px 15px",
                marginRight: "8px",
                cursor: "pointer",
                fontWeight: "bold",
              }}
              onClick={() => sendMessage(btn.value)}
            >
              {btn.label}
            </button>
          ))}
        </div>

        <div style={styles.inputArea}>
          <input
            style={styles.input}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && sendMessage()}
            placeholder="Ask something (e.g. 'lung CSC', 'breast gene', 'CD44')"
          />
          <button style={styles.button} onClick={() => sendMessage()}>
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

const styles = {
  outerWrapper: { width: "100%", maxWidth: "900px", margin: "20px auto", display: "flex", flexDirection: "column", alignItems: "center" },
  container: { width: "100%", height: "550px", backgroundColor: "white", border: "2px solid #2e3e93", borderRadius: "12px", display: "flex", flexDirection: "column", boxShadow: "0 8px 20px rgba(0,0,0,0.12)", overflow: "hidden" },
  header: { padding: "12px", backgroundColor: "#2e3e93", color: "white", fontSize: "18px", fontWeight: "bold", textAlign: "center" },
  msgBox: { flex: 1, padding: "15px", overflowY: "auto", display: "flex", flexDirection: "column" },
  msg: { margin: "8px", padding: "10px 16px", borderRadius: "18px", maxWidth: "85%", fontSize: "16px", lineHeight: "1.5", whiteSpace: "pre-wrap", wordBreak: "break-word", boxShadow: "0 2px 4px rgba(0,0,0,0.05)" },
  inputArea: { display: "flex", borderTop: "1px solid #eee", padding: "15px", backgroundColor: "#fafafa" },
  input: { flex: 1, border: "1px solid #ddd", borderRadius: "8px", padding: "10px 15px", fontSize: "15px" },
  button: { marginLeft: "12px", backgroundColor: "#2e3e93", color: "white", border: "none", borderRadius: "8px", padding: "10px 25px", cursor: "pointer", fontWeight: "bold", fontSize: "15px" },
};

export default RAGChatbot;
