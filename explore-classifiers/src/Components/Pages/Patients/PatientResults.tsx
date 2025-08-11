import { TextField } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import "../../../Global.css";
import FloatingBox from "./FloatingBox/FloatingBox";
import styles from "./PatientResults.module.css";
import { UmapCard } from "./UmapCard";
import UmapThumbnail from "./UmapThumbnail/UmapThumbnail";

type SummaryItem = {
  id: number;   // Stable identifier (we use result index or a backend id)
  text: string; // Rendered summary text
};

/**
 * Utility: check whether an element is currently visible in the viewport.
 */
const isInViewport = (el: HTMLElement | null) => {
  if (!el) return false;
  const rect = el.getBoundingClientRect();
  const vh = window.innerHeight || document.documentElement.clientHeight;
  const vw = window.innerWidth || document.documentElement.clientWidth;
  return rect.bottom > 0 && rect.top < vh && rect.right > 0 && rect.left < vw;
};

export default function PetientResults() {
  // Tracks which UMAP cards are expanded/selected in the main panel.
  const [selectedUMAPs, setSelectedUMAPs] = useState<Set<number>>(new Set());
  // DOM refs for each rendered UMAP card, used to scroll into view when needed.
  const cardRefs = useRef<Record<number, HTMLDivElement | null>>({});
  const location = useLocation();

  // Data & loading state
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [value, setValue] = useState("");
  // Whether the right-side floating summary box is visible
  const [showFloatingBox, setShowFloatingBox] = useState(true);

  // Structured summaries; each one has a stable id so we can find it reliably.
  const [summaryList, setSummaryList] = useState<SummaryItem[]>([]);
  // Keep a ref with the latest summaryList to avoid stale reads inside callbacks.
  const summaryListRef = useRef<SummaryItem[]>([]);
  useEffect(() => {
    summaryListRef.current = summaryList;
  }, [summaryList]);

  // Which summary item (by index in summaryList) should be highlighted in the floating box
  const [highlightSummaryIndex, setHighlightSummaryIndex] = useState<number | null>(null);

  // If user clicks an old card while the floating box is CLOSED, we store the
  // target index here, and only highlight AFTER the box opens (see effect below).
  const [pendingHighlightIndex, setPendingHighlightIndex] = useState<number | null>(null);

  /**
   * Fetch results using the `value` query param (?value=sampleId).
   */
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

  /*Floating box CLOSED -> OPEN: apply the highlight to summary box for 1.5s.*/
  /* TODO: need to be fixed. currently not able to work. */
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

  /*Handle clicking a thumbnail on the left*/
  const handleThumbnailClick = (id: number) => {
    const result = results[id];

    // Was the card currently expanded?
    const isCurrentlySelected = selectedUMAPs.has(id);
    // Is there already a summary for this id? (old card vs new card)
    const currentSummaries = summaryListRef.current;
    const idxInSummary = currentSummaries.findIndex((s) => s.id === id);
    const hasSummaryAlready = idxInSummary >= 0;

    // Toggle selection state immediately
    setSelectedUMAPs((prev) => {
      const next = new Set(prev);
      if (isCurrentlySelected) next.delete(id);
      else next.add(id);
      return next;
    });

    if (!isCurrentlySelected) {
      // OLD card (summary exists already) and the box is CLOSED
      // -> open the box and schedule a highlight
      if (hasSummaryAlready && !showFloatingBox) {
        setPendingHighlightIndex(idxInSummary);
        setShowFloatingBox(true);
      }

      // NEW card (no summary yet)
      // -> create its summary and ensure the box is open (no highlight by design)
      if (!hasSummaryAlready) {
        const text = `Model: ${result.model_name}
                      Prediction: ${result.prediction}
                      Probability: ${result.probability.toFixed(2)}
                      Summary:
                      This is a summary place holder. Summary will be added later.`;

        setSummaryList((prevSummaries) =>
          prevSummaries.some((s) => s.id === id)
            ? prevSummaries
            : [...prevSummaries, { id, text }]
        );
        setShowFloatingBox(true);
      }

      // Scroll the big UMAP card into view if needed
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
      // We are closing the card (no highlight, just optional scroll)
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

  // If there are no results for this patient/cancer type
  if (results.length === 0) {
    return (
      <div style={{ padding: "2rem" }}>
        No summary of this cancer type available.
      </div>
    );
  }

  // left sidebar, center UMAP cards, right floating summary box
  return (
    <div className={styles.container}>
      {/* Sidebar with filter and UMAP thumbnail list */}
      <aside className={styles.sidebar}>
        <h3>Patient ID: {value}</h3>

        {/* Probability threshold filter; selecting applies to the large UMAP cards */}
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

      {/* Main UMAP cards panel */}
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
                // Keep selectedUMAPs in sync with expand/collapse actions inside each card
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

      {/* Right-side floating summary box */}
      <FloatingBox
        open={showFloatingBox}
        onClose={() => setShowFloatingBox(false)}
        // This component currently accepts string[], so map out the text
        summaries={summaryList.map((s) => s.text)}
        // The index to highlight inside the FloatingBox (cleared automatically after 1.5s)
        highlightIndex={highlightSummaryIndex}
      />

      {/* Button to reopen the summary box if the user closes it */}
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
