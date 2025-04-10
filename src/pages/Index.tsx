
import { useState, useEffect } from "react";
import { ThemeProvider } from "@/components/theme-provider";
import { Layout } from "@/components/layout/layout";
import { BMICalculator } from "@/components/bmi-calculator";
import { NutritionAnalyzer } from "@/components/nutrition-analyzer";
import { HealthyAlternatives } from "@/components/healthy-alternatives";
import { NutritionChat } from "@/components/nutrition-chat";
import { useToast } from "@/components/ui/use-toast";

const Index = () => {
  const [activeTab, setActiveTab] = useState("bmi");
  const { toast } = useToast();
  
  // Check for API key on initial load - removed the alert
  useEffect(() => {
    if (!process.env.GROQ_API_KEY && activeTab !== "bmi") {
      // We'll handle this within the components that need it
      console.log("API key not found");
    }
  }, [activeTab]);

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
        {renderActiveTab()}
      </Layout>
    </ThemeProvider>
  );
};

export default Index;
