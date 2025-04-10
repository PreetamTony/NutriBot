import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle, Loader2 } from "lucide-react";
import { NutritionAnalysisResult, analyzeNutrition } from "@/lib/groq-api";

export function NutritionAnalyzer() {
  const [mealDescription, setMealDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<NutritionAnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyzeNutrition = async () => {
    if (!mealDescription.trim()) {
      setError("Please enter a meal description.");
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      const analysisResult = await analyzeNutrition(mealDescription);
      setResult(analysisResult);
    } catch (err) {
      console.error("Error analyzing nutrition:", err);
      setError("Failed to analyze nutrition. Please try again later or check if the Groq API key is set correctly in the .env file. If the issue persists, contact support.");
    } finally {
      setLoading(false);
    }
  };

  const handleExampleClick = (example: string) => {
    setMealDescription(example);
  };

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Nutrition Analyzer</CardTitle>
          <CardDescription>
            Describe your meal and get a detailed nutritional breakdown.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="meal-description">Meal Description</Label>
              <Textarea
                id="meal-description"
                placeholder="Describe your meal in detail, e.g: 2 eggs, 2 slices of wheat toast, 1 avocado, and a cup of orange juice"
                value={mealDescription}
                onChange={(e) => setMealDescription(e.target.value)}
                rows={5}
              />
            </div>
            
            {error && (
              <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            
            <Button onClick={handleAnalyzeNutrition} disabled={loading} className="w-full">
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Analyzing...
                </>
              ) : (
                "Analyze Nutrition"
              )}
            </Button>
            
            <div className="pt-2">
              <p className="text-sm text-muted-foreground mb-2">Examples:</p>
              <div className="flex flex-wrap gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => handleExampleClick("2 eggs, 2 slices of wheat toast with butter, half an avocado, and a cup of orange juice")}
                >
                  Breakfast
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => handleExampleClick("Chicken caesar salad with grilled chicken breast, romaine lettuce, croutons, parmesan cheese, and caesar dressing")}
                >
                  Lunch
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => handleExampleClick("8oz ribeye steak (medium rare), baked potato with sour cream and chives, steamed broccoli, and a glass of red wine")}
                >
                  Dinner
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Nutritional Analysis</CardTitle>
          <CardDescription>
            Breakdown of calories, macronutrients, and nutritional insights.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {result ? (
            <div className="space-y-6">
              <div className="flex flex-col items-center justify-center p-4 border rounded-lg bg-muted/50">
                <span className="text-xl font-bold">{result.calories}</span>
                <span className="text-sm text-muted-foreground">Estimated Calories</span>
              </div>
              
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Macronutrients</h3>
                <div className="grid grid-cols-3 gap-2">
                  <div className="flex flex-col items-center justify-center p-3 border rounded bg-background">
                    <span className="text-xs uppercase text-muted-foreground">Carbs</span>
                    <span className="font-medium">{result.macronutrients.carbohydrates}</span>
                  </div>
                  <div className="flex flex-col items-center justify-center p-3 border rounded bg-background">
                    <span className="text-xs uppercase text-muted-foreground">Protein</span>
                    <span className="font-medium">{result.macronutrients.protein}</span>
                  </div>
                  <div className="flex flex-col items-center justify-center p-3 border rounded bg-background">
                    <span className="text-xs uppercase text-muted-foreground">Fat</span>
                    <span className="font-medium">{result.macronutrients.fat}</span>
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <h3 className="text-lg font-medium">Micronutrients</h3>
                <div className="flex flex-wrap gap-1">
                  {result.micronutrients.map((nutrient, index) => (
                    <span 
                      key={index} 
                      className="bg-nutribot-100 dark:bg-nutribot-900 text-nutribot-800 dark:text-nutribot-100 text-xs py-1 px-2 rounded-full"
                    >
                      {nutrient}
                    </span>
                  ))}
                </div>
              </div>
              
              <div className="space-y-2">
                <h3 className="text-lg font-medium">Analysis</h3>
                <p className="text-sm">{result.analysis}</p>
              </div>
              
              <div className="space-y-2">
                <h3 className="text-lg font-medium">Suggestions</h3>
                <ul className="space-y-1 list-disc pl-4">
                  {result.suggestions.map((suggestion, index) => (
                    <li key={index} className="text-sm">{suggestion}</li>
                  ))}
                </ul>
              </div>
              
              <div className="pt-2 text-xs text-muted-foreground">
                <p>Note: Nutritional analysis is an estimate based on the provided description. For precise nutritional information, refer to nutrition labels or consult a dietitian.</p>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-80 text-center">
              <p className="text-muted-foreground">
                Enter your meal information and click "Analyze Nutrition" to get your nutritional breakdown.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
