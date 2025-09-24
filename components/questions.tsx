"use client";
import React, { useState, useEffect } from "react";
import {
  getQuestionnaire,
  saveAnswer,
  checkAnswer,
} from "@/lib/supabase/client";
import { Form, Input, Radio, Checkbox, Button, Spin, Alert } from "antd";
import "antd/dist/reset.css";

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

// 保证 input 只接收 string
const getInputValue = (val: AnswerValue) =>
  typeof val === "string" ? val : "";

export default function QuestionnaireForm({
  id,
  uid,
}: {
  id: string | string[] | undefined;
  uid: string | string[] | undefined;
}) {
  const [answers, setAnswers] = useState<AnswersState>({});
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [title, setTitle] = useState<string>("问卷调查");
  const [status, setStatus] = useState<number>(0);

  useEffect(() => {
    const fetchStatus = async () => {
      const res = await checkAnswer(id, uid);
      console.log("[ res ] >", res);
      setStatus(res?.status || 0);
      // setStatus(res?.status || 0);
    };
    fetchStatus();
  }, [id, uid]);

  useEffect(() => {
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
  }, [id, uid]);

  const handleChange = (id: number, value: string | boolean) => {
    setAnswers((prev) => ({ ...prev, [id]: value }));
  };

  const handleCheckboxChange = (
    id: number,
    checkedValue: Array<string | boolean>
  ) => {
    setAnswers((prev) => ({ ...prev, [id]: checkedValue }));
  };

  const handleSubmit = async () => {
    // 这里可以提交 answers 到后端
    // setLoading(true);
    console.log("[ answers ] >", answers);
    const data = await saveAnswer(id, uid, answers);
    // setLoading(false);
    console.log("[ data ] >", data);
    location.reload();
  };

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

  return status === 0 ? (
    <div
      style={{
        maxWidth: 600,
        margin: "20px auto",
        borderRadius: 8,
        boxShadow: "0 2px 8px #f0f1f2",
        padding: 32,
      }}
      className="dark:bg-gray-800 bg-white"
    >
      <h2 style={{ fontSize: 24, fontWeight: 700, marginBottom: 32 }}>
        {title}
      </h2>
      <Form layout="vertical" onFinish={handleSubmit}>
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
              <Input
                value={getInputValue(answers[q.id])}
                onChange={(e) => handleChange(q.id, e.target.value)}
                placeholder="请输入..."
              />
            )}
            {q.type === "radio" && q.options && (
              <Radio.Group
                value={answers[q.id]}
                onChange={(e) =>
                  handleChange(
                    q.id,
                    e.target.value === "true"
                      ? true
                      : e.target.value === "false"
                      ? false
                      : e.target.value
                  )
                }
              >
                {q.options.map((opt) => (
                  <Radio
                    key={String(opt)}
                    value={opt}
                    style={{ marginRight: 16 }}
                    className="text-gray-900 dark:text-gray-100"
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
                onChange={(checked) =>
                  handleCheckboxChange(
                    q.id,
                    Array.isArray(checked) ? checked : []
                  )
                }
              >
                {q.options.map((opt) => (
                  <Checkbox
                    key={String(opt)}
                    value={opt}
                    style={{ marginRight: 16 }}
                    className="text-gray-900 dark:text-gray-100"
                  >
                    {opt}
                  </Checkbox>
                ))}
              </Checkbox.Group>
            )}
          </Form.Item>
        ))}
        <Form.Item>
          <Button type="primary" htmlType="submit" style={{ width: 120 }}>
            提交
          </Button>
        </Form.Item>
      </Form>
    </div>
  ) : (
    <div>
      <h2 className="text-center my-10 text-2xl font-bold">
        您已提交过问卷，谢谢参与！
      </h2>
    </div>
  );
}
