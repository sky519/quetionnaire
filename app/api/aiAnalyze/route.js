import { NextResponse } from "next/server";

export async function POST(request) {
  // console.log("[ req.body ] >", req.body);
  const rData = await request.json();
  console.log("[ rData ] >", rData);
  // const response = await fetch(
  //   "https://openrouter.ai/api/v1/chat/completions",
  //   {
  //     method: "POST",
  //     headers: {
  //       Authorization:
  //         "Bearer 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",
  //       "Content-Type": "application/json",
  //     },
  //     body: JSON.stringify(rData),
  //   }
  // );
  const response = await fetch(
    "https://api.siliconflow.cn/v1/chat/completions",
    {
      method: "POST",
      headers: {
        Authorization:
          "Bearer sk-rfbcwiudzvsurjdpiiaaaazysktybatpdhaslrxogzaeibfw",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(rData),
    }
  );
  console.log("[ res ] >", response);
  const data = await response.json();
  return NextResponse.json(data, { status: response.status });
}
