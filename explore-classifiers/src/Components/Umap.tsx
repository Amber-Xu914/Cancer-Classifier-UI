
import { useState, useEffect } from 'react';
import Plot from 'react-plotly.js';
import LoadingAnimation from './Animations/LoadingAnimation';
import { Scatter3dData } from 'plotly.js';
import { buildUmapData } from '../Helpers/buildUmapData';
import { getCancerUMAP } from '../Service/getCancerUMAPData';

interface UmapProps {
    cancerType: string;
}

const Umap = ({ cancerType }: UmapProps) => {
    const [umap, setUmap] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [hasError, setHasError] = useState(false);

    useEffect(() => {
        setIsLoading(true);
        setUmap(null);
        setHasError(false);

        getCancerUMAP(cancerType)
            .then((data) => {
                setUmap(data);
                setHasError(false);
            })
            .catch(err => {
                console.error(err);
                setHasError(true);
            })
            .finally(() => {
                setIsLoading(false);
            });
    }, [cancerType]);

    if (isLoading) return <LoadingAnimation />;

    if (hasError) {
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

    const data: Partial<Scatter3dData>[] | undefined = umap ? buildUmapData(umap.data) : undefined;

    return isLoading ? <LoadingAnimation /> :
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
        />;
};

export default Umap;
