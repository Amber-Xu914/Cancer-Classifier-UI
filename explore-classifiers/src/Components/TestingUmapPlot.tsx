import Plot from 'react-plotly.js';
import { useEffect, useState } from 'react';
import { corePalette } from '../Themes/colours';

const tumorTypes = [
  { name: 'Medulloblastoma', color: corePalette.green300 },
  { name: 'ATRT', color: corePalette.green200 },
  { name: 'Ependymoma', color: corePalette.green150 },
  { name: 'DIPG', color: corePalette.green100 },
  { name: 'Ewing Sarcoma', color: corePalette.green50 }
];

// 创建随机 UMAP-like 数据（每类 20 个点围绕中心）
const generateMockUMAP = () => {
  const clusters = [];

  const centers = [
    [1, 1, 1],
    [4, 1, 2],
    [1, 4, 3],
    [3, 4, 1],
    [2, 2, 5]
  ];

  for (let i = 0; i < tumorTypes.length; i++) {
    const [cx, cy, cz] = centers[i];
    const cluster = {
      x: Array.from({ length: 20 }, () => cx + (Math.random() - 0.5)),
      y: Array.from({ length: 20 }, () => cy + (Math.random() - 0.5)),
      z: Array.from({ length: 20 }, () => cz + (Math.random() - 0.5)),
      name: tumorTypes[i].name,
      mode: 'markers',
      type: 'scatter3d',
      marker: {
        color: tumorTypes[i].color,
        size: 6,
        opacity: 0.8
      }
    };
    clusters.push(cluster);
  }

  return clusters;
};

export default function TestingUmapPlot() {
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    const syntheticData = generateMockUMAP();
    setData(syntheticData);
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
        legend: {
          x: 0,
          y: 1
        },
        height: 500
      }}
      style={{ width: '100%' }}
    />
  );
}
