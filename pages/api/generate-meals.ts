import type { NextApiRequest, NextApiResponse } from "next";

const generateMealIdeas = async (selectedIngredients: string[]) => {
  const { LANGTAIL_API_KEY, LANGTAIL_API_URL } = process.env;

  if (!LANGTAIL_API_KEY) {
    throw new Error("LANGTAIL_API_KEY is not defined.");
  }

  if (!LANGTAIL_API_URL) {
    throw new Error("LANGTAIL_API_URL is not defined.");
  }

  const options = {
    method: "POST",
    headers: {
      "X-API-Key": LANGTAIL_API_KEY,
      "content-type": "application/json",
    },
    body: JSON.stringify({
      stream: false,
      variables: { selectedIngredients: JSON.stringify(selectedIngredients) },
      doNotRecord: false,
      messages: [{ role: "user", content: "Generate" }],
    }),
  };

  const response = await fetch(LANGTAIL_API_URL, options);

  if (!response.ok) {
    const text = await response.text();
    throw new Error("Failed to generate meal ideas.");
  }

  const data = await response.json();
  return data.choices[0].message;
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
