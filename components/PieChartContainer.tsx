"use client";
import {
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from "recharts";
import type { PieLabelRenderProps } from "recharts";

const RADIAN = Math.PI / 180;
const COLORS = [
  "#0088FE",
  "#00C49F",
  "#FFBB28",
  "#FF8042",
  "#AF19FF",
  "#FF4560",
  "#00E396",
];

const renderCustomizedLabel = ({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  percent,
}: PieLabelRenderProps) => {
  const cxNum = Number(cx ?? 0);
  const cyNum = Number(cy ?? 0);
  const midAngleNum = Number(midAngle ?? 0);
  const innerRadiusNum = Number(innerRadius ?? 0);
  const outerRadiusNum = Number(outerRadius ?? 0);
  const percentNum = Number(percent ?? 0);

  const radius = innerRadiusNum + (outerRadiusNum - innerRadiusNum) * 0.5;
  const x = cxNum + radius * Math.cos(-midAngleNum * RADIAN);
  const y = cyNum + radius * Math.sin(-midAngleNum * RADIAN);

  return (
    <text
      x={x}
      y={y}
      fill="white"
      textAnchor={x > cxNum ? "start" : "end"}
      dominantBaseline="central"
    >
      {`${(percentNum * 100).toFixed(0)}%`}
    </text>
  );
};

export default function PieChartContainer({ answerData }) {
  console.log("[ answerData ] >", answerData);
  const data = answerData.reduce((acc, curr) => {
    const existing = acc.find((item) => item.name === curr);
    if (existing) {
      existing.value += 1;
    } else {
      acc.push({ name: curr, value: 1 });
    }
    return acc;
  }, []);
  console.log("[ answerData after ] >", answerData);
  // 示例数据
  // const data = [
  //   { name: "Group A", value: 400 },
  //   { name: "Group B", value: 300 },
  //   { name: "Group C", value: 300 },
  //   { name: "Group D", value: 200 },
  // ];
  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart width={400} height={400}>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={renderCustomizedLabel}
          outerRadius={80}
          fill="#8884d8"
          dataKey="value"
        >
          {data.map((entry, index) => (
            <Cell
              key={`cell-${entry.name}`}
              fill={COLORS[index % COLORS.length]}
            />
          ))}
        </Pie>
        <Legend />
        <Tooltip />
      </PieChart>
    </ResponsiveContainer>
  );
}
