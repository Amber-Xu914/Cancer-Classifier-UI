import { useRef, useState, useEffect } from "react";
import UmapThumbnail from "./UmapThumbnail";
import { UmapCard } from "./UmapCard";
import styles from "./PatientResults.module.css";
import { useLocation } from "react-router-dom";
import '../Global.css';

export default function PatientResults() {
  const [selectedUMAPs, setSelectedUMAPs] = useState<Set<number>>(new Set());
  const cardRefs = useRef<Record<number, HTMLDivElement | null>>({});
  const location = useLocation();
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [value, setValue] = useState('');

  useEffect(() => {
    // mock data
    const mockResults = [
      {
        model_name: "ZERO2",
        prediction: "Positive",
        probability: 0.92,
        figure: {},
      },
      {
        model_name: "First Level",
        prediction: "Negative",
        probability: 0.15,
        figure: {},
      },
      {
        model_name: "Second Level",
        prediction: "Positive",
        probability: 0.83,
        figure: {},
      },
      {
        model_name: "Third Level",
        prediction: "Negative",
        probability: 0.33,
        figure: {},
      },
    ];

    setResults(mockResults);
    setLoading(false);

    const searchParams = new URLSearchParams(location.search);
    const patientId = searchParams.get("value") || "unknown";
    setValue(patientId);

    /*
    const searchParams = new URLSearchParams(location.search);
    const value = searchParams.get("value");

    if (value) {
      fetch(`/sample/${value}`)
        .then(res => res.json())
        .then(data => {
          setResults(data.results || []);
          setLoading(false);
        })
        .catch(err => {
          console.error("Error fetching patient data:", err);
          setResults([]);
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
    */
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
            block: "start",
          });
        }, 0);
      }

      return newSet;
    });
  };

  if (loading) return <div>Loading...</div>;

  // handle no results
  if (results.length === 0) {
    return <div style={{ padding: "2rem" }}>no results...?</div>;
  }

  // Display data
  return (
    <div className={styles.container}>
      {/* sidebar */}
      <aside className={styles.sidebar}>
        <h3>Patient ID: {value}</h3>
        <div>
          {results.map((result, idx) => (
            <UmapThumbnail
              key={idx}
              id={String(idx)}
              // TODO: change to dynamic UMAP pic
              src="/logo192.png"
              summary={`${result.model_name}: ${result.prediction}`}
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
            />
          </div>
        ))}
      </main>
    </div>
  );
}
