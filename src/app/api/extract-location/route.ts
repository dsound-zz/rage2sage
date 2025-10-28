import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  try {
    const { title, content } = await req.json();

    if (!title) {
      return NextResponse.json({ error: "Title is required" }, { status: 400 });
    }

    // Fallback to keyword extraction if no API key
    if (!process.env.OPENAI_API_KEY) {
      console.warn("OPENAI_API_KEY not set, using keyword fallback");
      return NextResponse.json({
        location: extractLocationByKeywords(title, content),
      });
    }

    const prompt = `Extract the location from this news article. Return the city and state if available.

Article Title: ${title}
${content ? `Article Content: ${content.substring(0, 1000)}` : ""}

Respond with a JSON object in this format:
{
  "city": "City name or null",
  "state": "State abbreviation (e.g., CA, TX, NY) or null",
  "zip": "null"
}

If no specific location is found, return {"city": null, "state": null, "zip": null}.
Only include the JSON, no other text.`;

    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.3,
      max_tokens: 50,
    });

    const aiResponse = response.choices[0]?.message?.content?.trim() || "";

    try {
      const location = JSON.parse(aiResponse);
      console.log(`AI location extraction for "${title}":`, location);
      return NextResponse.json({
        location: {
          city: location.city || null,
          state: location.state || null,
          zip: null,
        },
      });
    } catch {
      // If JSON parsing fails, use keyword extraction
      return NextResponse.json({
        location: extractLocationByKeywords(title, aiResponse),
      });
    }
  } catch (error) {
    console.error("Error extracting location:", error);
    // Fallback to keyword extraction
    const { title, content: contentData } = await req.json();
    return NextResponse.json({
      location: extractLocationByKeywords(title, contentData),
    });
  }
}

function extractLocationByKeywords(
  title: string,
  content?: string
): { city: string | null; state: string | null; zip: string | null } {
  const text = `${title} ${content || ""}`;

  // Try to find city and state patterns
  const statePattern = /\b([A-Z]{2})\b/g;
  const states = [...text.matchAll(statePattern)];

  // Common city patterns
  const cityPattern = /\b([A-Z][a-z]+(?:\s[A-Z][a-z]+)?),\s*([A-Z]{2})\b/;
  const cityMatch = text.match(cityPattern);

  if (cityMatch) {
    return {
      city: cityMatch[1],
      state: cityMatch[2],
      zip: null,
    };
  }

  if (states.length > 0) {
    return {
      city: null,
      state: states[0][1],
      zip: null,
    };
  }

  return { city: null, state: null, zip: null };
}
