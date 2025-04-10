// This API key will be loaded from .env
// In a production environment, this should be handled securely
// and not exposed in the frontend

export type NutritionAnalysisResult = {
  calories: string;
  macronutrients: {
    carbohydrates: string;
    protein: string;
    fat: string;
  };
  micronutrients: string[];
  analysis: string;
  suggestions: string[];
};

export type HealthyAlternative = {
  original: string;
  alternatives: {
    name: string;
    benefits: string[];
    nutritionFacts: string;
  }[];
};

export const analyzeNutrition = async (
  mealDescription: string
): Promise<NutritionAnalysisResult> => {
  try {
    const apiKey = import.meta.env.VITE_GROQ_API_KEY;
    if (!apiKey) {
      throw new Error("Groq API key is not available. Please add it to your .env file as VITE_GROQ_API_KEY.");
    }

    const systemPrompt = `You are a nutrition expert. Analyze the given meal and provide a detailed breakdown of its nutritional content. Respond with a JSON object containing:
    {
      "calories": "estimated calories",
      "macronutrients": {
        "carbohydrates": "amount with percentage of meal",
        "protein": "amount with percentage of meal",
        "fat": "amount with percentage of meal"
      },
      "micronutrients": ["list of key vitamins and minerals"],
      "analysis": "brief analysis of the nutritional value",
      "suggestions": ["2-3 suggestions for improvement"]
    }`;

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gemma2-9b-it",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: `Analyze this meal: ${mealDescription}` },
        ],
        temperature: 0.5,
        max_tokens: 1000,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      const errorMessage = errorData?.error?.message || 'Unknown error occurred';
      console.error('API Error:', errorData);
      throw new Error(`Failed to analyze nutrition: ${errorMessage}`);
    }

    const data = await response.json();
    const content = data.choices[0].message.content;
    
    // Parse the JSON response
    try {
      // Find JSON object in the response
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      } else {
        throw new Error("Could not parse JSON from response");
      }
    } catch (e) {
      console.error("Error parsing JSON:", e);
      throw new Error("Failed to parse nutrition analysis results");
    }
  } catch (error) {
    console.error("Error analyzing nutrition:", error);
    throw error;
  }
};

export const getHealthyAlternatives = async (
  food: string
): Promise<HealthyAlternative> => {
  try {
    const apiKey = import.meta.env.VITE_GROQ_API_KEY;
    if (!apiKey) {
      throw new Error("Groq API key is not available. Please add it to your .env file as VITE_GROQ_API_KEY.");
    }

    const systemPrompt = `You are a nutrition expert. Provide healthy alternatives to the processed food item mentioned by the user. Respond with a JSON object containing:
    {
      "original": "original food item",
      "alternatives": [
        {
          "name": "healthy alternative 1",
          "benefits": ["benefit 1", "benefit 2"],
          "nutritionFacts": "key nutrition facts"
        },
        {
          "name": "healthy alternative 2",
          "benefits": ["benefit 1", "benefit 2"],
          "nutritionFacts": "key nutrition facts"
        },
        {
          "name": "healthy alternative 3",
          "benefits": ["benefit 1", "benefit 2"],
          "nutritionFacts": "key nutrition facts"
        }
      ]
    }`;

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gemma2-9b-it",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: `Provide healthy alternatives for: ${food}` },
        ],
        temperature: 0.7,
        max_tokens: 1000,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      const errorMessage = errorData?.error?.message || 'Unknown error occurred';
      console.error('API Error:', errorData);
      throw new Error(`Failed to get healthy alternatives: ${errorMessage}`);
    }

    const data = await response.json();
    const content = data.choices[0].message.content;
    
    // Parse the JSON response
    try {
      // Find JSON object in the response
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      } else {
        throw new Error("Could not parse JSON from response");
      }
    } catch (e) {
      console.error("Error parsing JSON:", e);
      throw new Error("Failed to parse healthy alternatives results");
    }
  } catch (error) {
    console.error("Error getting healthy alternatives:", error);
    throw error;
  }
};

