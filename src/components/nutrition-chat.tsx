
import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle, Loader2, MicIcon, Send, Volume2 } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { chatWithNutritionAssistant } from "@/lib/groq-api";

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
    } catch (err) {
      setError("Failed to get a response. Please try again later or check if the Groq API key is set correctly in the .env file.");
    } finally {
      setLoading(false);
    }
  };

  const handleExampleClick = (example: string) => {
    setNewMessage(example);
  };

  return (
    <Card className="h-[calc(100vh-16rem)]">
      <CardHeader>
        <CardTitle>Nutrition Chat</CardTitle>
        <CardDescription>
          Ask questions about nutrition, diet, and healthy eating habits.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-grow overflow-hidden">
        <ScrollArea className="h-[calc(100vh-20rem)]">
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
                  } items-start gap-3 max-w-[80%]`}
                >
                  <Avatar className={`w-8 h-8 ${msg.role === "user" ? "ml-2" : "mr-2"}`}>
                    <AvatarFallback>
                      {msg.role === "user" ? "U" : "N"}
                    </AvatarFallback>
                    {msg.role === "assistant" && (
                      <AvatarImage src="/placeholder.svg" className="bg-nutribot-500 p-1" />
                    )}
                  </Avatar>
                  <div
                    className={`p-3 rounded-lg ${
                      msg.role === "user"
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted"
                    }`}
                  >
                    <p className="text-sm">{msg.content}</p>
                    <div className="mt-1 text-xs opacity-70">
                      {msg.timestamp.toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </div>
                  </div>
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="flex flex-row items-start gap-3 max-w-[80%]">
                  <Avatar className="w-8 h-8 mr-2">
                    <AvatarFallback>N</AvatarFallback>
                    <AvatarImage src="/placeholder.svg" className="bg-nutribot-500 p-1" />
                  </Avatar>
                  <div className="p-3 rounded-lg bg-muted">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-muted-foreground rounded-full animate-pulse-soft"></div>
                      <div className="w-2 h-2 bg-muted-foreground rounded-full animate-pulse-soft" style={{ animationDelay: "0.2s" }}></div>
                      <div className="w-2 h-2 bg-muted-foreground rounded-full animate-pulse-soft" style={{ animationDelay: "0.4s" }}></div>
                    </div>
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
      <CardFooter className="flex-col gap-4">
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => handleExampleClick("What foods are high in protein?")}
            className="text-xs sm:text-sm"
          >
            High protein foods?
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => handleExampleClick("How many calories should I eat daily?")}
            className="text-xs sm:text-sm"
          >
            Daily calories?
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => handleExampleClick("Is intermittent fasting healthy?")}
            className="text-xs sm:text-sm"
          >
            Intermittent fasting?
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => handleExampleClick("How can I reduce sugar cravings?")}
            className="text-xs sm:text-sm"
          >
            Reduce sugar cravings?
          </Button>
        </div>
        <div className="flex w-full items-center gap-2">
          <Button size="icon" variant="ghost" disabled>
            <MicIcon className="h-5 w-5" />
            <span className="sr-only">Use voice input</span>
          </Button>
          <Input
            placeholder="Type your nutrition question..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSendMessage();
              }
            }}
            className="flex-1"
          />
          <Button size="icon" onClick={handleSendMessage} disabled={loading || !newMessage.trim()}>
            {loading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <Send className="h-5 w-5" />
            )}
            <span className="sr-only">Send message</span>
          </Button>
          <Button size="icon" variant="ghost" disabled>
            <Volume2 className="h-5 w-5" />
            <span className="sr-only">Text-to-speech</span>
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
