import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseClient";

export async function GET() {
  try {
    // Fetch only curated articles for homepage
    const { data: curatedArticles, error: curatedError } = await supabaseAdmin
      .from("curated_articles")
      .select("*")
      .order("priority", { ascending: false })
      .order("created_at", { ascending: false });

    if (curatedError) {
      console.error("Error fetching curated articles:", curatedError);
      return NextResponse.json([]);
    }

    // Convert curated articles to feed format
    const items = (curatedArticles || []).map((article) => ({
      issue: article.issue,
      title: article.title,
      link: article.link,
      image: article.image_url,
      curated: true,
      priority: article.priority,
    }));

    return NextResponse.json(items);
  } catch (error) {
    console.error("Error fetching curated feed:", error);

    // Return empty array instead of error object to prevent frontend crashes
    return NextResponse.json([]);
  }
}
