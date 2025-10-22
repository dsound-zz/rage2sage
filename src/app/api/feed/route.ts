import Parser from "rss-parser";
import { NextResponse } from "next/server";

interface GuardianArticle {
  webTitle: string;
  webUrl: string;
  fields?: {
    thumbnail?: string;
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

export async function GET() {
  try {
    const apiKey = process.env.GUARDIAN_API_KEY;

    if (!apiKey) {
      console.error("GUARDIAN_API_KEY environment variable is not set");
      return NextResponse.json([]);
    }

    const parser = new Parser();

    // Fetch Guardian API articles
    const guardianResponses = await Promise.all([
      fetch(
        `https://content.guardianapis.com/search?api-key=${apiKey}&q=immigration ICE raids&show-fields=thumbnail,headline,trailText&page-size=2`
      ),
      fetch(
        `https://content.guardianapis.com/search?api-key=${apiKey}&q=climate crisis environment&show-fields=thumbnail,headline,trailText&page-size=2`
      ),
    ]);

    const [guardianImmigrationData, guardianClimateData] = await Promise.all(
      guardianResponses.map((r) => {
        return r.json() as Promise<GuardianResponse>;
      })
    );

    // Fetch RSS feeds
    const rssFeeds = await Promise.all([
      // ICE RAIDS RSS
      parser.parseURL("https://www.commondreams.org/rss.xml"),
      parser.parseURL("https://www.democracynow.org/democracynow.rss"),

      // CLIMATE RSS
      parser.parseURL("https://grist.org/feed/"),
      parser.parseURL("https://insideclimatenews.org/feed/"),
    ]);
    console.log(
      "Guardian Response: ",
      guardianResponses,
      "Gaurdian Immigrations Data: ",
      guardianImmigrationData,
      "guardianClimateData:",
      guardianClimateData,
      "rss feeds",
      rssFeeds
    );
    // Combine Guardian API and RSS articles
    const items = [
      // Guardian API articles for ICE RAIDS
      ...guardianImmigrationData.response.results.map(
        (article: GuardianArticle) => {
          return {
            issue: "ICE RAIDS",
            title: article.webTitle,
            link: article.webUrl,
            image: article.fields?.thumbnail || null,
            curated: false,
            priority: 0,
            source: "The Guardian",
          };
        }
      ),

      // RSS articles for ICE RAIDS
      ...rssFeeds[0].items.slice(0, 2).map((item) => {
        return {
          issue: "ICE RAIDS",
          title: item.title,
          link: item.link,
          image: extractImage(item),
          curated: false,
          priority: 0,
          source: "Common Dreams",
        };
      }),
      ...rssFeeds[1].items.slice(0, 2).map((item) => {
        return {
          issue: "ICE RAIDS",
          title: item.title,
          link: item.link,
          image: extractImage(item),
          curated: false,
          priority: 0,
          source: "Democracy Now",
        };
      }),

      // Guardian API articles for CLIMATE
      ...guardianClimateData.response.results.map(
        (article: GuardianArticle) => {
          return {
            issue: "CLIMATE",
            title: article.webTitle,
            link: article.webUrl,
            image: article.fields?.thumbnail || null,
            curated: false,
            priority: 0,
            source: "The Guardian",
          };
        }
      ),

      // RSS articles for CLIMATE
      ...rssFeeds[2].items.slice(0, 2).map((item) => {
        return {
          issue: "CLIMATE",
          title: item.title,
          link: item.link,
          image: extractImage(item),
          curated: false,
          priority: 0,
          source: "Grist",
        };
      }),
      ...rssFeeds[3].items.slice(0, 2).map((item) => {
        return {
          issue: "CLIMATE",
          title: item.title,
          link: item.link,
          image: extractImage(item),
          curated: false,
          priority: 0,
          source: "Inside Climate News",
        };
      }),
    ];

    // Ensure we always return an array, even if empty
    const safeItems = Array.isArray(items) ? items : [];
    console.log(safeItems);
    return NextResponse.json(safeItems);
  } catch (error) {
    console.error("Error fetching hybrid feeds:", error);

    // Return empty array instead of error object to prevent frontend crashes
    return NextResponse.json([]);
  }
}
