import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, Salad } from "lucide-react";
import { getHealthyAlternatives, type HealthyAlternative } from "@/lib/groq-api";

export function HealthyAlternatives() {
  const [food, setFood] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<HealthyAlternative | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleGetAlternatives = async () => {
    if (!food.trim()) {
      setError("Please enter a food item.");
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      const alternatives = await getHealthyAlternatives(food);
      setResult(alternatives);
    } catch (err) {
      setError("Failed to get healthy alternatives. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Healthy Alternatives</CardTitle>
        <CardDescription>
          Find nutritious alternatives to your favorite foods
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="food">Food Item</Label>
            <Input
              id="food"
              placeholder="Enter a food item (e.g., potato chips)"
              value={food}
              onChange={(e) => setFood(e.target.value)}
            />
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <Button onClick={handleGetAlternatives} disabled={loading} className="w-full">
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Finding Alternatives...
              </>
            ) : (
              <>
                <Salad className="mr-2 h-4 w-4" />
                Find Healthy Alternatives
              </>
            )}
          </Button>

          {result && (
            <div className="space-y-4">
              <div className="rounded-lg border bg-card p-4">
                <h3 className="font-medium mb-2">Instead of {result.original}, try:</h3>
                <div className="space-y-4">
                  {result.alternatives.map((alt, index) => (
                    <div key={index} className="space-y-2">
                      <h4 className="font-medium text-primary">{alt.name}</h4>
                      <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">
                          {alt.nutritionFacts}
                        </p>
                        <ul className="list-disc list-inside space-y-1">
                          {alt.benefits.map((benefit, i) => (
                            <li key={i} className="text-sm text-muted-foreground">
                              {benefit}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
