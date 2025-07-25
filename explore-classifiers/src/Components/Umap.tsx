import { useState, useEffect } from 'react';
import Plot from 'react-plotly.js';
import LoadingAnimation from './Animations/LoadingAnimation';

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

    return umap ? (
        <Plot
            data={umap.data}
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