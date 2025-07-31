import { SunburstData } from "plotly.js";
import { useMemo } from "react";
import { DEFAULT_CANCER_TYPE } from "../Constants/DashboardDefaults";
import { CancerTypeData } from "../Service/getCancerHireachyData";

export const useSunburstData = (
    cancerHireachyArray: CancerTypeData[],
    level: string
): Partial<SunburstData>[] => {
    const data = useMemo<Partial<SunburstData>[]>(() => {
        return [{
            type: 'sunburst',
            labels: cancerHireachyArray.map((item) => item.child),
            ids: cancerHireachyArray.map((item) => item.child),
            parents: cancerHireachyArray.map(item => item.parent),
            values: cancerHireachyArray.map((item) => item.count),
            outsidetextfont: { size: 16, color: "#333" },
            insidetextorientation: 'radial',
            maxdepth: 4,
            leaf: { opacity: 0.7 },
            marker: { line: { width: 1 } },
            hovertext: cancerHireachyArray.map((item) =>
                item.child === DEFAULT_CANCER_TYPE ? DEFAULT_CANCER_TYPE : `${item.child}: ${item.count}`
            ),
            hoverinfo: 'text',
            level: level
        }];
    }, [cancerHireachyArray, level]);

    return data;
};