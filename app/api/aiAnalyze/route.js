import { NextResponse } from "next/server";

export async function POST(request) {
  // console.log("[ req.body ] >", req.body);
  const rData = await request.json();
  console.log("[ rData ] >", rData);
  const response = await fetch(
    "https://openrouter.ai/api/v1/chat/completions",
    {
      method: "POST",
      headers: {
        Authorization:
          "Bearer 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",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(rData),
    }
  );
  console.log("[ res ] >", response);
  const data = await response.json();
  return NextResponse.json(data, { status: response.status });
}
