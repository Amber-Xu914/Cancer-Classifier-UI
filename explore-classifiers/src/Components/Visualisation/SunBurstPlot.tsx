import { AnimatePresence, motion } from 'framer-motion';
import { SunburstClickEvent, SunburstData } from 'plotly.js';
import React from 'react';
import Plot from 'react-plotly.js';
import { CancerTypeData } from '../../Service/getCancerHireachyData';
import { corePalette } from '../../Themes/colours';
import zccTheme from '../../Themes/zccTheme';
import { useSunburstData } from '../../Hooks';

type SunburstChartProps = {
    data: CancerTypeData[],
    level: string,
    onClick: (value: string | null) => void,
}

const Plotly = require('plotly.js-dist') as typeof import('plotly.js');

const SunburstPlot = (
    { data, level, onClick }: SunburstChartProps
) => {
    const plotData: Partial<SunburstData>[] = useSunburstData(data, level);

    const layout: Partial<Plotly.Layout> = {
        margin: { l: 0, r: 0, b: 0, t: 20 },
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
        autosize: true
    };

    const handleClick = (data: SunburstClickEvent) => {
        const { nextLevel } = data;
        onClick(nextLevel);
    }

    const handleInitialized = (_: any, graphDiv: Plotly.PlotlyHTMLElement) => {
        graphDiv.removeAllListeners?.('plotly_sunburstclick');
        graphDiv.on?.('plotly_sunburstclick', handleClick);
    };

    return (
        <AnimatePresence mode="wait">
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4 }}
            >
                <Plot
                    data={plotData}
                    layout={layout}
                    onInitialized={handleInitialized}
                    useResizeHandler
                    style={{ width: '100%', height: '500px' }}
                />
            </motion.div>
        </AnimatePresence>
    );
};

export default React.memo(SunburstPlot);
