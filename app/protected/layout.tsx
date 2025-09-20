import { EnvVarWarning } from "@/components/env-var-warning";
import { AuthButton } from "@/components/auth-button";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { hasEnvVars } from "@/lib/utils";

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="min-h-screen flex flex-col items-center bg-white">
      {/* 顶部固定导航栏 */}
      <nav className="w-full fixed top-0 left-0 z-20 bg-white border-b border-b-foreground/10 h-16 flex justify-end">
        <div className="w-full max-w-5xl flex justify-end items-center p-3 px-5 text-sm mx-auto">
          {!hasEnvVars ? <EnvVarWarning /> : <AuthButton />}
        </div>
      </nav>
      {/* 内容区，顶部留出导航栏高度 */}
      <div className="flex-1 w-full flex flex-col items-center pt-16">
        <div className="flex flex-row gap-8 max-w-7xl p-5 w-full h-[calc(100vh-4rem)] min-h-0">
          {/* 左侧：问卷列表 */}
          <aside className="w-1/4 min-w-[200px] max-w-xs border-r pr-4 h-full flex flex-col">
            <div className="font-bold text-lg mb-4 shrink-0">问卷列表</div>
            <div className="flex-1 min-h-0 overflow-y-auto">
              {/* TODO: 填充问卷列表 */}
              <div className="text-gray-500">（此处显示问卷列表）</div>
            </div>
          </aside>
          {/* 中间：问卷内容 */}
          <section className="flex-1 px-4 h-full flex flex-col">
            <div className="flex-1 min-h-0 overflow-y-auto">{children}</div>
          </section>
          {/* 右侧：问卷分析 */}
          <aside className="w-1/4 min-w-[200px] max-w-xs border-l pl-4 h-full flex flex-col">
            <div className="font-bold text-lg mb-4 shrink-0">问卷分析</div>
            <div className="flex-1 min-h-0 overflow-y-auto">
              {/* TODO: 填充问卷分析内容 */}
              <div className="text-gray-500">（此处显示问卷分析）</div>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
