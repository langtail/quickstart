"use client";

import { useState } from "react";
import ReactMarkdown from "react-markdown";

const ingredients = {
  proteins: [
    "Chicken",
    "Beef",
    "Pork",
    "Tofu",
    "Eggs",
    "Salmon",
    "Shrimp",
    "Turkey",
    "Lamb",
    "Duck",
  ],
  vegetables: [
    "Broccoli",
    "Carrots",
    "Spinach",
    "Potatoes",
    "Onions",
    "Tomatoes",
    "Peppers",
    "Mushrooms",
    "Zucchini",
    "Cauliflower",
  ],
  fruits: [
    "Apples",
    "Bananas",
    "Oranges",
    "Berries",
    "Lemons",
    "Grapes",
    "Melons",
    "Peaches",
    "Pineapples",
    "Mangoes",
  ],
  nuts: [
    "Almonds",
    "Walnuts",
    "Cashews",
    "Peanuts",
    "Pecans",
    "Pistachios",
    "Hazelnuts",
    "Macadamia",
    "Brazil Nuts",
    "Pine Nuts",
  ],
};

export default function Home() {
  const [selectedIngredients, setSelectedIngredients] = useState<string[]>([]);
  const [mealIdeas, setMealIdeas] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleIngredientClick = (ingredient: string) => {
    if (selectedIngredients.includes(ingredient)) {
      setSelectedIngredients(selectedIngredients.filter((item) => item !== ingredient));
    } else {
      setSelectedIngredients([...selectedIngredients, ingredient]);
    }
  };

  const handleInspireClick = async () => {
    if (selectedIngredients.length === 0) {
      return;
    }

    setIsLoading(true);
    console.log("Inspire Me clicked with ingredients:", selectedIngredients);

    try {
      const response = await fetch("/api/generate-meals", {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({ selectedIngredients }),
      });

      if (response.ok) {
        const data = await response.json();
        setMealIdeas(data.content);
      } else {
        console.error("Error fetching meal ideas:", response.statusText);
      }
    } catch (error) {
      console.error("Error fetching meal ideas:", error);
    }

    setIsLoading(false);
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold mb-8">Meal Suggestion App</h1>
      <div className="space-y-8 mb-8">
        {Object.entries(ingredients).map(([category, items]) => (
          <div key={category}>
            <h2 className="text-2xl font-semibold mb-4 capitalize">{category}</h2>
            <div className="grid grid-cols-5 gap-4">
              {items.map((ingredient) => (
                <button
                  key={ingredient}
                  className={`px-4 py-2 rounded ${selectedIngredients.includes(ingredient)
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 text-gray-800"
                    }`}
                  onClick={() => handleIngredientClick(ingredient)}
                >
                  {ingredient}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
      <button
        className={`px-8 py-4 rounded-lg font-semibold text-lg ${isLoading
          ? "bg-white text-green-500 border-2 border-green-500"
          : "bg-green-500 text-white"
          }`}
        onClick={handleInspireClick}
        disabled={isLoading}
      >
        {isLoading ? "Finding Inspiration..." : "Inspire Me"}
      </button>
      {mealIdeas && (
        <div className="mt-8">
          <h2 className="text-2xl font-semibold mb-4">Meal Ideas:</h2>
          <div className="bg-gray-100 p-4 rounded">
            <ReactMarkdown
              components={{
                h2: ({ node, ...props }) => (
                  <h2 className="text-xl font-semibold mb-2" {...props} />
                ),
                p: ({ node, ...props }) => <p className="mb-4" {...props} />,
              }}
            >
              {mealIdeas}
            </ReactMarkdown>
          </div>
        </div>
      )}
    </main>
  );
}