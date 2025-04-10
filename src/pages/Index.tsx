
import { useState } from "react";
import { ThemeProvider } from "@/components/theme-provider";
import { Layout } from "@/components/layout/layout";
import { BMICalculator } from "@/components/bmi-calculator";
import { NutritionAnalyzer } from "@/components/nutrition-analyzer";
import { HealthyAlternatives } from "@/components/healthy-alternatives";
import { NutritionChat } from "@/components/nutrition-chat";
import { useToast } from "@/hooks/use-toast";

const Index = () => {
  const [activeTab, setActiveTab] = useState("bmi");
  const { toast } = useToast();
  
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