export const chatWithNutritionAssistant = async (
  message: string
): Promise<string> => {
  try {
    const apiKey = import.meta.env.VITE_GROQ_API_KEY;
    if (!apiKey) {
      throw new Error("Groq API key is not available. Please add it to your .env file as VITE_GROQ_API_KEY.");
    }

    const systemPrompt = `You are a knowledgeable nutrition assistant AI. 
    Provide helpful, evidence-based answers to questions about nutrition, diet, and food. 
    Keep responses concise and easy to understand. 
    If you're unsure about something, acknowledge it and suggest consulting a professional. 
    Focus on providing general nutrition information rather than personalized medical advice.`;

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gemma2-9b-it",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: message },
        ],
        temperature: 0.7,
        max_tokens: 1000,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      const errorMessage = errorData?.error?.message || 'Unknown error occurred';
      console.error('API Error:', errorData);
      throw new Error(`Failed to chat with nutrition assistant: ${errorMessage}`);
    }

    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    console.error("Error chatting with nutrition assistant:", error);
    throw error;
  }
};

export type MealPlan = {
  dailyPlans: {
    day: string;
    meals: {
      type: string;
      name: string;
      calories: string;
      macros: {
        protein: string;
        carbs: string;
        fats: string;
      };
      recipe?: string;
    }[];
    totalCalories: string;
  }[];
  weeklyNotes: string[];
  dietaryFocus: string;
};

export type Recipe = {
  name: string;
  ingredients: string[];
  instructions: string[];
  nutritionInfo: {
    calories: string;
    protein: string;
    carbs: string;
    fats: string;
  };
  cookingTime: string;
  difficulty: string;
  tips: string[];
};

export const generateMealPlan = async (
  preferences: {
    dietType: string;
    calories: number;
    restrictions: string[];
    goal: string;
  }
): Promise<MealPlan> => {
  try {
    const apiKey = import.meta.env.VITE_GROQ_API_KEY;
    if (!apiKey) {
      throw new Error("Groq API key is not available. Please add it to your .env file as VITE_GROQ_API_KEY.");
    }

    const systemPrompt = `You are a professional nutritionist and meal planner. Create a detailed weekly meal plan based on the user's preferences. 
    You must respond with ONLY a valid JSON object using this exact structure, with no additional text or formatting:
    {
      "dailyPlans": [
        {
          "day": "Monday",
          "meals": [
            {
              "type": "Breakfast/Lunch/Dinner/Snack",
              "name": "Meal name",
              "calories": "calorie count",
              "macros": {
                "protein": "amount in grams",
                "carbs": "amount in grams",
                "fats": "amount in grams"
              },
              "recipe": "Brief recipe overview"
            }
          ],
          "totalCalories": "Total daily calories"
        }
      ],
      "weeklyNotes": ["Nutritionist notes and tips"],
      "dietaryFocus": "Main focus of the meal plan"
    }
    
    Important:
    1. Use only straight quotes (") not curly quotes
    2. Ensure all array elements are comma-separated
    3. Do not add any text before or after the JSON
    4. Ensure all property names and string values are in double quotes
    5. Keep the response concise to avoid exceeding token limits`;

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gemma2-9b-it",
        messages: [
          { role: "system", content: systemPrompt },
          { 
            role: "user", 
            content: `Generate a 5-day meal plan (Monday to Friday) for someone who:
              - Follows a ${preferences.dietType} diet
              - Aims for ${preferences.calories} calories per day
              - Has the following restrictions: ${preferences.restrictions.join(', ')}
              - Has a goal of: ${preferences.goal}
              
              Remember to respond ONLY with the JSON object, no additional text or explanations.`
          },
        ],
        temperature: 0.3,
        max_tokens: 2048,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      const errorMessage = errorData?.error?.message || 'Unknown error occurred';
      console.error('API Error:', errorData);
      throw new Error(`Failed to generate meal plan: ${errorMessage}`);
    }

    const data = await response.json();
    let content = data.choices[0].message.content.trim();
    
    try {
      // Clean up the content
      content = content
        // Remove any text before the first {
        .substring(content.indexOf('{'))
        // Remove any text after the last }
        .substring(0, content.lastIndexOf('}') + 1)
        // Replace smart quotes with straight quotes
        .replace(/[\u2018\u2019\u201C\u201D]/g, '"')
        // Fix trailing commas
        .replace(/,(\s*[}\]])/g, '$1')
        // Fix missing commas between array elements
        .replace(/}(\s*){/g, '},{')
        .replace(/](\s*)\[/g, '],[')
        // Remove any remaining invalid characters
        .replace(/[\u200B-\u200D\uFEFF]/g, '');

      // Try to parse and validate the JSON structure
      try {
        const parsedContent = JSON.parse(content);
        
        // If dailyPlans exists but weeklyNotes or dietaryFocus are missing, add default values
        if (parsedContent.dailyPlans && Array.isArray(parsedContent.dailyPlans)) {
          if (!parsedContent.weeklyNotes) {
            parsedContent.weeklyNotes = [
              "Focus on portion control",
              "Stay hydrated throughout the day",
              "Eat slowly and mindfully"
            ];
          }
          if (!parsedContent.dietaryFocus) {
            parsedContent.dietaryFocus = `${preferences.dietType} diet focused on ${preferences.goal}`;
          }
          return parsedContent;
        }

        // If we can't parse the content normally, try to extract and reconstruct the meal plan
        const dailyPlans = parsedContent.dailyPlans || [];
        return {
          dailyPlans,
          weeklyNotes: [
            "Focus on portion control",
            "Stay hydrated throughout the day",
            "Eat slowly and mindfully"
          ],
          dietaryFocus: `${preferences.dietType} diet focused on ${preferences.goal}`
        };
      } catch (e) {
        console.error("First parse attempt failed:", e);
        
        // If parsing fails, try to extract the dailyPlans array and reconstruct the object
        const match = content.match(/"dailyPlans"\s*:\s*\[([\s\S]*?)\]/);
        if (match) {
          const dailyPlansStr = match[0];
          const reconstructedJson = `{${dailyPlansStr},
            "weeklyNotes": [
              "Focus on portion control",
              "Stay hydrated throughout the day",
              "Eat slowly and mindfully"
            ],
            "dietaryFocus": "${preferences.dietType} diet focused on ${preferences.goal}"
          }`;
          return JSON.parse(reconstructedJson);
        }
        throw new Error("Could not parse JSON from response");
      }
    } catch (e) {
      console.error("Error parsing JSON:", e);
      console.error("Raw content:", content);
      throw new Error("Failed to parse meal plan results");
    }
  } catch (error) {
    console.error("Error generating meal plan:", error);
    throw error;
  }
};

