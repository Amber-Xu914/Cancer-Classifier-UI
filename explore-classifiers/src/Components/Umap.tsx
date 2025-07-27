// import { useState, useEffect } from 'react';
// import Plot from 'react-plotly.js';
// import LoadingAnimation from './Animations/LoadingAnimation';

// interface UmapProps {
//     cancerType: string;
// }

// const Umap = ({ cancerType }: UmapProps) => {
//     const [umap, setUmap] = useState<any>(null);

//     // Fetch UMAP data based on the selected cancer type
//     useEffect(() => {
//         console.log("cancer type: ", {cancerType});
//         fetch(`/cancer_type/${cancerType}`)
//             .then((response) => {
//                 if (!response.ok) {
//                     throw new Error(`HTTP error! Status: ${response.status}`);
//                 }
//                 return response.json();
//             })
//             .then((data) => {
//                 const plot = JSON.parse(data.plot);
//                 setUmap(plot);
//             })
//             .catch((error) => {
//                 console.error('Error fetching UMAP: ', error);
//             })
//     }, [cancerType]);

//     return umap ? (
//         <Plot
//             data={umap.data}
//             layout={{
//                 ...umap.layout,
//                 width: undefined,
//                 height: undefined,
//                 autosize: true,
//             }}
//             useResizeHandler
//             style={{ width: '100%', height: '500px' }}
//         />
//     ) : (
//         <LoadingAnimation />
//     );
// }

// export default Umap;

import { useState, useEffect } from 'react';
import Plot from 'react-plotly.js';
import LoadingAnimation from './Animations/LoadingAnimation';

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
        setUmap(null); // clear previous plot

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
        return (
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
        );
    }

    return null;
};

export default Umap;
