import { PlotlyHTMLElement, SunburstClickEvent } from "plotly.js";
import { useEffect, useRef } from "react";

const Plotly = require('plotly.js-dist') as typeof import('plotly.js');

export const useSunburstInteraction = (
    plotDiv: PlotlyHTMLElement | null,
    onClick: (value: string | null) => void,
) => {
    const clickDataRef = useRef<SunburstClickEvent>(null);

    useEffect(() => {
        if (!plotDiv || typeof plotDiv.on !== "function") return;

        const handleClick = (data: SunburstClickEvent) => {
            clickDataRef.current = data;
            if (clickDataRef.current) {
                const { nextLevel } = clickDataRef.current;
                onClick(nextLevel);
                clickDataRef.current = null;
            }
        }

        console.log('layout: ', plotDiv.layout);

        plotDiv.on('plotly_sunburstclick', handleClick);

        return () => {
            plotDiv.removeAllListeners?.('plotly_sunburstclick');
        };
    }, [plotDiv, onClick]);
};