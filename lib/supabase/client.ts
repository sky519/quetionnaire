import { createBrowserClient } from "@supabase/ssr";
import { stat } from "fs";

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_OR_ANON_KEY!
  );
}

export const getQuestionnaire = async (id) => {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("questionnaires")
    .select()
    .eq("id", id)
    .single();

  if (error) {
    console.error("Error fetching questionnaire:", error);
    return null;
  }

  return {
    id: data.id,
    title: data.title,
    target: data.target,
    questions: JSON.parse(data.questions),
  };
};

export const saveAnswer = async (id, uid, answers) => {
  const supabase = await createClient();
  const { error } = await supabase
    .from("answers")
    .insert({ answers, qid: id, uid });

  if (error) {
    console.error("Error fetching questionnaire:", error);
    return null;
  }

  return {
    status: "success",
  };
};
