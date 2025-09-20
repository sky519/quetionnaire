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
    <ul>
      {data.map((item) => (
        <li
          key={item.id}
          className="mb-2 cursor-pointer hover:underline"
          onClick={() => router.push(`/protected/${item.id}`)}
        >
          <span className="font-medium pl-4">{item.title}</span>
        </li>
      ))}
    </ul>
  );
}
