import {
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from "recharts";

const COLORS = [
  "#0088FE",
  "#00C49F",
  "#FFBB28",
  "#FF8042",
  "#AF19FF",
  "#FF4560",
  "#00E396",
];

export default function PieChart2Container({ answerData }) {
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

  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart width={800} height={400}>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={60}
          outerRadius={80}
          fill="#8884d8"
          paddingAngle={5}
          dataKey="value"
          label
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
