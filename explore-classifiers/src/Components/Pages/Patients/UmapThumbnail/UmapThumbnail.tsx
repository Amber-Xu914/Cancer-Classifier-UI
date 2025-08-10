import React from "react";
import './UmapThumbnail.css';

interface Props {
  id: string;
  modelName: string;
  probability: number;
  isSelected: boolean;
  onClick: () => void;
}

const UmapThumbnail: React.FC<Props> = ({
  modelName,
  probability,
  isSelected,
  onClick,
}) => {
  return (
    <div
      className={`thumbnail ${isSelected ? 'selected' : ''}`}
      onClick={onClick}
    >
      <div className="thumbnail-label">
        <strong>Level:</strong><br />
        {modelName}<br />
        <strong>Probability:</strong><br />
        {probability.toFixed(2)}
      </div>
    </div>
  );
};

export default UmapThumbnail;
