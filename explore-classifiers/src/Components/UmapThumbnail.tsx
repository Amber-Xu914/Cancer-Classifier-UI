import React from "react";
import "./UmapThumbnail.css";

interface Props {
  id: string;
  src: string;
  summary: string;
  isSelected: boolean;
  onClick: () => void;
}

const UmapThumbnail: React.FC<Props> = ({
  src,
  summary,
  isSelected,
  onClick,
}) => {
  return (
    <div
      onClick={onClick}
      className={`thumbnail ${isSelected ? "selected" : ""}`}
    >
      <img src={src} alt={summary} className="thumbnail-img" />
      <div className="thumbnail-label">
        <p>{summary}</p>
      </div>
    </div>
  );
};

export default UmapThumbnail;