export const generateRecipesFromIngredients = async (
  ingredients: string[],
  preferences: {
    dietaryRestrictions?: string[];
    cuisine?: string;
    mealType?: string;
  } = {}
): Promise<Recipe[]> => {
  try {
    const apiKey = import.meta.env.VITE_GROQ_API_KEY;
    if (!apiKey) {
      throw new Error("Groq API key is not available. Please add it to your .env file as VITE_GROQ_API_KEY.");
    }

    const systemPrompt = `You are a creative chef specializing in healthy cooking. Generate recipes using the provided ingredients.
    The response should be a JSON array of recipe objects with the following structure:
    [
      {
        "name": "Recipe name",
        "ingredients": ["List of ingredients with quantities"],
        "instructions": ["Step by step cooking instructions"],
        "nutritionInfo": {
          "calories": "per serving",
          "protein": "grams",
          "carbs": "grams",
          "fats": "grams"
        },
        "cookingTime": "Total time",
        "difficulty": "Easy/Medium/Hard",
        "tips": ["Cooking tips and variations"]
      }
    ]`;

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gemma2-9b-it",
        messages: [
          { role: "system", content: systemPrompt },
          { 
            role: "user", 
            content: `Generate healthy recipes using these ingredients: ${ingredients.join(', ')}
              ${preferences.dietaryRestrictions ? `\nDietary restrictions: ${preferences.dietaryRestrictions.join(', ')}` : ''}
              ${preferences.cuisine ? `\nCuisine type: ${preferences.cuisine}` : ''}
              ${preferences.mealType ? `\nMeal type: ${preferences.mealType}` : ''}`
          },
        ],
        temperature: 0.7,
        max_tokens: 2048,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      const errorMessage = errorData?.error?.message || 'Unknown error occurred';
      console.error('API Error:', errorData);
      throw new Error(`Failed to generate recipes: ${errorMessage}`);
    }

    const data = await response.json();
    const content = data.choices[0].message.content;
    
    try {
      const jsonMatch = content.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      } else {
        throw new Error("Could not parse JSON from response");
      }
    } catch (e) {
      console.error("Error parsing JSON:", e);
      throw new Error("Failed to parse recipe results");
    }
  } catch (error) {
    console.error("Error generating recipes:", error);
    throw error;
  }
};
