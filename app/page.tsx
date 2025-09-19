import { EnvVarWarning } from "@/components/env-var-warning";
import { AuthButton } from "@/components/auth-button";
import Questions from "@/components/questions";
import { hasEnvVars } from "@/lib/utils";
// import Link from "next/link";
import "@ant-design/v5-patch-for-react-19";

export default async function Home({
  searchParams,
}: {
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  const params = await searchParams;
  const id = params?.id || "1";
  const uid = params?.uid || "1";
  console.log("id", id);
  console.log("uid", uid);
  return (
    <main className="min-h-screen flex flex-col items-center">
      <div className="flex-1 w-full flex flex-col gap-20 items-center">
        <nav className="w-full flex justify-center border-b border-b-foreground/10 h-16">
          <div className="w-full max-w-5xl flex justify-end items-center p-3 px-5 text-sm">
            {!hasEnvVars ? <EnvVarWarning /> : <AuthButton />}
          </div>
        </nav>
        <div className="flex-1 flex flex-col gap-20 max-w-5xl p-5">
          <main className="flex-1 flex flex-col gap-6 px-4">
            <Questions id={id} uid={uid} />
          </main>
        </div>
      </div>
    </main>
  );
}
