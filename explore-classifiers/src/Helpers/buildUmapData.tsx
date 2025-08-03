import { Scatter3dData, Datum  } from "plotly.js";

const Plotly = require('plotly.js-dist') as typeof import('plotly.js');

export const buildUmapData = (
    data: Partial<Scatter3dData>[]
) => {
    console.log(data);
    const umapData: Partial<Scatter3dData>[] = data.map((trace) => ({
        ...trace,
        customdata: trace.text as Datum[],
        hovertemplate: 'ID: %{customdata}<extra></extra>',
    }));

    return umapData;
};