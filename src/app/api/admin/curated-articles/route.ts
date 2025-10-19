import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseClient";

// GET - Fetch all curated articles
export async function GET() {
  try {
    const { data, error } = await supabaseAdmin
      .from("curated_articles")
      .select("*")
      .order("priority", { ascending: false })
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching curated articles:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data || []);
  } catch (error) {
    console.error("Error in curated articles GET:", error);
    return NextResponse.json(
      { error: "Failed to fetch curated articles" },
      { status: 500 }
    );
  }
}

// POST - Add a new curated article
export async function POST(req: Request) {
  try {
    const {
      title,
      link,
      image_url,
      issue,
      priority = 0,
      source,
    } = await req.json();

    if (!title || !link || !issue) {
      return NextResponse.json(
        { error: "Missing required fields: title, link, issue" },
        { status: 400 }
      );
    }

    const { data, error } = await supabaseAdmin
      .from("curated_articles")
      .insert([
        {
          title,
          link,
          image_url,
          issue,
          priority,
          source,
        },
      ])
      .select()
      .single();

    if (error) {
      console.error("Error creating curated article:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error in curated articles POST:", error);
    return NextResponse.json(
      { error: "Failed to create curated article" },
      { status: 500 }
    );
  }
}

// DELETE - Remove a curated article
export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Missing article ID" },
        { status: 400 }
      );
    }

    const { error } = await supabaseAdmin
      .from("curated_articles")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Error deleting curated article:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error in curated articles DELETE:", error);
    return NextResponse.json(
      { error: "Failed to delete curated article" },
      { status: 500 }
    );
  }
}
