import { useEffect, useState } from "react";
import PatientUmap from "../../Visualisation/PatientUmap";
import styles from "./PatientResults.module.css";

interface UmapCardProps {
    layer: number;
    selected: boolean;
    modelName: string;
    prediction: string;
    probability: number;
    figureJSON: string | object;
    onToggle?: (layer: number, open: boolean) => void;
}

export function UmapCard({
    layer,
    selected,
    modelName,
    prediction,
    probability,
    figureJSON,
    onToggle,
}: UmapCardProps) {
    const [open, setOpen] = useState(selected);

    // Sync with external selected prop
    useEffect(() => {
        setOpen(selected);
    }, [selected]);

    // Handle dropdown toggle and notify parent
    const handleToggle = () => {
        const newOpen = !open;
        setOpen(newOpen);
        if (onToggle) {
            onToggle(layer, newOpen);
        }
    };

    const parsedFigure =
        typeof figureJSON === "string" ? JSON.parse(figureJSON) : figureJSON;

    return (
        <div className={styles.dropdownCard}>
            <button className={styles.dropdownHeader} onClick={handleToggle}>
                <span
                    className={`${styles.dropdownArrow} ${open ? styles.arrowOpen : ""}`}
                >
                    ▼
                </span>
                <span style={{ marginLeft: "8px" }}>
                    MODEL LEVEL: <strong>{modelName}</strong>
                </span>
            </button>

            <div
                className={styles.dropdownContent}
                style={{
                    maxHeight: open ? "1000px" : "0px",
                    opacity: open ? 1 : 0,
                    transition: "max-height 0.4s ease, opacity 0.3s ease",
                    overflow: "hidden",
                }}
            >
                <p style={{ margin: "16px 0" }}>
                    <strong>Model Level:</strong> {modelName} &nbsp;&nbsp;
                    <strong>Prediction:</strong> {prediction} &nbsp;&nbsp;
                    <strong>Probability:</strong> {probability}
                </p>

                <div className={styles.umapContainer}>
                    <PatientUmap figure={parsedFigure} />
                </div>
            </div>
        </div>
    );
}

