import { useRef, useState } from "react";
import UmapThumbnail from "./UmapThumbnail";
import { UmapCard } from "./UmapCard";
import styles from "./PatientResults.module.css";

const UMAP_PREVIEWS = [
  { id: 1, src: "/logo192.png", summary: "Summary of UMAP 1" },
  { id: 2, src: "/logo192.png", summary: "Summary of UMAP 2" },
  { id: 3, src: "/logo192.png", summary: "Summary of UMAP 3" },
  { id: 4, src: "/logo192.png", summary: "Summary of UMAP 4" },
];

export default function PatientResults() {
  const [selectedUMAP, setSelectedUMAP] = useState<number | null>(null);
  const cardRefs = useRef<Record<number, HTMLDivElement | null>>({});

  const handleThumbnailClick = (id: number) => {
    setSelectedUMAP((prev) => {
      const newSelection = prev === id ? null : id;

      // scroll into view only if expanding
      if (newSelection !== null && cardRefs.current[newSelection]) {
        cardRefs.current[newSelection]?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }

      return newSelection;
    });
  };

  return (
    <div className={styles.container}>
      {/* Sidebar */}
      <aside className={styles.sidebar}>
        <h3>UMAP Previews</h3>
        <div>
          {UMAP_PREVIEWS.map((umap) => (
            <UmapThumbnail
              key={umap.id}
              id={String(umap.id)}
              src={umap.src}
              summary={umap.summary}
              isSelected={selectedUMAP === umap.id}
              onClick={() => handleThumbnailClick(umap.id)}
            />
          ))}
        </div>
      </aside>

      {/* Main */}
      <main className={styles.main}>
        {UMAP_PREVIEWS.map((umap) => (
          <div
            key={umap.id}
            ref={(el) => {
              cardRefs.current[umap.id] = el;
            }}
            style={{ marginBottom: "24px", scrollMarginTop: "80px" }}
          >
            <UmapCard
              layer={umap.id}
              selected={selectedUMAP === umap.id}
            />
          </div>
        ))}
      </main>
    </div>
  );
}

