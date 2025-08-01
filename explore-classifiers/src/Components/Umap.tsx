 
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
    const [hasData, setHasData] = useState(true);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        console.log("cancer type: ", { cancerType });
        setIsLoading(true);
        setHasData(true);
        setUmap(null); // Clear previous UMAP when type changes

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
                setHasData(true);
            })
            .catch((error) => {
                console.error('Error fetching UMAP: ', error);
                setHasData(false);
                setUmap(null);
            })
            .finally(() => {
                setIsLoading(false);
            });
    }, [cancerType]);

    if (isLoading) {
        return <LoadingAnimation />;
    }

    if (!hasData) {
        return (
            <div
                style={{
                    height: '500px',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    border: '1px dashed #ccc',
                    borderRadius: '8px',
                    fontStyle: 'italic',
                    color: '#888',
                }}
            >
                No UMAP available for "{cancerType}"
            </div>
        );
    }

    if (umap) {
        const data: Partial<Scatter3dData>[] = buildUmapData(umap.data);

        return (
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
        );
    }

    return null;
};

export default Umap;
