import Plot from 'react-plotly.js';
import { corePalette } from '../Themes/colours';

const TestingSunBurstPlot = () => {
  return (
    <Plot
      data={[
        {
          type: 'sunburst',
          labels: [
            "Paediatric Tumors",
            "Central Nervous System (CNS)", "Bone & Soft Tissue",
            "Medulloblastoma", "ATRT", "Ependymoma", "DIPG",
            "Ewing Sarcoma"
          ],
          parents: [
            "",
            "Paediatric Tumors", "Paediatric Tumors",
            "Central Nervous System (CNS)", "Central Nervous System (CNS)",
            "Central Nervous System (CNS)", "Central Nervous System (CNS)",
            "Bone & Soft Tissue"
          ],
          values: [100, 70, 30, 25, 15, 15, 15, 30],
          branchvalues: "total",
          outsidetextfont: { size: 16, color: "#333" },
          leaf: { opacity: 0.7 },
          marker: { line: { width: 2 } }
        }
      ]}
      layout={{
        margin: { l: 0, r: 0, b: 0, t: 20 },
        width: 500,
        height: 500,
        sunburstcolorway: [
          corePalette.green300,
          corePalette.green200,
          corePalette.green150,
          corePalette.green100,
          corePalette.green50,
          corePalette.green30,
          corePalette.green10
        ],
        extendsunburstcolorway: true
      }}
    />
  );
};

export default TestingSunBurstPlot;
