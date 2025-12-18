import React, { useState, useEffect, useRef } from 'react';
import { Send, Search, UserPlus } from 'lucide-react';
import { getMessages, getConversation, sendMessage, getFollowing } from '../services/api';

const Messages = ({ currentUser }) => {
  const [conversations, setConversations] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [messageText, setMessageText] = useState('');
  const [loading, setLoading] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showNewConversation, setShowNewConversation] = useState(false);
  const [followingUsers, setFollowingUsers] = useState([]);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    loadConversations();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const loadConversations = async () => {
    try {
      setLoading(true);
      const data = await getMessages();
      setConversations(data);

      // If we have conversations and none selected, select the first one
      if (data.length > 0 && !selectedUser) {
        handleSelectConversation(data[0]);
      }
    } catch (error) {
      console.error('Error loading conversations:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectConversation = async (conversation) => {
    const userId = conversation.sender_id || conversation.user_id;
    const username = conversation.sender_username || conversation.username;

    setSelectedUser({
      user_id: userId,
      username: username
    });

    // Load full conversation history
    setLoadingMessages(true);
    try {
      const conversationMessages = await getConversation(userId);
      setMessages(conversationMessages);
    } catch (error) {
      console.error('Error loading conversation:', error);
      setMessages([]);
    } finally {
      setLoadingMessages(false);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!messageText.trim() || !selectedUser) return;

    const tempMessage = {
      message_id: Date.now(),
      sender_id: currentUser.user_id,
      receiver_id: selectedUser.user_id,
      content: messageText,
      created_at: 'Just now',
      is_read: 0
    };

    // Optimistic update
    setMessages(prev => [...prev, tempMessage]);
    const textToSend = messageText;
    setMessageText('');

    try {
      const result = await sendMessage(selectedUser.user_id, textToSend);
      if (result.success) {
        // Refresh conversations to update last message
        loadConversations();
      }
    } catch (error) {
      console.error('Error sending message:', error);
      // Remove optimistic message on error
      setMessages(prev => prev.filter(m => m.message_id !== tempMessage.message_id));
      setMessageText(textToSend);
    }
  };

  const handleNewConversation = async () => {
    setShowNewConversation(true);
    // Load users the current user is following
    try {
      const following = await getFollowing(currentUser.user_id);
      setFollowingUsers(following);
    } catch (error) {
      console.error('Error loading following users:', error);
    }
  };

  const handleStartConversation = (user) => {
    setSelectedUser({
      user_id: user.user_id,
      username: user.username
    });
    setMessages([]);
    setShowNewConversation(false);
  };

  const filteredConversations = conversations.filter(conv => {
    const username = conv.sender_username || conv.username || '';
    return username.toLowerCase().includes(searchQuery.toLowerCase());
  });

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-60px)] bg-dark-bg flex items-center justify-center">
        <div className="text-neutral-500 text-sm">Loading messages...</div>
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
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-neutral-50">Messages</h2>
                <button
                  onClick={handleNewConversation}
                  className="p-2 bg-neutral-50 text-neutral-900 rounded-lg hover:bg-neutral-200 transition-colors"
                  title="New conversation"
                >
                  <UserPlus size={18} />
                </button>
              </div>

              <div className="relative">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" />
                <input
                  type="text"
                  placeholder="Search messages..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full py-2.5 pl-9 pr-3 bg-dark-bg border border-dark-border rounded-lg text-neutral-50 text-[13px] placeholder:text-neutral-500 focus:outline-none focus:border-neutral-500 transition-colors"
                />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto scrollbar-custom">
              {showNewConversation ? (
                <div className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-medium text-neutral-50">Start a conversation</span>
                    <button
                      onClick={() => setShowNewConversation(false)}
                      className="text-xs text-neutral-400 hover:text-neutral-50"
                    >
                      Cancel
                    </button>
                  </div>
                  {followingUsers.length === 0 ? (
                    <p className="text-sm text-neutral-400 text-center py-4">
                      Follow users to message them
                    </p>
                  ) : (
                    followingUsers.map(user => (
                      <div
                        key={user.user_id}
                        onClick={() => handleStartConversation(user)}
                        className="flex items-center gap-3 p-3 rounded-lg cursor-pointer hover:bg-dark-border transition-all"
                      >
                        <div className="w-10 h-10 rounded-full bg-neutral-700 flex items-center justify-center text-neutral-50 font-semibold">
                          {user.username?.charAt(0).toUpperCase()}
                        </div>
                        <span className="text-sm text-neutral-50">{user.username}</span>
                      </div>
                    ))
                  )}
                </div>
              ) : filteredConversations.length === 0 ? (
                <div className="p-10 text-center text-neutral-500">
                  <p>No conversations yet</p>
                  <button
                    onClick={handleNewConversation}
                    className="mt-3 text-sm text-neutral-300 hover:text-neutral-50"
                  >
                    Start a conversation
                  </button>
                </div>
              ) : (
                filteredConversations.map(conv => {
                  const userId = conv.sender_id || conv.user_id;
                  const username = conv.sender_username || conv.username;
                  const isSelected = selectedUser?.user_id === userId;

                  return (
                    <div
                      key={userId}
                      onClick={() => handleSelectConversation(conv)}
                      className={`flex items-center gap-3 p-4 cursor-pointer border-b border-dark-border hover:bg-dark-bg transition-all relative ${
                        isSelected ? 'bg-dark-border' : ''
                      }`}
                    >
                      <div className="w-12 h-12 rounded-full bg-neutral-700 flex items-center justify-center text-neutral-50 font-semibold text-lg flex-shrink-0">
                        {username?.charAt(0).toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-sm font-semibold text-neutral-50 truncate">
                            {username}
                          </span>
                          <span className="text-[11px] text-neutral-500">
                            {conv.created_at}
                          </span>
                        </div>
                        <p className="text-[13px] text-neutral-400 truncate">
                          {conv.content}
                        </p>
                      </div>
                      {conv.is_read === 0 && (
                        <div className="absolute top-1/2 right-5 -translate-y-1/2 w-2 h-2 bg-neutral-50 rounded-full"></div>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Chat Area */}
          <div className="flex flex-col h-full">
            {selectedUser ? (
              <>
                {/* Chat Header */}
                <div className="p-5 border-b border-dark-border">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-neutral-700 flex items-center justify-center text-neutral-50 font-semibold text-base">
                      {selectedUser.username?.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h3 className="text-base font-semibold text-neutral-50">
                        {selectedUser.username}
                      </h3>
                      <span className="text-xs text-green-500">Active now</span>
                    </div>
                  </div>
                </div>

                {/* Messages List */}
                <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-4 scrollbar-custom">
                  {loadingMessages ? (
                    <div className="text-center text-neutral-500 py-10">Loading messages...</div>
                  ) : messages.length === 0 ? (
                    <div className="text-center text-neutral-500 py-10">
                      No messages yet. Say hello!
                    </div>
                  ) : (
                    messages.map((msg, index) => {
                      const isSent = msg.sender_id === currentUser.user_id;

                      return (
                        <div
                          key={msg.message_id || index}
                          className={`max-w-[70%] p-3 rounded-2xl animate-[fadeIn_0.2s_ease] ${
                            isSent
                              ? 'self-end bg-neutral-50 text-neutral-900 rounded-br'
                              : 'self-start bg-dark-border text-neutral-50 rounded-bl'
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
                    })
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* Message Input */}
                <form onSubmit={handleSendMessage} className="flex items-center gap-3 p-5 border-t border-dark-border">
                  <input
                    type="text"
                    placeholder="Type a message..."
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                    className="flex-1 py-3 px-4 bg-dark-bg border border-dark-border rounded-full text-neutral-50 text-sm placeholder:text-neutral-500 focus:outline-none focus:border-neutral-500 transition-colors"
                  />
                  <button
                    type="submit"
                    disabled={!messageText.trim()}
                    className="w-11 h-11 rounded-full bg-neutral-50 text-neutral-900 flex items-center justify-center hover:bg-neutral-200 disabled:bg-dark-border disabled:text-neutral-500 disabled:cursor-not-allowed transition-all hover:scale-105"
                  >
                    <Send size={20} />
                  </button>
                </form>
              </>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-neutral-500">
                <h3 className="text-xl text-neutral-50 mb-2">Select a conversation</h3>
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
