import Plot from 'react-plotly.js';
import { corePalette } from '../Themes/colours';

const TestingCNSSunburst = () => {
  return (
    <Plot
      data={[
        {
          type: 'sunburst',
          labels: [
            "Central Nervous System (CNS)",
            "Medulloblastoma", "ATRT", "Ependymoma", "DIPG"
          ],
          parents: [
            "",
            "Central Nervous System (CNS)", "Central Nervous System (CNS)",
            "Central Nervous System (CNS)", "Central Nervous System (CNS)"
          ],
          values: [70, 25, 15, 15, 15],
          branchvalues: "total",
          textinfo: "label",
          hoverinfo: "label+value+percent parent",
          leaf: { opacity: 0.85 },
          marker: {
            colors: [
              corePalette.green300,
              corePalette.green200,
              corePalette.green150,
              corePalette.green100,
              corePalette.green50,
              corePalette.green30,
              corePalette.green10
            ],
            line: {
              color: '#fff',
              width: 1.5
            }
          },
          outsidetextfont: { size: 14, color: '#fff' }
        }
      ]}
      layout={{
        margin: { l: 0, r: 0, b: 0, t: 20 },
        width: 500,
        height: 500,
        paper_bgcolor: 'white'
      }}
    />
  );
};

export default TestingCNSSunburst;
