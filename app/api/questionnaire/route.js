import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
// import { v4 as uuidv4 } from "uuid";

export async function POST(request) {
  // 获取 formData
  // console.log("[ data ] >", data);
  const rData = await request.json();
  console.log("[ data ] >", rData);
  // const uid = uuidv4();

  const supabase = await createClient();

  const { error, data } = await supabase
    .from("questionnaires")
    .insert({
      // id: uid,
      title: rData.title,
      target: rData.target,
      questions: JSON.stringify(rData.questions),
    })
    .select("id");

  if (error) {
    console.log("[ error ] >", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  console.log("[ success ] >", { id: data[0]?.id });
  return new NextResponse(data[0]?.id);
}
