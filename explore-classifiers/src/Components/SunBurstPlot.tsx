import { PlotlyHTMLElement } from 'plotly.js';
import React, { useState } from 'react';
import Plot from 'react-plotly.js';
import { CancerTypeData } from '../Service/getCancerHireachyData';
import { corePalette } from '../Themes/colours';
import zccTheme from '../Themes/zccTheme';
import { useSunburstData } from './Hooks/useSunburstData';
import { useSunburstInteraction } from './Hooks/useSunburstInteraction';
import { AnimatePresence } from 'framer-motion';

type SunburstChartProps = {
    data: CancerTypeData[],
    level: string,
    onClick: (value: string | null) => void,
}

const SunburstChart = (
    { data, level, onClick }: SunburstChartProps
) => {
    const [PlotlyElement, setPlotlyElement] = useState<PlotlyHTMLElement | null>(null);

    const plotData = useSunburstData(data, level);

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

    useSunburstInteraction(PlotlyElement, onClick);

    return (
        <AnimatePresence mode="wait">
            <Plot
                data={plotData}
                layout={layout}
                onInitialized={(_: any, graphDiv: PlotlyHTMLElement) => setPlotlyElement(graphDiv)}
                onUpdate={(_: any, graphDiv: PlotlyHTMLElement) => setPlotlyElement(graphDiv)}
            />
        </AnimatePresence>
    );
};

export default React.memo(SunburstChart);
