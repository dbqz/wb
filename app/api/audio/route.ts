import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const url = searchParams.get("url");

  if (!url) {
    return NextResponse.json(
      { error: "Missing audio URL" },
      { status: 400 }
    );
  }

  try {
    const response = await fetch(decodeURIComponent(url));
    
    if (!response.ok) {
      throw new Error(`Failed to fetch audio: ${response.status}`);
    }

    const audioBuffer = await response.arrayBuffer();
    
    return new NextResponse(audioBuffer, {
      headers: {
        "Content-Type": response.headers.get("Content-Type") || "audio/mpeg",
        "Content-Length": audioBuffer.byteLength.toString(),
        "Cache-Control": "public, max-age=3600",
      },
    });
  } catch (error) {
    console.error("Error proxying audio:", error);
    return NextResponse.json(
      { error: "Failed to proxy audio" },
      { status: 500 }
    );
  }
}
