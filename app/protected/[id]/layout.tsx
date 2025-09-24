import { EnvVarWarning } from "@/components/env-var-warning";
import { AuthButton } from "@/components/auth-button";
// import { ThemeSwitcher } from "@/components/theme-switcher";
import { hasEnvVars } from "@/lib/utils";
import List from "./components/list";

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="min-h-screen flex flex-col items-center bg-white">
      {/* 顶部固定导航栏 */}
      <nav className="w-full fixed top-0 left-0 z-20 bg-white border-b border-b-foreground/10 h-16 flex justify-end xs:bg-white">
        <div className="w-full flex justify-end items-center p-3 px-5 text-sm mx-auto">
          {/* <ThemeSwitcher /> */}
          {!hasEnvVars ? <EnvVarWarning /> : <AuthButton />}
        </div>
      </nav>
      {/* 内容区，顶部留出导航栏高度 */}
      <div className="flex-1 w-full flex flex-col items-center pt-20 px-2 sm:px-4 md:px-8 lg:px-16 xl:px-[200px]">
        <div className="w-full flex flex-col md:flex-row h-[calc(100vh-8rem)] min-h-0 overflow-y-auto">
          {/* 左侧：问卷列表 */}
          <aside className="w-full md:w-1/3 lg:w-1/4 min-w-0 max-w-full md:max-w-xl border-b md:border-b-0 md:border-r pr-0 md:pr-4 h-auto md:h-full flex flex-col mb-4 md:mb-0">
            <div className="font-bold text-[20px] md:text-[24px] mb-4 shrink-0 text-center md:text-left">
              问卷列表
            </div>
            <div className="flex-1 min-h-0 overflow-y-auto">
              <div className="text-gray-500">
                <List />
              </div>
            </div>
          </aside>
          {/* 中间：问卷内容 */}
          <section className="flex-1 px-0 md:px-4 h-auto md:h-full flex flex-col">
            <div className="flex-1 min-h-0 overflow-y-auto">{children}</div>
          </section>
        </div>
      </div>
    </main>
  );
}
