import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

export interface PatientResult {
    model_name: string;
    prediction: string;
    probability: number;
    figure: string | object;
}

export interface PatientResultsState {
    results: PatientResult[];
    loading: boolean;
    error: string | null;
    patientId: string;
}

export const usePatientResults = (): PatientResultsState => {
    const location = useLocation();
    const [results, setResults] = useState<PatientResult[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [patientId, setPatientId] = useState('');

    useEffect(() => {
        const fetchPatientData = async () => {
            try {
                setLoading(true);
                setError(null);

                const searchParams = new URLSearchParams(location.search);
                const sampleId = searchParams.get("value");

                if (!sampleId) {
                    setLoading(false);
                    return;
                }

                setPatientId(sampleId);

                const response = await fetch(`/sample/${sampleId}`);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const data = await response.json();
                setResults(data.results || []);
            } catch (err) {
                console.error("Error fetching patient data:", err);
                setError(err instanceof Error ? err.message : 'Failed to fetch patient data');
                setResults([]);
            } finally {
                setLoading(false);
            }
        };

        fetchPatientData();
    }, [location]);

    return { results, loading, error, patientId };
};
