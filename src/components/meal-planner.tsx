import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, Utensils } from "lucide-react";
import { generateMealPlan, type MealPlan } from "@/lib/groq-api";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";

const dietTypes = [
  { value: "balanced", label: "Balanced" },
  { value: "vegetarian", label: "Vegetarian" },
  { value: "vegan", label: "Vegan" },
  { value: "paleo", label: "Paleo" },
  { value: "keto", label: "Keto" },
  { value: "mediterranean", label: "Mediterranean" },
];

const dietaryRestrictions = [
  { id: "gluten-free", label: "Gluten-Free" },
  { id: "dairy-free", label: "Dairy-Free" },
  { id: "nut-free", label: "Nut-Free" },
  { id: "soy-free", label: "Soy-Free" },
  { id: "egg-free", label: "Egg-Free" },
];

const goals = [
  { value: "weight-loss", label: "Weight Loss" },
  { value: "muscle-gain", label: "Muscle Gain" },
  { value: "maintenance", label: "Maintenance" },
  { value: "energy-boost", label: "Energy Boost" },
  { value: "heart-health", label: "Heart Health" },
];

export function MealPlanner() {
  const [preferences, setPreferences] = useState({
    dietType: "balanced",
    calories: 2000,
    restrictions: [] as string[],
    goal: "maintenance",
  });
  const [loading, setLoading] = useState(false);
  const [mealPlan, setMealPlan] = useState<MealPlan | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleGenerateMealPlan = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const plan = await generateMealPlan(preferences);
      setMealPlan(plan);
    } catch (err) {
      setError("Failed to generate meal plan. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Meal Planner</CardTitle>
          <CardDescription>
            Create your personalized meal plan based on your preferences and goals.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Diet Type</Label>
              <Select
                value={preferences.dietType}
                onValueChange={(value) => setPreferences({ ...preferences, dietType: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {dietTypes.map((diet) => (
                    <SelectItem key={diet.value} value={diet.value}>
                      {diet.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Daily Calories Target</Label>
              <Input
                type="number"
                value={preferences.calories}
                onChange={(e) => setPreferences({ ...preferences, calories: parseInt(e.target.value) })}
                min={100}
                max={1000}
              />
            </div>

            <div className="space-y-2">
              <Label>Dietary Restrictions</Label>
              <div className="grid grid-cols-2 gap-2">
                {dietaryRestrictions.map((restriction) => (
                  <div key={restriction.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={restriction.id}
                      checked={preferences.restrictions.includes(restriction.id)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setPreferences({
                            ...preferences,
                            restrictions: [...preferences.restrictions, restriction.id],
                          });
                        } else {
                          setPreferences({
                            ...preferences,
                            restrictions: preferences.restrictions.filter((r) => r !== restriction.id),
                          });
                        }
                      }}
                    />
                    <label htmlFor={restriction.id} className="text-sm">
                      {restriction.label}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label>Goal</Label>
              <Select
                value={preferences.goal}
                onValueChange={(value) => setPreferences({ ...preferences, goal: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {goals.map((goal) => (
                    <SelectItem key={goal.value} value={goal.value}>
                      {goal.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <Button
              onClick={handleGenerateMealPlan}
              disabled={loading}
              className="w-full"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating Plan...
                </>
              ) : (
                <>
                  <Utensils className="mr-2 h-4 w-4" />
                  Generate Meal Plan
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Your Meal Plan</CardTitle>
          <CardDescription>
            Weekly meal plan based on your preferences
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[600px] pr-4">
            {mealPlan ? (
              <div className="space-y-6">
                <div className="rounded-lg border bg-card p-4">
                  <h3 className="font-semibold">Dietary Focus</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    {mealPlan.dietaryFocus}
                  </p>
                </div>

                {mealPlan.dailyPlans.map((day, index) => (
                  <div key={index} className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold">{day.day}</h3>
                      <Badge variant="secondary">
                        {day.totalCalories} calories
                      </Badge>
                    </div>

                    <div className="space-y-3">
                      {day.meals.map((meal, mealIndex) => (
                        <div
                          key={mealIndex}
                          className="rounded-lg border bg-card p-4 space-y-2"
                        >
                          <div className="flex items-center justify-between">
                            <h4 className="font-medium">{meal.type}</h4>
                            <span className="text-sm text-muted-foreground">
                              {meal.calories}
                            </span>
                          </div>
                          <p className="text-sm">{meal.name}</p>
                          <div className="flex gap-2 text-xs">
                            <Badge variant="outline">
                              Protein: {meal.macros.protein}
                            </Badge>
                            <Badge variant="outline">
                              Carbs: {meal.macros.carbs}
                            </Badge>
                            <Badge variant="outline">
                              Fats: {meal.macros.fats}
                            </Badge>
                          </div>
                          {meal.recipe && (
                            <p className="text-xs text-muted-foreground mt-2">
                              {meal.recipe}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}

                <div className="space-y-2">
                  <h3 className="font-semibold">Weekly Notes</h3>
                  <ul className="list-disc pl-4 space-y-1">
                    {mealPlan.weeklyNotes.map((note, index) => (
                      <li key={index} className="text-sm text-muted-foreground">
                        {note}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-[500px] text-center">
                <Utensils className="h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-muted-foreground">
                  Configure your preferences and generate a meal plan to see your personalized recommendations.
                </p>
              </div>
            )}
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
} 