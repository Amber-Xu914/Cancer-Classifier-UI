import Plot from 'react-plotly.js';
import { useEffect, useState } from 'react';
import { corePalette } from '../Themes/colours';

const tumorTypes = [
    { name: 'Medulloblastoma', color: corePalette.green300, center: [1, 1, 1] },
    { name: 'ATRT', color: corePalette.green200, center: [4, 1, 2] },
    { name: 'Ependymoma', color: corePalette.green150, center: [1, 4, 3] },
    { name: 'DIPG', color: corePalette.green100, center: [3, 4, 1] }
];

const generateMockUMAP = () => {
    return tumorTypes.map(({ name, color, center }) => {
        const [cx, cy, cz] = center;
        return {
            x: Array.from({ length: 20 }, () => cx + (Math.random() - 0.5)),
            y: Array.from({ length: 20 }, () => cy + (Math.random() - 0.5)),
            z: Array.from({ length: 20 }, () => cz + (Math.random() - 0.5)),
            name,
            mode: 'markers',
            type: 'scatter3d',
            marker: {
                color,
                size: 6,
                opacity: 0.85,
                line: {
                    width: 0.5,
                    color: '#444'
                }
            }
        };
    });
};

export default function TestingCNSUMAP() {
    const [data, setData] = useState<any[]>([]);

    useEffect(() => {
        console.log("data: ", data);
        setData(generateMockUMAP());
    }, []);

    return (
        <Plot
            data={data}
            layout={{
                margin: { l: 0, r: 0, b: 0, t: 20 },
                scene: {
                    xaxis: { title: 'UMAP 1', zeroline: false },
                    yaxis: { title: 'UMAP 2', zeroline: false },
                    zaxis: { title: 'UMAP 3', zeroline: false }
                },
                legend: {
                    x: 0.02,
                    y: 0.98,
                    bgcolor: 'rgba(255,255,255,0.5)',
                    bordercolor: '#ccc',
                    borderwidth: 1
                },
                height: 500
            }}
            style={{ width: '100%' }}
        />
    );
}
