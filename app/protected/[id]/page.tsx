import Analyze from "./components/analyze";
import QuestionsResult from "@/components/questionsResult";

export default async function ProtectedPage({ params }) {
  const pageParams = await params;
  const id = pageParams.id;
  return (
    <div className="flex flex-col md:flex-row w-full h-auto md:h-[calc(100vh-8rem)] min-h-0">
      {/* 左侧：问卷内容 */}
      <section className="flex-1 min-h-0 overflow-y-auto px-2 md:px-0">
        <QuestionsResult id={id} />
      </section>
      {/* 右侧：问卷分析 */}
      <aside className="flex-1 border-t md:border-t-0 md:border-l pl-0 md:pl-20 h-auto md:h-full flex flex-col mt-8 md:mt-0">
        <div className="font-bold text-[20px] md:text-[24px] mb-4 shrink-0 text-center md:text-left">
          问卷分析
        </div>
        <div className="flex-1 min-h-0 overflow-y-auto">
          <Analyze id={id} />
        </div>
      </aside>
    </div>
  );
}
