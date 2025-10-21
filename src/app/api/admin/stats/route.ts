import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseClient";

export async function GET() {
  try {
    // Fetch all clicks
    const { data: clicksData, error: clicksError } = await supabaseAdmin
      .from("clicks")
      .select("*")
      .order("created_at", { ascending: false });

    if (clicksError) throw clicksError;

    const totalClicks = clicksData?.length || 0;

    // Count unique users
    const uniqueAnonIds = new Set(
      clicksData?.map((c) => {
        return c.anon_id;
      }) || []
    );
    const uniqueUsers = uniqueAnonIds.size;

    // Issue statistics
    const issueCounts =
      clicksData?.reduce((acc, click) => {
        acc[click.issue] = (acc[click.issue] || 0) + 1;
        return acc;
      }, {} as Record<string, number>) || {};

    const issueStats = Object.entries(issueCounts).map(([issue, count]) => {
      return {
        issue,
        count: count as number,
      };
    });

    // Daily statistics (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const dailyCounts =
      clicksData?.reduce((acc, click) => {
        const date = new Date(click.created_at).toISOString().split("T")[0];
        if (new Date(date) >= sevenDaysAgo) {
          acc[date] = (acc[date] || 0) + 1;
        }
        return acc;
      }, {} as Record<string, number>) || {};

    const dailyStats = Object.entries(dailyCounts)
      .map(([date, clicks]) => {
        return {
          date,
          clicks: clicks as number,
        };
      })
      .sort((a, b) => {
        return a.date.localeCompare(b.date);
      });

    return NextResponse.json({
      clicks: clicksData || [],
      totalClicks,
      uniqueUsers,
      issueStats,
      dailyStats,
    });
  } catch (error) {
    console.error("Error fetching admin stats:", error);
    return NextResponse.json(
      { error: "Failed to fetch stats" },
      { status: 500 }
    );
  }
}
