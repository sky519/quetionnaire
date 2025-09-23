import Analyze from "./components/analyze";
import QuestionsResult from "@/components/questionsResult";

export default async function ProtectedPage({ params }) {
  const pageParams = await params;
  const id = pageParams.id;
  return (
    <div className="flex w-full h-[calc(100vh-8rem)] min-h-0">
      {/* 左侧：问卷内容 */}
      <section className="flex-1 min-h-0 overflow-y-auto ">
        <QuestionsResult id={id} />
      </section>
      {/* 右侧：问卷列表 */}
      <aside className="flex-1 border-l pl-20 h-full flex flex-col">
        <div className="font-bold text-[24px] mb-4 shrink-0">问卷分析</div>
        <div className="flex-1 min-h-0 overflow-y-auto">
          <Analyze id={id} />
        </div>
      </aside>
    </div>
  );
}
