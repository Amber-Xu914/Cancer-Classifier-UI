import { useNavigate } from "react-router-dom";
import { CancerTypeOptions } from "../Helpers/mapCancerToLevel";
import { isValidCancerType, isValidPatientId } from "../Utils/searchValidation";

interface UseSearchLogicProps {
    onSearch: (filter: string, value: string | null) => void;
    cancerTypeOptions: CancerTypeOptions[];
    patientIds: string[];
}

export const useSearchLogic = ({ onSearch, cancerTypeOptions, patientIds }: UseSearchLogicProps) => {
    const navigate = useNavigate();

    const handleSearch = (
        filter: string,
        searchValue: string,
        comboValue: { level: string; cancer: string } | null
    ) => {
        const value = filter === 'Cancer Type' ? comboValue?.cancer ?? '' : searchValue;

        switch (filter) {
            case 'Cancer Type':
                if (value && isValidCancerType(value, cancerTypeOptions)) {
                    onSearch('Cancer Type', value);
                }
                break;
            case 'Patient':
                if (isValidPatientId(value, patientIds)) {
                    onSearch('Patient', value);
                    navigate(
                        `/PatientResults?filter=Patient&value=${encodeURIComponent(value)}`
                    );
                }
                break;
            default:
                onSearch(filter, value);
                navigate(
                    `/PatientResults?filter=${encodeURIComponent(
                        filter
                    )}&value=${encodeURIComponent(value)}`
                );
        }
    };

    return { handleSearch };
};