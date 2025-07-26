import { AnimatePresence, motion } from 'framer-motion';
import { SunburstClickEvent } from 'plotly.js';
import React from 'react';
import Plot from 'react-plotly.js';
import { CancerTypeData } from '../Service/getCancerHireachyData';
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
            })
            .catch((error) => {
                console.error('Error fetching cancer type data: ', error);
            });
    }, []);

    const generateData = (level: string): Partial<Plotly.SunburstData>[] => {
        return [{
            type: 'sunburst',
            labels: cancerTypeData.map(item => item.child),
            ids: cancerTypeData.map(item => item.child),
            parents: cancerTypeData.map(item => item.parent),
            values: cancerTypeData.map(item => item.count),
            outsidetextfont: { size: 16, color: '#333' },
            insidetextorientation: 'radial',
            maxdepth: 4,
            leaf: { opacity: 0.7 },
            marker: { line: { width: 1 } },
            hovertext: cancerTypeData.map(item =>
                item.child === DEFAULT_CANCER_TYPE
                    ? DEFAULT_CANCER_TYPE
                    : `${item.child}: ${item.count}`
            ),
            hoverinfo: 'text',
            level,
        }];
    };

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

export default React.memo(SunburstChart);
