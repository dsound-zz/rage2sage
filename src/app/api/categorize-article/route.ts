import { NextResponse } from "next/server";
import OpenAI from "openai";

// Lazy initialize OpenAI to avoid build errors
const getOpenAI = () => {
  if (!process.env.OPENAI_API_KEY) return null;
  return new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
};

export async function POST(req: Request) {
  try {
    const { title, content } = await req.json();

    if (!title) {
      return NextResponse.json({ error: "Title is required" }, { status: 400 });
    }

    // First, try keyword matching to see if it's a clear match
    const text = `${title} ${content || ""}`.toLowerCase();

    // Strong ICE signals - check these first
    if (
      text.includes("ice raid") ||
      text.includes("ice agent") ||
      text.includes("ice enforcement") ||
      text.includes("customs enforcement") ||
      text.includes("immigration raid")
    ) {
      console.log(`Strong ICE signal for "${title}"`);
      return NextResponse.json({ category: "ICE RAIDS" });
    }

    const iceKeywords = [
      "ice",
      "immigration",
      "raids",
      "deportation",
      "border",
      "immigrant",
      "detention",
      "asylum",
      "refugee",
      "undocumented",
      "immigration enforcement",
    ];

    const climateKeywords = [
      "climate",
      "global warming",
      "carbon",
      "emissions",
      "renewable energy",
      "fossil fuel",
      "extreme weather",
      "drought",
      "flooding",
      "environment",
      "pollution",
      "sea ice",
      "glaciers",
      "greenhouse",
    ];

    const iceCount = iceKeywords.filter((k) => {
      return text.includes(k);
    }).length;
    const climateCount = climateKeywords.filter((k) => {
      return text.includes(k);
    }).length;

    // If keyword match is clear, use it
    if (Math.abs(iceCount - climateCount) > 1 || iceCount >= 2) {
      const keywordCategory =
        iceCount >= climateCount ? "ICE RAIDS" : "CLIMATE";
      console.log(
        `Keyword match for "${title}": ${keywordCategory} (ice: ${iceCount}, climate: ${climateCount})`
      );
      return NextResponse.json({ category: keywordCategory });
    }

    // Fallback to keyword matching if no API key
    if (!process.env.OPENAI_API_KEY) {
      console.warn("OPENAI_API_KEY not set, using keyword fallback");
      const defaultCategory =
        iceCount >= climateCount ? "ICE RAIDS" : "CLIMATE";
      return NextResponse.json({ category: defaultCategory });
    }

    // Use AI for unclear cases
    const prompt = `Categorize this article as either "ICE RAIDS" or "CLIMATE":

"ICE RAIDS" = Immigration and Customs Enforcement (ICE) agency, immigration enforcement, raids, deportations, border issues, asylum seekers, detention centers
"CLIMATE" = Climate change, environmental issues, global warming, emissions, renewable energy, extreme weather, carbon

Note: "ICE" means the federal immigration agency, NOT frozen water.

Title: ${title}
${content ? `Preview: ${content.substring(0, 500)}` : ""}

Category:`;

    const openai = getOpenAI();
    if (!openai) {
      const defaultCategory =
        iceCount >= climateCount ? "ICE RAIDS" : "CLIMATE";
      return NextResponse.json({ category: defaultCategory });
    }

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [{ role: "user", content: prompt }],
      temperature: 0,
      max_tokens: 5,
    });

    let category =
      response.choices[0]?.message?.content?.trim()?.toUpperCase() || "";

    // Clean up the response
    if (category.includes("ICE")) category = "ICE RAIDS";
    else if (category.includes("CLIMATE")) category = "CLIMATE";
    else {
      category = iceCount >= climateCount ? "ICE RAIDS" : "CLIMATE";
    }

    console.log(`AI result for "${title}": ${category}`);
    return NextResponse.json({ category });
  } catch (error) {
    console.error("Error categorizing article:", error);
    const { title, content } = await req.json();
    const text = `${title} ${content || ""}`.toLowerCase();
    const iceCount = ["ice", "immigration", "raid", "deportation"].filter(
      (k) => {
        return text.includes(k);
      }
    ).length;
    const climateCount = [
      "climate",
      "warming",
      "emission",
      "environment",
    ].filter((k) => {
      return text.includes(k);
    }).length;
    const defaultCategory = iceCount >= climateCount ? "ICE RAIDS" : "CLIMATE";
    return NextResponse.json({ category: defaultCategory });
  }
}
