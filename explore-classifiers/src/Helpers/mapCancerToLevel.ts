import { CancerTypeData } from "../Service/getCancerHireachyData";
import { DEFAULT_CANCER_TYPE } from "../Constants/Common/DashboardDefaults";

export type CancerTypeOptions = {
    level: string,
    cancer: string
};

export const mapCancerToLevel = (data: CancerTypeData[]): CancerTypeOptions[] => {
    const cancerDataMap = createCancerDataMap(data);

    const roots: CancerTypeData[] = data.filter(data => data.parent == DEFAULT_CANCER_TYPE);
    const queue: { node: CancerTypeData, level: number }[] = roots.map(root => ({ node: root, level: 0 }));

    const cancerTypeOptions: CancerTypeOptions[] = [];

    while (queue.length > 0) {
        const { node, level } = queue.shift()!;

        cancerTypeOptions.push({
            level: `level ${level}`,
            cancer: node.child
        });

        const children: CancerTypeData[] = cancerDataMap.get(node.child) || [];
        children.forEach(child => {
            queue.push({ node: child, level: level + 1 });
        });
    }

    return cancerTypeOptions;
};

const createCancerDataMap = (data: CancerTypeData[]): Map<string, CancerTypeData[]> => {
    const cancerDataMap = new Map<string, CancerTypeData[]>();

    data.forEach(item => {
        if (!cancerDataMap.has(item.parent)) {
            cancerDataMap.set(item.parent, []);
        }
        cancerDataMap.get(item.parent)!.push(item);
    });

    return cancerDataMap;
};