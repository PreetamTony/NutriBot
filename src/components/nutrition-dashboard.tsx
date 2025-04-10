import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { NutritionChat } from "./nutrition-chat";
import { NutritionAnalyzer } from "./nutrition-analyzer";
import { MealPlanner } from "./meal-planner";
import { RecipeGenerator } from "./recipe-generator";
import { BMICalculator } from "./bmi-calculator";
import { HealthyAlternatives } from "./healthy-alternatives";
import { MessageSquare, Calculator, Calendar, ChefHat, Scale, Salad } from "lucide-react";

export function NutritionDashboard() {
  const [activeTab, setActiveTab] = useState("chat");

  return (
    <div className="container mx-auto py-8">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid grid-cols-6 w-full max-w-3xl mx-auto">
          <TabsTrigger value="chat" className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4" />
            Chat
          </TabsTrigger>
          <TabsTrigger value="analyzer" className="flex items-center gap-2">
            <Calculator className="h-4 w-4" />
            Analyzer
          </TabsTrigger>
          <TabsTrigger value="meal-planner" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Meal Planner
          </TabsTrigger>
          <TabsTrigger value="recipe-generator" className="flex items-center gap-2">
            <ChefHat className="h-4 w-4" />
            Recipes
          </TabsTrigger>
          <TabsTrigger value="bmi" className="flex items-center gap-2">
            <Scale className="h-4 w-4" />
            BMI
          </TabsTrigger>
          <TabsTrigger value="alternatives" className="flex items-center gap-2">
            <Salad className="h-4 w-4" />
            Alternatives
          </TabsTrigger>
        </TabsList>

        <TabsContent value="chat" className="mt-6">
          <NutritionChat />
        </TabsContent>

        <TabsContent value="analyzer" className="mt-6">
          <NutritionAnalyzer />
        </TabsContent>

        <TabsContent value="meal-planner" className="mt-6">
          <MealPlanner />
        </TabsContent>

        <TabsContent value="recipe-generator" className="mt-6">
          <RecipeGenerator />
        </TabsContent>

        <TabsContent value="bmi" className="mt-6">
          <BMICalculator />
        </TabsContent>

        <TabsContent value="alternatives" className="mt-6">
          <HealthyAlternatives />
        </TabsContent>
      </Tabs>
    </div>
  );
} 