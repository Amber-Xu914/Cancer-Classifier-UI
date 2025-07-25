import TestingUmapPlot from "./TestingUmapPlot";
import styles from './PatientResults.module.css'

interface UmapCardProps {
  layer: number;
  selected: boolean;
  modelName: string;
  prediction: string;
  probability: number;
  figureJSON: string | object;
}

export function UmapCard({
  layer,
  selected,
  modelName,
  prediction,
  probability,
  figureJSON,
}: UmapCardProps) {
  let parsedFigure: any = null;
  try {
    parsedFigure = typeof figureJSON === "string" ? JSON.parse(figureJSON) : figureJSON;
  } catch (err) {
    console.error("Invalid figure JSON:", err);
  }

  return (
    <div>
      <h3>MODEL LEVEL: {modelName}</h3>
      <p>
        <span style={{ marginRight: '2rem' }}>
          <strong>Model Level:</strong> {modelName}
        </span>
        <span style={{ marginRight: '2rem' }}>
          <strong>Prediction:</strong> {prediction}
        </span>
        <span>
          <strong>Probability:</strong> {probability}
        </span>
      </p>

      {selected && parsedFigure && (
        <div className={styles.umapContainer}>
          <TestingUmapPlot figure={parsedFigure} />
        </div>
      )}

      {selected && !parsedFigure && (
        <p style={{ color: 'red' }}>!ERROR</p>
      )}
    </div>
  );
}
