
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
    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      throw new Error("Groq API key is not available. Please add it to your .env file.");
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
        model: "llama-3-8b-8192",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: `Analyze this meal: ${mealDescription}` },
        ],
        temperature: 0.5,
        max_tokens: 1000,
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to analyze nutrition");
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
    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      throw new Error("Groq API key is not available. Please add it to your .env file.");
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
        model: "llama-3-8b-8192",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: `Provide healthy alternatives for: ${food}` },
        ],
        temperature: 0.7,
        max_tokens: 1000,
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to get healthy alternatives");
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
    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      throw new Error("Groq API key is not available. Please add it to your .env file.");
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
        model: "llama-3-8b-8192",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: message },
        ],
        temperature: 0.7,
        max_tokens: 1000,
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to chat with nutrition assistant");
    }

    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    console.error("Error chatting with nutrition assistant:", error);
    throw error;
  }
};
