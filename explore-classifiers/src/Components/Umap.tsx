import { useState, useEffect } from 'react';
import Plot from 'react-plotly.js';
import LoadingAnimation from './Animations/LoadingAnimation';
import { Scatter3dData } from 'plotly.js';
import { buildUmapData } from '../Helpers/buildUmapData';
import { useNavigate } from 'react-router-dom';
import '../Global.css';

interface UmapProps {
    cancerType: string;
}

const Umap = ({ cancerType }: UmapProps) => {
    const [umap, setUmap] = useState<any>(null);
    const [hasData, setHasData] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const [hoveredPoint, setHoveredPoint] = useState<{ x: number; y: number; z: number } | null>(null);
    const [camera, setCamera] = useState<any>(null);

    const navigate = useNavigate();

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

        if (hoveredPoint) {
            data.push({
                type: 'scatter3d',
                mode: 'markers',
                x: [hoveredPoint.x],
                y: [hoveredPoint.y],
                z: [hoveredPoint.z],
                marker: {
                    size: 7,
                    color: 'rgba(0, 255, 255, 0.3)',
                    line: {
                        color: 'rgba(0, 255, 255, 1)',
                        width: 3,
                    },
                    symbol: 'circle',
                },
                hoverinfo: 'skip',
                showlegend: false,
            });
        }

        return (
            <Plot
                data={data}
                layout={{
                    ...umap.layout,
                    hovermode: 'closest',
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
                style={{ width: '100%', height: '500px' }}
            />
        );
    }

    return null;
};

export default Umap;