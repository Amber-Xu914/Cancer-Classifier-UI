interface Props {
  layer: number;
  selected: boolean;
}

export const UmapCard: React.FC<Props> = ({ layer, selected }) => {
  return (
    <div>
      <h2>UMAP Layer {layer}</h2>
      {selected ? (
        <div>
          {/* Replace with real chart */}
          <p>UMAP description place holder</p>
          <p>[UMAP visualization place holder for layer {layer}]</p>
        </div>
      ) : (
        <p>Click UMAP {layer} to view this layer.</p>
      )}
    </div>
  );
};

