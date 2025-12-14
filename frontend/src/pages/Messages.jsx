import React, { useState, useEffect } from 'react';
import { Send, Search } from 'lucide-react';
import { getMessages, sendMessage } from '../services/api';

const Messages = ({ currentUser }) => {
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messageText, setMessageText] = useState('');
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadMessages();
  }, []);

  const loadMessages = async () => {
    try {
      setLoading(true);
      const data = await getMessages();
      const grouped = groupMessagesByUser(data);
      setConversations(grouped);
      if (grouped.length > 0 && !selectedConversation) {
        setSelectedConversation(grouped[0]);
      }
    } catch (error) {
      console.error('Error loading messages:', error);
    } finally {
      setLoading(false);
    }
  };

  const groupMessagesByUser = (messages) => {
    const grouped = {};
    messages.forEach(msg => {
      const otherUserId = msg.sender_id === currentUser.user_id 
        ? msg.receiver_id 
        : msg.sender_id;

      if (!grouped[otherUserId]) {
        grouped[otherUserId] = {
          userId: otherUserId,
          username: msg.sender_username,
          messages: [],
          lastMessage: msg,
          unreadCount: msg.is_read === 0 ? 1 : 0
        };
      }

      grouped[otherUserId].messages.push(msg);
      if (msg.is_read === 0 && msg.receiver_id === currentUser.user_id) {
        grouped[otherUserId].unreadCount += 1;
      }
    });

    return Object.values(grouped);
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!messageText.trim() || !selectedConversation) return;

    try {
      await sendMessage(selectedConversation.userId, messageText);
      await loadMessages();
      setMessageText('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const filteredConversations = conversations.filter(conv =>
    conv.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-60px)] bg-dark-bg flex items-center justify-center">
        <div className="text-slate-500 text-sm">Loading messages...</div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-60px)] bg-dark-bg">
      <div className="max-w-[1200px] mx-auto h-[calc(100vh-120px)]">
        <div className="grid grid-cols-[350px_1fr] h-full bg-dark-card rounded-xl border border-dark-border overflow-hidden">
          
          {/* Conversations Sidebar */}
          <div className="border-r border-dark-border flex flex-col">
            <div className="p-5 border-b border-dark-border">
              <h2 className="text-2xl font-bold text-slate-50 mb-4">Messages</h2>
              
              <div className="relative">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="text"
                  placeholder="Search messages..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full py-2.5 pl-9 pr-3 bg-dark-bg border border-dark-border rounded-lg text-slate-50 text-[13px] placeholder:text-slate-500 focus:outline-none focus:border-primary transition-colors"
                />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto scrollbar-custom">
              {filteredConversations.length === 0 ? (
                <div className="p-10 text-center text-slate-500">
                  <p>No conversations yet</p>
                </div>
              ) : (
                filteredConversations.map(conv => (
                  <div
                    key={conv.userId}
                    onClick={() => setSelectedConversation(conv)}
                    className={`flex items-center gap-3 p-4 cursor-pointer border-b border-dark-border hover:bg-dark-bg transition-all relative ${
                      selectedConversation?.userId === conv.userId ? 'bg-dark-border' : ''
                    }`}
                  >
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-purple-500 flex items-center justify-center text-white font-semibold text-lg flex-shrink-0">
                      {conv.username?.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm font-semibold text-slate-50 truncate">
                          {conv.username}
                        </span>
                        <span className="text-[11px] text-slate-500">
                          {conv.lastMessage.created_at}
                        </span>
                      </div>
                      <p className="text-[13px] text-slate-400 truncate">
                        {conv.lastMessage.content}
                      </p>
                    </div>
                    {conv.unreadCount > 0 && (
                      <div className="absolute top-1/2 right-5 -translate-y-1/2 bg-primary text-white text-[11px] font-semibold px-2 py-0.5 rounded-full min-w-[20px] text-center">
                        {conv.unreadCount}
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Chat Area */}
          <div className="flex flex-col h-full">
            {selectedConversation ? (
              <>
                {/* Chat Header */}
                <div className="p-5 border-b border-dark-border">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-purple-500 flex items-center justify-center text-white font-semibold text-base">
                      {selectedConversation.username?.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h3 className="text-base font-semibold text-slate-50">
                        {selectedConversation.username}
                      </h3>
                      <span className="text-xs text-green-500">Active now</span>
                    </div>
                  </div>
                </div>

                {/* Messages List */}
                <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-4 scrollbar-custom">
                  {selectedConversation.messages.map((msg, index) => {
                    const isSent = msg.sender_id === currentUser.user_id;
                    
                    return (
                      <div
                        key={index}
                        className={`max-w-[70%] p-3 rounded-2xl animate-[fadeIn_0.2s_ease] ${
                          isSent 
                            ? 'self-end bg-primary text-white rounded-br' 
                            : 'self-start bg-dark-border text-slate-50 rounded-bl'
                        }`}
                      >
                        <p className="text-sm leading-relaxed mb-1">
                          {msg.content}
                        </p>
                        <span className="text-[11px] opacity-70">
                          {msg.created_at}
                        </span>
                      </div>
                    );
                  })}
                </div>

                {/* Message Input */}
                <form onSubmit={handleSendMessage} className="flex items-center gap-3 p-5 border-t border-dark-border">
                  <input
                    type="text"
                    placeholder="Type a message..."
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                    className="flex-1 py-3 px-4 bg-dark-bg border border-dark-border rounded-full text-slate-50 text-sm placeholder:text-slate-500 focus:outline-none focus:border-primary transition-colors"
                  />
                  <button 
                    type="submit" 
                    disabled={!messageText.trim()}
                    className="w-11 h-11 rounded-full bg-primary text-white flex items-center justify-center hover:bg-primary-hover disabled:bg-dark-border disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:scale-105"
                  >
                    <Send size={20} />
                  </button>
                </form>
              </>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-slate-500">
                <h3 className="text-xl text-slate-50 mb-2">Select a conversation</h3>
                <p className="text-sm">Choose a conversation from the left to start messaging</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Messages;