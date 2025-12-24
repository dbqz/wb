import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const msg = searchParams.get("msg") || "雨爱(人声弱化1.05x)";
  const n = searchParams.get("n") || "1";

  try {
    const response = await fetch(
      `https://api.jkyai.top/API/qsyyjs.php?msg=${encodeURIComponent(msg)}&n=${n}`
    );
    const data = await response.json();
    
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch music" },
      { status: 500 }
    );
  }
}
