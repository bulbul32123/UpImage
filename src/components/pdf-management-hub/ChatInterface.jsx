"use client"
import React, { useState, useRef, useEffect } from 'react';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';

const ChatInterface = ({ selectedFile, onSendMessage }) => {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  useEffect(() => {
    if (selectedFile?.id) {
      loadChatHistory();
    }
  }, [selectedFile]);

  const loadChatHistory = async () => {
    if (!selectedFile?.id) return;

    try {
      const response = await fetch(`/api/chat/${selectedFile.id}`);
      const data = await response.json();

      if (data.success) {
        setMessages(data.messages);
      }
    } catch (error) {
      console.error('Failed to load chat history:', error);
    }
  };

  const mockConversations = {
    'file-1': [
      {
        id: 1,
        type: 'user',
        content: 'What is the main topic of this document?',
        timestamp: new Date(Date.now() - 300000)
      },
      {
        id: 2,
        type: 'assistant',
        content: `Based on my analysis of the PDF, this document appears to be a comprehensive business proposal for implementing AI-powered customer service solutions.\n\nThe main topics covered include:\n• Current customer service challenges\n• Proposed AI chatbot implementation\n• Cost-benefit analysis\n• Implementation timeline\n• Expected ROI projections`,
        timestamp: new Date(Date.now() - 295000)
      },
      {
        id: 3,
        type: 'user',
        content: 'Can you summarize the key financial projections?',
        timestamp: new Date(Date.now() - 120000)
      },
      {
        id: 4,
        type: 'assistant',
        content: `Here are the key financial projections from the document:\n\n**Implementation Costs:**\n• Initial setup: $45,000\n• Annual licensing: $24,000\n• Training & integration: $15,000\n\n**Projected Savings:**\n• Year 1: $78,000 (reduced support staff)\n• Year 2: $95,000 (efficiency gains)\n• Year 3: $112,000 (scale benefits)\n\n**ROI Timeline:**\n• Break-even: Month 14\n• 3-year ROI: 285%`,
        timestamp: new Date(Date.now() - 115000)
      }
    ]
  };

  const quickQuestions = [
    'Summarize this document',
    'What are the key points?',
    'Extract important dates',
    'Find financial information',
    'List action items'
  ];

  useEffect(() => {
    if (selectedFile && mockConversations?.[selectedFile?.id]) {
      setMessages(mockConversations?.[selectedFile?.id]);
    } else {
      setMessages([]);
    }
  }, [selectedFile]);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const scrollToBottom = () => {
    messagesEndRef?.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async (message = inputMessage) => {
    if (!message?.trim() || !selectedFile || isLoading) return;

    setIsLoading(true);
    const tempUserMsg = {
      id: Date.now(),
      type: 'user',
      content: message.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, tempUserMsg]);
    setInputMessage('');
    setIsTyping(true);

    try {
      const response = await fetch(`/api/chat/${selectedFile.id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: message.trim() })
      });

      const data = await response.json();

      if (data.success) {
        setMessages(prev => [
          ...prev.filter(m => m.id !== tempUserMsg.id),
          data.userMessage,
          data.assistantMessage
        ]);
        onSendMessage?.(data.userMessage, data.assistantMessage);
      }
    } catch (error) {
      console.error('Failed to send message:', error);
    } finally {
      setIsTyping(false);
      setIsLoading(false);
    }
  };

  const handleQuickQuestion = (question) => {
    handleSendMessage(question);
  };

  const formatTime = (date) => {
    return new Intl.DateTimeFormat('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    })?.format(date);
  };

  const handleKeyPress = (e) => {
    if (e?.key === 'Enter' && !e?.shiftKey) {
      e?.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="h-full flex flex-col bg-card">
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-foreground">PDF Chat</h2>
            {selectedFile ? (
              <p className="text-sm text-muted-foreground truncate">
                Chatting with: {selectedFile?.name}
              </p>
            ) : (
              <p className="text-sm text-muted-foreground">Select a PDF to start chatting</p>
            )}
          </div>
          {selectedFile && (
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-success rounded-full animate-pulse"></div>
              <span className="text-xs text-success font-medium">Connected</span>
            </div>
          )}
        </div>
      </div>
      {!selectedFile ? (
        (<div className="flex-1 flex items-center justify-center p-8">
          <div className="text-center max-w-sm">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
              <Icon name="MessageCircle" size={24} color="var(--color-muted-foreground)" />
            </div>
            <h3 className="text-lg font-medium text-foreground mb-2">Start a Conversation</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Upload and select a PDF file to begin chatting with your document using AI.
            </p>
            <div className="flex flex-wrap gap-2 justify-center">
              {quickQuestions?.slice(0, 3)?.map((question, index) => (
                <span key={index} className="px-3 py-1 bg-muted text-xs text-muted-foreground rounded-full">
                  {question}
                </span>
              ))}
            </div>
          </div>
        </div>)
      ) : (
        <>
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages?.length === 0 && (
              <div className="text-center py-8">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Icon name="Sparkles" size={20} color="var(--color-primary)" />
                </div>
                <p className="text-sm text-muted-foreground mb-4">
                  Ask me anything about this PDF document
                </p>
                <div className="flex flex-wrap gap-2 justify-center max-w-md mx-auto">
                  {quickQuestions?.map((question, index) => (
                    <button
                      key={index}
                      onClick={() => handleQuickQuestion(question)}
                      className="px-3 py-1 bg-muted hover:bg-muted/80 text-xs text-foreground rounded-full transition-colors"
                    >
                      {question}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {messages?.map((message) => (
              <div
                key={message?.id}
                className={`flex ${message?.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`flex items-start space-x-2 max-w-[80%] ${message?.type === 'user' ? 'flex-row-reverse space-x-reverse' : ''
                  }`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${message?.type === 'user' ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground'
                    }`}>
                    <Icon
                      name={message?.type === 'user' ? 'User' : 'Bot'}
                      size={16}
                    />
                  </div>
                  <div className={`rounded-lg p-3 ${message?.type === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted text-foreground'
                    }`}>
                    <div className="whitespace-pre-wrap text-sm leading-relaxed">
                      {message?.content}
                    </div>
                    <div className={`text-xs mt-2 opacity-70 ${message?.type === 'user' ? 'text-primary-foreground' : 'text-muted-foreground'
                      }`}>
                      {formatTime(message?.timestamp)}
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex justify-start">
                <div className="flex items-start space-x-2 max-w-[80%]">
                  <div className="w-8 h-8 bg-secondary rounded-full flex items-center justify-center flex-shrink-0">
                    <Icon name="Bot" size={16} color="white" />
                  </div>
                  <div className="bg-muted rounded-lg p-3">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="p-4 border-t border-border">
            <div className="flex items-end space-x-2">
              <div className="flex-1">
                <Input
                  ref={inputRef}
                  type="text"
                  placeholder="Ask a question about this PDF..."
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e?.target?.value)}
                  onKeyPress={handleKeyPress}
                  disabled={isTyping}
                  className="resize-none"
                />
              </div>
              <Button
                onClick={() => handleSendMessage()}
                disabled={!inputMessage?.trim() || isTyping}
                size="icon"
                className="flex-shrink-0"
              >
                <Icon name="Send" size={16} />
              </Button>
            </div>
            <div className="flex items-center justify-between mt-2">
              <p className="text-xs text-muted-foreground">
                Press Enter to send, Shift+Enter for new line
              </p>
              <div className="flex items-center space-x-2">
                <Button variant="ghost" size="sm" iconName="RotateCcw">
                  Clear
                </Button>
                <Button variant="ghost" size="sm" iconName="Download">
                  Export
                </Button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ChatInterface;
