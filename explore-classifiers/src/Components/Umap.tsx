import { useState, useEffect } from 'react';
import Plot from 'react-plotly.js';
import LoadingAnimation from './Animations/LoadingAnimation';
import { Scatter3dData } from 'plotly.js';
import { buildUmapData } from '../Helpers/buildUmapData';

interface UmapProps {
    cancerType: string;
}

const Umap = ({ cancerType }: UmapProps) => {
    const [umap, setUmap] = useState<any>(null);

    // Fetch UMAP data based on the selected cancer type
    useEffect(() => {
        fetch(`/cancer_type/${cancerType}`)
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return response.json();
            })
            .then((data) => {
                const plot = JSON.parse(data.plot);
                setUmap(plot);
            })
            .catch((error) => {
                console.error('Error fetching UMAP: ', error);
            })
    }, [cancerType]);

    const data: Partial<Scatter3dData>[] | undefined = umap ? buildUmapData(umap.data) : undefined;

    return umap ? (
        <Plot
            data={data}
            layout={{
                ...umap.layout,
                width: undefined,
                height: undefined,
                autosize: true,
            }}
            useResizeHandler
            style={{ width: '100%', height: '500px' }}
        />
    ) : (
        <LoadingAnimation />
    );
}

export default Umap;