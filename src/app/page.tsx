"use client"

import { useState, useEffect } from 'react'
import { 
  Play, 
  BookOpen, 
  MessageCircle, 
  Headphones, 
  Trophy, 
  Star, 
  Crown, 
  User, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  ArrowRight, 
  Check, 
  X, 
  RotateCcw,
  Settings,
  Upload,
  BarChart3,
  Users,
  CreditCard,
  Zap,
  Shield,
  Heart,
  Target,
  Award,
  ChevronRight,
  Volume2,
  Pause,
  SkipForward,
  Home,
  LogOut,
  Plus,
  Mic,
  Globe,
  Calendar,
  Clock,
  TrendingUp,
  Gift,
  Sparkles,
  Flame,
  Medal,
  Brain,
  Lightbulb,
  Headphones as HeadphonesIcon
} from 'lucide-react'

// Tipos de dados
interface User {
  id: string
  name: string
  email: string
  level: string
  points: number
  streak: number
  subscription: 'free' | 'monthly' | 'annual'
  progress: {
    vocabulary: number
    grammar: number
    conversation: number
    listening: number
    pronunciation: number
  }
  badges: string[]
  lessonsCompleted: number
  totalLessons: number
  weeklyGoal: number
  currentWeekProgress: number
  certificates: string[]
}

interface Lesson {
  id: string
  title: string
  module: 'vocabulary' | 'grammar' | 'conversation' | 'listening' | 'pronunciation'
  level: 'basic' | 'intermediate' | 'advanced'
  duration: string
  videoUrl?: string
  content: string
  exercises: Exercise[]
  isPremium: boolean
  completed: boolean
  points: number
}

interface Exercise {
  id: string
  type: 'multiple-choice' | 'flashcard' | 'translation' | 'speaking'
  question: string
  options?: string[]
  correctAnswer: string
  explanation: string
  audioUrl?: string
}

