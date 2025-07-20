import TestingUmapPlot from "./TestingUmapPlot";

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
      <h2>Prediction {layer}</h2>
      <p><strong>Model Level:</strong> {modelName}</p>
      <p><strong>Prediction:</strong> {prediction}</p>
      <p><strong>Probability:</strong> {probability}</p>

      {selected && parsedFigure && (
        <TestingUmapPlot figure={parsedFigure} />
      )}

      {selected && !parsedFigure && (
        <p style={{ color: 'red' }}>!ERROR</p>
      )}
    </div>
  );
}
