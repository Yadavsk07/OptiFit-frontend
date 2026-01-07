import { useState, useEffect, useRef } from "react";
import { MessageCircle, Send, X } from "lucide-react";
import { chatAPI } from "../services/api";

const initialMessage = {
  role: "assistant",
  content:
    "Hi! I'm your OptiFit assistant. Ask me anything about workouts, exercises, or nutrition 💪"
};

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([initialMessage]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [contextType, setContextType] = useState("general");
  const [applyChanges, setApplyChanges] = useState(false);

  const messagesEndRef = useRef(null);

  // 🔥 Clear chat when opened
  useEffect(() => {
    if (isOpen) {
      setMessages([initialMessage]);
      setInput("");
      setApplyChanges(false);
      setContextType("general");
    }
  }, [isOpen]);

  // Scroll to bottom when messages update
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const userMsg = { role: "user", content: input };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const res = await chatAPI.sendMessage({
        message: input,
        contextType: contextType === "general" ? null : contextType,
        applyChanges: applyChanges && contextType !== "general"
      });

      const assistantContent = res.data.reply || "Sorry, I didn't understand that.";

      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: assistantContent }
      ]);

      // Notify frontend if plan was updated
      if (res.data.updatedPlan) {
        window.dispatchEvent(
          new CustomEvent("planUpdated", {
            detail: { type: contextType, plan: res.data.updatedPlan }
          })
        );
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: "✅ Plan updated successfully." }
        ]);
      }
    } catch (err) {
      console.error("Chat error:", err);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "⚠️ Something went wrong. Please try again." }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Chat Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 bg-indigo-600 text-white p-4 rounded-full shadow-lg hover:scale-110 transition z-50"
        >
          <MessageCircle size={26} />
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 w-96 h-[600px] bg-white rounded-xl shadow-2xl flex flex-col z-50">
          {/* Header */}
          <div className="bg-indigo-600 text-white p-4 flex justify-between items-center">
            <h3 className="font-semibold">OptiFit Assistant</h3>
            <button onClick={() => setIsOpen(false)}>
              <X />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
            {messages.map((m, i) => (
              <div
                key={i}
                className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`px-4 py-2 rounded-lg max-w-[80%] break-words ${
                    m.role === "user" ? "bg-indigo-600 text-white" : "bg-white border border-gray-200"
                  }`}
                >
                  {m.content}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
            {loading && (
              <div className="text-gray-400 italic">Typing...</div>
            )}
          </div>

          {/* Input */}
          <div className="border-t p-3 bg-white">
            <div className="flex gap-2 mb-2">
              <select
                value={contextType}
                onChange={(e) => setContextType(e.target.value)}
                className="border p-1 rounded"
              >
                <option value="general">General</option>
                <option value="workout">Workout</option>
                <option value="diet">Diet</option>
              </select>

              <label className="text-sm flex items-center gap-1">
                <input
                  type="checkbox"
                  checked={applyChanges}
                  onChange={(e) => setApplyChanges(e.target.checked)}
                  disabled={contextType === "general"}
                />
                Apply changes
              </label>
            </div>

            <div className="flex gap-2">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                placeholder="Ask me anything about fitness..."
                className="flex-1 border rounded p-2"
              />
              <button
                onClick={sendMessage}
                disabled={loading || !input.trim()}
                className="bg-indigo-600 text-white p-2 rounded hover:bg-indigo-700 transition"
              >
                <Send size={18} />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ChatBot;
