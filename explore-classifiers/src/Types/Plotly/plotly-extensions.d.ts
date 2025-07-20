// types/plotly-extensions.d.ts
declare namespace Plotly {
    interface SunburstData extends Plotly.PlotData {
        type: 'sunburst';
        ids?: string[];
        labels?: string[];
        parents?: string[];
        values?: number[];
        outsidetextfont?: {
            size?: number;
            color?: string;
        };
        leaf?: {
            opacity?: number;
        };
        marker?: {
            line?: {
                width?: number;
            };
        };
        maxdepth?: number;
        insidetextorientation?: 'horizontal' | 'radial' | 'tangential' | 'auto';
        level?: string;
    }

    interface Layout {
        sunburstcolorway?: string[];
        extendsunburstcolorway: boolean;
    }
}
