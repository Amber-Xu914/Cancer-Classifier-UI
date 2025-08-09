
import { useState, useEffect } from 'react';
import Plot from 'react-plotly.js';
import { Scatter3dData } from 'plotly.js';
import { buildUmapData } from '../../Helpers/buildUmapData';
import { getCancerUMAP } from '../../Service/getCancerUMAPData';
import LoadingAnimation from '../Animations/LoadingAnimation';
import { useNavigate } from 'react-router-dom';

interface UmapProps {
    cancerType: string;
}

const CancerUmap = ({ cancerType }: UmapProps) => {
    const [umap, setUmap] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [hasError, setHasError] = useState(false);
    const [hoveredPoint, setHoveredPoint] = useState<{ x: number; y: number; z: number } | null>(null);
    const [camera, setCamera] = useState<any>(null);

    const navigate = useNavigate();

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

    useEffect(() => {
        if (umap?.layout?.scene?.camera && !camera) {
            setCamera(umap.layout.scene.camera);
        }
    }, [umap]);

    // click to navigate to patient result page
    const handlePointClick = (event: any) => {
        const point = event.points?.[0];
        const patientID = point?.customdata;
        console.log("patientid is ", patientID);
        if (patientID) {
            navigate(`/PatientResults?filter=Patient&value=${patientID}`);
        }
    };

    const handleHover = (event: any) => {
        const point = event.points?.[0];
        console.log("hover point: ", point);
        if (point) {
            const { x, y, z } = point;
            if (
                !hoveredPoint ||
                hoveredPoint.x !== x ||
                hoveredPoint.y !== y ||
                hoveredPoint.z !== z
            ) {
                // Only update when coordianates are different
                setHoveredPoint({ x, y, z });
            }
        }
    };

    const handleUnhover = () => {
        setHoveredPoint(null);
    };

    if (isLoading) return <LoadingAnimation />;

    if (hasError) {
        return (
            <div
                style={{
                    display: 'flex',
                    width: '100%',
                    height: '100%',
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
                scene: {
                    ...umap.layout.scene,
                    camera: camera ?? umap.layout.scene?.camera,
                },

            }}
            onClick={handlePointClick}
            onHover={handleHover}
            onUnhover={handleUnhover}
            onRelayout={(layout: any) => {
                if (layout['scene.camera']) {
                    setCamera(layout['scene.camera']);
                }
            }}
            useResizeHandler
            style={{ width: '100%', height: '100%' }}
        />;
};

export default CancerUmap;
