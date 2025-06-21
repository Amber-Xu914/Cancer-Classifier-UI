import FilterSelect from './Common/FilterSelect';
import TestingUmapPlot from './TestingUmapPlot';

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const ageData = [
  { name: "Alveolar Rha...", Infant: 22, Preschool: 27 },
  { name: "Wilms Tumor", Infant: 24, Preschool: 30, Child: 9 },
  { name: "Diffuse Pedi...", Infant: 16, Preschool: 33, Child: 15 },
  { name: "Acute Myeloid...", Infant: 27, Preschool: 28, Child: 24 },
  { name: "Pilocytic As...", Infant: 16, Preschool: 27, Child: 42, Adolescent: 20 },
  { name: "Diffuse Midl...", Infant: 28, Preschool: 50, Child: 21 },
];

export default function Dashboard() {
  return (
    <div style={{ padding: "20px", fontFamily: "Arial" }}>
      <h1 style={{ marginBottom: '40px' }}>Methylation Classifier</h1>

      <FilterSelect />

      <p style={{ marginTop: '40px' }}>Summary page showing results out of xxx individuals</p>

      <div style={{ display: "flex", gap: "40px", marginTop: "30px" }}>
        {/* Left: UMAP Plot */}
        <div style={{ width: "50%" }}>
          <p>Testing UMAP</p>
          <TestingUmapPlot />
        </div>

        {/* Right: Bar Chart */}
        <div style={{ width: "50%" }}>
          <p>Testing bar chart</p>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart layout="vertical" data={ageData}>
              <XAxis
                type="number"
                tick={{ fontSize: 12 }}
              />
              <YAxis
                dataKey="name"
                type="category"
                width={120}
                tick={{ fontSize: 12 }}
              />
              <Tooltip />
              <Legend />
              <Bar dataKey="Infant" stackId="a" fill="#4285F4" />
              <Bar dataKey="Preschool" stackId="a" fill="#FBBC05" />
              <Bar dataKey="Child" stackId="a" fill="#34A853" />
              <Bar dataKey="Adolescent" stackId="a" fill="#EA4335" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
