import CloseIcon from '@mui/icons-material/Close';
import { Box, IconButton, Typography } from '@mui/material';
import React, { useEffect, useRef, useState } from 'react';
import { ResizableBox } from 'react-resizable';
import 'react-resizable/css/styles.css';
import '../../../../Global.css';
import styles from './FloatingBox.module.css';

interface FloatingBoxProps {
  open: boolean;
  onClose: () => void;
  summaries: string[];
  highlightIndex?: number | null;
}

const FloatingBox: React.FC<FloatingBoxProps> = ({ open, onClose, summaries, highlightIndex = null }) => {
  const [height, setHeight] = useState(window.innerHeight - 64);
  const cardRefs = useRef<Record<number, HTMLDivElement | null>>({});

  useEffect(() => {
    const handleResize = () => setHeight(window.innerHeight - 64);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (highlightIndex == null) return;
    const el = cardRefs.current[highlightIndex];
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'nearest' });
    }
  }, [highlightIndex]);

  if (!open) return null;

  return (
    <ResizableBox
      width={320}
      height={height}
      minConstraints={[260, height]}
      maxConstraints={[window.innerWidth * 0.6, height]}
      axis="x"
      resizeHandles={['w']}
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
            summaries.map((summary, index) => (
              <Box
                key={index}
                ref={(el) => { cardRefs.current[index] = el as HTMLDivElement | null; }}
                className={`${styles.summaryCard} ${highlightIndex === index ? styles.summaryCardHighlight : ''}`}
              >
                {summary.split('\n').map((line, i) => (
                  <p key={i}>{line}</p>
                ))}
              </Box>
            ))
          )}
        </Box>
      </Box>
    </ResizableBox>
  );
};

export default FloatingBox;
