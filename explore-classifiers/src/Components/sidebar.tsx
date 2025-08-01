import React from "react";
import UmapThumbnail from "./UmapThumbnail";

export interface UmapData {
  id: string;
  modelName: string;
  probability: number;
}

interface SidebarProps {
  UMAP_PREVIEWS: UmapData[];
  selectedUMAP: string;
  setSelectedUMAP: (id: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  UMAP_PREVIEWS,
  selectedUMAP,
  setSelectedUMAP,
}) => {
  return (
    <aside className="w-1/5 min-w-[180px] bg-white p-4 border-r overflow-y-auto">
      <h2 className="text-lg font-semibold mb-4">UMAP Previews</h2>
      <div className="flex flex-col space-y-4">
        {UMAP_PREVIEWS.map((umap) => (
          <UmapThumbnail
            id={umap.id}
            modelName={umap.modelName}
            probability={umap.probability}
            isSelected={selectedUMAP === umap.id}
            onClick={() => setSelectedUMAP(umap.id)}
          />
        ))}
      </div>
    </aside>
  );
};

export default Sidebar;
