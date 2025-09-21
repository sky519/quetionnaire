"use client";
import React, { useState, useEffect } from "react";
import { getQuestionnaire, getAnswers } from "@/lib/supabase/client";
import { Form, Input, Radio, Checkbox, Spin, Alert } from "antd";
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

// 保证 input 只接收 string
const getInputValue = (val: AnswerValue) =>
  typeof val === "string" ? val : "";

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
        console.log("[ data ] >", data);
        setAnswers(data?.answers || {});
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
        background: "#fff",
        borderRadius: 8,
        boxShadow: "0 2px 8px #f0f1f2",
        padding: "0 32px",
      }}
    >
      <h2 style={{ fontSize: 24, fontWeight: 700, marginBottom: 32 }}>
        {title}
      </h2>
      <Form layout="vertical" aria-readonly disabled>
        {questions.map((q) => (
          <Form.Item key={q.id} label={q.title} style={{ marginBottom: 28 }}>
            {q.type === "input" && (
              <Input
                value={getInputValue(answers[q.id])}
                placeholder="请输入..."
              />
            )}
            {q.type === "radio" && q.options && (
              <Radio.Group value={answers[q.id]}>
                {q.options.map((opt) => (
                  <Radio
                    key={String(opt)}
                    value={opt}
                    style={{ marginRight: 16 }}
                  >
                    {typeof opt === "boolean" ? (opt ? "是" : "否") : opt}
                  </Radio>
                ))}
              </Radio.Group>
            )}
            {q.type === "checkbox" && q.options && (
              <Checkbox.Group
                value={
                  Array.isArray(answers[q.id])
                    ? (answers[q.id] as (string | boolean)[])
                    : []
                }
              >
                {q.options.map((opt) => (
                  <Checkbox
                    key={String(opt)}
                    value={opt}
                    style={{ marginRight: 16 }}
                  >
                    {opt}
                  </Checkbox>
                ))}
              </Checkbox.Group>
            )}
          </Form.Item>
        ))}
      </Form>
    </div>
  );
}
