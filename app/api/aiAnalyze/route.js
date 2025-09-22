import { NextResponse } from "next/server";

export async function POST(request) {
  // console.log("[ req.body ] >", req.body);
  const rData = await request.json();
  console.log("[ rData ] >", rData);
  const response = await fetchfetch(
    "https://openrouter.ai/api/v1/chat/completions",
    {
      method: "POST",
      headers: {
        Authorization:
          "Bearer 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",
        "HTTP-Referer": "<YOUR_SITE_URL>", // Optional. Site URL for rankings on openrouter.ai.
        "X-Title": "<YOUR_SITE_NAME>", // Optional. Site title for rankings on openrouter.ai.
        "Content-Type": "application/json",
      },
      body: JSON.stringify(rData),
    }
  );
  console.log("[ res ] >", response);
  const data = await response.json();
  return NextResponse.json(data, { status: response.status });
}
