"use client";
import Link from "next/link";
import { Button } from "./ui/button";
import { createClient } from "@/lib/supabase/client";
import { LogoutButton } from "./logout-button";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";

export function AuthButton() {
  const pathname = usePathname();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const supabase = createClient();
      const { data } = await supabase.auth.getUser();
      setUser(data?.user ?? null);
    };
    fetchUser();
  }, []);

  if (pathname !== "/" && user) {
    return (
      <div className="flex items-center gap-4">
        你好, {user.email ?? "未知邮箱"}!
        <LogoutButton />
      </div>
    );
  }
  return (
    <div className="flex gap-2">
      <Button asChild size="sm" variant={"default"}>
        <Link href={user ? "/protected/0" : "/auth/login"}>查看后台统计</Link>
      </Button>
    </div>
  );
}
