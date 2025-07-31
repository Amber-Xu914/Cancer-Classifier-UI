
export type CancerTypeData = {
    parent: string;
    child: string;
    count: number;
}

export const getCancerHireachy = async (): Promise<CancerTypeData[]> => {
    const response = await fetch('/cancer/cancer_structure');
    if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
    const data = await response.json();
    return data.cancer_types;
};