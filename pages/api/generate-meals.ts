import type { NextApiRequest, NextApiResponse } from "next";
import { LangtailCompletion } from "@langtail/node";

const {
  LANGTAIL_API_KEY,
  LANGTAIL_WORKSPACE,
  LANGTAIL_PROMPT_SLUG,
  LANGTAIL_ENV,
  LANGTAIL_BASE_URL,
  LANGTAIL_API_URL,
} = process.env;

if (!LANGTAIL_API_KEY) {
  throw new Error("LANGTAIL_API_KEY is not defined.");
}

const generateMealIdeas = async (selectedIngredients: string[]) => {
  if (!LANGTAIL_PROMPT_SLUG) {
    throw new Error("LANGTAIL_PROMPT_SLUG is not defined.");
  }

  if (!LANGTAIL_ENV) {
    throw new Error("LANGTAIL_ENV is not defined.");
  }

  // Initialize the LangtailCompletion instance
  const lt = new LangtailCompletion({
    apiKey: LANGTAIL_API_KEY,
    baseURL: LANGTAIL_BASE_URL || "https://api.langtail.com",
  });

  try {
    // Requesting the completion
    const completion = await lt.request({
      prompt: LANGTAIL_PROMPT_SLUG,
      environment: "staging",
      variables: {
        selectedIngredients: JSON.stringify(selectedIngredients),
      },
    });

    // Handling the response
    if (completion && completion.choices && completion.choices.length > 0) {
      return completion.choices[0].message; // Assuming the structure matches your needs
    } else {
      throw new Error("No meal ideas generated.");
    }
  } catch (error) {
    // Handle any errors that occur during the API request
    console.error("Failed to generate meal ideas with Langtail SDK:", error);
    throw error;
  }
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method Not Allowed" });
    return;
  }

  const { selectedIngredients } = req.body;

  try {
    const data = await generateMealIdeas(selectedIngredients);
    res.status(200).json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
