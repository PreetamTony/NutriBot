import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Scale } from "lucide-react";

type BMIResult = {
  bmi: number;
  category: string;
  recommendation: string;
};

export function BMICalculator() {
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [result, setResult] = useState<BMIResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const calculateBMI = () => {
    setError(null);

    if (!height || !weight) {
      setError("Please enter both height and weight.");
      return;
    }

    const heightInMeters = parseFloat(height) / 100; // Convert cm to meters
    const weightInKg = parseFloat(weight);

    if (isNaN(heightInMeters) || isNaN(weightInKg)) {
      setError("Please enter valid numbers.");
      return;
    }

    if (heightInMeters <= 0 || weightInKg <= 0) {
      setError("Height and weight must be greater than 0.");
      return;
    }

    const bmi = weightInKg / (heightInMeters * heightInMeters);
    let category: string;
    let recommendation: string;

    if (bmi < 18.5) {
      category = "Underweight";
      recommendation = "Consider consulting a nutritionist for a healthy weight gain plan. Focus on nutrient-dense foods and regular meals.";
    } else if (bmi < 25) {
      category = "Normal weight";
      recommendation = "Maintain your healthy lifestyle with balanced nutrition and regular physical activity.";
    } else if (bmi < 30) {
      category = "Overweight";
      recommendation = "Focus on portion control and increasing physical activity. Consider consulting a healthcare provider for personalized advice.";
    } else {
      category = "Obese";
      recommendation = "It's recommended to consult a healthcare provider for a comprehensive health assessment and weight management plan.";
    }

    setResult({ bmi: parseFloat(bmi.toFixed(1)), category, recommendation });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>BMI Calculator</CardTitle>
        <CardDescription>
          Calculate your Body Mass Index (BMI) to assess your weight relative to your height
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="height">Height (cm)</Label>
            <Input
              id="height"
              type="number"
              placeholder="Enter your height"
              value={height}
              onChange={(e) => setHeight(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="weight">Weight (kg)</Label>
            <Input
              id="weight"
              type="number"
              placeholder="Enter your weight"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
            />
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <Button onClick={calculateBMI} className="w-full">
            <Scale className="mr-2 h-4 w-4" />
            Calculate BMI
          </Button>

          {result && (
            <div className="mt-4 space-y-4">
              <div className="rounded-lg border bg-card p-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium">Your BMI</p>
                    <p className="text-2xl font-bold">{result.bmi}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Category</p>
                    <p className="text-lg font-semibold">{result.category}</p>
                  </div>
                </div>
              </div>
              
              <div className="rounded-lg border bg-card p-4">
                <p className="text-sm font-medium">Recommendation</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  {result.recommendation}
                </p>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
