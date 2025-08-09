import { Scatter3dData } from 'plotly.js';
import Plot from 'react-plotly.js';
import { buildUmapData } from '../../Helpers/buildUmapData';

interface PatientUmapProps {
    figure: {
        data: any[];
        layout?: object;
    };
}

export default function PatientUmap({ figure }: PatientUmapProps) {
    const data: Partial<Scatter3dData>[] | undefined = figure ? buildUmapData(figure.data) : undefined;

    return (
        <div style={{ width: '100%', height: '100%', textAlign: 'left' }}>
            <Plot
                data={data || []}
                layout={{
                    margin: { l: 0, r: 0, b: 0, t: 0 },
                    scene: {
                        xaxis: { title: 'UMAP X' },
                        yaxis: { title: 'UMAP Y' },
                        zaxis: { title: 'UMAP Z' },
                    },
                    legend: { x: 0, y: 1 },
                    ...figure?.layout,
                }}
                useResizeHandler
                style={{ width: '100%', height: '100%' }} // fill in container
                config={{ responsive: true }}
            />
        </div>
    );
}

