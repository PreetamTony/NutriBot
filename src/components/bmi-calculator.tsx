
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

type BMIResult = {
  bmi: number;
  status: string;
  riskLevel: string;
  classification: "underweight" | "normal" | "overweight" | "obese";
};

export function BMICalculator() {
  const [height, setHeight] = useState<number | "">("");
  const [heightUnit, setHeightUnit] = useState<string>("cm");
  const [weight, setWeight] = useState<number | "">("");
  const [weightUnit, setWeightUnit] = useState<string>("kg");
  const [age, setAge] = useState<number | "">("");
  const [sex, setSex] = useState<string>("male");
  const [waist, setWaist] = useState<number | "">("");
  const [hip, setHip] = useState<number | "">("");
  
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<BMIResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const calculateBMI = () => {
    if (!height || !weight || !age) {
      setError("Please fill in height, weight, and age");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Convert height to meters
      let heightInM = 0;
      if (heightUnit === "cm") {
        heightInM = height / 100;
      } else if (heightUnit === "in") {
        heightInM = height * 0.0254;
      } else if (heightUnit === "ft") {
        heightInM = height * 0.3048;
      }

      // Convert weight to kg
      let weightInKg = 0;
      if (weightUnit === "kg") {
        weightInKg = weight;
      } else if (weightUnit === "lb") {
        weightInKg = weight * 0.45359237;
      }

      // Calculate BMI
      const bmi = weightInKg / (heightInM * heightInM);

      // Determine status and risk level
      let status = "";
      let riskLevel = "";
      let classification: BMIResult["classification"] = "normal";

      if (bmi < 18.5) {
        status = "Underweight";
        riskLevel = "Moderate risk";
        classification = "underweight";
      } else if (bmi >= 18.5 && bmi < 25) {
        status = "Normal weight";
        riskLevel = "Low risk";
        classification = "normal";
      } else if (bmi >= 25 && bmi < 30) {
        status = "Overweight";
        riskLevel = "Moderate risk";
        classification = "overweight";
      } else {
        status = "Obese";
        riskLevel = "High risk";
        classification = "obese";
      }

      setResult({
        bmi: Math.round(bmi * 10) / 10,
        status,
        riskLevel,
        classification
      });
    } catch (err) {
      setError("Error calculating BMI");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>BMI Calculator</CardTitle>
          <CardDescription>
            Calculate your Body Mass Index using your height, weight, and additional measurements.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="height">Height</Label>
                <div className="flex gap-2">
                  <Input
                    id="height"
                    type="number"
                    placeholder="Enter height"
                    value={height}
                    onChange={(e) => setHeight(e.target.value ? parseFloat(e.target.value) : "")}
                    className="flex-1"
                  />
                  <Select value={heightUnit} onValueChange={setHeightUnit}>
                    <SelectTrigger className="w-24">
                      <SelectValue placeholder="Unit" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="cm">cm</SelectItem>
                      <SelectItem value="in">in</SelectItem>
                      <SelectItem value="ft">ft</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="weight">Weight</Label>
                <div className="flex gap-2">
                  <Input
                    id="weight"
                    type="number"
                    placeholder="Enter weight"
                    value={weight}
                    onChange={(e) => setWeight(e.target.value ? parseFloat(e.target.value) : "")}
                    className="flex-1"
                  />
                  <Select value={weightUnit} onValueChange={setWeightUnit}>
                    <SelectTrigger className="w-24">
                      <SelectValue placeholder="Unit" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="kg">kg</SelectItem>
                      <SelectItem value="lb">lb</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="age">Age</Label>
                <Input
                  id="age"
                  type="number"
                  placeholder="Enter age"
                  value={age}
                  onChange={(e) => setAge(e.target.value ? parseInt(e.target.value) : "")}
                />
              </div>
              
              <div className="space-y-2">
                <Label>Sex</Label>
                <RadioGroup
                  value={sex}
                  onValueChange={setSex}
                  className="flex gap-4"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="male" id="male" />
                    <Label htmlFor="male">Male</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="female" id="female" />
                    <Label htmlFor="female">Female</Label>
                  </div>
                </RadioGroup>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="waist">Waist (cm) - Optional</Label>
                <Input
                  id="waist"
                  type="number"
                  placeholder="Waist circumference"
                  value={waist}
                  onChange={(e) => setWaist(e.target.value ? parseFloat(e.target.value) : "")}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="hip">Hip (cm) - Optional</Label>
                <Input
                  id="hip"
                  type="number"
                  placeholder="Hip circumference"
                  value={hip}
                  onChange={(e) => setHip(e.target.value ? parseFloat(e.target.value) : "")}
                />
              </div>
            </div>
            
            {error && (
              <p className="text-sm font-medium text-destructive">{error}</p>
            )}
            
            <Button onClick={calculateBMI} disabled={loading} className="w-full">
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> 
                  Calculating...
                </>
              ) : (
                "Calculate BMI"
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Results</CardTitle>
          <CardDescription>
            Your calculated Body Mass Index and risk assessment.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {result ? (
            <div className="space-y-6">
              <div className="flex flex-col items-center justify-center p-6 border rounded-lg bg-muted/50">
                <span className="text-3xl font-bold">{result.bmi}</span>
                <span className="text-sm text-muted-foreground">Your BMI</span>
              </div>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <h3 className="text-lg font-medium">Status</h3>
                  <div className="flex items-center gap-2">
                    <div className={cn(
                      "w-4 h-4 rounded-full",
                      {
                        "bg-amber-500": result.classification === "underweight",
                        "bg-green-500": result.classification === "normal",
                        "bg-orange-500": result.classification === "overweight",
                        "bg-red-500": result.classification === "obese",
                      }
                    )} />
                    <span className="font-medium">{result.status}</span>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <h3 className="text-lg font-medium">Risk Level</h3>
                  <p>{result.riskLevel}</p>
                </div>
                
                <div className="space-y-2">
                  <h3 className="text-lg font-medium">BMI Range Classifications</h3>
                  <ul className="space-y-1">
                    <li className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-amber-500" />
                      <span>Underweight: BMI less than 18.5</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-green-500" />
                      <span>Normal weight: BMI 18.5 to 24.9</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-orange-500" />
                      <span>Overweight: BMI 25 to 29.9</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-red-500" />
                      <span>Obesity: BMI 30 or greater</span>
                    </li>
                  </ul>
                </div>
                
                <div className="pt-2 text-xs text-muted-foreground">
                  <p>Note: BMI is a screening tool, not a diagnostic tool. Consult with a healthcare professional for a complete health assessment.</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-80 text-center">
              <p className="text-muted-foreground">
                Fill in the required information and click "Calculate BMI" to see your results.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
