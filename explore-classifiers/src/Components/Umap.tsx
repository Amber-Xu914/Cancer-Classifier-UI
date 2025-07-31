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

    useEffect(() => {
        getCancerUMAP(cancerType)
            .then((data) => {
                setUmap(data);
            })
            .catch(err => console.error(err));
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