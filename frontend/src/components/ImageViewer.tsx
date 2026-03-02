import React, { useEffect } from "react";
import {
    Dialog,
    DialogContent,
} from "@/components/ui/dialog";
import Lightbox from "yet-another-react-lightbox";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import "yet-another-react-lightbox/styles.css";
import { resolveImage } from "@/util/apiUtils";

interface ImageViewerProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    images: string[];
    initialIndex?: number;
}

const ImageViewer: React.FC<ImageViewerProps> = ({
    open,
    onOpenChange,
    images,
    initialIndex = 0,
}) => {
    // Use a ref to capture the initialIndex when opening, to prevent updates during viewing
    const indexRef = React.useRef(initialIndex);
    const prevOpenRef = React.useRef(open);

    useEffect(() => {
        // Capture the initialIndex only when opening
        if (open && !prevOpenRef.current) {
            indexRef.current = initialIndex;
        }
        prevOpenRef.current = open;
    }, [open, initialIndex]);

    if (images.length === 0) return null;

    // Convert images to slides format for lightbox
    const slides = images.map((image) => ({
        src: resolveImage(image),
    }));

    return (
        <>
            <Dialog open={open} onOpenChange={onOpenChange}>
                <DialogContent 
                    showCloseButton={false}
                    className="!fixed !inset-0 !w-screen !h-screen !max-w-none !max-h-none !p-0 !bg-transparent !border-none !z-[200] !translate-x-0 !translate-y-0 !top-0 !left-0 !rounded-none !shadow-none !pointer-events-none"
                    onInteractOutside={(e) => {
                        // Prevent closing when interacting with Lightbox
                        e.preventDefault();
                    }}
                    onPointerDownOutside={(e) => {
                        // Prevent closing when clicking on Lightbox
                        e.preventDefault();
                    }}
                >
                    {/* Empty content - Lightbox renders in its own portal */}
                </DialogContent>
            </Dialog>
            {/* Render Lightbox outside Dialog to avoid overlay conflicts */}
            {open && (
                <div className="fixed inset-0 z-[201] pointer-events-auto">
                    <Lightbox
                        key={`lightbox-${indexRef.current}`}
                        open={open}
                        close={() => onOpenChange(false)}
                        index={indexRef.current}
                        slides={slides}
                        plugins={[Zoom]}
                        zoom={{
                            maxZoomPixelRatio: 3,
                            scrollToZoom: true,
                        }}
                        styles={{
                            container: { backgroundColor: "rgba(0, 0, 0, 0.95)" },
                        }}
                    />
                </div>
            )}
        </>
    );
};

export default ImageViewer;

