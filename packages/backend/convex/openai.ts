import OpenAI from "openai";
import { action, internalAction, query } from "./_generated/server";
import { v } from "convex/values";
import { missingEnvVariableUrl } from "./utils";

export const openaiKeySet = query({
  args: {},
  handler: async () => {
    return !!process.env.OPENAI_API_KEY;
  },
});

const ingredientValidator = v.object({
  amount: v.optional(v.string()),
  unit: v.optional(v.string()),
  item: v.string(),
  notes: v.optional(v.string()),
});

// Extract recipe from pasted text or URL content
export const extractRecipe = action({
  args: {
    text: v.string(),
  },
  handler: async (ctx, { text }) => {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      const error = missingEnvVariableUrl(
        "OPENAI_API_KEY",
        "https://platform.openai.com/account/api-keys",
      );
      throw new Error(error);
    }

    const openai = new OpenAI({ apiKey });
    const prompt = `Extract recipe information from the following text. Parse it into a structured format.

Text:
${text}

Return a JSON object with this exact structure:
{
  "title": "Recipe name",
  "description": "Brief description (optional)",
  "servings": number or null,
  "prepTime": number in minutes or null,
  "cookTime": number in minutes or null,
  "ingredients": [
    {
      "amount": "1" or null,
      "unit": "cup" or null,
      "item": "flour",
      "notes": "sifted" or null
    }
  ],
  "instructions": ["Step 1", "Step 2"],
  "tags": ["dinner", "vegetarian"] or null
}`;

    const output = await openai.chat.completions.create({
      messages: [
        {
          role: "system",
          content:
            "You are a helpful assistant that extracts recipe information from text and returns it as structured JSON. Always parse ingredients into separate amount, unit, and item fields when possible.",
        },
        { role: "user", content: prompt },
      ],
      model: "gpt-4-turbo-preview",
      response_format: { type: "json_object" },
    });

    const messageContent = output.choices[0]?.message.content;
    const parsedOutput = JSON.parse(messageContent!);

    return parsedOutput;
  },
});

// Generate recipe modifications based on user request
export const modifyRecipe = action({
  args: {
    recipeTitle: v.string(),
    ingredients: v.array(ingredientValidator),
    instructions: v.array(v.string()),
    modificationRequest: v.string(),
  },
  handler: async (
    ctx,
    { recipeTitle, ingredients, instructions, modificationRequest },
  ) => {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      const error = missingEnvVariableUrl(
        "OPENAI_API_KEY",
        "https://platform.openai.com/account/api-keys",
      );
      throw new Error(error);
    }

    const openai = new OpenAI({ apiKey });
    const prompt = `Modify this recipe based on the user's request.

Recipe: ${recipeTitle}

Current Ingredients:
${JSON.stringify(ingredients, null, 2)}

Current Instructions:
${instructions.map((step, i) => `${i + 1}. ${step}`).join("\n")}

Modification Request: ${modificationRequest}

Return a JSON object with:
{
  "modificationSummary": "Brief description of what was changed",
  "ingredients": [modified ingredient objects with same structure],
  "instructions": [modified instruction steps]
}`;

    const output = await openai.chat.completions.create({
      messages: [
        {
          role: "system",
          content:
            "You are a helpful culinary assistant that modifies recipes based on user requests. Return structured JSON with the modifications.",
        },
        { role: "user", content: prompt },
      ],
      model: "gpt-4-turbo-preview",
      response_format: { type: "json_object" },
    });

    const messageContent = output.choices[0]?.message.content;
    const parsedOutput = JSON.parse(messageContent!);

    return parsedOutput;
  },
});
