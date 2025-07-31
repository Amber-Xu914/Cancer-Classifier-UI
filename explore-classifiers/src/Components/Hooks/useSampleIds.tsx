import { useState, useEffect } from 'react';

export const usePatientIds = () => {
    const [patientIds, setPatientIds] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchPatientIds = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await fetch('/sample/sample_list');
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                const data = await response.json();
                setPatientIds(data.sample_list);
            } catch (err) {
                const errorMessage = err instanceof Error ? err.message : 'Unknown error';
                setError(errorMessage);
                console.error('Error fetching patient IDs: ', err);
            } finally {
                setLoading(false);
            }
        };

        fetchPatientIds();
    }, []);

    return { patientIds, loading, error };
};