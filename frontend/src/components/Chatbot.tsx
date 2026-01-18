import { useState, useEffect, useRef } from 'react'
import {
  Box,
  Container,
  Typography,
  Card,
  Stack,
  TextField,
  IconButton,
  Avatar,
  Paper,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  LinearProgress,
  Chip,
  Button,
  Tooltip,
  Fade,
  Zoom,
  alpha,
} from '@mui/material'
import SendIcon from '@mui/icons-material/Send'
import SmartToyIcon from '@mui/icons-material/SmartToy'
import SettingsIcon from '@mui/icons-material/Settings'
import ContentCopyIcon from '@mui/icons-material/ContentCopy'
import ThumbUpIcon from '@mui/icons-material/ThumbUp'
import ThumbDownIcon from '@mui/icons-material/ThumbDown'
import RefreshIcon from '@mui/icons-material/Refresh'
import PersonIcon from '@mui/icons-material/Person'
import ReactMarkdown from 'react-markdown'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { materialDark } from 'react-syntax-highlighter/dist/esm/styles/prism'

// MessageContent component for rendering markdown with syntax highlighting
const MessageContent = ({ content, sender }: { content: string; sender: 'user' | 'bot' }) => {
  return (
    <ReactMarkdown
      components={{
        code({ node, className, children, ...props }: any) {
          const match = /language-(\w+)/.exec(className || '')
          const isInline = !match
          return !isInline && match ? (
            <Box sx={{ position: 'relative', mt: 1, mb: 1 }}>
              <SyntaxHighlighter
                style={materialDark}
                language={match[1]}
                PreTag="div"
                customStyle={{
                  margin: 0,
                  borderRadius: '8px',
                  fontSize: '14px',
                }}
                {...props}
              >
                {String(children).replace(/\n$/, '')}
              </SyntaxHighlighter>
              <Tooltip title="Copy code">
                <IconButton
                  size="small"
                  sx={{
                    position: 'absolute',
                    top: 8,
                    right: 8,
                    bgcolor: 'rgba(0,0,0,0.6)',
                    color: 'white',
                    '&:hover': { bgcolor: 'rgba(0,0,0,0.8)' },
                  }}
                  onClick={() => navigator.clipboard.writeText(String(children))}
                >
                  <ContentCopyIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </Box>
          ) : (
            <code
              style={{
                backgroundColor: sender === 'user' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
                padding: '2px 6px',
                borderRadius: '4px',
                fontSize: '0.875em',
              }}
              {...props}
            >
              {children}
            </code>
          )
        },
        p: ({ children }) => <Typography variant="body1" sx={{ mb: 1 }}>{children}</Typography>,
        h1: ({ children }) => <Typography variant="h4" sx={{ mb: 2, fontWeight: 600 }}>{children}</Typography>,
        h2: ({ children }) => <Typography variant="h5" sx={{ mb: 2, fontWeight: 600 }}>{children}</Typography>,
        h3: ({ children }) => <Typography variant="h6" sx={{ mb: 1, fontWeight: 600 }}>{children}</Typography>,
        ul: ({ children }) => <Box component="ul" sx={{ pl: 3, mb: 1 }}>{children}</Box>,
        ol: ({ children }) => <Box component="ol" sx={{ pl: 3, mb: 1 }}>{children}</Box>,
        li: ({ children }) => <Typography component="li" variant="body1" sx={{ mb: 0.5 }}>{children}</Typography>,
        table: ({ children }) => (
          <Box sx={{ overflowX: 'auto', mb: 2 }}>
            <Box component="table" sx={{ minWidth: '100%', borderCollapse: 'collapse' }}>
              {children}
            </Box>
          </Box>
        ),
        th: ({ children }) => (
          <Box component="th" sx={{ p: 1, border: '1px solid', borderColor: 'divider', bgcolor: 'action.hover', fontWeight: 600 }}>
            {children}
          </Box>
        ),
        td: ({ children }) => (
          <Box component="td" sx={{ p: 1, border: '1px solid', borderColor: 'divider' }}>
            {children}
          </Box>
        ),
      }}
    >
      {content}
    </ReactMarkdown>
  )
}

