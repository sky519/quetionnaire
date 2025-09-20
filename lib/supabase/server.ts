import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

/**
 * Especially important if using Fluid compute: Don't put this client in a
 * global variable. Always create a new client within each function when using
 * it.
 */
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_OR_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // The `setAll` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
    }
  );
}

export const getAllQuestionnaires = async () => {
  const supabase = await createClient();
  const { data, error } = await supabase.from("questionnaires").select();

  if (error) {
    console.error("Error fetching questionnaire:", error);
    return null;
  }

  return {
    data,
  };
};

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
