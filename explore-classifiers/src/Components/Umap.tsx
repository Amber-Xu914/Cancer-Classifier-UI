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

    // click to navigate to patient result page
    const handlePointClick = (event: any) => {
        const point = event.points?.[0];
        const patientID = point?.customdata;
        console.log("patientid is ", patientID);
        if (patientID) {
            navigate(`/PatientResults?filter=Patient&value=${patientID}`);
        }
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

        return (
            <Plot
                data={data}
                layout={{
                    ...umap.layout,
                    hovermode: 'closest',
                    width: undefined,
                    height: undefined,
                    autosize: true,
                }}
                onClick={handlePointClick}
                useResizeHandler
                style={{ width: '100%', height: '500px' }}
            />
        );
    }

    return null;
};

export default Umap;