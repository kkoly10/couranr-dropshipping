import { NextResponse } from "next/server";
import { buildWeeklySnapshot } from "@/lib/marketing/analyzer";

export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const snapshot = await buildWeeklySnapshot();
    return NextResponse.json({ success: true, snapshot });
  } catch (error) {
    console.error("Marketing snapshot error:", error);
    return NextResponse.json(
      { error: "Failed to build snapshot" },
      { status: 500 }
    );
  }
}
