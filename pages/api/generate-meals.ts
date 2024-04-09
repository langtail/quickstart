import type { NextApiRequest, NextApiResponse } from "next";
import { LangtailPrompts } from "@langtail/node";

const { LANGTAIL_API_KEY } = process.env;

if (!LANGTAIL_API_KEY) {
  throw new Error("LANGTAIL_API_KEY is not defined.");
}

const generateMealIdeas = async (selectedIngredients: string[]) => {
  // Initialize the LangtailPrompts instance
  const lt = new LangtailPrompts({
    apiKey: LANGTAIL_API_KEY,
  });

  // Requesting the completion
  const completion = await lt.invoke({
    prompt: "quickstart",
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
