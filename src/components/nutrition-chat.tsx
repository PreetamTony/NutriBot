import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Loader2, 
  Send, 
  Volume2, 
  VolumeX, 
  Mic, 
  Apple, 
  Coffee, 
  Pizza,
  Sandwich,
  MessageSquare,
  Bot
} from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { chatWithNutritionAssistant } from "@/lib/groq-api";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { toast } from "@/hooks/use-toast";
import { Alert, AlertDescription } from "@/components/ui/alert";

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
  const scrollAreaRef = useRef<HTMLDivElement | null>(null);
  
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
      console.error("Error fetching data:", err);
      setError("Failed to get a response. Please try again later. If the issue persists, check your network connection or contact support.");
      toast({
        title: "Error",
        description: "Failed to get a response. Please try again later.",
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
    <Card className="border-nutribot-200 dark:border-nutribot-800 shadow-lg overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-nutribot-500 to-nutribot-600 text-white pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bot className="h-6 w-6" />
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
      
      <Alert variant="nutribot" className="m-4 mb-2 animate-fade-in">
        <AlertDescription>
          I provide general nutrition information. For personalized dietary advice, please consult a registered dietitian.
        </AlertDescription>
      </Alert>
      
      <div className="p-4 grid grid-cols-2 md:grid-cols-4 gap-2">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => handleExampleClick("What foods are high in protein?")}
          className="text-xs md:text-sm flex gap-2 h-auto py-3 group transition-all hover:border-nutribot-300"
        >
          <Apple className="h-4 w-4 text-nutribot-500 group-hover:text-nutribot-600 transition-colors" />
          <span>High protein foods?</span>
        </Button>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => handleExampleClick("How many calories should I eat daily?")}
          className="text-xs md:text-sm flex gap-2 h-auto py-3 group transition-all hover:border-nutribot-300"
        >
          <Coffee className="h-4 w-4 text-nutribot-500 group-hover:text-nutribot-600 transition-colors" />
          <span>Daily calories?</span>
        </Button>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => handleExampleClick("Is intermittent fasting healthy?")}
          className="text-xs md:text-sm flex gap-2 h-auto py-3 group transition-all hover:border-nutribot-300"
        >
          <Pizza className="h-4 w-4 text-nutribot-500 group-hover:text-nutribot-600 transition-colors" />
          <span>Intermittent fasting?</span>
        </Button>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => handleExampleClick("How can I reduce sugar cravings?")}
          className="text-xs md:text-sm flex gap-2 h-auto py-3 group transition-all hover:border-nutribot-300"
        >
          <Sandwich className="h-4 w-4 text-nutribot-500 group-hover:text-nutribot-600 transition-colors" />
          <span>Reduce sugar cravings?</span>
        </Button>
      </div>

      <CardContent className="p-0">
        <ScrollArea ref={scrollAreaRef} className="h-[400px] px-4" type="always">
          <div className="space-y-4 pb-4 pr-2">
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
                  } flex-shrink-0`}>
                    <AvatarFallback className={msg.role === "user" ? "bg-primary/10 text-primary" : "bg-nutribot-500/10 text-nutribot-600"}>
                      {msg.role === "user" ? "U" : "N"}
                    </AvatarFallback>
                    {msg.role === "assistant" && (
                      <AvatarImage src="https://i.postimg.cc/WzfKp2mL/image.png" />
                    )}
                  </Avatar>
                  <div
                    className={`p-4 rounded-2xl shadow-sm ${
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
                    <AvatarFallback className="bg-nutribot-500/10 text-nutribot-600">N</AvatarFallback>
                    <AvatarImage src="https://i.postimg.cc/WzfKp2mL/image.png" />
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
      </CardContent>
      
      <CardFooter className="border-t p-4 bg-background">
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