export default function EnglishLearningApp() {
  const [currentScreen, setCurrentScreen] = useState<'welcome' | 'login' | 'register' | 'dashboard' | 'lessons' | 'exercise' | 'subscription' | 'chat' | 'admin' | 'profile' | 'certificates'>('welcome')
  const [user, setUser] = useState<User | null>(null)
  const [showPassword, setShowPassword] = useState(false)
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null)
  const [currentExercise, setCurrentExercise] = useState(0)
  const [exerciseAnswers, setExerciseAnswers] = useState<string[]>([])
  const [showResults, setShowResults] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [chatMessages, setChatMessages] = useState<{role: 'user' | 'bot', message: string}[]>([])
  const [chatInput, setChatInput] = useState('')
  const [selectedModule, setSelectedModule] = useState<string>('all')
  const [selectedLevel, setSelectedLevel] = useState<string>('all')

  // Dados mockados
  const mockUser: User = {
    id: '1',
    name: 'Ana Silva',
    email: 'ana@email.com',
    level: 'B1 - Intermediate',
    points: 3250,
    streak: 12,
    subscription: 'free',
    progress: {
      vocabulary: 85,
      grammar: 72,
      conversation: 58,
      listening: 90,
      pronunciation: 45
    },
    badges: ['First Steps', 'Grammar Master', 'Vocabulary Builder', 'Streak Champion', 'Listening Pro'],
    lessonsCompleted: 47,
    totalLessons: 180,
    weeklyGoal: 5,
    currentWeekProgress: 3,
    certificates: ['Basic English Certificate', 'Vocabulary Mastery']
  }

  const mockLessons: Lesson[] = [
    {
      id: '1',
      title: 'Essential Greetings & Introductions',
      module: 'vocabulary',
      level: 'basic',
      duration: '12 min',
      content: 'Master the art of first impressions with essential greeting phrases and self-introduction techniques.',
      isPremium: false,
      completed: true,
      points: 50,
      exercises: [
        {
          id: '1',
          type: 'multiple-choice',
          question: 'What\'s the most appropriate response to "How are you?"',
          options: ['I\'m fine, thank you', 'Very good', 'I\'m okay', 'Not bad'],
          correctAnswer: 'I\'m fine, thank you',
          explanation: 'This is the most polite and commonly used response in formal situations.'
        },
        {
          id: '2',
          type: 'flashcard',
          question: 'Nice to meet you',
          correctAnswer: 'Prazer em conhecê-lo',
          explanation: 'Used when meeting someone for the first time.'
        }
      ]
    },
    {
      id: '2',
      title: 'Present Simple vs Present Continuous',
      module: 'grammar',
      level: 'intermediate',
      duration: '18 min',
      content: 'Understand the key differences between present simple and present continuous tenses with practical examples.',
      isPremium: true,
      completed: false,
      points: 75,
      exercises: [
        {
          id: '1',
          type: 'multiple-choice',
          question: 'She _____ to work every day, but today she _____ from home.',
          options: ['goes / is working', 'is going / works', 'go / work', 'goes / works'],
          correctAnswer: 'goes / is working',
          explanation: 'Present simple for habits (every day) and present continuous for temporary actions (today).'
        }
      ]
    },
    {
      id: '3',
      title: 'Restaurant Conversations',
      module: 'conversation',
      level: 'intermediate',
      duration: '15 min',
      content: 'Practice ordering food, asking for recommendations, and handling restaurant situations confidently.',
      isPremium: true,
      completed: false,
      points: 80,
      exercises: []
    },
    {
      id: '4',
      title: 'Understanding Native Speakers',
      module: 'listening',
      level: 'advanced',
      duration: '20 min',
      content: 'Improve your listening skills with real conversations and learn to understand different accents.',
      isPremium: false,
      completed: true,
      points: 90,
      exercises: []
    },
    {
      id: '5',
      title: 'Mastering the TH Sound',
      module: 'pronunciation',
      level: 'basic',
      duration: '10 min',
      content: 'Learn the correct pronunciation of the challenging TH sound with step-by-step guidance.',
      isPremium: true,
      completed: false,
      points: 60,
      exercises: []
    },
    {
      id: '6',
      title: 'Business Email Writing',
      module: 'vocabulary',
      level: 'advanced',
      duration: '25 min',
      content: 'Master professional email communication with formal phrases and business vocabulary.',
      isPremium: true,
      completed: false,
      points: 100,
      exercises: []
    }
  ]

  const handleLogin = (email: string, password: string) => {
    setUser(mockUser)
    setCurrentScreen('dashboard')
  }

  const handleRegister = (name: string, email: string, password: string) => {
    setUser({...mockUser, name, email})
    setCurrentScreen('dashboard')
  }

  const startLesson = (lesson: Lesson) => {
    if (lesson.isPremium && user?.subscription === 'free') {
      setCurrentScreen('subscription')
      return
    }
    setSelectedLesson(lesson)
    setCurrentExercise(0)
    setExerciseAnswers([])
    setShowResults(false)
    setCurrentScreen('exercise')
  }

  const submitExercise = (answer: string) => {
    const newAnswers = [...exerciseAnswers, answer]
    setExerciseAnswers(newAnswers)
    
    if (currentExercise < (selectedLesson?.exercises.length || 0) - 1) {
      setCurrentExercise(currentExercise + 1)
    } else {
      setShowResults(true)
    }
  }

  const sendChatMessage = () => {
    if (!chatInput.trim()) return
    
    const newMessages = [...chatMessages, { role: 'user' as const, message: chatInput }]
    setChatMessages(newMessages)
    
    // Simulação de resposta da IA
    setTimeout(() => {
      const responses = [
        "Great question! Let me help you with that. The present simple tense is used for habits and general truths. For example: 'I study English every day.' Would you like more examples?",
        "I understand you're asking about pronunciation. The 'th' sound can be tricky! Try placing your tongue between your teeth and blowing air gently. Practice with words like 'think' and 'this'.",
        "That's an excellent grammar question! Remember that we use 'a' before consonant sounds and 'an' before vowel sounds. For example: 'a book' but 'an apple'.",
        "Perfect! You're making great progress. For conversation practice, try to use new vocabulary in complete sentences. This helps with retention and fluency."
      ]
      const randomResponse = responses[Math.floor(Math.random() * responses.length)]
      setChatMessages([...newMessages, { role: 'bot', message: randomResponse }])
    }, 1500)
    
    setChatInput('')
  }

  const filteredLessons = mockLessons.filter(lesson => {
    const moduleMatch = selectedModule === 'all' || lesson.module === selectedModule
    const levelMatch = selectedLevel === 'all' || lesson.level === selectedLevel
    return moduleMatch && levelMatch
  })

  // Tela de Boas-vindas
  const WelcomeScreen = () => (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center p-4">
      <div className="max-w-4xl mx-auto text-center">
        <div className="mb-8">
          <div className="bg-gradient-to-r from-blue-500 via-purple-500 to-green-500 w-24 h-24 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-2xl">
            <Globe className="w-12 h-12 text-white" />
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-gray-800 mb-4">
            English<span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-green-500">Pro</span>
          </h1>
          <p className="text-2xl md:text-3xl text-gray-600 mb-2">Seu novo jeito de aprender inglês</p>
          <p className="text-xl text-gray-500 mb-8">começa aqui!</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/20">
            <div className="bg-blue-100 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Brain className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-3">IA Personalizada</h3>
            <p className="text-gray-600">Tutor inteligente que se adapta ao seu ritmo de aprendizado</p>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/20">
            <div className="bg-green-100 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Trophy className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-3">Gamificação</h3>
            <p className="text-gray-600">Conquiste badges, mantenha sequências e compete com amigos</p>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/20">
            <div className="bg-purple-100 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Sparkles className="w-8 h-8 text-purple-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-3">Método Inovador</h3>
            <p className="text-gray-600">Aprenda através de conversação, jogos e situações reais</p>
          </div>
        </div>

        <div className="space-y-4">
          <button
            onClick={() => setCurrentScreen('register')}
            className="w-full max-w-md mx-auto bg-gradient-to-r from-blue-500 to-green-500 text-white py-4 px-8 rounded-2xl font-bold text-lg hover:from-blue-600 hover:to-green-600 transition-all duration-300 transform hover:scale-105 shadow-xl flex items-center justify-center space-x-2"
          >
            <Sparkles className="w-6 h-6" />
            <span>Começar Jornada Gratuita</span>
          </button>
          
          <button
            onClick={() => setCurrentScreen('login')}
            className="w-full max-w-md mx-auto bg-white/80 backdrop-blur-sm text-gray-700 py-4 px-8 rounded-2xl font-semibold text-lg hover:bg-white transition-all duration-300 border border-gray-200 flex items-center justify-center space-x-2"
          >
            <User className="w-5 h-5" />
            <span>Já tenho conta</span>
          </button>
        </div>

        <div className="mt-12 text-center">
          <p className="text-gray-500 mb-4">Mais de 10.000 alunos já transformaram seu inglês</p>
          <div className="flex justify-center space-x-8 text-sm text-gray-400">
            <div className="flex items-center space-x-2">
              <Star className="w-4 h-4 text-yellow-500" />
              <span>4.9/5 estrelas</span>
            </div>
            <div className="flex items-center space-x-2">
              <Shield className="w-4 h-4 text-green-500" />
              <span>Certificado</span>
            </div>
            <div className="flex items-center space-x-2">
              <Zap className="w-4 h-4 text-blue-500" />
              <span>Resultados rápidos</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )

  // Tela de Login
  const LoginScreen = () => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-md">
          <div className="text-center mb-8">
            <button
              onClick={() => setCurrentScreen('welcome')}
              className="mb-4 text-gray-500 hover:text-gray-700"
            >
              ← Voltar
            </button>
            <div className="bg-gradient-to-r from-blue-500 to-green-500 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Globe className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Bem-vindo de volta!</h1>
            <p className="text-gray-600">Continue sua jornada de aprendizado</p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="seu@email.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Senha</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <button
              onClick={() => handleLogin(email, password)}
              className="w-full bg-gradient-to-r from-blue-500 to-green-500 text-white py-3 rounded-xl font-semibold hover:from-blue-600 hover:to-green-600 transition-all duration-300 transform hover:scale-105"
            >
              Entrar
            </button>

            <div className="text-center">
              <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                Esqueci minha senha
              </button>
            </div>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Ou continue com</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button className="flex items-center justify-center px-4 py-3 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors">
                <span className="text-sm font-medium">Google</span>
              </button>
              <button className="flex items-center justify-center px-4 py-3 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors">
                <span className="text-sm font-medium">Apple</span>
              </button>
            </div>

            <div className="text-center mt-6">
              <span className="text-gray-600">Não tem uma conta? </span>
              <button
                onClick={() => setCurrentScreen('register')}
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                Cadastre-se
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Tela de Registro
  const RegisterScreen = () => {
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-md">
          <div className="text-center mb-8">
            <button
              onClick={() => setCurrentScreen('welcome')}
              className="mb-4 text-gray-500 hover:text-gray-700"
            >
              ← Voltar
            </button>
            <div className="bg-gradient-to-r from-blue-500 to-green-500 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Globe className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Crie sua conta</h1>
            <p className="text-gray-600">Comece sua jornada no inglês hoje mesmo</p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Nome completo</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Seu nome"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="seu@email.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Senha</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <button
              onClick={() => handleRegister(name, email, password)}
              className="w-full bg-gradient-to-r from-blue-500 to-green-500 text-white py-3 rounded-xl font-semibold hover:from-blue-600 hover:to-green-600 transition-all duration-300 transform hover:scale-105"
            >
              Criar Conta
            </button>

            <div className="text-center mt-6">
              <span className="text-gray-600">Já tem uma conta? </span>
              <button
                onClick={() => setCurrentScreen('login')}
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                Entrar
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Dashboard do Aluno
  const DashboardScreen = () => (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm shadow-sm border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <div className="bg-gradient-to-r from-blue-500 to-green-500 w-10 h-10 rounded-xl flex items-center justify-center">
                <Globe className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-gray-800">EnglishPro</h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 bg-gradient-to-r from-orange-100 to-yellow-100 px-3 py-1 rounded-full">
                <Trophy className="w-4 h-4 text-orange-600" />
                <span className="text-sm font-medium text-orange-600">{user?.points} pts</span>
              </div>
              <div className="flex items-center space-x-2 bg-gradient-to-r from-red-100 to-pink-100 px-3 py-1 rounded-full">
                <Flame className="w-4 h-4 text-red-600" />
                <span className="text-sm font-medium text-red-600">{user?.streak} dias</span>
              </div>
              <button
                onClick={() => setCurrentScreen('profile')}
                className="w-8 h-8 bg-gradient-to-r from-blue-500 to-green-500 rounded-full flex items-center justify-center text-white font-bold"
              >
                {user?.name.charAt(0)}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Coluna Principal */}
          <div className="lg:col-span-2 space-y-8">
            {/* Boas-vindas */}
            <div className="bg-gradient-to-r from-blue-500 via-purple-500 to-green-500 rounded-3xl p-8 text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full -ml-12 -mb-12"></div>
              <div className="relative">
                <h2 className="text-3xl font-bold mb-2">Olá, {user?.name}! 👋</h2>
                <p className="text-blue-100 mb-6">Pronto para continuar sua jornada no inglês?</p>
                <div className="flex items-center space-x-4">
                  <div className="bg-white/20 px-4 py-2 rounded-xl backdrop-blur-sm">
                    <span className="text-sm font-medium">{user?.level}</span>
                  </div>
                  <div className="bg-white/20 px-4 py-2 rounded-xl backdrop-blur-sm">
                    <span className="text-sm font-medium">{user?.lessonsCompleted}/{user?.totalLessons} aulas</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Meta Semanal */}
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/20">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-gray-800">Meta Semanal</h3>
                <div className="flex items-center space-x-2 text-green-600">
                  <Target className="w-5 h-5" />
                  <span className="font-semibold">{user?.currentWeekProgress}/{user?.weeklyGoal} aulas</span>
                </div>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-4 mb-4">
                <div 
                  className="bg-gradient-to-r from-green-400 to-blue-500 h-4 rounded-full transition-all duration-500"
                  style={{ width: `${((user?.currentWeekProgress || 0) / (user?.weeklyGoal || 1)) * 100}%` }}
                ></div>
              </div>
              <p className="text-gray-600">
                Faltam apenas {(user?.weeklyGoal || 0) - (user?.currentWeekProgress || 0)} aulas para completar sua meta!
              </p>
            </div>

            {/* Progresso por Módulo */}
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/20">
              <h3 className="text-2xl font-bold text-gray-800 mb-6">Seu Progresso</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {Object.entries(user?.progress || {}).map(([module, progress]) => (
                  <div key={module} className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        {module === 'vocabulary' && <BookOpen className="w-6 h-6 text-blue-500" />}
                        {module === 'grammar' && <Target className="w-6 h-6 text-green-500" />}
                        {module === 'conversation' && <MessageCircle className="w-6 h-6 text-purple-500" />}
                        {module === 'listening' && <HeadphonesIcon className="w-6 h-6 text-orange-500" />}
                        {module === 'pronunciation' && <Mic className="w-6 h-6 text-pink-500" />}
                        <span className="font-medium text-gray-800 capitalize">
                          {module === 'vocabulary' ? 'Vocabulário' :
                           module === 'grammar' ? 'Gramática' :
                           module === 'conversation' ? 'Conversação' :
                           module === 'listening' ? 'Listening' : 'Pronúncia'}
                        </span>
                      </div>
                      <span className="text-sm font-medium text-gray-600">{progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div 
                        className={`h-3 rounded-full transition-all duration-500 ${
                          module === 'vocabulary' ? 'bg-gradient-to-r from-blue-400 to-blue-600' :
                          module === 'grammar' ? 'bg-gradient-to-r from-green-400 to-green-600' :
                          module === 'conversation' ? 'bg-gradient-to-r from-purple-400 to-purple-600' :
                          module === 'listening' ? 'bg-gradient-to-r from-orange-400 to-orange-600' :
                          'bg-gradient-to-r from-pink-400 to-pink-600'
                        }`}
                        style={{ width: `${progress}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Aulas Recomendadas */}
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/20">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-gray-800">Aulas Recomendadas</h3>
                <button
                  onClick={() => setCurrentScreen('lessons')}
                  className="text-blue-600 hover:text-blue-700 font-medium flex items-center space-x-1"
                >
                  <span>Ver Todas</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {mockLessons.slice(0, 4).map((lesson) => (
                  <div key={lesson.id} className="border border-gray-200 rounded-2xl p-6 hover:shadow-lg transition-all duration-300 bg-white/50 backdrop-blur-sm">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-2">
                        {lesson.module === 'vocabulary' && <BookOpen className="w-5 h-5 text-blue-500" />}
                        {lesson.module === 'grammar' && <Target className="w-5 h-5 text-green-500" />}
                        {lesson.module === 'conversation' && <MessageCircle className="w-5 h-5 text-purple-500" />}
                        {lesson.module === 'listening' && <HeadphonesIcon className="w-5 h-5 text-orange-500" />}
                        {lesson.module === 'pronunciation' && <Mic className="w-5 h-5 text-pink-500" />}
                        <span className="text-sm font-medium text-gray-600 capitalize">
                          {lesson.module === 'vocabulary' ? 'Vocabulário' :
                           lesson.module === 'grammar' ? 'Gramática' :
                           lesson.module === 'conversation' ? 'Conversação' :
                           lesson.module === 'listening' ? 'Listening' : 'Pronúncia'}
                        </span>
                      </div>
                      {lesson.isPremium && (
                        <Crown className="w-5 h-5 text-yellow-500" />
                      )}
                      {lesson.completed && (
                        <Check className="w-5 h-5 text-green-500" />
                      )}
                    </div>
                    <h4 className="font-semibold text-gray-800 mb-2">{lesson.title}</h4>
                    <p className="text-sm text-gray-600 mb-4">{lesson.content}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3 text-xs text-gray-500">
                        <span className="capitalize">{lesson.level === 'basic' ? 'Básico' : lesson.level === 'intermediate' ? 'Intermediário' : 'Avançado'}</span>
                        <span>{lesson.duration}</span>
                        <div className="flex items-center space-x-1">
                          <Trophy className="w-3 h-3" />
                          <span>{lesson.points} pts</span>
                        </div>
                      </div>
                      <button
                        onClick={() => startLesson(lesson)}
                        className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                          lesson.completed 
                            ? 'bg-green-100 text-green-700 hover:bg-green-200'
                            : 'bg-blue-500 text-white hover:bg-blue-600'
                        }`}
                      >
                        {lesson.completed ? 'Revisar' : 'Iniciar'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Badges */}
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 shadow-xl border border-white/20">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Suas Conquistas</h3>
              <div className="space-y-3">
                {user?.badges.slice(0, 3).map((badge, index) => (
                  <div key={index} className="flex items-center space-x-3 p-3 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl border border-yellow-200">
                    <Medal className="w-6 h-6 text-yellow-600" />
                    <span className="font-medium text-gray-800">{badge}</span>
                  </div>
                ))}
                <button
                  onClick={() => setCurrentScreen('profile')}
                  className="w-full text-center text-blue-600 hover:text-blue-700 font-medium text-sm py-2"
                >
                  Ver todas as conquistas
                </button>
              </div>
            </div>

            {/* Upgrade to Premium */}
            {user?.subscription === 'free' && (
              <div className="bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 rounded-3xl p-6 text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -mr-10 -mt-10"></div>
                <Crown className="w-8 h-8 mb-3" />
                <h3 className="text-xl font-bold mb-2">Upgrade Premium</h3>
                <p className="text-yellow-100 text-sm mb-4">Desbloqueie todas as aulas e recursos</p>
                <div className="space-y-2 mb-4 text-sm">
                  <div className="flex items-center space-x-2">
                    <Check className="w-4 h-4" />
                    <span>Aulas ilimitadas</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Check className="w-4 h-4" />
                    <span>Tutor IA 24/7</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Check className="w-4 h-4" />
                    <span>Certificados</span>
                  </div>
                </div>
                <button
                  onClick={() => setCurrentScreen('subscription')}
                  className="bg-white text-orange-600 px-4 py-2 rounded-xl font-medium hover:bg-gray-100 transition-colors w-full"
                >
                  Ver Planos
                </button>
              </div>
            )}

            {/* Ações Rápidas */}
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 shadow-xl border border-white/20">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Ações Rápidas</h3>
              <div className="space-y-3">
                <button
                  onClick={() => setCurrentScreen('lessons')}
                  className="w-full flex items-center space-x-3 p-3 text-left hover:bg-blue-50 rounded-xl transition-colors"
                >
                  <Play className="w-5 h-5 text-blue-500" />
                  <span className="font-medium text-gray-800">Continuar Aprendendo</span>
                </button>
                <button
                  onClick={() => setCurrentScreen('chat')}
                  className="w-full flex items-center space-x-3 p-3 text-left hover:bg-green-50 rounded-xl transition-colors"
                >
                  <MessageCircle className="w-5 h-5 text-green-500" />
                  <span className="font-medium text-gray-800">Tutor IA</span>
                </button>
                <button
                  onClick={() => setCurrentScreen('certificates')}
                  className="w-full flex items-center space-x-3 p-3 text-left hover:bg-purple-50 rounded-xl transition-colors"
                >
                  <Award className="w-5 h-5 text-purple-500" />
                  <span className="font-medium text-gray-800">Certificados</span>
                </button>
                <button
                  onClick={() => setCurrentScreen('admin')}
                  className="w-full flex items-center space-x-3 p-3 text-left hover:bg-gray-50 rounded-xl transition-colors"
                >
                  <Settings className="w-5 h-5 text-gray-500" />
                  <span className="font-medium text-gray-800">Painel Admin</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )

  // Tela de Aulas
  const LessonsScreen = () => (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm shadow-sm border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setCurrentScreen('dashboard')}
                className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
              >
                <Home className="w-6 h-6 text-gray-600" />
              </button>
              <h1 className="text-2xl font-bold text-gray-800">Biblioteca de Aulas</h1>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filtros */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-white/20 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">Módulo</label>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setSelectedModule('all')}
                  className={`px-4 py-2 rounded-xl font-medium transition-colors ${
                    selectedModule === 'all' 
                      ? 'bg-blue-500 text-white' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Todos
                </button>
                <button
                  onClick={() => setSelectedModule('vocabulary')}
                  className={`px-4 py-2 rounded-xl font-medium transition-colors ${
                    selectedModule === 'vocabulary' 
                      ? 'bg-blue-500 text-white' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Vocabulário
                </button>
                <button
                  onClick={() => setSelectedModule('grammar')}
                  className={`px-4 py-2 rounded-xl font-medium transition-colors ${
                    selectedModule === 'grammar' 
                      ? 'bg-green-500 text-white' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Gramática
                </button>
                <button
                  onClick={() => setSelectedModule('conversation')}
                  className={`px-4 py-2 rounded-xl font-medium transition-colors ${
                    selectedModule === 'conversation' 
                      ? 'bg-purple-500 text-white' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Conversação
                </button>
                <button
                  onClick={() => setSelectedModule('listening')}
                  className={`px-4 py-2 rounded-xl font-medium transition-colors ${
                    selectedModule === 'listening' 
                      ? 'bg-orange-500 text-white' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Listening
                </button>
                <button
                  onClick={() => setSelectedModule('pronunciation')}
                  className={`px-4 py-2 rounded-xl font-medium transition-colors ${
                    selectedModule === 'pronunciation' 
                      ? 'bg-pink-500 text-white' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Pronúncia
                </button>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">Nível</label>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setSelectedLevel('all')}
                  className={`px-4 py-2 rounded-xl font-medium transition-colors ${
                    selectedLevel === 'all' 
                      ? 'bg-blue-500 text-white' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Todos
                </button>
                <button
                  onClick={() => setSelectedLevel('basic')}
                  className={`px-4 py-2 rounded-xl font-medium transition-colors ${
                    selectedLevel === 'basic' 
                      ? 'bg-green-500 text-white' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Básico
                </button>
                <button
                  onClick={() => setSelectedLevel('intermediate')}
                  className={`px-4 py-2 rounded-xl font-medium transition-colors ${
                    selectedLevel === 'intermediate' 
                      ? 'bg-yellow-500 text-white' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Intermediário
                </button>
                <button
                  onClick={() => setSelectedLevel('advanced')}
                  className={`px-4 py-2 rounded-xl font-medium transition-colors ${
                    selectedLevel === 'advanced' 
                      ? 'bg-red-500 text-white' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Avançado
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Lista de Aulas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredLessons.map((lesson) => (
            <div key={lesson.id} className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-white/20 hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  {lesson.module === 'vocabulary' && <BookOpen className="w-6 h-6 text-blue-500" />}
                  {lesson.module === 'grammar' && <Target className="w-6 h-6 text-green-500" />}
                  {lesson.module === 'conversation' && <MessageCircle className="w-6 h-6 text-purple-500" />}
                  {lesson.module === 'listening' && <HeadphonesIcon className="w-6 h-6 text-orange-500" />}
                  {lesson.module === 'pronunciation' && <Mic className="w-6 h-6 text-pink-500" />}
                  <span className="text-sm font-medium text-gray-600 capitalize">
                    {lesson.module === 'vocabulary' ? 'Vocabulário' :
                     lesson.module === 'grammar' ? 'Gramática' :
                     lesson.module === 'conversation' ? 'Conversação' :
                     lesson.module === 'listening' ? 'Listening' : 'Pronúncia'}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  {lesson.isPremium && (
                    <div className="flex items-center space-x-1 bg-yellow-100 px-2 py-1 rounded-full">
                      <Crown className="w-4 h-4 text-yellow-600" />
                      <span className="text-xs font-medium text-yellow-600">Premium</span>
                    </div>
                  )}
                  {lesson.completed && (
                    <div className="bg-green-100 p-1 rounded-full">
                      <Check className="w-4 h-4 text-green-600" />
                    </div>
                  )}
                </div>
              </div>
              
              <h3 className="text-xl font-bold text-gray-800 mb-2">{lesson.title}</h3>
              <p className="text-gray-600 mb-4 text-sm">{lesson.content}</p>
              
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-4 text-sm text-gray-500">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    lesson.level === 'basic' ? 'bg-green-100 text-green-700' :
                    lesson.level === 'intermediate' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-red-100 text-red-700'
                  }`}>
                    {lesson.level === 'basic' ? 'Básico' : lesson.level === 'intermediate' ? 'Intermediário' : 'Avançado'}
                  </span>
                  <div className="flex items-center space-x-1">
                    <Clock className="w-4 h-4" />
                    <span>{lesson.duration}</span>
                  </div>
                </div>
                <div className="flex items-center space-x-1 text-orange-600">
                  <Trophy className="w-4 h-4" />
                  <span className="text-sm font-medium">{lesson.points} pts</span>
                </div>
              </div>
              
              <button
                onClick={() => startLesson(lesson)}
                className={`w-full py-3 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center space-x-2 ${
                  lesson.completed 
                    ? 'bg-gradient-to-r from-green-400 to-green-600 text-white hover:from-green-500 hover:to-green-700'
                    : 'bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700'
                }`}
              >
                {lesson.completed ? (
                  <>
                    <RotateCcw className="w-5 h-5" />
                    <span>Revisar</span>
                  </>
                ) : (
                  <>
                    <Play className="w-5 h-5" />
                    <span>Iniciar</span>
                  </>
                )}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )

  // Tela de Exercícios
  const ExerciseScreen = () => {
    if (!selectedLesson) return null

    const currentExerciseData = selectedLesson.exercises[currentExercise]
    
    // Verificação de segurança para evitar erro quando currentExerciseData é undefined
    if (!currentExerciseData) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center p-4">
          <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-2xl max-w-md w-full text-center border border-white/20">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Exercício não encontrado</h2>
            <p className="text-gray-600 mb-6">Não foi possível carregar este exercício.</p>
            <button
              onClick={() => setCurrentScreen('lessons')}
              className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 rounded-xl font-semibold hover:from-blue-600 hover:to-purple-700 transition-all duration-300"
            >
              Voltar às Aulas
            </button>
          </div>
        </div>
      )
    }
    
    if (showResults) {
      const correctAnswers = exerciseAnswers.filter((answer, index) => 
        answer === selectedLesson.exercises[index].correctAnswer
      ).length
      const score = Math.round((correctAnswers / selectedLesson.exercises.length) * 100)
      const earnedPoints = Math.round((score / 100) * selectedLesson.points)

      return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center p-4">
          <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-2xl max-w-md w-full text-center border border-white/20">
            <div className="mb-6">
              {score >= 80 ? (
                <div className="bg-gradient-to-r from-green-400 to-green-600 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Trophy className="w-10 h-10 text-white" />
                </div>
              ) : score >= 60 ? (
                <div className="bg-gradient-to-r from-yellow-400 to-orange-500 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Medal className="w-10 h-10 text-white" />
                </div>
              ) : (
                <div className="bg-gradient-to-r from-blue-400 to-purple-500 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Target className="w-10 h-10 text-white" />
                </div>
              )}
              <h2 className="text-3xl font-bold text-gray-800 mb-2">
                {score >= 80 ? 'Excelente!' : score >= 60 ? 'Bom trabalho!' : 'Continue tentando!'}
              </h2>
              <p className="text-gray-600 mb-4">
                Você acertou {correctAnswers}/{selectedLesson.exercises.length} questões ({score}%)
              </p>
              <div className="bg-gradient-to-r from-orange-100 to-yellow-100 p-4 rounded-2xl">
                <div className="flex items-center justify-center space-x-2 text-orange-600">
                  <Trophy className="w-5 h-5" />
                  <span className="font-bold">+{earnedPoints} pontos ganhos!</span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <button
                onClick={() => setCurrentScreen('lessons')}
                className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 rounded-xl font-semibold hover:from-blue-600 hover:to-purple-700 transition-all duration-300"
              >
                Continuar Aprendendo
              </button>
              <button
                onClick={() => {
                  setCurrentExercise(0)
                  setExerciseAnswers([])
                  setShowResults(false)
                }}
                className="w-full bg-gray-100 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-200 transition-colors"
              >
                Tentar Novamente
              </button>
            </div>
          </div>
        </div>
      )
    }

    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
        {/* Header */}
        <div className="bg-white/80 backdrop-blur-sm shadow-sm border-b border-white/20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-4">
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setCurrentScreen('lessons')}
                  className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
                >
                  <X className="w-6 h-6 text-gray-600" />
                </button>
                <h1 className="text-xl font-bold text-gray-800">{selectedLesson.title}</h1>
              </div>
              <div className="text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
                {currentExercise + 1} / {selectedLesson.exercises.length}
              </div>
            </div>
            <div className="pb-4">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-blue-500 to-green-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${((currentExercise + 1) / selectedLesson.exercises.length) * 100}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/20">
            {currentExerciseData.type === 'multiple-choice' ? (
              <div>
                <h2 className="text-2xl font-bold text-gray-800 mb-8 text-center">
                  {currentExerciseData.question}
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {currentExerciseData.options?.map((option, index) => (
                    <button
                      key={index}
                      onClick={() => submitExercise(option)}
                      className="p-6 border-2 border-gray-200 rounded-2xl hover:border-blue-500 hover:bg-blue-50 transition-all duration-200 text-left font-medium text-gray-800 hover:shadow-lg transform hover:scale-105"
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center">
                <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-2xl p-8 mb-8 border border-blue-200">
                  <h2 className="text-3xl font-bold text-blue-600 mb-4">
                    {currentExerciseData.question}
                  </h2>
                  <p className="text-gray-600">Toque para revelar a tradução</p>
                </div>
                <button
                  onClick={() => submitExercise(currentExerciseData.correctAnswer)}
                  className="bg-gradient-to-r from-blue-500 to-green-500 text-white px-8 py-4 rounded-2xl font-semibold hover:from-blue-600 hover:to-green-600 transition-all duration-300 transform hover:scale-105"
                >
                  Mostrar Resposta
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    )
  }

  // Tela de Assinatura
  const SubscriptionScreen = () => (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm shadow-sm border-b border-white/20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setCurrentScreen('dashboard')}
                className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
              >
                <X className="w-6 h-6 text-gray-600" />
              </button>
              <h1 className="text-2xl font-bold text-gray-800">Escolha Seu Plano</h1>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-800 mb-4">Desbloqueie Todo Seu Potencial</h2>
          <p className="text-xl text-gray-600">Escolha o plano perfeito para sua jornada no inglês</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {/* Plano Gratuito */}
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl border-2 border-gray-200">
            <div className="text-center mb-8">
              <div className="bg-gray-100 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Gift className="w-8 h-8 text-gray-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-2">Gratuito</h3>
              <div className="text-4xl font-bold text-gray-800 mb-4">R$0<span className="text-lg text-gray-600">/mês</span></div>
              <p className="text-gray-600">Perfeito para começar</p>
            </div>
            
            <div className="space-y-4 mb-8">
              <div className="flex items-center space-x-3">
                <Check className="w-5 h-5 text-green-500" />
                <span className="text-gray-700">3 aulas por semana</span>
              </div>
              <div className="flex items-center space-x-3">
                <Check className="w-5 h-5 text-green-500" />
                <span className="text-gray-700">Vocabulário básico</span>
              </div>
              <div className="flex items-center space-x-3">
                <Check className="w-5 h-5 text-green-500" />
                <span className="text-gray-700">Suporte da comunidade</span>
              </div>
              <div className="flex items-center space-x-3">
                <X className="w-5 h-5 text-gray-400" />
                <span className="text-gray-400">Gramática avançada</span>
              </div>
              <div className="flex items-center space-x-3">
                <X className="w-5 h-5 text-gray-400" />
                <span className="text-gray-400">Prática de conversação</span>
              </div>
              <div className="flex items-center space-x-3">
                <X className="w-5 h-5 text-gray-400" />
                <span className="text-gray-400">Tutor IA</span>
              </div>
            </div>

            <button className="w-full bg-gray-100 text-gray-700 py-3 rounded-xl font-semibold">
              Plano Atual
            </button>
          </div>

          {/* Plano Mensal */}
          <div className="bg-gradient-to-br from-blue-500 via-purple-500 to-green-500 rounded-3xl p-8 shadow-2xl text-white relative overflow-hidden transform scale-105">
            <div className="absolute top-4 right-4">
              <div className="bg-yellow-400 text-yellow-900 px-3 py-1 rounded-full text-sm font-bold">
                POPULAR
              </div>
            </div>
            
            <div className="text-center mb-8">
              <Crown className="w-16 h-16 mx-auto mb-4 text-yellow-300" />
              <h3 className="text-2xl font-bold mb-2">Premium Mensal</h3>
              <div className="text-4xl font-bold mb-4">R$30<span className="text-lg text-blue-200">/mês</span></div>
              <p className="text-blue-100">Tudo que você precisa para dominar o inglês</p>
            </div>
            
            <div className="space-y-4 mb-8">
              <div className="flex items-center space-x-3">
                <Check className="w-5 h-5 text-green-300" />
                <span>Aulas ilimitadas</span>
              </div>
              <div className="flex items-center space-x-3">
                <Check className="w-5 h-5 text-green-300" />
                <span>Todo vocabulário & gramática</span>
              </div>
              <div className="flex items-center space-x-3">
                <Check className="w-5 h-5 text-green-300" />
                <span>Prática de conversação</span>
              </div>
              <div className="flex items-center space-x-3">
                <Check className="w-5 h-5 text-green-300" />
                <span>Tutor IA 24/7</span>
              </div>
              <div className="flex items-center space-x-3">
                <Check className="w-5 h-5 text-green-300" />
                <span>Acompanhamento de progresso</span>
              </div>
              <div className="flex items-center space-x-3">
                <Check className="w-5 h-5 text-green-300" />
                <span>Downloads offline</span>
              </div>
              <div className="flex items-center space-x-3">
                <Check className="w-5 h-5 text-green-300" />
                <span>Certificados digitais</span>
              </div>
            </div>

            <button className="w-full bg-white text-blue-600 py-3 rounded-xl font-semibold hover:bg-gray-100 transition-colors">
              Assinar Agora
            </button>
          </div>

          {/* Plano Anual */}
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl border-2 border-green-300 relative">
            <div className="absolute top-4 right-4">
              <div className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                MELHOR VALOR
              </div>
            </div>
            
            <div className="text-center mb-8">
              <div className="bg-green-100 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-2">Premium Anual</h3>
              <div className="text-4xl font-bold text-gray-800 mb-2">R$60<span className="text-lg text-gray-600">/ano</span></div>
              <div className="text-sm text-green-600 font-semibold mb-4">Economize R$300 por ano!</div>
              <p className="text-gray-600">O melhor investimento no seu futuro</p>
            </div>
            
            <div className="space-y-4 mb-8">
              <div className="flex items-center space-x-3">
                <Check className="w-5 h-5 text-green-500" />
                <span className="text-gray-700">Todos os recursos Premium</span>
              </div>
              <div className="flex items-center space-x-3">
                <Check className="w-5 h-5 text-green-500" />
                <span className="text-gray-700">Suporte prioritário</span>
              </div>
              <div className="flex items-center space-x-3">
                <Check className="w-5 h-5 text-green-500" />
                <span className="text-gray-700">Acesso antecipado a novos recursos</span>
              </div>
              <div className="flex items-center space-x-3">
                <Check className="w-5 h-5 text-green-500" />
                <span className="text-gray-700">Certificados oficiais</span>
              </div>
              <div className="flex items-center space-x-3">
                <Check className="w-5 h-5 text-green-500" />
                <span className="text-gray-700">Sessões de conversação ao vivo</span>
              </div>
              <div className="flex items-center space-x-3">
                <Check className="w-5 h-5 text-green-500" />
                <span className="text-gray-700">Plano de estudos personalizado</span>
              </div>
            </div>

            <button className="w-full bg-gradient-to-r from-green-500 to-blue-500 text-white py-3 rounded-xl font-semibold hover:from-green-600 hover:to-blue-600 transition-all duration-300">
              Assinar Anual
            </button>
          </div>
        </div>

        {/* Métodos de Pagamento */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/20">
          <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">Métodos de Pagamento</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="flex items-center justify-center p-4 border border-gray-200 rounded-xl hover:border-blue-500 transition-colors cursor-pointer">
              <CreditCard className="w-6 h-6 text-gray-600 mr-3" />
              <span className="font-medium text-gray-800">Cartão de Crédito</span>
            </div>
            <div className="flex items-center justify-center p-4 border border-gray-200 rounded-xl hover:border-blue-500 transition-colors cursor-pointer">
              <span className="font-medium text-gray-800">PIX</span>
            </div>
            <div className="flex items-center justify-center p-4 border border-gray-200 rounded-xl hover:border-blue-500 transition-colors cursor-pointer">
              <span className="font-medium text-gray-800">MercadoPago</span>
            </div>
          </div>
          
          <div className="mt-8 text-center">
            <p className="text-gray-600 mb-4">🔒 Pagamento 100% seguro e criptografado</p>
            <p className="text-sm text-gray-500">Cancele a qualquer momento. Sem taxas ocultas.</p>
          </div>
        </div>
      </div>
    </div>
  )

  // Chat com IA
  const ChatScreen = () => (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm shadow-sm border-b border-white/20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setCurrentScreen('dashboard')}
                className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
              >
                <X className="w-6 h-6 text-gray-600" />
              </button>
              <div className="flex items-center space-x-3">
                <div className="bg-gradient-to-r from-green-500 to-blue-500 w-10 h-10 rounded-full flex items-center justify-center">
                  <Brain className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-800">Tutor IA EnglishPro</h1>
                  <div className="text-sm text-green-600 flex items-center space-x-1">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>Online</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4 h-[calc(100vh-120px)] flex flex-col">
        {/* Mensagens */}
        <div className="flex-1 overflow-y-auto space-y-4 mb-4">
          {chatMessages.length === 0 && (
            <div className="text-center py-12">
              <div className="bg-gradient-to-r from-green-500 to-blue-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Brain className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Olá! Sou seu Tutor IA de Inglês</h3>
              <p className="text-gray-600 mb-6">Pergunte-me qualquer coisa sobre gramática, vocabulário ou pronúncia!</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-2xl mx-auto">
                <button
                  onClick={() => setChatInput("Qual a diferença entre 'a' e 'an'?")}
                  className="p-4 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-xl hover:border-blue-500 transition-colors text-left shadow-sm"
                >
                  <div className="flex items-center space-x-2 mb-2">
                    <Target className="w-5 h-5 text-green-500" />
                    <span className="font-medium text-gray-800">Gramática</span>
                  </div>
                  <p className="text-sm text-gray-600">Diferença entre artigos</p>
                </button>
                <button
                  onClick={() => setChatInput("Como pronunciar 'through'?")}
                  className="p-4 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-xl hover:border-blue-500 transition-colors text-left shadow-sm"
                >
                  <div className="flex items-center space-x-2 mb-2">
                    <Mic className="w-5 h-5 text-pink-500" />
                    <span className="font-medium text-gray-800">Pronúncia</span>
                  </div>
                  <p className="text-sm text-gray-600">Ajuda com sons difíceis</p>
                </button>
                <button
                  onClick={() => setChatInput("Me ajude a praticar conversação")}
                  className="p-4 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-xl hover:border-blue-500 transition-colors text-left shadow-sm"
                >
                  <div className="flex items-center space-x-2 mb-2">
                    <MessageCircle className="w-5 h-5 text-purple-500" />
                    <span className="font-medium text-gray-800">Conversação</span>
                  </div>
                  <p className="text-sm text-gray-600">Prática de diálogo</p>
                </button>
                <button
                  onClick={() => setChatInput("Explique o present perfect")}
                  className="p-4 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-xl hover:border-blue-500 transition-colors text-left shadow-sm"
                >
                  <div className="flex items-center space-x-2 mb-2">
                    <BookOpen className="w-5 h-5 text-blue-500" />
                    <span className="font-medium text-gray-800">Tempos Verbais</span>
                  </div>
                  <p className="text-sm text-gray-600">Explicações detalhadas</p>
                </button>
              </div>
            </div>
          )}
          
          {chatMessages.map((message, index) => (
            <div key={index} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl ${
                message.role === 'user' 
                  ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white' 
                  : 'bg-white/80 backdrop-blur-sm text-gray-800 shadow-sm border border-white/20'
              }`}>
                <p className="text-sm">{message.message}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Input */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 shadow-xl border border-white/20">
          <div className="flex items-center space-x-3">
            <input
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && sendChatMessage()}
              placeholder="Pergunte qualquer coisa sobre inglês..."
              className="flex-1 bg-gray-50 border-0 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:bg-white transition-colors"
            />
            <button
              onClick={sendChatMessage}
              className="bg-gradient-to-r from-blue-500 to-green-500 text-white p-3 rounded-xl hover:from-blue-600 hover:to-green-600 transition-all duration-300 transform hover:scale-105"
            >
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )

  // Painel Administrativo
  const AdminScreen = () => (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm shadow-sm border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setCurrentScreen('dashboard')}
                className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
              >
                <Home className="w-6 h-6 text-gray-600" />
              </button>
              <h1 className="text-2xl font-bold text-gray-800">Painel Administrativo</h1>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Estatísticas */}
          <div className="lg:col-span-2 space-y-8">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-white/20">
                <div className="flex items-center justify-between mb-4">
                  <Users className="w-8 h-8 text-blue-500" />
                  <span className="text-2xl font-bold text-gray-800">2,847</span>
                </div>
                <h3 className="font-semibold text-gray-800">Total de Alunos</h3>
                <div className="text-sm text-green-600 flex items-center space-x-1">
                  <TrendingUp className="w-4 h-4" />
                  <span>+18% este mês</span>
                </div>
              </div>
              
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-white/20">
                <div className="flex items-center justify-between mb-4">
                  <Crown className="w-8 h-8 text-yellow-500" />
                  <span className="text-2xl font-bold text-gray-800">1,234</span>
                </div>
                <h3 className="font-semibold text-gray-800">Usuários Premium</h3>
                <div className="text-sm text-green-600 flex items-center space-x-1">
                  <TrendingUp className="w-4 h-4" />
                  <span>+25% este mês</span>
                </div>
              </div>
              
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-white/20">
                <div className="flex items-center justify-between mb-4">
                  <BarChart3 className="w-8 h-8 text-green-500" />
                  <span className="text-2xl font-bold text-gray-800">R$ 45.670</span>
                </div>
                <h3 className="font-semibold text-gray-800">Receita Mensal</h3>
                <div className="text-sm text-green-600 flex items-center space-x-1">
                  <TrendingUp className="w-4 h-4" />
                  <span>+32% este mês</span>
                </div>
              </div>
            </div>

            {/* Upload de Aulas */}
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/20">
              <h3 className="text-2xl font-bold text-gray-800 mb-6">Adicionar Nova Aula</h3>
              <div className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Título da Aula</label>
                    <input
                      type="text"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Digite o título da aula"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Módulo</label>
                    <select className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                      <option>Vocabulário</option>
                      <option>Gramática</option>
                      <option>Conversação</option>
                      <option>Listening</option>
                      <option>Pronúncia</option>
                    </select>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Nível</label>
                    <select className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                      <option>Básico</option>
                      <option>Intermediário</option>
                      <option>Avançado</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Duração</label>
                    <input
                      type="text"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="ex: 15 min"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Descrição</label>
                  <textarea
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Descreva o conteúdo da aula"
                  ></textarea>
                </div>
                
                <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-blue-500 transition-colors">
                  <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 mb-2">Fazer upload do vídeo</p>
                  <p className="text-sm text-gray-500">MP4, MOV até 500MB</p>
                  <button className="mt-4 bg-blue-500 text-white px-6 py-2 rounded-xl hover:bg-blue-600 transition-colors">
                    Escolher Arquivo
                  </button>
                </div>
                
                <div className="flex items-center space-x-4">
                  <label className="flex items-center space-x-2">
                    <input type="checkbox" className="rounded" />
                    <span className="text-sm text-gray-700">Aula Premium</span>
                  </label>
                  <div className="flex items-center space-x-2">
                    <Trophy className="w-4 h-4 text-orange-500" />
                    <input
                      type="number"
                      placeholder="Pontos"
                      className="w-20 px-2 py-1 border border-gray-300 rounded text-sm"
                    />
                  </div>
                </div>
                
                <button className="w-full bg-gradient-to-r from-green-500 to-blue-500 text-white py-3 rounded-xl font-semibold hover:from-green-600 hover:to-blue-600 transition-all duration-300">
                  Publicar Aula
                </button>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Ações Rápidas */}
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 shadow-xl border border-white/20">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Ações Rápidas</h3>
              <div className="space-y-3">
                <button className="w-full flex items-center space-x-3 p-3 text-left hover:bg-blue-50 rounded-xl transition-colors">
                  <Plus className="w-5 h-5 text-blue-500" />
                  <span className="font-medium text-gray-800">Nova Aula</span>
                </button>
                <button className="w-full flex items-center space-x-3 p-3 text-left hover:bg-green-50 rounded-xl transition-colors">
                  <Users className="w-5 h-5 text-green-500" />
                  <span className="font-medium text-gray-800">Gerenciar Alunos</span>
                </button>
                <button className="w-full flex items-center space-x-3 p-3 text-left hover:bg-purple-50 rounded-xl transition-colors">
                  <BarChart3 className="w-5 h-5 text-purple-500" />
                  <span className="font-medium text-gray-800">Relatórios</span>
                </button>
                <button className="w-full flex items-center space-x-3 p-3 text-left hover:bg-orange-50 rounded-xl transition-colors">
                  <Crown className="w-5 h-5 text-orange-500" />
                  <span className="font-medium text-gray-800">Assinaturas</span>
                </button>
              </div>
            </div>

            {/* Assinaturas Recentes */}
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 shadow-xl border border-white/20">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Assinaturas Recentes</h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-3 p-3 bg-gradient-to-r from-green-50 to-blue-50 rounded-xl">
                  <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-bold">JS</span>
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-800">João Silva</p>
                    <p className="text-sm text-gray-600">Premium Anual - R$60</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl">
                  <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-bold">MJ</span>
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-800">Maria José</p>
                    <p className="text-sm text-gray-600">Premium Mensal - R$30</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl">
                  <div className="w-8 h-8 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-bold">PC</span>
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-800">Pedro Costa</p>
                    <p className="text-sm text-gray-600">Premium Mensal - R$30</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Estatísticas Rápidas */}
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 shadow-xl border border-white/20">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Estatísticas</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Taxa de Conversão</span>
                  <span className="font-bold text-green-600">43.2%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Retenção Mensal</span>
                  <span className="font-bold text-blue-600">87.5%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Aulas Completadas</span>
                  <span className="font-bold text-purple-600">12,456</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Satisfação</span>
                  <span className="font-bold text-yellow-600">4.8/5</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )

  // Tela de Perfil
  const ProfileScreen = () => (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm shadow-sm border-b border-white/20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setCurrentScreen('dashboard')}
                className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
              >
                <X className="w-6 h-6 text-gray-600" />
              </button>
              <h1 className="text-2xl font-bold text-gray-800">Meu Perfil</h1>
            </div>
            <button
              onClick={() => setCurrentScreen('welcome')}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              <LogOut className="w-5 h-5" />
              <span>Sair</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Informações do Perfil */}
          <div className="lg:col-span-2 space-y-8">
            {/* Dados Pessoais */}
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/20">
              <h3 className="text-2xl font-bold text-gray-800 mb-6">Informações Pessoais</h3>
              <div className="flex items-center space-x-6 mb-8">
                <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-green-500 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                  {user?.name.charAt(0)}
                </div>
                <div>
                  <h4 className="text-xl font-bold text-gray-800">{user?.name}</h4>
                  <p className="text-gray-600">{user?.email}</p>
                  <p className="text-blue-600 font-medium">{user?.level}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Nome</label>
                  <input
                    type="text"
                    defaultValue={user?.name}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  <input
                    type="email"
                    defaultValue={user?.email}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
              
              <button className="mt-6 bg-gradient-to-r from-blue-500 to-green-500 text-white px-6 py-3 rounded-xl font-semibold hover:from-blue-600 hover:to-green-600 transition-all duration-300">
                Salvar Alterações
              </button>
            </div>

            {/* Estatísticas Detalhadas */}
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/20">
              <h3 className="text-2xl font-bold text-gray-800 mb-6">Suas Estatísticas</h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="bg-blue-100 w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-2">
                    <Trophy className="w-6 h-6 text-blue-600" />
                  </div>
                  <p className="text-2xl font-bold text-gray-800">{user?.points}</p>
                  <p className="text-sm text-gray-600">Pontos</p>
                </div>
                <div className="text-center">
                  <div className="bg-red-100 w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-2">
                    <Flame className="w-6 h-6 text-red-600" />
                  </div>
                  <p className="text-2xl font-bold text-gray-800">{user?.streak}</p>
                  <p className="text-sm text-gray-600">Sequência</p>
                </div>
                <div className="text-center">
                  <div className="bg-green-100 w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-2">
                    <BookOpen className="w-6 h-6 text-green-600" />
                  </div>
                  <p className="text-2xl font-bold text-gray-800">{user?.lessonsCompleted}</p>
                  <p className="text-sm text-gray-600">Aulas</p>
                </div>
                <div className="text-center">
                  <div className="bg-purple-100 w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-2">
                    <Medal className="w-6 h-6 text-purple-600" />
                  </div>
                  <p className="text-2xl font-bold text-gray-800">{user?.badges.length}</p>
                  <p className="text-sm text-gray-600">Badges</p>
                </div>
              </div>
            </div>

            {/* Todas as Conquistas */}
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/20">
              <h3 className="text-2xl font-bold text-gray-800 mb-6">Todas as Conquistas</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {user?.badges.map((badge, index) => (
                  <div key={index} className="flex items-center space-x-3 p-4 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl border border-yellow-200">
                    <Medal className="w-8 h-8 text-yellow-600" />
                    <div>
                      <p className="font-medium text-gray-800">{badge}</p>
                      <p className="text-sm text-gray-600">Conquistado</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Status da Assinatura */}
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 shadow-xl border border-white/20">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Assinatura</h3>
              <div className="text-center">
                {user?.subscription === 'free' ? (
                  <>
                    <div className="bg-gray-100 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <Gift className="w-8 h-8 text-gray-600" />
                    </div>
                    <p className="font-semibold text-gray-800 mb-2">Plano Gratuito</p>
                    <p className="text-sm text-gray-600 mb-4">3 aulas por semana</p>
                    <button
                      onClick={() => setCurrentScreen('subscription')}
                      className="w-full bg-gradient-to-r from-blue-500 to-green-500 text-white py-2 rounded-xl font-medium hover:from-blue-600 hover:to-green-600 transition-all duration-300"
                    >
                      Fazer Upgrade
                    </button>
                  </>
                ) : (
                  <>
                    <div className="bg-gradient-to-r from-yellow-400 to-orange-500 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <Crown className="w-8 h-8 text-white" />
                    </div>
                    <p className="font-semibold text-gray-800 mb-2">Premium {user?.subscription === 'monthly' ? 'Mensal' : 'Anual'}</p>
                    <p className="text-sm text-gray-600 mb-4">Acesso ilimitado</p>
                    <button className="w-full bg-gray-100 text-gray-700 py-2 rounded-xl font-medium">
                      Gerenciar Assinatura
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* Certificados */}
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 shadow-xl border border-white/20">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Certificados</h3>
              <div className="space-y-3">
                {user?.certificates.map((certificate, index) => (
                  <div key={index} className="flex items-center space-x-3 p-3 bg-gradient-to-r from-blue-50 to-green-50 rounded-xl border border-blue-200">
                    <Award className="w-6 h-6 text-blue-600" />
                    <div className="flex-1">
                      <p className="font-medium text-gray-800 text-sm">{certificate}</p>
                      <p className="text-xs text-gray-600">Certificado oficial</p>
                    </div>
                  </div>
                ))}
                <button
                  onClick={() => setCurrentScreen('certificates')}
                  className="w-full text-center text-blue-600 hover:text-blue-700 font-medium text-sm py-2"
                >
                  Ver todos os certificados
                </button>
              </div>
            </div>

            {/* Configurações */}
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 shadow-xl border border-white/20">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Configurações</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-700">Notificações</span>
                  <input type="checkbox" className="rounded" defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-700">Lembrete diário</span>
                  <input type="checkbox" className="rounded" defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-700">Sons</span>
                  <input type="checkbox" className="rounded" defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-700">Modo escuro</span>
                  <input type="checkbox" className="rounded" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )

  // Tela de Certificados
  const CertificatesScreen = () => (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm shadow-sm border-b border-white/20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setCurrentScreen('dashboard')}
                className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
              >
                <X className="w-6 h-6 text-gray-600" />
              </button>
              <h1 className="text-2xl font-bold text-gray-800">Meus Certificados</h1>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <div className="bg-gradient-to-r from-blue-500 to-green-500 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Award className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-gray-800 mb-2">Parabéns pelas suas conquistas!</h2>
          <p className="text-gray-600">Seus certificados oficiais de proficiência em inglês</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {user?.certificates.map((certificate, index) => (
            <div key={index} className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/20 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-500/10 to-green-500/10 rounded-full -mr-16 -mt-16"></div>
              <div className="relative">
                <div className="flex items-center justify-between mb-6">
                  <Award className="w-12 h-12 text-blue-600" />
                  <div className="text-right">
                    <p className="text-sm text-gray-600">EnglishPro</p>
                    <p className="text-xs text-gray-500">Certificado Oficial</p>
                  </div>
                </div>
                
                <h3 className="text-xl font-bold text-gray-800 mb-2">{certificate}</h3>
                <p className="text-gray-600 mb-4">Certificamos que {user?.name} completou com sucesso o curso e demonstrou proficiência nas habilidades avaliadas.</p>
                
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <p className="text-sm text-gray-600">Data de conclusão</p>
                    <p className="font-semibold text-gray-800">15 de Dezembro, 2024</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-600">Nível</p>
                    <p className="font-semibold text-gray-800">{user?.level}</p>
                  </div>
                </div>
                
                <div className="border-t border-gray-200 pt-4">
                  <div className="flex items-center justify-between">
                    <button className="bg-blue-500 text-white px-4 py-2 rounded-xl font-medium hover:bg-blue-600 transition-colors">
                      Download PDF
                    </button>
                    <button className="text-blue-600 hover:text-blue-700 font-medium">
                      Compartilhar
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
          
          {/* Próximo Certificado */}
          <div className="bg-gradient-to-br from-gray-100 to-gray-200 rounded-3xl p-8 shadow-xl border-2 border-dashed border-gray-300 flex items-center justify-center">
            <div className="text-center">
              <div className="bg-gray-300 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Target className="w-8 h-8 text-gray-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-700 mb-2">Próximo Certificado</h3>
              <p className="text-gray-600 mb-4">Complete mais 15 aulas para desbloquear o certificado de Conversação Avançada</p>
              <button
                onClick={() => setCurrentScreen('lessons')}
                className="bg-gradient-to-r from-blue-500 to-green-500 text-white px-6 py-2 rounded-xl font-medium hover:from-blue-600 hover:to-green-600 transition-all duration-300"
              >
                Continuar Estudando
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )

  // Renderização condicional das telas
  const renderScreen = () => {
    switch (currentScreen) {
      case 'welcome':
        return <WelcomeScreen />
      case 'login':
        return <LoginScreen />
      case 'register':
        return <RegisterScreen />
      case 'dashboard':
        return <DashboardScreen />
      case 'lessons':
        return <LessonsScreen />
      case 'exercise':
        return <ExerciseScreen />
      case 'subscription':
        return <SubscriptionScreen />
      case 'chat':
        return <ChatScreen />
      case 'admin':
        return <AdminScreen />
      case 'profile':
        return <ProfileScreen />
      case 'certificates':
        return <CertificatesScreen />
      default:
        return <WelcomeScreen />
    }
  }

  return renderScreen()
}