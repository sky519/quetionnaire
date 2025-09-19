"use client";
import React, { useState, useEffect } from "react";
import { getQuestionnaire } from "@/lib/supabase/client";

type Question =
  | { id: number; type: "input"; title: string }
  | {
      id: number;
      type: "radio" | "checkbox";
      title: string;
      options: (string | boolean)[];
    };

// const questions: Question[] = [
//   { id: 0, type: "input", title: "您的职业是什么？" },
//   {
//     options: ["25岁以下", "25-35岁", "36-45岁", "46岁以上"],
//     id: 1,
//     type: "radio",
//     title: "您的年龄段是？",
//   },
//   {
//     options: ["ChatGPT", "Midjourney", "GitHub Copilot", "Notion AI", "其他"],
//     id: 2,
//     type: "checkbox",
//     title: "您使用过哪些AI工具？",
//   },
//   {
//     options: ["完全新手", "基础了解", "熟练应用", "专家级"],
//     id: 3,
//     type: "radio",
//     title: "您认为自己的AI技能水平如何？",
//   },
//   {
//     options: [
//       "编程辅助",
//       "数据分析",
//       "内容创作",
//       "图像处理",
//       "自动化办公",
//       "其他",
//     ],
//     id: 4,
//     type: "checkbox",
//     title: "您希望通过AI技能比武提升哪些能力？",
//   },
//   {
//     options: ["几乎不用", "1-3次", "4-7次", "每天使用"],
//     id: 5,
//     type: "radio",
//     title: "您每周使用AI工具的频率是？",
//   },
//   {
//     options: ["在线课程", "专家讲座", "实战项目", "学习小组", "其他"],
//     id: 6,
//     type: "checkbox",
//     title: "您觉得公司应提供哪些AI培训资源？",
//   },
//   {
//     options: [true, false],
//     id: 7,
//     type: "radio",
//     title: "您是否愿意参与AI技能比武活动？",
//   },
//   {
//     options: ["知识竞赛", "实战项目", "创意展示", "团队协作", "其他"],
//     id: 8,
//     type: "checkbox",
//     title: "您认为AI技能比武应包含哪些形式？",
//   },
//   { id: 9, type: "input", title: "您对AI技能比武活动还有哪些建议？" },
// ];

type AnswerValue = string | boolean | Array<string | boolean>;
type AnswersState = Record<number, AnswerValue>;

export default function QuestionnaireForm() {
  const [answers, setAnswers] = useState<AnswersState>({});
  const [questions, setQuestions] = useState<Question[]>([]);

  useEffect(() => {
    const fetchQuestionnaires = async () => {
      try {
        // 查询用户表数据
        const data = await getQuestionnaire(1);
        console.log("[ data ] >", data);
        setQuestions(data?.questions || []);
      } catch (err) {
        console.error("获取用户失败:", err);
      }
    };

    fetchQuestionnaires();
  }, []);

  const handleChange = (id: number, value: string | boolean) => {
    setAnswers((prev) => ({ ...prev, [id]: value }));
  };

  const handleCheckboxChange = (id: number, option: string | boolean) => {
    setAnswers((prev) => {
      const prevArr = Array.isArray(prev[id])
        ? (prev[id] as Array<string | boolean>)
        : [];
      if (prevArr.includes(option)) {
        return { ...prev, [id]: prevArr.filter((v) => v !== option) };
      } else {
        return { ...prev, [id]: [...prevArr, option] };
      }
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // 这里可以提交 answers 到后端
    alert(JSON.stringify(answers, null, 2));
  };

  return (
    <form
      className="max-w-xl mx-auto p-6 bg-white rounded shadow"
      onSubmit={handleSubmit}
    >
      <h2 className="text-2xl font-bold mb-6">问卷调查</h2>
      {questions.map((q) => (
        <div className="mb-6" key={q.id}>
          <label className="block font-medium mb-2">{q.title}</label>
          {q.type === "input" && (
            <input
              type="text"
              className="w-full border rounded px-3 py-2"
              value={(() => {
                const v = answers[q.id];
                if (typeof v === "string") return v;
                return "";
              })()}
              onChange={(e) => handleChange(q.id, e.target.value)}
            />
          )}
          {q.type === "radio" &&
            q.options.map((opt) => (
              <label
                key={String(opt)}
                className="inline-flex items-center mr-4"
              >
                <input
                  type="radio"
                  name={`q${q.id}`}
                  value={String(opt)}
                  checked={answers[q.id] === opt}
                  onChange={() => handleChange(q.id, opt)}
                  className="mr-2"
                />
                {typeof opt === "boolean" ? (opt ? "是" : "否") : opt}
              </label>
            ))}
          {q.type === "checkbox" &&
            q.options.map((opt) => {
              const arr = Array.isArray(answers[q.id])
                ? (answers[q.id] as Array<string | boolean>)
                : [];
              return (
                <label
                  key={String(opt)}
                  className="inline-flex items-center mr-4"
                >
                  <input
                    type="checkbox"
                    name={`q${q.id}`}
                    value={String(opt)}
                    checked={arr.includes(opt)}
                    onChange={() => handleCheckboxChange(q.id, opt)}
                    className="mr-2"
                  />
                  {opt}
                </label>
              );
            })}
        </div>
      ))}
      <button
        type="submit"
        className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
      >
        提交
      </button>
    </form>
  );
}
