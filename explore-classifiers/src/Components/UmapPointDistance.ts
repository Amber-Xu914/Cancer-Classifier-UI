import { Point } from "plotly.js";

type PointData = {
    cancer: string,
    id: string,
    point: Point,
}

const euclideanDistance = (a: Point, b: Point): number => {
    return Math.pow(a.x - b.x, 2)
        + Math.pow(a.y - b.y, 2)
        + Math.pow(a.z - b.z, 2);
};