'use client'
import { useState, useEffect } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { 
  ArrowLeft, 
  Mail, 
  Phone, 
  Send, 
  Search, 
  MessageSquare, 
  Flag,
  TrendingUp,
  AlertTriangle,
  DollarSign,
  CreditCard,
  PieChart
} from 'lucide-react'
import React from 'react';

interface ProbabilityTrendData {
  month: string;
  probability: number;
}

interface ClientData {
  probabilityTrend: ProbabilityTrendData[];
  segment: string;
}

interface ChatMessage {
  role: 'assistant' | 'user';
  content: string;
}

interface ClientDetails {
  startDate: string;
  monthlyPayment: string;
  paymentsMade: string;
  progress: number;
  monthlyIncome: string;
  totalDebt: string;
  debtToIncomeRatio: string;
  creditScore: number;
  savingsBalance: string;
}

interface Client {
  id: number;
  name: string;
  programType: string;
  status: string;
  segment: string;
  probabilityTrend: ProbabilityTrendData[];
  lastContact: string;
  details: ClientDetails;
}

// Trend Visualization Component
const TrendVisualization = ({ client }: { client: Client }) => {
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <Card className="animate-pulse">
      <CardContent className="h-[400px] bg-gray-100" />
    </Card>;
  }

  const trendData = client.probabilityTrend;
  const latestProbability = trendData[trendData.length - 1].probability;
  const isPositiveTrend = latestProbability > trendData[0].probability;
  const maxProbability = Math.max(...trendData.map(d => d.probability));
  
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-xl font-semibold text-gray-900">Success Probability</CardTitle>
            <div className="flex items-center gap-2 mt-1">
              <span className={`text-2xl font-bold ${
                isPositiveTrend ? 'text-green-600' : 'text-red-600'
              }`}>
                {latestProbability.toFixed(1)}%
              </span>
              <span className={`flex items-center gap-1 text-sm ${
                isPositiveTrend ? 'text-green-600' : 'text-red-600'
              }`}>
                {isPositiveTrend ? <TrendingUp className="h-4 w-4" /> : <AlertTriangle className="h-4 w-4" />}
                {isPositiveTrend ? 'Improving' : 'Needs Attention'}
              </span>
            </div>
          </div>
          <div className="text-right">
            <span className="inline-flex items-center justify-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 whitespace-nowrap">
              {client.segment}
            </span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Trend Bar Visualization */}
          <div className="grid grid-cols-7 gap-2">
            {trendData.map((point, index) => (
              <div key={index} className="flex flex-col items-center gap-1">
                <div className="relative w-full h-32 bg-gray-100 rounded-lg overflow-hidden">
                  <div 
                    className={`absolute bottom-0 w-full transition-all duration-500 rounded-t-lg ${
                      isPositiveTrend ? 'bg-green-500' : 'bg-red-500'
                    }`}
                    style={{ 
                      height: `${(point.probability / 100) * 100}%`,
                      opacity: 0.8
                    }}
                  />
                </div>
                <span className="text-xs font-medium text-gray-600">{point.month}</span>
                <span className="text-sm font-semibold text-gray-900">{point.probability}%</span>
              </div>
            ))}
          </div>

          {/* Trend Summary */}
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="grid grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-gray-600">Starting</p>
                <p className="text-lg font-semibold text-gray-900">{trendData[0].probability}%</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Current</p>
                <p className="text-lg font-semibold text-gray-900">{latestProbability}%</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Highest</p>
                <p className="text-lg font-semibold text-gray-900">{maxProbability}%</p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default function Page() {
  const [mounted, setMounted] = React.useState(false);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [loading, setLoading] = useState(false);
  const [showActions, setShowActions] = useState(false);
  const [chatMessage, setChatMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [loadingChat, setLoadingChat] = useState(true);

  useEffect(() => {
    setMounted(true);
  }, []);

  const clients = [
    {
      id: 1,
      name: "Noah McDonough",
      programType: "Debt Consolidation",
      status: "On Track",
      segment: "Indebted Homeowners",
      probabilityTrend: [
        { month: 'Sep', probability: 65 },
        { month: 'Oct', probability: 71 },
        { month: 'Nov', probability: 68 },
        { month: 'Dec', probability: 75 },
        { month: 'Jan', probability: 73 },
        { month: 'Feb', probability: 82 },
        { month: 'Mar', probability: 85 }
      ],
      lastContact: "2024-03-05",
      details: {
        startDate: "September 2023",
        monthlyPayment: "$650",
        paymentsMade: "7/48",
        progress: 10,
        monthlyIncome: "$8,200",
        totalDebt: "$21,500",
        debtToIncomeRatio: "15.8%",
        creditScore: 720,
        savingsBalance: "$3,100"
      }
    },
    {
      id: 2,
      name: "Yuchen Zhang",
      programType: "Debt Consolidation",
      status: "Needs Review",
      segment: "Uncertain Canadians",
      probabilityTrend: [
        { month: 'Jul', probability: 70 },
        { month: 'Aug', probability: 65 },
        { month: 'Sep', probability: 68 },
        { month: 'Oct', probability: 62 },
        { month: 'Nov', probability: 58 },
        { month: 'Dec', probability: 60 },
        { month: 'Jan', probability: 55 },
     
      ],
      lastContact: "2024-03-01",
      details: {
        startDate: "July 2023",
        monthlyPayment: "$480",
        paymentsMade: "7/36",
        progress: 22,
        monthlyIncome: "$2,800",
        totalDebt: "$32,000",
        debtToIncomeRatio: "58.2%",
        creditScore: 600,
        savingsBalance: "$1,500"
      }
    }
  ];

  useEffect(() => {
    if (selectedClient) {
      setLoading(true);
      setShowActions(false);
      setLoadingChat(true);
      setChatHistory([]);
      
      setTimeout(() => {
        setLoading(false);
        setShowActions(true);
      }, 5000);

      setTimeout(() => {
        setLoadingChat(false);
        setChatHistory([
          { 
            role: 'assistant', 
            content: "Here's recommended content based on our algorithm:" 
          },
          {
            role: 'assistant',
            content: "🎯 Emergency Fund Building Guide\n🛒 Smart Shopping Tips\n📊 Budget Strategy Review"
          }
        ]);
      }, 5000);
    }
  }, [selectedClient]);

  const getNextBestActions = (client: Client) => {
    if (client.status === 'On Track') {
      return [
        {
          title: "Program Milestone",
          description: "Client has consistently made on-time payments. Good opportunity to discuss long-term financial goals.",
          impact: "High",
          timeframe: "This week",
          icon: <DollarSign className="h-6 w-6 text-green-600" />,
          metrics: {
            successfulPayments: "5 months",
            savingsGrowth: "+15%",
            nextMilestone: "6 months"
          }
        },
        {
          title: "Set Up Butterfly Budgeting App",
          description: "Introduce client to our budgeting app for better expense tracking and real-time insights.",
          impact: "Medium",
          timeframe: "Within 1 week",
          icon: <PieChart className="h-6 w-6 text-purple-600" />,
          metrics: {
            potentialSavings: "$200-300/month",
            setupTime: "15 minutes"
          }
        },
        {
          title: "Credit Score Review",
          description: "Credit score has improved. Schedule review to discuss potential rate improvements.",
          impact: "High",
          timeframe: "This week",
          icon: <TrendingUp className="h-6 w-6 text-blue-600" />,
          metrics: {
            scoreIncrease: "+35 points",
            potentialSavings: "$150/month",
            nextReview: "March 20"
          }
        }
      ];
    } else {
      return [
        {
          title: "Missing Payment Alert",
          description: "Client missed their last scheduled payment. Recommend immediate follow-up to prevent program delays.",
          impact: "High",
          timeframe: "Immediate",
          icon: <DollarSign className="h-6 w-6 text-red-600" />,
          metrics: {
            missedAmount: "$650",
            daysOverdue: "5 days",
            nextDueDate: "March 15"
          }
        },
        {
          title: "Set Up Butterfly Budgeting App",
          description: "Introduce client to our budgeting app for better expense tracking and real-time insights.",
          impact: "Medium",
          timeframe: "Within 1 week",
          icon: <PieChart className="h-6 w-6 text-purple-600" />,
          metrics: {
            potentialSavings: "$200-300/month",
            setupTime: "15 minutes"
          }
        },
        {
          title: "Payment Schedule Update",
          description: "Multiple missed payments detected. Review and adjust payment schedule.",
          impact: "High",
          timeframe: "This week",
          icon: <TrendingUp className="h-6 w-6 text-yellow-600" />,
          metrics: {
            missedPayments: "2 in last 3 months",
            totalOverdue: "$1,300",
            recommendedDate: "15th of month"
          }
        }
      ];
    }
  };

  const suggestedContent = [
    {
      title: "Emergency Fund Guide",
      type: "Article",
      readTime: "5 min",
      icon: "🎯"
    },
    {
      title: "Smart Grocery Shopping",
      type: "Checklist",
      readTime: "3 min",
      icon: "🛒"
    },
    {
      title: "Debt Reduction Calculator",
      type: "Tool",
      readTime: "2 min",
      icon: "🧮"
    }
  ];

  const conversationHistory = [
    {
      date: "March 5, 2024",
      counselor: "John Smith",
      content: "Discussed emergency fund strategies. Client interested in automatic savings plan."
    },
    {
      date: "February 28, 2024",
      counselor: "Sarah Lee",
      content: "Reviewed budget. Identified potential savings in transportation and entertainment categories."
    }
  ];

  const handleChatSubmit = () => {
    if (chatMessage.trim()) {
      setChatHistory([...chatHistory, { role: 'user', content: chatMessage }]);
      setChatMessage('');
      setIsTyping(true);
      
      setTimeout(() => {
        setIsTyping(false);
        setChatHistory(prev => [
          ...prev,
          { 
            role: 'assistant',
            content: "Based on your question, here are some relevant resources:"
          },
          {
            role: 'assistant',
            content: "🎯 Building an Emergency Fund 101\nLearn the basics of creating a safety net with easy weekly savings targets and practical tips."
          },
          {
            role: 'assistant',
            content: "🛒 Smart Grocery Shopping Guide\nPractical strategies to reduce grocery expenses without compromising on nutrition."
          }
        ]);
      }, 2000);
    }
  };

  if (!mounted) {
    return null;
  }

  if (!selectedClient) {
    return (
      <div className="min-h-screen bg-gray-50">
        <nav className="border-b bg-white">
          <div className="max-w-7xl mx-auto px-4 py-2">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
                  <path d="M20 8L28 16L20 24L12 16L20 8Z" fill="rgb(51,109,246)" />
                  <path d="M20 16L28 24L20 32L12 24L20 16Z" fill="rgb(51,109,246)" opacity="0.7" />
                </svg>
                <span className="text-lg font-semibold text-gray-900">Credit Canada</span>
                </div>
              <div className="flex items-center space-x-6">
                <Button variant="ghost" className="text-gray-700 hover:text-gray-900">Dashboard</Button>
                <Button variant="ghost" className="text-gray-700 hover:text-gray-900">Clients</Button>
                <Button variant="ghost" className="text-gray-700 hover:text-gray-900">Resources</Button>
                <Button variant="ghost" className="text-gray-700 hover:text-gray-900">Settings</Button>
              </div>
            </div>
          </div>
        </nav>

        <div className="max-w-7xl mx-auto p-4">
          <Card className="bg-white">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Clients</h2>
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
                  <Input placeholder="Search clients..." className="pl-8 w-64" />
                </div>
              </div>
              
              <div className="space-y-2">
                {clients.map((client) => (
                  <div
                    key={client.id}
                    onClick={() => setSelectedClient(client)}
                    className="p-4 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="font-medium text-gray-900">{client.name}</h3>
                        <p className="text-sm text-gray-600">{client.programType}</p>
                      </div>
                      <div className="text-right">
                        <span className={`px-2 py-1 rounded-full flex items-center gap-1 text-sm ${
                          client.status === 'On Track' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          <Flag className="h-3 w-3" />
                          {client.status}
                        </span>
                        <p className="text-sm text-gray-600 mt-1">Last Contact: {client.lastContact}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="border-b bg-white">
        <div className="max-w-7xl mx-auto px-4 py-2">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
                <path d="M20 8L28 16L20 24L12 16L20 8Z" fill="rgb(51,109,246)" />
                <path d="M20 16L28 24L20 32L12 24L20 16Z" fill="rgb(51,109,246)" opacity="0.7" />
              </svg>
              <span className="text-lg font-semibold text-gray-900">Credit Canada</span>
            </div>
            <div className="flex items-center space-x-6">
              <Button variant="ghost" className="text-gray-700 hover:text-gray-900">Dashboard</Button>
              <Button variant="ghost" className="text-gray-700 hover:text-gray-900">Clients</Button>
              <Button variant="ghost" className="text-gray-700 hover:text-gray-900">Resources</Button>
              <Button variant="ghost" className="text-gray-700 hover:text-gray-900">Settings</Button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto p-4">
        <Button 
          variant="outline" 
          onClick={() => setSelectedClient(null)}
          className="mb-4 flex items-center gap-2 text-gray-700 hover:text-gray-900"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Client List
        </Button>

        <div className="grid grid-cols-3 gap-4">
          {/* Client Information Card */}
          <Card className="col-span-1 bg-white">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-xl font-semibold text-gray-900">Client Information</h2>
                <span className={`px-2 py-1 rounded-full flex items-center gap-1 text-sm ${
                  selectedClient?.status === 'On Track' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-yellow-100 text-yellow-800'
                }`}>
                  <Flag className="h-3 w-3" />
                  {selectedClient?.status}
                </span>
              </div>
              
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium text-lg text-gray-900">{selectedClient.name}</h3>
                  <p className="text-sm text-gray-600">Program: {selectedClient.programType}</p>
                  <p className="text-sm text-gray-600">Last Contact: {selectedClient.lastContact}</p>
                  
                  <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                    <h4 className="font-medium text-sm text-gray-900 mb-2">Program Status</h4>
                    <div className="space-y-1">
                      <p className="text-sm text-gray-700">Start Date: {selectedClient.details.startDate}</p>
                      <p className="text-sm text-gray-700">Monthly Payment: {selectedClient.details.monthlyPayment}</p>
                      <p className="text-sm text-gray-700">Progress: {selectedClient.details.paymentsMade}</p>
                      <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                        <div 
                          className="bg-blue-500 rounded-full h-2 transition-all duration-500" 
                          style={{ width: `${selectedClient.details.progress}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Trend Visualization */}
                <TrendVisualization client={selectedClient} />

                {/* Financial Overview */}
                <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                  <h4 className="font-medium text-sm text-gray-900 mb-2">Financial Overview</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Monthly Income</span>
                      <span className="text-sm font-medium text-gray-900">
                        {selectedClient.details.monthlyIncome}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Total Debt</span>
                      <span className="text-sm font-medium text-gray-900">
                        {selectedClient.details.totalDebt}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Debt-to-Income</span>
                      <span className="text-sm font-medium text-gray-900">
                        {selectedClient.details.debtToIncomeRatio}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Credit Score</span>
                      <span className="text-sm font-medium text-gray-900">
                        {selectedClient.details.creditScore}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Savings Balance</span>
                      <span className="text-sm font-medium text-gray-900">
                        {selectedClient.details.savingsBalance}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex space-x-2">
                  <Button variant="outline" className="flex items-center gap-2 text-gray-700">
                    <Mail className="h-4 w-4" />
                    Email
                  </Button>
                  <Button variant="outline" className="flex items-center gap-2 text-gray-700">
                    <Phone className="h-4 w-4" />
                    Call
                  </Button>
                </div>
              </div>
            </div>
          </Card>

          {/* Main Content Area */}
          <div className="col-span-2 space-y-4">
            {/* Next Best Actions */}
            <Card className="bg-white">
              <div className="p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Next Best Actions</h2>
                {loading ? (
                  <div className="flex flex-col items-center justify-center py-12">
                    <div className="relative w-16 h-16">
                      <div className="absolute top-0 left-0 w-full h-full border-4 border-blue-100 rounded-full"></div>
                      <div className="absolute top-0 left-0 w-full h-full border-4 border-blue-500 rounded-full animate-spin border-t-transparent"></div>
                    </div>
                    <p className="mt-4 text-gray-900 font-medium">Analyzing client data...</p>
                    <p className="text-sm text-gray-600">Calculating personalized recommendations</p>
                  </div>
                ) : (
                  <div className="grid gap-4 grid-cols-1">
                    {getNextBestActions(selectedClient).map((action, index) => (
                      <Card key={index} className="bg-white border hover:shadow-lg transition-all">
                        <div className="p-4">
                          <div className="flex items-start gap-4">
                            <div className="p-2 bg-gray-50 rounded-lg">
                              {action.icon}
                            </div>
                            <div className="flex-1">
                              <div className="flex justify-between items-start mb-2">
                                <h3 className="font-semibold text-gray-900">{action.title}</h3>
                                <div className="flex gap-2">
                                  <span className="px-2 py-1 bg-blue-50 text-blue-700 rounded-full text-xs">
                                    {action.impact} Impact
                                  </span>
                                  <span className="px-2 py-1 bg-gray-50 text-gray-600 rounded-full text-xs">
                                    {action.timeframe}
                                  </span>
                                </div>
                              </div>
                              <p className="text-sm text-gray-600 mb-3">{action.description}</p>
                              <div className="bg-gray-50 rounded-lg p-3">
                                <h4 className="text-sm font-medium text-gray-900 mb-2">Key Metrics</h4>
                                <div className="grid grid-cols-2 gap-4">
                                  {Object.entries(action.metrics).map(([key, value]) => (
                                    <div key={key}>
                                      <p className="text-xs text-gray-600">{key.replace(/([A-Z])/g, ' $1').trim()}</p>
                                      <p className="text-sm font-medium text-gray-900">{value}</p>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            </Card>

            {/* AI Assistant */}
            <Card className="bg-white">
              <div className="p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">AI Assistant</h2>
                {loadingChat ? (
                  <div className="flex flex-col items-center justify-center py-12">
                    <div className="relative w-16 h-16">
                      <div className="absolute top-0 left-0 w-full h-full border-4 border-blue-100 rounded-full"></div>
                      <div className="absolute top-0 left-0 w-full h-full border-4 border-blue-500 rounded-full animate-spin border-t-transparent"></div>
                    </div>
                    <p className="mt-4 text-gray-900 font-medium">Analyzing client data...</p>
                    <p className="text-sm text-gray-600">Generating personalized recommendations</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="h-64 overflow-y-auto mb-4 space-y-4 border rounded-lg p-4">
                      {chatHistory.map((msg, index) => (
                        <div
                          key={index}
                          className={`p-3 rounded-lg ${
                            msg.role === 'assistant' 
                              ? 'bg-blue-50 text-blue-900' 
                              : 'bg-gray-50 text-gray-900'
                          }`}
                        >
                          {msg.content}
                        </div>
                      ))}
                      {isTyping && (
                        <div className="flex items-center space-x-2 p-4 bg-blue-50 rounded-lg">
                          <div className="relative w-3 h-3">
                            <div className="absolute top-0 left-0 w-full h-full bg-blue-500 rounded-full animate-ping opacity-75"></div>
                            <div className="w-full h-full bg-blue-500 rounded-full"></div>
                          </div>
                          <div className="relative w-3 h-3" style={{ animationDelay: '0.2s' }}>
                            <div className="absolute top-0 left-0 w-full h-full bg-blue-500 rounded-full animate-ping opacity-75"></div>
                            <div className="w-full h-full bg-blue-500 rounded-full"></div>
                          </div>
                          <div className="relative w-3 h-3" style={{ animationDelay: '0.4s' }}>
                            <div className="absolute top-0 left-0 w-full h-full bg-blue-500 rounded-full animate-ping opacity-75"></div>
                            <div className="w-full h-full bg-blue-500 rounded-full"></div>
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="grid grid-cols-3 gap-3">
                      {suggestedContent.map((content, index) => (
                        <Card key={index} className="p-3 hover:bg-gray-50 cursor-pointer transition-colors">
                          <div className="flex items-start gap-2">
                            <span className="text-2xl">{content.icon}</span>
                            <div>
                              <h4 className="font-medium text-sm text-gray-900">{content.title}</h4>
                              <p className="text-xs text-gray-600">{content.type} • {content.readTime}</p>
                            </div>
                          </div>
                        </Card>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <Input
                        value={chatMessage}
                        onChange={(e) => setChatMessage(e.target.value)}
                        placeholder="Ask for advice..."
                        className="flex-1"
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault()
                            handleChatSubmit()
                          }
                        }}
                      />
                      <Button 
                        onClick={handleChatSubmit}
                        className="bg-blue-600 hover:bg-blue-700 text-white"
                      >
                        <Send className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </Card>

            {/* Conversation History */}
            <Card className="bg-white">
              <div className="p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <MessageSquare className="h-5 w-5" />
                  Conversation History
                </h2>
                <div className="space-y-4">
                  {conversationHistory.map((note, index) => (
                    <div key={index} className="p-4 rounded-lg border hover:bg-gray-50 transition-colors">
                      <div className="flex justify-between items-start mb-2">
                        <span className="text-sm font-medium text-gray-900">{note.date}</span>
                        <span className="text-sm text-gray-600">{note.counselor}</span>
                      </div>
                      <p className="text-sm text-gray-700">{note.content}</p>
                    </div>
                  ))}
                  <Button className="w-full text-gray-700 hover:text-gray-900" variant="outline">
                    Add Note
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}