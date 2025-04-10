
import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { 
  AlertTriangle, 
  Loader2, 
  Send, 
  Volume2, 
  VolumeX, 
  Mic, 
  Apple, 
  Coffee, 
  Pizza,
  Sandwich,
  MessageSquare
} from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { chatWithNutritionAssistant } from "@/lib/groq-api";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { toast } from "@/hooks/use-toast";

type Message = {
  id: string;
  content: string;
  role: "user" | "assistant";
  timestamp: Date;
};

export function NutritionChat() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome-message",
      content: "Hello! I'm NutriBot, your AI nutrition assistant. How can I help you with your nutrition questions today?",
      role: "assistant",
      timestamp: new Date(),
    },
  ]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    // Scroll to bottom when messages change
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      content: newMessage,
      role: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setNewMessage("");
    setLoading(true);
    setError(null);

    try {
      const response = await chatWithNutritionAssistant(newMessage);
      
      const assistantMessage: Message = {
        id: `assistant-${Date.now()}`,
        content: response,
        role: "assistant",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
      toast({
        title: "Response received",
        description: "Got nutritional insights for you!",
        variant: "default",
      });
    } catch (err) {
      setError("Failed to get a response. Please try again later or check if the Groq API key is set correctly in the .env file.");
      toast({
        title: "Error",
        description: "Failed to get a response. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleExampleClick = (example: string) => {
    setNewMessage(example);
  };

  // Simulate the text-to-speech functionality
  const toggleSpeech = (messageContent: string) => {
    if (isSpeaking) {
      setIsSpeaking(false);
      toast({
        title: "Speech stopped",
        description: "Text-to-speech has been stopped",
        variant: "default",
      });
    } else {
      setIsSpeaking(true);
      toast({
        title: "Speaking...",
        description: "Text-to-speech has started",
        variant: "default",
      });
      
      // Simulate ending speech after a few seconds
      setTimeout(() => {
        setIsSpeaking(false);
      }, 10000);
    }
  };

  return (
    <Card className="h-[calc(100vh-16rem)] shadow-lg border-nutribot-200 dark:border-nutribot-800">
      <CardHeader className="bg-gradient-to-r from-nutribot-500 to-nutribot-600 text-white rounded-t-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MessageSquare className="h-6 w-6" />
            <CardTitle>Nutrition Chat Assistant</CardTitle>
          </div>
          <Badge variant="outline" className="bg-white/20 text-white hover:bg-white/30 transition-colors">
            AI Powered
          </Badge>
        </div>
        <CardDescription className="text-nutribot-50">
          Ask me anything about nutrition, diet plans, or healthy eating habits
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-grow overflow-hidden pt-6">
        <Alert variant="default" className="bg-nutribot-50 dark:bg-nutribot-900/20 border-nutribot-200 dark:border-nutribot-800 mb-4">
          <AlertDescription className="text-sm italic text-nutribot-700 dark:text-nutribot-300">
            I provide general nutrition information. For personalized dietary advice, please consult a registered dietitian.
          </AlertDescription>
        </Alert>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-2 mb-4">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => handleExampleClick("What foods are high in protein?")}
            className="text-xs md:text-sm flex gap-2 h-auto py-3"
          >
            <Apple className="h-4 w-4 text-nutribot-500" />
            <span>High protein foods?</span>
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => handleExampleClick("How many calories should I eat daily?")}
            className="text-xs md:text-sm flex gap-2 h-auto py-3"
          >
            <Coffee className="h-4 w-4 text-nutribot-500" />
            <span>Daily calories?</span>
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => handleExampleClick("Is intermittent fasting healthy?")}
            className="text-xs md:text-sm flex gap-2 h-auto py-3"
          >
            <Pizza className="h-4 w-4 text-nutribot-500" />
            <span>Intermittent fasting?</span>
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => handleExampleClick("How can I reduce sugar cravings?")}
            className="text-xs md:text-sm flex gap-2 h-auto py-3"
          >
            <Sandwich className="h-4 w-4 text-nutribot-500" />
            <span>Reduce sugar cravings?</span>
          </Button>
        </div>

        <ScrollArea className="h-[calc(100vh-28rem)]">
          <div className="space-y-4 pb-4">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${
                  msg.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`flex ${
                    msg.role === "user" ? "flex-row-reverse" : "flex-row"
                  } items-start gap-3 max-w-[85%] animate-fade-in`}
                >
                  <Avatar className={`w-8 h-8 ${msg.role === "user" ? "ml-2" : "mr-2"} ring-2 ${
                    msg.role === "user" ? "ring-primary/20" : "ring-nutribot-300/20"
                  }`}>
                    <AvatarFallback className={msg.role === "user" ? "bg-primary/10" : "bg-nutribot-500/10"}>
                      {msg.role === "user" ? "U" : "N"}
                    </AvatarFallback>
                    {msg.role === "assistant" && (
                      <AvatarImage src="/placeholder.svg" className="bg-nutribot-500 p-1" />
                    )}
                  </Avatar>
                  <div
                    className={`p-3 rounded-2xl shadow-sm ${
                      msg.role === "user"
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted border border-border/50"
                    }`}
                  >
                    <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                    <div className="mt-2 flex items-center justify-between text-xs opacity-70">
                      <span>
                        {msg.timestamp.toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                      {msg.role === "assistant" && (
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                className="h-6 w-6" 
                                onClick={() => toggleSpeech(msg.content)}
                              >
                                {isSpeaking ? (
                                  <VolumeX className="h-3.5 w-3.5" />
                                ) : (
                                  <Volume2 className="h-3.5 w-3.5" />
                                )}
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent side="top">
                              <p>{isSpeaking ? "Stop speaking" : "Listen"}</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="flex flex-row items-start gap-3 max-w-[80%]">
                  <Avatar className="w-8 h-8 mr-2 ring-2 ring-nutribot-300/20">
                    <AvatarFallback className="bg-nutribot-500/10">N</AvatarFallback>
                    <AvatarImage src="/placeholder.svg" className="bg-nutribot-500 p-1" />
                  </Avatar>
                  <div className="p-4 rounded-2xl bg-muted border border-border/50 flex items-center">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-nutribot-500 rounded-full animate-pulse-soft"></div>
                      <div className="w-2 h-2 bg-nutribot-500 rounded-full animate-pulse-soft" style={{ animationDelay: "0.2s" }}></div>
                      <div className="w-2 h-2 bg-nutribot-500 rounded-full animate-pulse-soft" style={{ animationDelay: "0.4s" }}></div>
                    </div>
                    <span className="ml-2 text-sm text-muted-foreground">Thinking...</span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>
        
        {error && (
          <Alert variant="destructive" className="mt-4">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
      </CardContent>
      <CardFooter className="border-t pt-4">
        <form onSubmit={(e) => {e.preventDefault(); handleSendMessage();}} className="w-full">
          <div className="flex w-full items-center gap-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button size="icon" variant="ghost" type="button" disabled className="flex-shrink-0">
                    <Mic className="h-5 w-5 text-muted-foreground" />
                    <span className="sr-only">Voice input</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="top">
                  <p>Voice input (coming soon)</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            
            <Input
              placeholder="Type your nutrition question..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
              className="flex-1 focus-visible:ring-nutribot-500"
              disabled={loading}
            />
            
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    type="submit" 
                    size="icon" 
                    className="bg-nutribot-500 hover:bg-nutribot-600 text-white flex-shrink-0"
                    disabled={loading || !newMessage.trim()}
                  >
                    {loading ? (
                      <Loader2 className="h-5 w-5 animate-spin" />
                    ) : (
                      <Send className="h-5 w-5" />
                    )}
                    <span className="sr-only">Send message</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="top">
                  <p>Send message</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </form>
      </CardFooter>
    </Card>
  );
}
