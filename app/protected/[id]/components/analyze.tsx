"use client";
import { useEffect, useState } from "react";
import parse from "html-react-parser";
import { getQuestionnaire, getAnswers } from "@/lib/supabase/client";
import { Button } from "antd";

interface Question {
  id: number;
  type: "input" | "radio" | "checkbox";
  title: string;
  options?: (string | boolean)[];
}

type AnswersState = Record<number, (string | boolean)[]>;

const SafeHtmlRenderer = ({ htmlString }: { htmlString: string }) => {
  // 可选：添加清理函数防止XSS攻击
  const sanitizeHtml = (html: string) => {
    // 这里使用简单的替换，实际应用中应使用DOMPurify等库
    return html.replace(
      /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
      ""
    );
  };

  return <div className="html-content">{parse(sanitizeHtml(htmlString))}</div>;
};

export default function Analyze({ id }: { id: string }) {
  const [questions, setQuestions] = useState<Question[] | null>(null);
  const [answers, setAnswers] = useState<AnswersState>({});
  const [title, setTitle] = useState<string>("问卷分析");
  const [result, setResult] = useState<string>("");
  const [htmlContent, setHtmlContent] = useState<string>("");
  const [loading, setLoading] = useState(false);

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
    setLoading(true);
    console.log("AI分析中...");
    console.log("[ title,questions ] >", title, questions, answers);

    fetch("/api/aiAnalyze", {
      method: "POST",
      body: JSON.stringify({
        model: "deepseek/deepseek-chat-v3.1:free",
        messages: [
          {
            role: "system",
            content:
              "你是一个AI分析助手，擅长对问卷调查结果进行分析，并生成简洁的报告。请根据用户输入的问卷标题、问题和答案，提供有价值的见解和建议。大概500字左右。以纯html格式输出,直接给出html div标签,不要多余内容,不要思考过程",
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
        setHtmlContent(data.choices[0].message.content || "AI分析失败");
      })
      .catch((err) => {
        console.error("AI分析出错:", err);
        setHtmlContent("AI分析出错");
      })
      .finally(() => {
        setLoading(false);
      });
  }

  return (
    <div>
      {!result && !htmlContent ? (
        <Button
          className="mb-4"
          type="primary"
          onClick={aiAnalyze}
          loading={loading}
        >
          {loading ? "AI分析中..." : "AI智能分析"}
        </Button>
      ) : null}
      {result && (
        <div className="mb-4 p-4 border rounded bg-gray-50">{result}</div>
      )}
      {htmlContent && <SafeHtmlRenderer htmlString={htmlContent} />}
    </div>
  );
}
