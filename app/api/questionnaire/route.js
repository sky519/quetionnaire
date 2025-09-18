import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { v4 as uuidv4 } from "uuid";

export async function POST(request) {
  // 获取 formData
  // console.log("[ data ] >", data);
  const data = await request.json();
  console.log("[ data ] >", data);
  const uid = uuidv4();

  const supabase = createClient();

  const { error } = await supabase
    .from("questionnaires")
    .insert({
      id: uid,
      title: data.title,
      target: data.target,
      questions: JSON.stringify(data.questions),
    });

  if (error) {
    console.log("[ error ] >", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ id: uid }, { status: 200 });
}