const ChatbotComponent = () => {
  const [message, setMessage] = useState('')
  const [messages, setMessages] = useState<Array<{ text: string; sender: 'user' | 'bot'; timestamp?: Date }>>([
    {
      text: 'Xin chào! Tôi là Trợ lý Sen AI tỉnh Đồng Tháp. Tôi có thể giúp bạn trả lời câu hỏi về khoa học, toán học, vật lý, hóa học và nhiều lĩnh vực khác. Hãy đặt câu hỏi để bắt đầu!',
      sender: 'bot',
      timestamp: new Date(),
    },
  ])

  const [selectedModel, setSelectedModel] = useState('qwen2.5-coder:7b')
  const [availableModels, setAvailableModels] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Fetch available models on component mount
  useEffect(() => {
    const fetchModels = async () => {
      try {
        const response = await fetch('http://localhost:11434/api/tags')
        const data = await response.json()
        if (data.models) {
          const modelNames = data.models.map((model: any) => model.name)
          setAvailableModels(modelNames)
          if (!modelNames.includes(selectedModel) && modelNames.length > 0) {
            setSelectedModel(modelNames[0])
          }
        }
      } catch (error) {
        console.error('Error fetching models:', error)
      }
    }
    fetchModels()
  }, [])

  // Auto scroll to bottom when new message arrives
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSend = async () => {
    if (!message.trim() || isLoading) return

    const userMessage = message
    const newMessages = [...messages, { text: userMessage, sender: 'user' as const, timestamp: new Date() }]
    console.log('Adding user message:', newMessages)
    setMessages(newMessages)
    setMessage('')
    setIsLoading(true)
    setIsTyping(true)

    try {
      // Prepare messages for Ollama
      const ollamaMessages = [
        {
          role: "system",
          content: "You are Trợ lý Sen AI tỉnh Đồng Tháp, a helpful AI assistant for education. Answer clearly and simply in Vietnamese. Use markdown formatting for code blocks, lists, tables, and structured content.",
        },
        ...messages.map(msg => ({
          role: msg.sender === 'user' ? 'user' : 'assistant',
          content: msg.text,
        })),
        {
          role: "user",
          content: userMessage,
        },
      ]

      const response = await fetch('http://localhost:11434/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: selectedModel,
          messages: ollamaMessages,
          stream: false,
        }),
      })

      const data = await response.json()

      if (data.message && data.message.content) {
        // Simulate typing effect
        const fullText = data.message.content
        let currentText = ''
        const typingSpeed = 30 // ms per character (faster for better UX)

        for (let i = 0; i < fullText.length; i++) {
          await new Promise(resolve => setTimeout(resolve, typingSpeed))
          currentText += fullText[i]
          setMessages((prev) => {
            const newMessages = [...prev]
            const lastMessage = newMessages[newMessages.length - 1]
            if (lastMessage.sender === 'bot') {
              // Create a new message object instead of mutating
              newMessages[newMessages.length - 1] = { ...lastMessage, text: currentText }
            } else {
              newMessages.push({ text: currentText, sender: 'bot', timestamp: new Date() })
            }
            return newMessages
          })
        }
      } else {
        setMessages((prev) => [
          ...prev,
          {
            text: 'Xin lỗi, có lỗi xảy ra. Vui lòng thử lại.',
            sender: 'bot',
            timestamp: new Date(),
          },
        ])
      }
    } catch (error) {
      console.error('Error sending message:', error)
      setMessages((prev) => [
        ...prev,
        {
          text: 'Không thể kết nối đến Ollama. Vui lòng kiểm tra Ollama đang chạy trên port 11434.',
          sender: 'bot',
          timestamp: new Date(),
        },
      ])
    } finally {
      setIsLoading(false)
      setIsTyping(false)
    }
  }

  const handleCopyMessage = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  const handleRegenerate = () => {
    // Remove last bot message and regenerate
    const lastBotIndex = messages.map((msg, index) => ({ msg, index })).reverse().find(({ msg }) => msg.sender === 'bot')?.index
    if (lastBotIndex !== undefined) {
      const newMessages = messages.slice(0, lastBotIndex)
      setMessages(newMessages)
      // Trigger send again with the last user message
      const lastUserMessage = newMessages.reverse().find(msg => msg.sender === 'user')
      if (lastUserMessage) {
        setMessage(lastUserMessage.text)
        handleSend()
      }
    }
  }

  return (
    <Box 
      sx={{ 
        py: { xs: 4, md: 8 }, 
        minHeight: 'calc(100vh - 200px)',
        background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.05) 0%, rgba(74, 222, 128, 0.05) 100%)',
        position: 'relative',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'radial-gradient(circle at 20% 50%, rgba(34, 197, 94, 0.1) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(74, 222, 128, 0.1) 0%, transparent 50%)',
          pointerEvents: 'none',
        }
      }}
    >
      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Typography
            variant="h2"
            component="h1"
            gutterBottom
            sx={{
              fontWeight: 800,
              background: 'linear-gradient(135deg, #22c55e 0%, #4ade80 50%, #16a34a 100%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              textShadow: '0 2px 4px rgba(0,0,0,0.1)',
              letterSpacing: '0.02em',
              position: 'relative',
              animation: 'fadeInDown 0.6s ease-out',
              '@keyframes fadeInDown': {
                '0%': {
                  opacity: 0,
                  transform: 'translateY(-20px)',
                },
                '100%': {
                  opacity: 1,
                  transform: 'translateY(0)',
                },
              },
              '&::after': {
                content: '""',
                position: 'absolute',
                bottom: -8,
                left: '50%',
                transform: 'translateX(-50%)',
                width: '80px',
                height: '4px',
                background: 'linear-gradient(90deg, #22c55e 0%, #4ade80 100%)',
                borderRadius: '2px',
                animation: 'expandWidth 0.8s ease-out',
                '@keyframes expandWidth': {
                  '0%': {
                    width: 0,
                  },
                  '100%': {
                    width: '80px',
                  },
                },
              }
            }}
          >
            Trợ Lý AI
          </Typography>
          <Typography
            variant="subtitle1"
            sx={{
              color: 'text.secondary',
              mt: 1,
              fontWeight: 500,
              opacity: 0.8,
              animation: 'fadeIn 0.8s ease-out 0.2s both',
              '@keyframes fadeIn': {
                '0%': {
                  opacity: 0,
                },
                '100%': {
                  opacity: 0.8,
                },
              },
            }}
          >
            Hỗ trợ học tập thông minh với AI
          </Typography>
        </Box>

        <Card 
          sx={{ 
            height: { xs: 'calc(100vh - 200px)', md: '700px' },
            display: 'flex', 
            flexDirection: 'column',
            borderRadius: 2,
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12), 0 2px 8px rgba(0, 0, 0, 0.08)',
            overflow: 'hidden',
            border: '1px solid',
            borderColor: alpha('#22c55e', 0.1),
            background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(255, 255, 255, 0.98) 100%)',
            backdropFilter: 'blur(10px)',
            transition: 'all 0.3s ease',
            '&:hover': {
              boxShadow: '0 12px 40px rgba(34, 197, 94, 0.15), 0 4px 12px rgba(0, 0, 0, 0.1)',
            }
          }}
        >
          <Box
            sx={{
              p: 3,
              borderBottom: '1px solid',
              borderColor: alpha('#22c55e', 0.1),
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.05) 0%, rgba(74, 222, 128, 0.05) 100%)',
              backdropFilter: 'blur(10px)',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Avatar 
                sx={{ 
                  bgcolor: 'primary.main',
                  width: 48,
                  height: 48,
                  border: '3px solid',
                  borderColor: alpha('#22c55e', 0.2),
                  boxShadow: '0 4px 12px rgba(34, 197, 94, 0.2)',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'scale(1.05)',
                    boxShadow: '0 6px 16px rgba(34, 197, 94, 0.3)',
                  }
                }} 
                src="/assets/icon/besen.webp"
              >
                <SmartToyIcon />
              </Avatar>
              <Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography variant="h6" fontWeight={600} sx={{ color: '#16a34a' }}>
                    Trợ lý Sen AI
                  </Typography>
                  <Box
                    sx={{
                      width: 8,
                      height: 8,
                      borderRadius: '50%',
                      bgcolor: '#00bfff',
                      animation: 'pulse 2s infinite',
                      '@keyframes pulse': {
                        '0%, 100%': {
                          opacity: 1,
                          transform: 'scale(1)',
                        },
                        '50%': {
                          opacity: 0.5,
                          transform: 'scale(0.8)',
                        },
                      },
                    }}
                  />
                </Box>
                <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500 }}>
                  Trợ lý AI tỉnh Đồng Tháp
                </Typography>
              </Box>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <FormControl size="small" sx={{ minWidth: 200 }}>
                <InputLabel>Model AI</InputLabel>
                <Select
                  value={selectedModel}
                  label="Model AI"
                  onChange={(e) => setSelectedModel(e.target.value)}
                  disabled={isLoading}
                >
                  {availableModels.map((model) => (
                    <MenuItem key={model} value={model}>
                      {model}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <Chip
                icon={<SettingsIcon />}
                label={isTyping ? 'Đang trả lời...' : 'Sẵn sàng'}
                color={isTyping ? 'warning' : 'primary'}
                variant="outlined"
                size="small"
                sx={{
                  '&.MuiChip-colorPrimary': {
                    borderColor: '#00bfff',
                    color: '#00bfff',
                    '& .MuiChip-icon': {
                      color: '#00bfff',
                    },
                  },
                }}
              />
            </Box>
          </Box>

          {isLoading && (
            <LinearProgress
              sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                zIndex: 1,
                height: 3,
                '& .MuiLinearProgress-bar': {
                  background: 'linear-gradient(90deg, #22c55e 0%, #4ade80 50%, #16a34a 100%)',
                  animation: 'pulse 1.5s ease-in-out infinite',
                  '@keyframes pulse': {
                    '0%, 100%': {
                      opacity: 1,
                    },
                    '50%': {
                      opacity: 0.7,
                    },
                  },
                },
              }}
            />
          )}

          <Box
            sx={{
              flexGrow: 1,
              p: 3,
              overflowY: 'auto',
              display: 'flex',
              flexDirection: 'column',
              gap: 2.5,
              '&::-webkit-scrollbar': {
                width: '8px',
              },
              '&::-webkit-scrollbar-track': {
                background: alpha('#22c55e', 0.05),
                borderRadius: '4px',
              },
              '&::-webkit-scrollbar-thumb': {
                background: alpha('#22c55e', 0.3),
                borderRadius: '4px',
                '&:hover': {
                  background: alpha('#22c55e', 0.5),
                },
              },
            }}
          >
            {messages.map((msg, index) => (
              <Box
                key={msg.timestamp ? msg.timestamp.getTime() : index}
                sx={{
                  display: 'flex',
                  gap: 2,
                  alignItems: 'flex-start',
                  flexDirection: msg.sender === 'user' ? 'row-reverse' : 'row',
                  animation: 'slideIn 0.3s ease-out',
                  '@keyframes slideIn': {
                    '0%': {
                      opacity: 0,
                      transform: msg.sender === 'user' ? 'translateX(20px)' : 'translateX(-20px)',
                    },
                    '100%': {
                      opacity: 1,
                      transform: 'translateX(0)',
                    },
                  },
                }}
              >
                  <Avatar 
                    sx={{ 
                      bgcolor: msg.sender === 'user' ? '#16a34a' : '#22c55e',
                      background: msg.sender === 'user'
                        ? 'linear-gradient(135deg, #16a34a 0%, #22c55e 100%)'
                        : 'linear-gradient(135deg, #22c55e 0%, #4ade80 100%)',
                      width: 40,
                      height: 40,
                      border: '2px solid',
                      borderColor: msg.sender === 'user' 
                        ? alpha('#16a34a', 0.2) 
                        : alpha('#22c55e', 0.2),
                      boxShadow: msg.sender === 'user'
                        ? '0 4px 12px rgba(22, 163, 74, 0.2)'
                        : '0 4px 12px rgba(34, 197, 94, 0.2)',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'scale(1.1) rotate(5deg)',
                      }
                    }} 
                    src={msg.sender === 'bot' ? "/assets/icon/besen.webp" : undefined}
                  >
                    {msg.sender === 'user' ? <PersonIcon sx={{ fontSize: 20 }} /> : <SmartToyIcon sx={{ fontSize: 20 }} />}
                  </Avatar>
                  <Box sx={{ maxWidth: { xs: '85%', md: '70%' } }}>
                    <Paper
                      sx={{
                        p: 2.5,
                        bgcolor: msg.sender === 'user'
                          ? '#16a34a'
                          : 'background.paper',
                        color: msg.sender === 'user' ? 'white' : 'text.primary',
                        position: 'relative',
                        borderRadius: 1.5,
                        boxShadow: msg.sender === 'user'
                          ? '0 4px 16px rgba(22, 163, 74, 0.2)'
                          : '0 4px 16px rgba(0, 0, 0, 0.08)',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          transform: 'translateY(-2px)',
                          boxShadow: msg.sender === 'user'
                            ? '0 6px 20px rgba(22, 163, 74, 0.3)'
                            : '0 6px 20px rgba(0, 0, 0, 0.12)',
                        },
                        '&::before': msg.sender === 'user' ? {
                          content: '""',
                          position: 'absolute',
                          right: -8,
                          top: 20,
                          width: 0,
                          height: 0,
                          borderTop: '8px solid transparent',
                          borderBottom: '8px solid transparent',
                          borderLeft: '8px solid #16a34a',
                        } : {
                          content: '""',
                          position: 'absolute',
                          left: -8,
                          top: 20,
                          width: 0,
                          height: 0,
                          borderTop: '8px solid transparent',
                          borderBottom: '8px solid transparent',
                          borderRight: '8px solid',
                          borderRightColor: 'background.paper',
                        },
                      }}
                    >
                    {msg.sender === 'user' ? (
                      <Typography variant="body1">{msg.text}</Typography>
                    ) : (
                      <MessageContent content={msg.text} sender={msg.sender} />
                    )}

                    {/* Hiển thị thời gian */}
                    <Typography 
                      variant="caption" 
                      sx={{ 
                        display: 'block',
                        mt: 1,
                        opacity: 0.7,
                        fontSize: '0.7rem',
                        color: msg.sender === 'user' ? 'rgba(255, 255, 255, 0.8)' : 'text.secondary',
                      }}
                    >
                      {msg.timestamp 
                        ? new Date(msg.timestamp).toLocaleTimeString('vi-VN', { 
                            hour: '2-digit', 
                            minute: '2-digit' 
                          })
                        : ''}
                    </Typography>

                    {msg.sender === 'bot' && (
                      <Fade in={!isTyping}>
                        <Box
                          sx={{
                            display: 'flex',
                            gap: 0.5,
                            mt: 1.5,
                            pt: 1.5,
                            borderTop: '1px solid',
                            borderColor: alpha('#22c55e', 0.1),
                          }}
                        >
                          <Tooltip title="Copy message" arrow>
                            <IconButton 
                              size="small" 
                              onClick={() => handleCopyMessage(msg.text)}
                              sx={{
                                color: 'text.secondary',
                                '&:hover': {
                                  bgcolor: alpha('#22c55e', 0.1),
                                  color: '#22c55e',
                                  transform: 'scale(1.1)',
                                },
                                transition: 'all 0.2s ease',
                              }}
                            >
                              <ContentCopyIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>

                          <Tooltip title="Regenerate response" arrow>
                            <span>
                              <IconButton
                                size="small"
                                onClick={handleRegenerate}
                                disabled={isLoading}
                                sx={{
                                  color: 'text.secondary',
                                  '&:hover:not(:disabled)': {
                                    bgcolor: alpha('#22c55e', 0.1),
                                    color: '#22c55e',
                                    transform: 'scale(1.1) rotate(180deg)',
                                  },
                                  transition: 'all 0.3s ease',
                                }}
                              >
                                <RefreshIcon fontSize="small" />
                              </IconButton>
                            </span>
                          </Tooltip>

                          <Tooltip title="Good response" arrow>
                            <IconButton 
                              size="small" 
                              sx={{
                                color: 'text.secondary',
                                '&:hover': {
                                  bgcolor: alpha('#22c55e', 0.1),
                                  color: '#22c55e',
                                  transform: 'scale(1.1)',
                                },
                                transition: 'all 0.2s ease',
                              }}
                            >
                              <ThumbUpIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>

                          <Tooltip title="Bad response" arrow>
                            <IconButton 
                              size="small" 
                              sx={{
                                color: 'text.secondary',
                                '&:hover': {
                                  bgcolor: alpha('#F44336', 0.1),
                                  color: '#F44336',
                                  transform: 'scale(1.1)',
                                },
                                transition: 'all 0.2s ease',
                              }}
                            >
                              <ThumbDownIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      </Fade>
                    )}
                  </Paper>
                </Box>
              </Box>
            ))}
            
            {isTyping && (
              <Box
                sx={{
                  display: 'flex',
                  gap: 2,
                  alignItems: 'flex-start',
                  animation: 'slideIn 0.3s ease-out',
                  '@keyframes slideIn': {
                    '0%': {
                      opacity: 0,
                      transform: 'translateX(-20px)',
                    },
                    '100%': {
                      opacity: 1,
                      transform: 'translateX(0)',
                    },
                  },
                }}
              >
                <Avatar 
                  sx={{ 
                    bgcolor: 'linear-gradient(135deg, #22c55e 0%, #4ade80 100%)',
                    width: 40,
                    height: 40,
                    border: '2px solid',
                    borderColor: alpha('#22c55e', 0.2),
                    boxShadow: '0 4px 12px rgba(34, 197, 94, 0.2)',
                  }} 
                  src="/assets/icon/besen.webp"
                >
                  <SmartToyIcon sx={{ fontSize: 20 }} />
                </Avatar>
                <Paper
                  sx={{
                    p: 2.5,
                    bgcolor: 'background.paper',
                    position: 'relative',
                    borderRadius: 1.5,
                    boxShadow: '0 4px 16px rgba(0, 0, 0, 0.08)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 0.5,
                  }}
                >
                  <Box
                    sx={{
                      width: 6,
                      height: 6,
                      borderRadius: '50%',
                      bgcolor: '#22c55e',
                      animation: 'typingDot1 1.4s infinite ease-in-out',
                      '@keyframes typingDot1': {
                        '0%, 60%, 100%': {
                          transform: 'translateY(0)',
                          opacity: 0.4,
                        },
                        '30%': {
                          transform: 'translateY(-10px)',
                          opacity: 1,
                        },
                      },
                    }}
                  />
                  <Box
                    sx={{
                      width: 6,
                      height: 6,
                      borderRadius: '50%',
                      bgcolor: '#22c55e',
                      animation: 'typingDot2 1.4s infinite ease-in-out',
                      animationDelay: '0.2s',
                      '@keyframes typingDot2': {
                        '0%, 60%, 100%': {
                          transform: 'translateY(0)',
                          opacity: 0.4,
                        },
                        '30%': {
                          transform: 'translateY(-10px)',
                          opacity: 1,
                        },
                      },
                    }}
                  />
                  <Box
                    sx={{
                      width: 6,
                      height: 6,
                      borderRadius: '50%',
                      bgcolor: '#22c55e',
                      animation: 'typingDot3 1.4s infinite ease-in-out',
                      animationDelay: '0.4s',
                      '@keyframes typingDot3': {
                        '0%, 60%, 100%': {
                          transform: 'translateY(0)',
                          opacity: 0.4,
                        },
                        '30%': {
                          transform: 'translateY(-10px)',
                          opacity: 1,
                        },
                      },
                    }}
                  />
                </Paper>
              </Box>
            )}
            
            <div ref={messagesEndRef} />
          </Box>

          <Box
            sx={{
              p: 2.5,
              borderTop: '1px solid',
              borderColor: alpha('#22c55e', 0.1),
              background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.02) 0%, rgba(74, 222, 128, 0.02) 100%)',
            }}
          >
            <Stack direction="row" spacing={1.5}>
              <TextField
                fullWidth
                placeholder="Nhập câu hỏi của bạn..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault()
                    handleSend()
                  }
                }}
                size="small"
                disabled={isLoading}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    bgcolor: 'background.paper',
                    borderRadius: 1.5,
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      boxShadow: '0 2px 8px rgba(34, 197, 94, 0.1)',
                    },
                    '&.Mui-focused': {
                      boxShadow: '0 4px 12px rgba(34, 197, 94, 0.2)',
                      '& fieldset': {
                        borderColor: '#22c55e',
                        borderWidth: 2,
                      },
                    },
                    '& fieldset': {
                      borderColor: alpha('#22c55e', 0.3),
                    },
                  },
                }}
              />
              <IconButton 
                onClick={handleSend} 
                disabled={isLoading || !message.trim()}
                sx={{ 
                  bgcolor: 'linear-gradient(135deg, #22c55e 0%, #4ade80 100%)',
                  background: 'linear-gradient(135deg, #22c55e 0%, #4ade80 100%)',
                  color: 'white',
                  width: 48,
                  height: 48,
                  borderRadius: 1.5,
                  boxShadow: '0 4px 12px rgba(34, 197, 94, 0.3)',
                  transition: 'all 0.3s ease',
                  '&:hover:not(:disabled)': {
                    background: 'linear-gradient(135deg, #16a34a 0%, #22c55e 100%)',
                    transform: 'scale(1.05) translateY(-2px)',
                    boxShadow: '0 6px 16px rgba(34, 197, 94, 0.4)',
                  },
                  '&:active:not(:disabled)': {
                    transform: 'scale(0.95)',
                  },
                  '&:disabled': {
                    opacity: 0.5,
                    cursor: 'not-allowed',
                  },
                }}
              >
                <SendIcon />
              </IconButton>
            </Stack>
          </Box>
        </Card>
      </Container>
    </Box>
  )
}

export default ChatbotComponent
