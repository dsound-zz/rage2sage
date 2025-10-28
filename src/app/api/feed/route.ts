import Parser from "rss-parser";
import { NextResponse } from "next/server";
import type { Location } from "@/types";

interface GuardianArticle {
  webTitle: string;
  webUrl: string;
  fields?: {
    thumbnail?: string;
    trailText?: string;
  };
}

interface GuardianResponse {
  response: {
    results: GuardianArticle[];
  };
}

// Helper function to extract image from HTML content
const extractImageFromContent = (
  content: string | undefined
): string | null => {
  if (!content) return null;
  const imgMatch = content.match(/<img[^>]+src="([^"]+)"/i);
  return imgMatch ? imgMatch[1] : null;
};

// Helper function to extract image from description/contentSnippet
const extractImageFromDescription = (
  description: string | undefined
): string | null => {
  if (!description) return null;
  const imgMatch = description.match(/<img[^>]+src="([^"]+)"/i);
  return imgMatch ? imgMatch[1] : null;
};

// Helper function to extract image from RSS item
const extractImage = (item: {
  enclosure?: { url?: string };
  media?: { thumbnail?: { url?: string }; content?: { url?: string } };
  content?: string;
  contentSnippet?: string;
  description?: string;
}): string | null => {
  return (
    item.enclosure?.url ||
    item.media?.thumbnail?.url ||
    item.media?.content?.url ||
    extractImageFromContent(item.content) ||
    extractImageFromDescription(item.contentSnippet) ||
    extractImageFromDescription(item.description) ||
    null
  );
};

// Helper function to categorize article using AI
async function categorizeArticle(
  title: string,
  content?: string
): Promise<"ICE RAIDS" | "CLIMATE"> {
  try {
    // Call the categorize-article endpoint
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
    const response = await fetch(`${baseUrl}/api/categorize-article`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, content }),
    });

    // Check if response is JSON
    const contentType = response.headers.get("content-type");
    if (!contentType?.includes("application/json")) {
      console.warn(
        "Category extraction returned non-JSON, using keyword fallback"
      );
      return keywordBasedCategory(title, content);
    }

    const data = await response.json();
    return data.category || "CLIMATE";
  } catch (error) {
    console.error("Error categorizing article:", error);
    return keywordBasedCategory(title, content);
  }
}

// Keyword-based categorization fallback
function keywordBasedCategory(
  title: string,
  content?: string
): "ICE RAIDS" | "CLIMATE" {
  const text = `${title} ${content || ""}`.toLowerCase();

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
  ];
  const climateKeywords = [
    "climate",
    "global warming",
    "carbon",
    "emissions",
    "renewable energy",
    "fossil fuel",
    "extreme weather",
    "environment",
    "pollution",
  ];

  const iceCount = iceKeywords.filter((k) => {
    return text.includes(k);
  }).length;
  const climateCount = climateKeywords.filter((k) => {
    return text.includes(k);
  }).length;

  if (text.includes("ice raid") || text.includes("ice agent")) {
    return "ICE RAIDS";
  }

  return iceCount >= climateCount ? "ICE RAIDS" : "CLIMATE";
}

