import { PlotlyHTMLElement, SunburstClickEvent } from 'plotly.js';
import React, { useEffect, useRef, useState } from 'react';
import { CancerTypeData } from '../Service/getCancerHireachyData';
import { corePalette } from '../Themes/colours';
import zccTheme from '../Themes/zccTheme';
import { useSunburstData } from './Hooks/useSunburstData';
import { AnimatePresence } from 'framer-motion';
import Plot from 'react-plotly.js'

type SunburstChartProps = {
    data: CancerTypeData[],
    level: string,
    onClick: (value: string | null) => void,
}

const Plotly = require('plotly.js-dist') as typeof import('plotly.js');

const SunburstChart = (
    { data, level, onClick }: SunburstChartProps
) => {
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

    const handleClick = (data: SunburstClickEvent) => {
        const { nextLevel } = data;
        onClick(nextLevel);
    }

    return (
        <AnimatePresence mode="wait">
            <Plot
                data={plotData}
                layout={layout}
                onSunburstClick={handleClick}
            />
        </AnimatePresence>
    );
};

export default React.memo(SunburstChart);
