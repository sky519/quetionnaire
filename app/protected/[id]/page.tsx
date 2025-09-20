import Analyze from "./components/analyze";
import QuestionsResult from "@/components/questionsResult";

export default async function ProtectedPage({
  params,
}: {
  params: { id: string };
}) {
  console.log("[ id ] >", params.id);
  return (
    <div className="flex w-full h-[calc(100vh-8rem)] min-h-0">
      {/* 左侧：问卷内容 */}
      <section className="flex-1 min-h-0 overflow-y-auto ">
        <QuestionsResult id={params.id} />
      </section>
      {/* 右侧：问卷列表 */}
      <aside className="w-80 max-w-xs min-w-[200px] border-l pl-4 h-full flex flex-col">
        <div className="font-bold text-lg mb-4 shrink-0">问卷分析</div>
        <div className="flex-1 min-h-0 overflow-y-auto">
          <Analyze />
        </div>
      </aside>
    </div>
  );
}
