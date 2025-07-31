import { CancerTypeOptions } from "../Helpers/mapCancerToLevel";

export const isValidCancerType = (value: string, cancerTypeOptions: CancerTypeOptions[]) => {
    const normalizedTypes = cancerTypeOptions.map((t) =>
        t.cancer.toLowerCase()
    );
    return normalizedTypes.includes(value.toLowerCase());
};

export const isValidPatientId = (value: string, patientIds: string[]) => {
    return value && value.trim() !== '' && patientIds.includes(value);
};