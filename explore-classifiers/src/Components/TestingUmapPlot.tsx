import Plot from 'react-plotly.js';

interface TestingUmapPlotProps {
  figure: {
    data: any[];
    layout?: object;
  };
}

export default function TestingUmapPlot({ figure }: TestingUmapPlotProps) {
  return (
    <Plot
      data={figure?.data || []}
      layout={{
        margin: { l: 0, r: 0, b: 0, t: 0 },
        scene: {
          xaxis: { title: 'UMAP 1' },
          yaxis: { title: 'UMAP 2' },
          zaxis: { title: 'UMAP 3' }
        },
        legend: { x: 0, y: 1 },
        height: 500,
        ...figure?.layout
      }}
      style={{ width: '100%' }}
      config={{ responsive: true }}
    />
  );
}
