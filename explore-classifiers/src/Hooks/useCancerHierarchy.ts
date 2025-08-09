import { useEffect, useState } from "react";
import { CancerTypeData } from "../Service/getCancerHireachyData";

export interface CancerHierarchyState {
    data: CancerTypeData[];
    loading: boolean;
    error: string | null;
}

export const useCancerHierarchy = (): CancerHierarchyState => {
    const [data, setData] = useState<CancerTypeData[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await fetch('/cancer/cancer_structure');
                if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
                const data = await response.json();
                setData(data.cancer_types);
            } catch (err) {
                console.error('Error fetching cancer hierarchy:', err);
                setError(err instanceof Error ? err.message : 'Failed to fetch cancer hierarchy');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    return { data, loading, error };
};