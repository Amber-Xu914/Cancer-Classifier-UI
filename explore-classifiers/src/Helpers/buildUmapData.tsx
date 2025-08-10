import { Datum, Scatter3dData } from "plotly.js";

const Plotly = require('plotly.js-dist') as typeof import('plotly.js');

export const buildUmapData = (
    data: Partial<Scatter3dData>[]
) => {
    const umapData: Partial<Scatter3dData>[] = data.map((trace) => ({
        ...trace,
        customdata: trace.text as Datum[],
        hovertemplate: 'ID: %{customdata}<extra></extra>',
    }));

    return umapData;
};