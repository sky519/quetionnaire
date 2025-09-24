"use client";
import React, { useState, useEffect } from "react";
import { getQuestionnaire, getAnswers } from "@/lib/supabase/client";
import { Form, Spin, Alert, List } from "antd";
import PieChartContainer from "@/components/PieChartContainer";
import PieChart2Container from "@/components/PieChart2Container";
import "antd/dist/reset.css";

type Question =
  | { id: number; type: "input"; title: string }
  | {
      id: number;
      type: "radio" | "checkbox";
      title: string;
      options: (string | boolean)[];
    };

type AnswerValue = string | boolean | Array<string | boolean>;
type AnswersState = Record<number, AnswerValue>;

export default function QuestionnaireForm({ id }) {
  const [answers, setAnswers] = useState<AnswersState>({});
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [title, setTitle] = useState<string>("问卷调查");

  useEffect(() => {
    console.log("[ id1 ] >", id);
    const fetchQuestionnaires = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getQuestionnaire(id);
        console.log("[ data.questions ] >", data?.questions);
        setQuestions(data?.questions || []);
        setTitle(data?.title || "问卷调查");
      } catch (err: unknown) {
        if (err && typeof err === "object" && "message" in err) {
          setError((err as { message?: string }).message || "加载失败");
        } else {
          setError("加载失败");
        }
      }
      setLoading(false);
    };
    fetchQuestionnaires();
  }, [id]);

  useEffect(() => {
    console.log("[ id2 ] >", id);
    const fetchAnswers = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getAnswers(id);
        // console.log("[ answers ] >", data.answers);
        const parsedAnswers = data.answers?.map((item) =>
          JSON.parse(item.answers)
        );
        console.log("[ parsedAnswers ] >", parsedAnswers);

        const tempAnswers = {};
        parsedAnswers?.forEach((ans) => {
          Object.keys(ans).forEach((key) => {
            if (!tempAnswers[key]) {
              tempAnswers[key] = [];
            }
            ans[key] = Array.isArray(ans[key])
              ? tempAnswers[key].push(...ans[key])
              : tempAnswers[key].push(ans[key]);
          });
        });

        console.log("[ tempAnswers ] >", tempAnswers);

        setAnswers(tempAnswers);
      } catch (err: unknown) {
        if (err && typeof err === "object" && "message" in err) {
          setError((err as { message?: string }).message || "加载失败");
        } else {
          setError("加载失败");
        }
      }
      setLoading(false);
    };
    fetchAnswers();
  }, [id]);

  if (loading) return <Spin style={{ width: "100%", margin: "40px 0" }} />;
  if (error)
    return (
      <Alert
        type="error"
        message={"加载失败: " + error}
        showIcon
        style={{ margin: "40px 0" }}
      />
    );

  return (
    <div
      style={{
        margin: "0 auto",
        borderRadius: 8,
        boxShadow: "0 2px 8px #f0f1f2",
        padding: "0 32px",
      }}
    >
      <h2
        style={{
          fontSize: 24,
          fontWeight: 700,
          marginBottom: 32,
          color: "rgba(156, 163, 175, 1)",
        }}
      >
        {title}
      </h2>
      <Form layout="vertical" aria-readonly disabled>
        {questions.map((q) => (
          <Form.Item
            key={q.id}
            label={
              <span className="text-gray-900 dark:text-gray-100">
                {q.id + 1 + ". " + q.title}
              </span>
            }
            style={{ marginBottom: 28 }}
          >
            {q.type === "input" && (
              <div className="h-40 overflow-y-auto">
                <List
                  className="dark:bg-gray-800 bg-white"
                  size="small"
                  bordered
                  dataSource={
                    Array.isArray(answers[q.id])
                      ? (answers[q.id] as (string | boolean)[])
                      : []
                  }
                  renderItem={(item) => (
                    <List.Item className=" text-gray-900 dark:text-gray-100">
                      {item}
                    </List.Item>
                  )}
                />
              </div>
            )}
            {q.type === "radio" && q.options && (
              <div className="h-64">
                <PieChart2Container answerData={answers[q.id] || []} />
              </div>
            )}
            {q.type === "checkbox" && q.options && (
              <div className="h-64">
                <PieChartContainer answerData={answers[q.id] || []} />
              </div>
            )}
          </Form.Item>
        ))}
      </Form>
    </div>
  );
}
