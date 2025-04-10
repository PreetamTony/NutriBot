
import { useState } from "react";
import { ThemeProvider } from "@/components/theme-provider";
import { Layout } from "@/components/layout/layout";
import { BMICalculator } from "@/components/bmi-calculator";
import { NutritionAnalyzer } from "@/components/nutrition-analyzer";
import { HealthyAlternatives } from "@/components/healthy-alternatives";
import { NutritionChat } from "@/components/nutrition-chat";
import { useToast } from "@/components/ui/use-toast";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";

const Index = () => {
  const [activeTab, setActiveTab] = useState("bmi");
  const { toast } = useToast();
  
  // Check for API key on initial load
  useState(() => {
    if (!process.env.GROQ_API_KEY) {
      toast({
        title: "API Key Required",
        description: "Please add your Groq API key to the .env file to use all features.",
        variant: "destructive",
      });
    }
  });

  const renderActiveTab = () => {
    switch (activeTab) {
      case "bmi":
        return <BMICalculator />;
      case "nutrition":
        return <NutritionAnalyzer />;
      case "alternatives":
        return <HealthyAlternatives />;
      case "chat":
        return <NutritionChat />;
      default:
        return <BMICalculator />;
    }
  };

  return (
    <ThemeProvider defaultTheme="system" storageKey="nutribot-theme">
      <Layout activeTab={activeTab} onTabChange={setActiveTab}>
        {!process.env.GROQ_API_KEY && activeTab !== "bmi" && (
          <Alert variant="warning" className="mb-6">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>API Key Required</AlertTitle>
            <AlertDescription>
              Please add your Groq API key to the .env file to use this feature.
              Create a .env file in the root directory and add: GROQ_API_KEY=your_api_key
            </AlertDescription>
          </Alert>
        )}
        {renderActiveTab()}
      </Layout>
    </ThemeProvider>
  );
};

export default Index;
