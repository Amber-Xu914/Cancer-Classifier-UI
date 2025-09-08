import { TextField } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import "../../../Global.css";
import FloatingBox from "./FloatingBox/FloatingBox";
import styles from "./PatientResults.module.css";
import { UmapCard } from "./UmapCard";
import UmapThumbnail from "./UmapThumbnail/UmapThumbnail";
import { nearestIdsFromFigure } from "../../../Utils/umapNearest";
import { useLocation, useNavigate } from "react-router-dom";

type SummaryItem = {
  id: number;
  text: string;
};

// check whether an element is currently visible in the viewport.
const isInViewport = (el: HTMLElement | null) => {
  if (!el) return false;
  const rect = el.getBoundingClientRect();
  const vh = window.innerHeight || document.documentElement.clientHeight;
  const vw = window.innerWidth || document.documentElement.clientWidth;
  return rect.bottom > 0 && rect.top < vh && rect.right > 0 && rect.left < vw;
};

export default function PetientResults() {
  const [selectedUMAPs, setSelectedUMAPs] = useState<Set<number>>(new Set());
  const cardRefs = useRef<Record<number, HTMLDivElement | null>>({});
  const location = useLocation();

  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [value, setValue] = useState("");
  const [showFloatingBox, setShowFloatingBox] = useState(true);

  const [summaryList, setSummaryList] = useState<SummaryItem[]>([]);
  const summaryListRef = useRef<SummaryItem[]>([]);

  const navigate = useNavigate();

  const handleSampleIdClick = (id: string) => {
    navigate(`/PatientResults?filter=Patient&value=${encodeURIComponent(id)}`);
  };

  useEffect(() => {
    summaryListRef.current = summaryList;
  }, [summaryList]);

  const [highlightSummaryIndex, setHighlightSummaryIndex] = useState<number | null>(null);
  const [pendingHighlightIndex, setPendingHighlightIndex] = useState<number | null>(null);

  // Fetch by ?value=<sampleId>
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const sampleId = searchParams.get("value");

    if (sampleId) {
      setValue(sampleId);
      fetch(`/sample/${sampleId}`)
        .then((res) => {
          if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
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

  // FloatingBox closed -> open highlight
  useEffect(() => {
    if (showFloatingBox && pendingHighlightIndex != null) {
      const idx = pendingHighlightIndex;
      setPendingHighlightIndex(null);

      const raf = requestAnimationFrame(() => {
        setHighlightSummaryIndex(idx);
        const t = window.setTimeout(() => {
          setHighlightSummaryIndex((prev) => (prev === idx ? null : prev));
        }, 1500);
        return () => clearTimeout(t);
      });

      return () => cancelAnimationFrame(raf);
    }
  }, [showFloatingBox, pendingHighlightIndex]);

  // Click thumbnail
  const handleThumbnailClick = (id: number) => {
    const result = results[id];

    const isCurrentlySelected = selectedUMAPs.has(id);
    const currentSummaries = summaryListRef.current;
    const idxInSummary = currentSummaries.findIndex((s) => s.id === id);
    const hasSummaryAlready = idxInSummary >= 0;

    setSelectedUMAPs((prev) => {
      const next = new Set(prev);
      if (isCurrentlySelected) next.delete(id);
      else next.add(id);
      return next;
    });

    if (!isCurrentlySelected) {
      if (hasSummaryAlready && !showFloatingBox) {
        setPendingHighlightIndex(idxInSummary);
        setShowFloatingBox(true);
      }

      if (!hasSummaryAlready) {
        const nearest = nearestIdsFromFigure(result.figure, 3, value);

        const text = [
          `Model: ${result.model_name}`,
          "",
          `Prediction: ${result.prediction}`,
          "",
          `Probability: ${result.probability.toFixed(2)}`,
          "",
          "Summary:",
          "",
          "This is a summary place holder. Summary will be added later.",
          "",
          "closest samples under this level:",
          nearest.length ? nearest.join(", ") : "N/A",
        ].join("\n");

        setSummaryList((prevSummaries) =>
          prevSummaries.some((s) => s.id === id)
            ? prevSummaries
            : [...prevSummaries, { id, text }]
        );
        setShowFloatingBox(true);
      }

      setTimeout(() => {
        const el = cardRefs.current[id];
        if (el && !isInViewport(el)) {
          el.scrollIntoView({
            behavior: "smooth",
            block: "center",
            inline: "nearest",
          });
        }
      }, 200);
    } else {
      const el = cardRefs.current[id];
      if (el && !isInViewport(el)) {
        el.scrollIntoView({
          behavior: "smooth",
          block: "center",
          inline: "nearest",
        });
      }
    }
  };

  if (loading) return <div>Fetching patient data...</div>;

  if (results.length === 0) {
    return (
      <div style={{ padding: "2rem" }}>
        No summary of this cancer type available.
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <aside className={styles.sidebar}>
        <h3>Patient ID: {value}</h3>
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
                  if (result.probability > threshold) newSet.add(idx);
                });
                return newSet;
              });
            }
          }}
          style={{ marginBottom: "16px" }}
          InputProps={{
            style: { fontSize: "0.75rem" },
            inputProps: { step: 0.01, min: 0, max: 1 },
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

      <main className={styles.main}>
        <h2 style={{ textAlign: "left" }}>
          Click the card on the left to view each level&apos;s UMAP
        </h2>
        {results.map((result, idx) => (
          <div
            key={idx}
            ref={(el) => {
              cardRefs.current[idx] = el;
            }}
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
                  if (open) newSet.add(layerIndex);
                  else newSet.delete(layerIndex);
                  return newSet;
                });
              }}
            />
          </div>
        ))}
      </main>

      <FloatingBox
        open={showFloatingBox}
        onClose={() => setShowFloatingBox(false)}
        summaries={summaryList.map((s) => s.text)}
        highlightIndex={highlightSummaryIndex}
        onSampleIdClick={handleSampleIdClick}
      />

      {!showFloatingBox && (
        <button
          onClick={() => setShowFloatingBox(true)}
          style={{
            position: "fixed",
            top: "50%",
            right: 0,
            transform: "translateY(-50%)",
            backgroundColor: "#00A859",
            color: "white",
            border: "none",
            padding: "8px 12px",
            borderTopLeftRadius: "6px",
            borderBottomLeftRadius: "6px",
            cursor: "pointer",
            zIndex: 1301,
          }}
        >
          &#8592; Summary
        </button>
      )}
    </div>
  );
}
