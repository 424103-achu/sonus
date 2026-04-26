import { useEffect, useMemo, useState } from "react";
import { Trash2 } from "lucide-react";
import Navbar from "./components/Navbar";
import Footer from "../auth_pages/components/Footer";
import { useAuth } from "../../hooks/useAuth";
import { getChats, getChatMessages, sendChatMessage, deleteChatMessage } from "../../services/chatService";
import { getRealtimeSocket } from "../../realtime/socket";

function ChatPage() {
  const { user } = useAuth();

  const [threads, setThreads] = useState([]);
  const [activeFriendId, setActiveFriendId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loadingThreads, setLoadingThreads] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");

  const activeThread = useMemo(
    () => threads.find((item) => Number(item.friend_id) === Number(activeFriendId)) || null,
    [threads, activeFriendId]
  );

  const activeTitle = activeThread
    ? activeThread.friend_first_name || activeThread.friend_username
    : "Select a friend";

  const reloadThreads = async () => {
    const list = await getChats();
    setThreads(list);
    return list;
  };

  const loadMessages = async (friendId) => {
    setLoadingMessages(true);
    setError("");

    try {
      const data = await getChatMessages(friendId);
      setMessages(data.messages || []);
    } catch (err) {
      const message = err?.response?.data?.message || "Failed to load messages";
      setError(message);
      setMessages([]);
    } finally {
      setLoadingMessages(false);
    }
  };

  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        const list = await reloadThreads();
        if (!mounted) return;

        if (list.length > 0) {
          const firstId = Number(list[0].friend_id);
          setActiveFriendId(firstId);
          await loadMessages(firstId);
        }
      } catch (err) {
        if (mounted) {
          setError(err?.response?.data?.message || "Failed to load chats");
        }
      } finally {
        if (mounted) {
          setLoadingThreads(false);
        }
      }
    })();

    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    if (!activeFriendId) return;

    loadMessages(activeFriendId);
  }, [activeFriendId]);

  useEffect(() => {
    const socket = getRealtimeSocket(user?.user_id);
    if (!socket || !user?.user_id) return;

    const onMessage = (payload) => {
      const currentUserId = Number(user.user_id);
      const senderId = Number(payload.sender_id);
      const recipientId = Number(payload.recipient_id);
      const threadFriendId = senderId === currentUserId ? recipientId : senderId;

      setThreads((prev) => {
        const next = prev.map((item) => {
          if (Number(item.friend_id) !== threadFriendId) return item;

          return {
            ...item,
            last_message: payload.message,
            last_message_at: payload.created_at,
            last_sender_id: payload.sender_id
          };
        });

        next.sort((a, b) => {
          const ta = a.last_message_at ? new Date(a.last_message_at).getTime() : 0;
          const tb = b.last_message_at ? new Date(b.last_message_at).getTime() : 0;
          return tb - ta;
        });

        return next;
      });

      if (Number(activeFriendId) !== threadFriendId) return;

      setMessages((prev) => {
        if (prev.some((m) => Number(m.message_id) === Number(payload.message_id))) {
          return prev;
        }

        return [
          ...prev,
          {
            message_id: payload.message_id,
            chat_id: payload.chat_id,
            sender_id: payload.sender_id,
            message: payload.message,
            created_at: payload.created_at,
            is_mine: senderId === currentUserId
          }
        ];
      });
    };

    const onMessageDeleted = (payload) => {
      setMessages((prev) => prev.filter((m) => Number(m.message_id) !== Number(payload.message_id)));
    };

    socket.on("chat:message", onMessage);
    socket.on("chat:message:deleted", onMessageDeleted);

    return () => {
      socket.off("chat:message", onMessage);
      socket.off("chat:message:deleted", onMessageDeleted);
    };
  }, [user?.user_id, activeFriendId]);

  const handleSend = async () => {
    const trimmed = input.trim();

    if (!activeFriendId || !trimmed || sending) {
      return;
    }

    setSending(true);
    setError("");

    try {
      await sendChatMessage(activeFriendId, trimmed);
      setInput("");
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to send message");
    } finally {
      setSending(false);
    }
  };

  const handleDeleteMessage = async (messageId) => {
    if (!window.confirm("Delete this message?")) {
      return;
    }

    setError("");

    try {
      await deleteChatMessage(activeFriendId, messageId);
      setMessages((prev) => prev.filter((m) => m.message_id !== messageId));
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to delete message");
    }
  };

  const formatTime = (value) => {
    if (!value) return "";

    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "";

    return date.toLocaleString([], {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  return (
    <div className="relative w-full min-h-screen flex flex-col text-white overflow-hidden">
      <div className="absolute inset-0 -z-10 bg-linear-to-b from-black via-[#0b0b0d] to-black"></div>
      <div className="absolute -top-40 -left-40 w-125 h-125 bg-red-600/10 blur-[160px] rounded-full"></div>
      <div className="absolute top-[40%] -right-40 w-125 h-125 bg-red-500/10 blur-[160px] rounded-full"></div>

      <Navbar />

      <main className="flex-1 pt-28 pb-16 px-4 md:px-10">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-5 min-h-[65vh]">
          <aside className="md:col-span-1 rounded-2xl border border-white/10 bg-white/5 backdrop-blur p-4">
            <h2 className="text-xl font-semibold mb-4" style={{ fontFamily: "Sour Gummy" }}>
              Chats
            </h2>

            {loadingThreads ? <p className="text-zinc-400 text-sm">Loading chats...</p> : null}

            {!loadingThreads && threads.length === 0 ? (
              <p className="text-zinc-400 text-sm">
                You can chat only with users who are mutually accepted friends.
              </p>
            ) : null}

            <div className="space-y-2">
              {threads.map((thread) => {
                const isActive = Number(thread.friend_id) === Number(activeFriendId);
                const friendName =
                  thread.friend_first_name || thread.friend_username || `User ${thread.friend_id}`;

                return (
                  <button
                    key={thread.friend_id}
                    onClick={() => setActiveFriendId(Number(thread.friend_id))}
                    className={`w-full text-left rounded-xl px-3 py-3 border transition ${
                      isActive
                        ? "bg-red-600/20 border-red-500/50"
                        : "bg-black/20 border-white/10 hover:bg-white/10"
                    }`}
                  >
                    <p className="font-medium text-white">{friendName}</p>
                    <p className="text-xs text-zinc-400 truncate mt-1">
                      {thread.last_message || "No messages yet"}
                    </p>
                  </button>
                );
              })}
            </div>
          </aside>

          <section className="md:col-span-2 rounded-2xl border border-white/10 bg-white/5 backdrop-blur flex flex-col">
            <div className="p-4 border-b border-white/10">
              <h3 className="text-lg font-semibold">{activeTitle}</h3>
              {activeThread?.last_message_at ? (
                <p className="text-xs text-zinc-400">Last message: {formatTime(activeThread.last_message_at)}</p>
              ) : null}
            </div>

            <div className="flex-1 p-4 space-y-3 overflow-y-auto min-h-80 max-h-[52vh]">
              {loadingMessages ? <p className="text-zinc-400 text-sm">Loading messages...</p> : null}

              {!loadingMessages && activeFriendId && messages.length === 0 ? (
                <p className="text-zinc-400 text-sm">Start the conversation.</p>
              ) : null}

              {messages.map((message) => (
                <div
                  key={message.message_id}
                  className={`flex items-end gap-2 group ${message.is_mine ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`w-fit max-w-[70%] rounded-xl px-3 py-2 ${
                      message.is_mine
                        ? "bg-red-600 text-white"
                        : "bg-white/10 text-zinc-100"
                    }`}
                  >
                    <p className="text-sm whitespace-pre-wrap wrap-break-word">{message.message}</p>
                    <p className="text-[11px] opacity-70 mt-1 text-right">{formatTime(message.created_at)}</p>
                  </div>
                  {message.is_mine ? (
                    <button
                      onClick={() => handleDeleteMessage(message.message_id)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:text-red-400 text-zinc-400"
                      title="Delete message"
                    >
                      <Trash2 size={16} />
                    </button>
                  ) : null}
                </div>
              ))}
            </div>

            <div className="p-4 border-t border-white/10 flex gap-3">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={activeFriendId ? "Type a message" : "Select a friend to chat"}
                className="flex-1 rounded-xl bg-black/30 border border-white/15 px-4 py-3 outline-none focus:border-red-500/60"
                disabled={!activeFriendId}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleSend();
                  }
                }}
              />
              <button
                onClick={handleSend}
                disabled={!activeFriendId || !input.trim() || sending}
                className="rounded-xl bg-red-600 hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed px-5 py-3 font-semibold transition"
              >
                Send
              </button>
            </div>

            {error ? <p className="px-4 pb-4 text-sm text-red-400">{error}</p> : null}
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default ChatPage;
