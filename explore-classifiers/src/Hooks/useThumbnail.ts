import { useState, useRef, useCallback } from "react";

export interface UmapSelectionState {
    selectedUMAPs: Set<number>;
    cardRefs: React.MutableRefObject<Record<number, HTMLDivElement | null>>;
}

export interface UmapSelectionActions {
    handleThumbnailClick: (id: number) => void;
    setSelectedUMAPs: React.Dispatch<React.SetStateAction<Set<number>>>;
    toggleUmap: (layerIndex: number, open: boolean) => void;
}

export const useThumbnail = () => {
    const [selectedUMAPs, setSelectedUMAPs] = useState<Set<number>>(new Set());
    const cardRefs = useRef<Record<number, HTMLDivElement | null>>({});

    const handleThumbnailClick = useCallback((id: number) => {
        setSelectedUMAPs((prev) => {
            const newSet = new Set(prev);
            const isNewlyAdded = !newSet.has(id);

            if (newSet.has(id)) {
                newSet.delete(id);
            } else {
                newSet.add(id);
            }

            if (isNewlyAdded) {
                // Scroll to the newly opened card
                setTimeout(() => {
                    cardRefs.current[id]?.scrollIntoView({
                        behavior: "smooth",
                        block: "center",
                    });
                }, 200);
            }

            return newSet;
        });
    }, []);

    const toggleUmap = useCallback((layerIndex: number, open: boolean) => {
        setSelectedUMAPs((prev) => {
            const newSet = new Set(prev);
            if (open) {
                newSet.add(layerIndex);
            } else {
                newSet.delete(layerIndex);
            }
            return newSet;
        });
    }, []);

    return {
        selectedUMAPs,
        cardRefs,
        handleThumbnailClick,
        setSelectedUMAPs,
        toggleUmap,
    };
};