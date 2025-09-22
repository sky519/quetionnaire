"use client";
import { useEffect, useState } from "react";

import { getQuestionnaire, getAnswers } from "@/lib/supabase/client";
import { Button } from "antd";

interface Question {
  id: number;
  type: "input" | "radio" | "checkbox";
  title: string;
  options?: (string | boolean)[];
}

type AnswersState = Record<number, (string | boolean)[]>;

export default function Analyze({ id }: { id: string }) {
  const [questions, setQuestions] = useState<Question[] | null>(null);
  const [answers, setAnswers] = useState<AnswersState>({});
  const [title, setTitle] = useState<string>("问卷分析");
  const [result, setResult] = useState<string>("");

  useEffect(() => {
    (async () => {
      const questionnaireRes = await getQuestionnaire(id);
      const answersRes = await getAnswers(id);
      console.log("[ questionnaire,answers ] >", questionnaireRes, answersRes);
      setTitle(questionnaireRes?.title || "问卷分析");
      setQuestions(questionnaireRes?.questions);
      setAnswers(answersRes?.answers || {});
      setResult("");
    })();
  }, [id]);

  function aiAnalyze() {
    console.log("AI分析中...");
    console.log("[ title,questions ] >", title, questions, answers);

    fetch("/api/aiAnalyze", {
      method: "POST",
      body: JSON.stringify({
        model: "Triangle104/Qwen3-8B-128k-Context-4X-Large-Q8_0-GGUF",
        temperature: 0.6,
        stream: false,
        messages: [
          {
            role: "system",
            content:
              "你是一个AI分析助手，擅长对问卷调查结果进行分析，并生成简洁的报告。请根据用户输入的问卷标题、问题和答案，提供有价值的见解和建议。大概500字左右。以纯html格式输出,直接给出html,不要多余内容,不要思考过程",
          },
          {
            role: "user",
            content: `问卷标题: ${title}\n  问题: ${JSON.stringify(
              questions,
              null,
              2
            )}\n  答案: ${JSON.stringify(answers, null, 2)}`,
          },
        ],
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("[ AI分析结果 ] >", data);
        setResult(data.choices[0].message.content || "AI分析失败");
      })
      .catch((err) => {
        console.error("AI分析出错:", err);
        setResult("AI分析出错");
      });
    // TODO: 实现AI分析逻辑
  }

  return (
    <div>
      {result ? (
        <div className="mb-4 p-4 border rounded bg-gray-50">{result}</div>
      ) : (
        <Button type="primary" onClick={aiAnalyze}>
          AI智能分析
        </Button>
      )}
    </div>
  );
}