// Helper function to extract location using keyword matching
function extractLocation(title: string, content?: string): Location | null {
  const text = `${title} ${content || ""}`;

  // US State abbreviations
  const states = [
    "AL",
    "AK",
    "AZ",
    "AR",
    "CA",
    "CO",
    "CT",
    "DE",
    "FL",
    "GA",
    "HI",
    "ID",
    "IL",
    "IN",
    "IA",
    "KS",
    "KY",
    "LA",
    "ME",
    "MD",
    "MA",
    "MI",
    "MN",
    "MS",
    "MO",
    "MT",
    "NE",
    "NV",
    "NH",
    "NJ",
    "NM",
    "NY",
    "NC",
    "ND",
    "OH",
    "OK",
    "OR",
    "PA",
    "RI",
    "SC",
    "SD",
    "TN",
    "TX",
    "UT",
    "VT",
    "VA",
    "WA",
    "WV",
    "WI",
    "WY",
    "DC",
  ];

  // Try to find city, state pattern (e.g., "Chicago, IL" or "Los Angeles CA")
  const cityStateMatch = text.match(
    /([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*),?\s*(CA|NY|TX|FL|IL|PA|OH|GA|NC|MI|NJ|VA|WA|AZ|MA|TN|IN|MO|MD|WI|CO|MN|SC|AL|LA|KY|OR|OK|CT|IA|UT|AR|NV|MS|KS|NM|NE|WV|ID|HI|NH|ME|RI|MT|DE|SD|ND|AK|DC|VT|WY)/i
  );
  if (cityStateMatch) {
    return {
      city: cityStateMatch[1].trim(),
      state: cityStateMatch[2].toUpperCase(),
      zip: null,
    };
  }

  // Try to find state abbreviation alone
  const stateMatch = text.match(
    /\b(CA|NY|TX|FL|IL|PA|OH|GA|NC|MI|NJ|VA|WA|AZ|MA|TN|IN|MO|MD|WI|CO|MN|SC|AL|LA|KY|OR|OK|CT|IA|UT|AR|NV|MS|KS|NM|NE|WV|ID|HI|NH|ME|RI|MT|DE|SD|ND|AK|DC|VT|WY)\b/i
  );
  if (stateMatch && states.includes(stateMatch[1].toUpperCase())) {
    return {
      city: null,
      state: stateMatch[1].toUpperCase(),
      zip: null,
    };
  }

  // Try to find major cities
  const majorCities = [
    "New York",
    "Los Angeles",
    "Chicago",
    "Houston",
    "Phoenix",
    "Philadelphia",
    "San Antonio",
    "San Diego",
    "Dallas",
    "San Jose",
    "Austin",
    "Jacksonville",
    "Fort Worth",
    "Columbus",
    "Charlotte",
    "San Francisco",
    "Indianapolis",
    "Seattle",
    "Denver",
    "Boston",
    "Washington",
    "Nashville",
    "Detroit",
    "Miami",
    "Portland",
  ];

  for (const city of majorCities) {
    if (text.match(new RegExp(city, "i"))) {
      return {
        city: city,
        state: null,
        zip: null,
      };
    }
  }

  return null;
}

export async function GET() {
  try {
    const apiKey = process.env.GUARDIAN_API_KEY;

    if (!apiKey) {
      console.error("GUARDIAN_API_KEY environment variable is not set");
      return NextResponse.json([]);
    }

    const parser = new Parser();

    // Fetch Guardian API articles for broad topics
    const guardianResponses = await Promise.all([
      fetch(
        `https://content.guardianapis.com/search?api-key=${apiKey}&q=immigration ICE raids&show-fields=thumbnail,headline,trailText&page-size=3`
      ),
      fetch(
        `https://content.guardianapis.com/search?api-key=${apiKey}&q=climate crisis environment&show-fields=thumbnail,headline,trailText&page-size=3`
      ),
    ]);

    const [guardianImmigrationData, guardianClimateData] = await Promise.all(
      guardianResponses.map((r) => {
        return r.json() as Promise<GuardianResponse>;
      })
    );

    // Fetch RSS feeds
    const rssFeeds = await Promise.all([
      parser.parseURL("https://www.commondreams.org/rss.xml"),
      parser.parseURL("https://www.democracynow.org/democracynow.rss"),
      parser.parseURL("https://grist.org/feed/"),
      parser.parseURL("https://insideclimatenews.org/feed/"),
    ]);

    // Combine all articles without pre-categorizing
    const rawArticles = [
      // Guardian articles
      ...guardianImmigrationData.response.results.map(
        (article: GuardianArticle) => {
          return {
            title: article.webTitle,
            link: article.webUrl,
            image: article.fields?.thumbnail || null,
            content: article.fields?.trailText,
            source: "The Guardian",
          };
        }
      ),
      ...guardianClimateData.response.results.map(
        (article: GuardianArticle) => {
          return {
            title: article.webTitle,
            link: article.webUrl,
            image: article.fields?.thumbnail || null,
            content: article.fields?.trailText,
            source: "The Guardian",
          };
        }
      ),

      // RSS articles
      ...rssFeeds[0].items.slice(0, 3).map((item) => {
        return {
          title: item.title || "",
          link: item.link || "",
          image: extractImage(item),
          content: item.contentSnippet || item.description,
          source: "Common Dreams",
        };
      }),
      ...rssFeeds[1].items.slice(0, 3).map((item) => {
        return {
          title: item.title || "",
          link: item.link || "",
          image: extractImage(item),
          content: item.contentSnippet || item.description,
          source: "Democracy Now",
        };
      }),
      ...rssFeeds[2].items.slice(0, 3).map((item) => {
        return {
          title: item.title || "",
          link: item.link || "",
          image: extractImage(item),
          content: item.contentSnippet || item.description,
          source: "Grist",
        };
      }),
      ...rssFeeds[3].items.slice(0, 3).map((item) => {
        return {
          title: item.title || "",
          link: item.link || "",
          image: extractImage(item),
          content: item.contentSnippet || item.description,
          source: "Inside Climate News",
        };
      }),
    ];

    // Categorize and extract location for each article
    const items = await Promise.all(
      rawArticles.map(async (article) => {
        const issue = await categorizeArticle(article.title, article.content);
        const location = await extractLocation(article.title, article.content);

        // Log for debugging
        console.log(`Article: "${article.title}" -> Categorized as: ${issue}`);
        console.log(`Location extracted:`, location);

        return {
          issue,
          title: article.title,
          link: article.link,
          image: article.image,
          location,
          curated: false,
          priority: 0,
          source: article.source,
        };
      })
    );

    // Filter to only show ICE RAIDS and CLIMATE articles
    const filteredItems = items.filter((item) => {
      return item.issue === "ICE RAIDS" || item.issue === "CLIMATE";
    });

    return NextResponse.json(filteredItems);
  } catch (error) {
    console.error("Error fetching hybrid feeds:", error);

    // Return empty array instead of error object to prevent frontend crashes
    return NextResponse.json([]);
  }
}
