const firstLevelModels = ["Haematological malignancy", "Sarcoma", "Central nervous system", "Solid tumour"];
const secondLevelModels = ["CNS embryonal tumour",
    "Leukaemia",
    "Lymphoma",
    "Solid tumour",
    "Ependymoma",
    "Ewing sarcoma",
    "Glioneuronal and neuronal tumour",
    "Medulloblastoma",
    "Paediatric-type diffuse glioma",
    "Rhabdomyosarcoma",
    "Solid other",
    "Liver tumour, Solid",
    "Sarcoma other"];
const thirdLevelModels = ["Undifferentiated sarcoma",
    "Supratentorial ependymoma, ZFTA fusion-positive",
    "Posterior fossa A ependymoma, group PFA",
    "Diffuse midline glioma, H3 K27-altered"
];

const firstLevelOptions = firstLevelModels.sort().map((cancer) => {
    const level = 'Level 1';
    return { level, cancer };
})

const secondLevelOptions = secondLevelModels.sort().map((cancer) => {
    const level = 'Level 2';
    return { level, cancer };
})

const thirdLevelOptions = thirdLevelModels.sort().map((cancer) => {
    const level = 'Level 3';
    return { level, cancer };
})

export const cancerTypeOptions = [
    ...firstLevelOptions,
    ...secondLevelOptions,
    ...thirdLevelOptions
];