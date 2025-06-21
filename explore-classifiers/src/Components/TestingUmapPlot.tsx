import Plot from 'react-plotly.js';
import { useEffect, useState } from 'react';

export default function TestingUmapPlot() {
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    fetch('https://raw.githubusercontent.com/plotly/datasets/master/3d-scatter.csv')
      .then((response) => response.text())
      .then((csvText) => {
        const rows = csvText.split('\n').slice(1).map((line) => {
          const [x1, y1, z1, x2, y2, z2] = line.split(',').map(Number);
          return { x1, y1, z1, x2, y2, z2 };
        });

        const trace1 = {
          x: rows.map((r) => r.x1),
          y: rows.map((r) => r.y1),
          z: rows.map((r) => r.z1),
          mode: 'markers',
          marker: {
            size: 12,
            line: {
              color: 'rgba(217, 217, 217, 0.14)',
              width: 0.5
            },
            opacity: 0.8
          },
          type: 'scatter3d'
        };

        const trace2 = {
          x: rows.map((r) => r.x2),
          y: rows.map((r) => r.y2),
          z: rows.map((r) => r.z2),
          mode: 'markers',
          marker: {
            color: 'rgb(127, 127, 127)',
            size: 12,
            symbol: 'circle',
            line: {
              color: 'rgb(204, 204, 204)',
              width: 1
            },
            opacity: 0.8
          },
          type: 'scatter3d'
        };

        setData([trace1, trace2]);
      });
  }, []);

  return (
    <Plot
      data={data}
      layout={{
        margin: { l: 0, r: 0, b: 0, t: 0 },
        scene: {
          xaxis: { title: 'UMAP 1' },
          yaxis: { title: 'UMAP 2' },
          zaxis: { title: 'UMAP 3' }
        },
        height: 500
      }}
      style={{ width: '100%' }}
    />
  );
}
