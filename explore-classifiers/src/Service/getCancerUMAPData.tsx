import { PlotlyHTMLElement } from "plotly.js";

export const getCancerUMAP = async (cancerType: String): Promise<PlotlyHTMLElement> => {
    const response = await fetch(`/cancer_type/${cancerType}`);
    if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
    const data = await response.json();
    return JSON.parse(data.plot);
};