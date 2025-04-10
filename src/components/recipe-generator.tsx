import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, ChefHat, Plus, X, Clock, Gauge } from "lucide-react";
import { generateRecipesFromIngredients, type Recipe } from "@/lib/groq-api";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const cuisineTypes = [
  { value: "any", label: "Any Cuisine" },
  { value: "mediterranean", label: "Mediterranean" },
  { value: "asian", label: "Asian" },
  { value: "italian", label: "Italian" },
  { value: "mexican", label: "Mexican" },
  { value: "indian", label: "Indian" },
  { value: "american", label: "American" },
];

const mealTypes = [
  { value: "any", label: "Any Type" },
  { value: "breakfast", label: "Breakfast" },
  { value: "lunch", label: "Lunch" },
  { value: "dinner", label: "Dinner" },
  { value: "snack", label: "Snack" },
  { value: "dessert", label: "Dessert" },
];

export function RecipeGenerator() {
  const [ingredients, setIngredients] = useState<string[]>([]);
  const [newIngredient, setNewIngredient] = useState("");
  const [loading, setLoading] = useState(false);
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [preferences, setPreferences] = useState({
    cuisine: "any",
    mealType: "any",
    dietaryRestrictions: [] as string[],
  });

  const handleAddIngredient = () => {
    if (newIngredient.trim()) {
      setIngredients([...ingredients, newIngredient.trim()]);
      setNewIngredient("");
    }
  };

  const handleRemoveIngredient = (index: number) => {
    setIngredients(ingredients.filter((_, i) => i !== index));
  };

  const handleGenerateRecipes = async () => {
    if (ingredients.length === 0) {
      setError("Please add at least one ingredient.");
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      const generatedRecipes = await generateRecipesFromIngredients(ingredients, {
        cuisine: preferences.cuisine !== "any" ? preferences.cuisine : undefined,
        mealType: preferences.mealType !== "any" ? preferences.mealType : undefined,
        dietaryRestrictions: preferences.dietaryRestrictions.length > 0 ? preferences.dietaryRestrictions : undefined,
      });
      setRecipes(generatedRecipes);
    } catch (err) {
      setError("Failed to generate recipes. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Recipe Generator</CardTitle>
          <CardDescription>
            Enter ingredients you have and get delicious recipe suggestions.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Add Ingredients</Label>
              <div className="flex gap-2">
                <Input
                  value={newIngredient}
                  onChange={(e) => setNewIngredient(e.target.value)}
                  placeholder="Enter an ingredient"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleAddIngredient();
                    }
                  }}
                />
                <Button onClick={handleAddIngredient} size="icon">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {ingredients.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {ingredients.map((ingredient, index) => (
                  <Badge
                    key={index}
                    variant="secondary"
                    className="flex items-center gap-1"
                  >
                    {ingredient}
                    <button
                      onClick={() => handleRemoveIngredient(index)}
                      className="ml-1 hover:text-destructive"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}

            <div className="space-y-2">
              <Label>Cuisine Type</Label>
              <Select
                value={preferences.cuisine}
                onValueChange={(value) => setPreferences({ ...preferences, cuisine: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {cuisineTypes.map((cuisine) => (
                    <SelectItem key={cuisine.value} value={cuisine.value}>
                      {cuisine.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Meal Type</Label>
              <Select
                value={preferences.mealType}
                onValueChange={(value) => setPreferences({ ...preferences, mealType: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {mealTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
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
              onClick={handleGenerateRecipes}
              disabled={loading || ingredients.length === 0}
              className="w-full"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating Recipes...
                </>
              ) : (
                <>
                  <ChefHat className="mr-2 h-4 w-4" />
                  Generate Recipes
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Recipe Suggestions</CardTitle>
          <CardDescription>
            Delicious recipes you can make with your ingredients
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[600px] pr-4">
            {recipes.length > 0 ? (
              <div className="space-y-6">
                {recipes.map((recipe, index) => (
                  <div
                    key={index}
                    className="rounded-lg border bg-card p-4 space-y-4"
                  >
                    <div>
                      <h3 className="font-semibold text-lg">{recipe.name}</h3>
                      <div className="flex items-center gap-4 mt-2">
                        <div className="flex items-center text-sm text-muted-foreground">
                          <Clock className="h-4 w-4 mr-1" />
                          {recipe.cookingTime}
                        </div>
                        <div className="flex items-center text-sm text-muted-foreground">
                          <Gauge className="h-4 w-4 mr-1" />
                          {recipe.difficulty}
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium mb-2">Ingredients</h4>
                      <ul className="list-disc pl-4 space-y-1">
                        {recipe.ingredients.map((ingredient, i) => (
                          <li key={i} className="text-sm">
                            {ingredient}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h4 className="font-medium mb-2">Instructions</h4>
                      <ol className="list-decimal pl-4 space-y-2">
                        {recipe.instructions.map((step, i) => (
                          <li key={i} className="text-sm">
                            {step}
                          </li>
                        ))}
                      </ol>
                    </div>

                    <div className="pt-2 border-t">
                      <h4 className="font-medium mb-2">Nutrition Information</h4>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="text-sm">
                          <span className="font-medium">Calories:</span>{" "}
                          {recipe.nutritionInfo.calories}
                        </div>
                        <div className="text-sm">
                          <span className="font-medium">Protein:</span>{" "}
                          {recipe.nutritionInfo.protein}
                        </div>
                        <div className="text-sm">
                          <span className="font-medium">Carbs:</span>{" "}
                          {recipe.nutritionInfo.carbs}
                        </div>
                        <div className="text-sm">
                          <span className="font-medium">Fats:</span>{" "}
                          {recipe.nutritionInfo.fats}
                        </div>
                      </div>
                    </div>

                    {recipe.tips.length > 0 && (
                      <div className="pt-2 border-t">
                        <h4 className="font-medium mb-2">Tips</h4>
                        <ul className="list-disc pl-4 space-y-1">
                          {recipe.tips.map((tip, i) => (
                            <li key={i} className="text-sm text-muted-foreground">
                              {tip}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-[500px] text-center">
                <ChefHat className="h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-muted-foreground">
                  Add ingredients and generate recipes to see delicious suggestions.
                </p>
              </div>
            )}
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
} 