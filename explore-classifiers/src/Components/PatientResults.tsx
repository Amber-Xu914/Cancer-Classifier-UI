import { useRef, useState, useEffect } from "react";
import UmapThumbnail from "./UmapThumbnail";
import { UmapCard } from "./UmapCard";
import styles from "./PatientResults.module.css";
import { useLocation } from "react-router-dom";
import { TextField } from "@mui/material";
import '../Global.css';


// pending floating box for summary
export default function PatientResults() {
  const [selectedUMAPs, setSelectedUMAPs] = useState<Set<number>>(new Set());
  const cardRefs = useRef<Record<number, HTMLDivElement | null>>({});
  const location = useLocation();
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [value, setValue] = useState('');

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const sampleId = searchParams.get("value");

    console.log("Extracted sampleId from URL:", sampleId);

    if (sampleId) {
      setValue(sampleId);

      fetch(`/sample/${sampleId}`)
        .then((res) => {
          if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`);
          }
          return res.json();
        })
        .then((data) => {
          setResults(data.results || []);
          setLoading(false);
        })
        .catch((err) => {
          console.error("Error fetching patient data: ", err);
          setResults([]);
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, [location]);

  const handleThumbnailClick = (id: number) => {
    setSelectedUMAPs((prev) => {
      const newSet = new Set(prev);
      const isNewlyAdded = !newSet.has(id);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }

      if (isNewlyAdded) {
        // wait till the UMAP to come out a bit
        setTimeout(() => {
          cardRefs.current[id]?.scrollIntoView({
            behavior: "smooth",
            block: "center",
          });
        }, 200);
      }

      return newSet;
    });
  };

  if (loading) return <div>Loading...</div>;

  // handle no results
  if (results.length === 0) {
    return <div style={{ padding: "2rem" }}>No summary of this cancer type available.</div>;
  }

  // Display data
  return (
    <div className={styles.container}>
      {/* sidebar */}
      <aside className={styles.sidebar}>
        <h3>Patient ID: {value}</h3>
        {/* MUI Filter */}
        <TextField
          placeholder="Min Probability"
          variant="outlined"
          size="small"
          fullWidth
          type="number"
          onChange={(e) => {
            const threshold = parseFloat(e.target.value);
            if (!isNaN(threshold)) {
              setSelectedUMAPs(() => {
                const newSet = new Set<number>();
                results.forEach((result, idx) => {
                  if (result.probability > threshold) {
                    newSet.add(idx);
                  }
                });
                return newSet;
              });
            }
          }}
          style={{ marginBottom: "16px" }}
          InputProps={{
            style: { fontSize: "0.75rem" },
            inputProps: {
              step: 0.01, // change unit to 0.01
              min: 0,
              max: 1,
            },
          }}
        />
        <div>
          {results.map((result, idx) => (
            <UmapThumbnail
              key={idx}
              id={String(idx)}
              modelName={result.model_name}
              probability={result.probability}
              isSelected={selectedUMAPs.has(idx)}
              onClick={() => handleThumbnailClick(idx)}
            />
          ))}
        </div>
      </aside>

      {/* UMAP display */}
      <main className={styles.main}>
        <h2 style={{ textAlign: "center" }}>
          Click the preview on the left to view each prediction's UMAP
        </h2>
        {results.map((result, idx) => (
          <div
            key={idx}
            ref={(el) => { cardRefs.current[idx] = el; }} //element rolling
            style={{ marginBottom: "24px", scrollMarginTop: "80px" }}
          >
            <UmapCard
              layer={idx + 1}
              selected={selectedUMAPs.has(idx)}
              modelName={result.model_name}
              prediction={result.prediction}
              probability={result.probability}
              figureJSON={result.figure}
              onToggle={(layer, open) => {
                setSelectedUMAPs((prev) => {
                  const newSet = new Set(prev);
                  const layerIndex = layer - 1;
                  if (open) {
                    newSet.add(layerIndex);
                  } else {
                    newSet.delete(layerIndex);
                  }
                  return newSet;
                });
              }}
            />
          </div>
        ))}
      </main>
    </div>
  );
}
