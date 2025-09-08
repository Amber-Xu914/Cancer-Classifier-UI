import CloseIcon from '@mui/icons-material/Close';
import { Box, IconButton, Typography } from '@mui/material';
import React, { useEffect, useRef, useState } from 'react';
import { ResizableBox } from 'react-resizable';
import 'react-resizable/css/styles.css';
import '../../../../Global.css';
import styles from './FloatingBox.module.css';

interface FloatingBoxProps {
  open: boolean; // Whether the floating box is visible
  onClose: () => void; // Callback when closing the box
  summaries: string[]; // Prediction summaries to display
  highlightIndex?: number | null; // Which summary card should be highlighted
  onSampleIdClick?: (id: string) => void; // Callback when clicking a sample id link
}

const FloatingBox: React.FC<FloatingBoxProps> = ({
  open,
  onClose,
  summaries,
  highlightIndex = null,
  onSampleIdClick,
}) => {
  // Box height is window height minus header
  const [height, setHeight] = useState(window.innerHeight - 64);

  // Store refs for each summary card (used for scrolling into view)
  const cardRefs = useRef<Record<number, HTMLDivElement | null>>({});

  // Adjust height when window resizes
  useEffect(() => {
    const handleResize = () => setHeight(window.innerHeight - 64);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Scroll to highlighted card when highlightIndex changes
  useEffect(() => {
    if (highlightIndex == null) return;
    const el = cardRefs.current[highlightIndex];
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'nearest' });
    }
  }, [highlightIndex]);

  if (!open) return null; // Do not render if the box is closed

  return (
    <ResizableBox
      width={320}
      height={height}
      minConstraints={[260, height]} // Minimum width, fixed height
      maxConstraints={[window.innerWidth * 0.6, height]} // Limit max width
      axis="x"
      resizeHandles={['w']} // Can resize only from the left side
      className={styles.resizableBox}
    >
      <Box className={styles.floatingBoxWrapper}>
        {/* Header */}
        <Box className={styles.header}>
          <Typography variant="h6" component="h2">
            Prediction Summary
          </Typography>
          <IconButton onClick={onClose} className={styles.closeBtn} aria-label="Close">
            <CloseIcon />
          </IconButton>
        </Box>

        {/* Body */}
        <Box className={styles.content}>
          {summaries.length === 0 ? (
            <Typography className={styles.emptyMessage}>
              Click a card to see more details.
            </Typography>
          ) : (
            summaries.map((summary, index) => {
              const lines = summary.split('\n');
              const rendered: React.ReactNode[] = [];

              // Render each line of summary
              for (let i = 0; i < lines.length; i++) {
                const line = lines[i];

                rendered.push(
                  <p key={`l-${index}-${i}`} style={{ margin: 0 }}>
                    {line}
                  </p>
                );

                // Special handling for "closest sample under this level"
                if (/closest\s+samples?\s+under\s+this\s+level:?\s*$/i.test(line)) {
                  const next = (lines[i + 1] ?? '').trim();
                  const ids = next
                    .split(',')
                    .map((s) => s.trim())
                    .filter(Boolean);

                  // Render clickable sample IDs
                  rendered.push(
                    <p key={`ids-${index}-${i}`} style={{ lineHeight: 1.6, marginTop: 4 }}>
                      {ids.length === 0
                        ? 'N/A'
                        : ids.map((id, j) => (
                          <a
                            key={`${id}-${j}`}
                            href={`/PatientResults?filter=Patient&value=${encodeURIComponent(id)}`}
                            onClick={(e) => {
                              e.preventDefault();
                              onSampleIdClick?.(id);
                            }}
                            style={{ textDecoration: 'underline', cursor: 'pointer', marginRight: 8 }}
                            title={`Go to ${id}`}
                          >
                            {id}
                          </a>
                        ))}
                    </p>
                  );

                  i++; // Skip the next line (already processed as IDs)
                }
              }

              // Render summary card
              return (
                <Box
                  key={index}
                  ref={(el) => {
                    cardRefs.current[index] = el as HTMLDivElement | null;
                  }}
                  className={`${styles.summaryCard} ${
                    highlightIndex === index ? styles.summaryCardHighlight : ''
                  }`}
                >
                  {rendered}
                </Box>
              );
            })
          )}
        </Box>
      </Box>
    </ResizableBox>
  );
};

export default FloatingBox;
