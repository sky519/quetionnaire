"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getAllQuestionnaires } from "@/lib/supabase/client";

type Questionnaire = {
  id: string;
  title: string;
  // 可根据实际接口补充其它字段
};

export default function List() {
  const [data, setData] = useState<Questionnaire[]>([]);
  const router = useRouter();

  useEffect(() => {
    (async () => {
      const res = await getAllQuestionnaires();
      setData(res?.data || []);
    })();
  }, []);

  return (
    <div className="max-w-2xl mx-auto mt-8">
      <ul className="space-y-4">
        {data.map((item) => (
          <li
            key={item.id}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-md transition hover:shadow-xl cursor-pointer border border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 px-6 py-4 flex items-center gap-3"
            onClick={() => router.push(`/protected/${item.id}`)}
          >
            <div className="w-2 h-8 bg-gradient-to-b from-blue-400 to-purple-400 rounded-full" />
            <span className="font-semibold text-lg text-gray-900 dark:text-gray-50">
              {item.title}
            </span>
          </li>
        ))}
      </ul>
      {data.length === 0 && (
        <div className="text-center text-gray-400 mt-10">暂无问卷</div>
      )}
    </div>
  );
}
