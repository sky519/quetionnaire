import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";

export async function POST(request) {
  // 获取 formData
  const data = await request.json();
  console.log("[ data ] >", data);
  const uid = uuidv4();

  try {
    return NextResponse.json({ data, uid });
  } catch (e) {
    return NextResponse.json({ error: e }, { status: 500 });
  }
}
