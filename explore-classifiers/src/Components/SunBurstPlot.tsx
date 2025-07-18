import React, { useEffect, useRef, useState } from 'react';
import Plot from 'react-plotly.js';
import { corePalette } from '../Themes/colours';
import zccTheme from '../Themes/zccTheme';

interface sunburstClickData {
    onSearch: (filter: string, value: string | null) => void;
}

const SunBurstPlot = ({ onSearch }: sunburstClickData) => {
    const [cancerTypeData, setCancerTypeData] = useState([{ parent: '', child: '', count: 0 }]);
    const plotRef = useRef<any>(null);
    const clickDataRef = useRef<any>(null);

    useEffect(() => {
        fetch('/cancer/cancer_structure')
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return response.json();
            })
            .then((data) => {
                setCancerTypeData(data.cancer_types);
            })
            .catch((error) => {
                console.error('Error fetching cancer type data: ', error);
            });
    }, []);

    const handleSearch = (data: object) => {
        clickDataRef.current = data;
    }

    const afterAnimation = () => {
        if (clickDataRef.current) {
            const { data, nextLevel, points } = clickDataRef.current;
            onSearch('Cancer Type', nextLevel);
            clickDataRef.current = null; // Reset after handling
        }
    }

    return (
        <Plot
            ref={plotRef}
            id="sunburst-plot"
            data={[
                {
                    type: 'sunburst',
                    labels: cancerTypeData ? cancerTypeData.map((item) => item.child) : [],
                    parents: cancerTypeData ? cancerTypeData.map((item) => item.parent) : [],
                    values: cancerTypeData ? cancerTypeData.map((item) => item.count) : [],
                    outsidetextfont: { size: 16, color: "#333" },
                    insidetextorientation: 'radial',
                    maxdepth: 4,
                    leaf: { opacity: 0.7 },
                    marker: { line: { width: 1 } }
                }
            ]}
            layout={{
                margin: { l: 0, r: 0, b: 0, t: 20 },
                width: 600,
                height: 600,
                sunburstcolorway: [
                    corePalette.green300,
                    corePalette.green200,
                    corePalette.green150,
                    corePalette.green100,
                    corePalette.green50,
                    corePalette.green30,
                    corePalette.green10,
                ],
                extendsunburstcolorway: true,
                font: zccTheme.typography.label,
            }}
            onSunburstClick={handleSearch}
            onAnimated={afterAnimation}
        />
    );
};

export default React.memo(SunBurstPlot);