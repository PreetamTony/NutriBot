
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle, Apple, Loader2 } from "lucide-react";
import { HealthyAlternative, getHealthyAlternatives } from "@/lib/groq-api";

export function HealthyAlternatives() {
  const [foodItem, setFoodItem] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<HealthyAlternative | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleGetAlternatives = async () => {
    if (!foodItem.trim()) {
      setError("Please enter a food item.");
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      const alternativesResult = await getHealthyAlternatives(foodItem);
      setResult(alternativesResult);
    } catch (err) {
      setError("Failed to get alternatives. Please try again later or check if the Groq API key is set correctly in the .env file.");
    } finally {
      setLoading(false);
    }
  };

  const handleExampleClick = (example: string) => {
    setFoodItem(example);
  };

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Healthy Alternatives</CardTitle>
          <CardDescription>
            Find healthier substitutes for processed foods.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="food-item">Food Item</Label>
              <Input
                id="food-item"
                placeholder="Enter a processed food item (e.g., potato chips)"
                value={foodItem}
                onChange={(e) => setFoodItem(e.target.value)}
              />
            </div>
            
            {error && (
              <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            
            <Button onClick={handleGetAlternatives} disabled={loading} className="w-full">
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Finding alternatives...
                </>
              ) : (
                "Find Alternatives"
              )}
            </Button>
            
            <div className="pt-2">
              <p className="text-sm text-muted-foreground mb-2">Examples:</p>
              <div className="flex flex-wrap gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => handleExampleClick("potato chips")}
                >
                  Potato Chips
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => handleExampleClick("soda")}
                >
                  Soda
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => handleExampleClick("ice cream")}
                >
                  Ice Cream
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => handleExampleClick("white bread")}
                >
                  White Bread
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Suggested Alternatives</CardTitle>
          <CardDescription>
            Healthier options with nutritional benefits.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {result ? (
            <div className="space-y-6">
              <div className="flex items-center gap-3 p-4 border rounded-lg bg-muted/50">
                <span className="text-xl font-bold">Alternatives for {result.original}</span>
              </div>
              
              <div className="space-y-6">
                {result.alternatives.map((alternative, index) => (
                  <div key={index} className="p-4 border rounded-lg">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-8 h-8 rounded-full bg-nutribot-100 dark:bg-nutribot-900 flex items-center justify-center">
                        <Apple className="h-4 w-4 text-nutribot-600 dark:text-nutribot-300" />
                      </div>
                      <h3 className="text-lg font-medium">{alternative.name}</h3>
                    </div>
                    
                    <div className="space-y-3">
                      <div>
                        <h4 className="text-sm font-medium text-muted-foreground mb-1">Benefits</h4>
                        <ul className="space-y-1 list-disc pl-5">
                          {alternative.benefits.map((benefit, i) => (
                            <li key={i} className="text-sm">{benefit}</li>
                          ))}
                        </ul>
                      </div>
                      
                      <div>
                        <h4 className="text-sm font-medium text-muted-foreground mb-1">Nutrition Facts</h4>
                        <p className="text-sm">{alternative.nutritionFacts}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="pt-2 text-xs text-muted-foreground">
                <p>Note: Individual nutritional needs vary. Consult a healthcare professional for personalized dietary advice.</p>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-80 text-center">
              <p className="text-muted-foreground">
                Enter a processed food item and click "Find Alternatives" to discover healthier options.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
