import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseClient";

export async function POST(req: Request) {
  const { action_id, issue, zip, anon_id } = await req.json();

  const { error } = await supabaseAdmin.from("clicks").insert([
    {
      action_id,
      issue,
      zip,
      anon_id,
      created_at: new Date().toISOString(),
    },
  ]);

  if (error) return NextResponse.json({ error }, { status: 500 });
  return NextResponse.json({ ok: true });
}
