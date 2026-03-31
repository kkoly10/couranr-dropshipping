import { NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";

export async function POST(req: Request) {
  try {
    const supabase = createServerClient();
    const { showcaseId } = await req.json();

    if (!showcaseId) {
      return NextResponse.json(
        { error: "showcaseId is required" },
        { status: 400 }
      );
    }

    // Fetch current votes then increment
    const { data: current, error: fetchError } = await supabase
      .from("setup_showcases")
      .select("votes")
      .eq("id", showcaseId)
      .single();

    if (fetchError || !current) {
      console.error("Showcase vote fetch error:", fetchError);
      return NextResponse.json(
        { error: "Showcase not found" },
        { status: 404 }
      );
    }

    const { error: updateError } = await supabase
      .from("setup_showcases")
      .update({ votes: current.votes + 1 })
      .eq("id", showcaseId);

    if (updateError) {
      console.error("Showcase vote update error:", updateError);
      return NextResponse.json(
        { error: "Failed to vote" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Showcase vote error:", err);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
