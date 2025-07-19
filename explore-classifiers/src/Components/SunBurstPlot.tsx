import React, { useEffect, useRef, useState } from 'react';
import { DEFAULT_CANCER_TYPE } from '../Constants/Common/DashboardDefaults';
import { corePalette } from '../Themes/colours';
import zccTheme from '../Themes/zccTheme';

interface SunBurstPlotProps {
    onClick: (value: string | null) => void;
    changeLevel?: string;
}

interface CancerTypeData {
    parent: string;
    child: string;
    count: number;
}

type CancerTypeDataArray = CancerTypeData[];

const Plotly = require('plotly.js-dist') as typeof import('plotly.js');

const SunburstChart = ({ onClick, changeLevel }: SunBurstPlotProps) => {
    const [cancerTypeData, setCancerTypeData] = useState<CancerTypeDataArray>([]);
    const plotRef = useRef<HTMLDivElement>(null);
    const clickDataRef = useRef<any>(null);

    // Fetch cancer type data from the server
    useEffect(() => {
        fetch('/cancer/cancer_structure')
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return response.json();
            })
            .then((data) => {
                const root = { parent: '', child: 'ZERO2', count: 1 };
                setCancerTypeData([root, ...data.cancer_types]);
                // setCancerTypeData(data.cancer_types)
            })
            .catch((error) => {
                console.error('Error fetching cancer type data: ', error);
            });
    }, []);

    // Adjusts level of the data based on the input string
    const data = (changeLevel: string): Partial<Plotly.SunburstData>[] => {
        return [{
            type: 'sunburst',
            labels: cancerTypeData.map((item) => item.child),
            ids: cancerTypeData.map((item) => item.child),
            parents: cancerTypeData.map(item => item.parent),
            values: cancerTypeData.map((item) => item.count),
            outsidetextfont: { size: 16, color: "#333" },
            insidetextorientation: 'radial',
            maxdepth: 4,
            leaf: { opacity: 0.7 },
            marker: { line: { width: 1 } },
            hovertext: cancerTypeData.map((item) =>
                item.child === DEFAULT_CANCER_TYPE ? DEFAULT_CANCER_TYPE : `${item.child}: ${item.count}`
            ),
            hoverinfo: 'text',
            level: changeLevel,
        }];
    };

    const layout: Partial<Plotly.Layout> = {
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
    };

    // Initialize the Plotly sunburst chart
    // This effect runs when the component mounts and whenever cancerTypeData changes
    useEffect(() => {
        if (!plotRef.current) return;
        const plotDiv = plotRef.current as unknown as Plotly.PlotlyHTMLElement;

        Plotly.newPlot(plotDiv, data(DEFAULT_CANCER_TYPE), layout)
            .then(() => {
                // Add event listeners for click events
                // Updating of cancerType through onClick happens in the afterAnimation callback
                // This ensures that the click data is captured after the animation completes
                const handleClick = (data: object) => {
                    clickDataRef.current = data;
                }
                const afterAnimation = () => {
                    if (clickDataRef.current) {
                        const { nextLevel } = clickDataRef.current;
                        onClick(nextLevel);
                        clickDataRef.current = null;
                    }
                }
                plotDiv.on('plotly_sunburstclick', handleClick);
                plotDiv.on('plotly_animated', afterAnimation);
            });

        return () => {
            plotDiv.removeAllListeners?.('plotly_click');
            plotDiv.removeAllListeners?.('plotly_animated');
        };
    }, [cancerTypeData, onClick]);

    // Takes effect on every change of the input string changeLevel
    useEffect(() => {
        const plotDiv = plotRef.current as unknown as Plotly.PlotlyHTMLElement;
        if (!plotDiv || !changeLevel) return;

        // Update the level of the sunburst chart based on the selected cancer type
        // Redraws the plot base on that
        Plotly.react(plotDiv, data(changeLevel), layout);
    }, [changeLevel]);

    return (
        <div ref={plotRef} />
    );
};

export default React.memo(SunburstChart);
