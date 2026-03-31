import { NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = createServerClient();

    const { data, error } = await supabase
      .from("setup_showcases")
      .select("*")
      .eq("published", true)
      .order("votes", { ascending: false })
      .limit(20);

    if (error) {
      console.error("Showcase fetch error:", error);
      return NextResponse.json({ showcases: [] });
    }

    return NextResponse.json({ showcases: data ?? [] });
  } catch (err) {
    console.error("Showcase GET error:", err);
    return NextResponse.json({ showcases: [] });
  }
}

export async function POST(req: Request) {
  try {
    const supabase = createServerClient();
    const body = await req.json();

    const { display_name, title, image_url, description, tagged_products } =
      body;

    if (!display_name || !image_url) {
      return NextResponse.json(
        { error: "display_name and image_url are required" },
        { status: 400 }
      );
    }

    const {
      data: { session },
    } = await supabase.auth.getSession();

    const { error } = await supabase.from("setup_showcases").insert({
      user_id: session?.user?.id ?? null,
      display_name,
      title: title || null,
      image_url,
      description: description || null,
      tagged_products: tagged_products ?? [],
      votes: 0,
      published: false,
      is_seeded: false,
    });

    if (error) {
      console.error("Showcase insert error:", error);
      return NextResponse.json(
        { error: "Failed to submit showcase" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Showcase POST error:", err);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
