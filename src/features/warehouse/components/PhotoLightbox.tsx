import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/shared/components/ui/dialog.tsx";

interface PhotoLightboxProps {
  url: string;
  alt: string;
  onClose: () => void;
}

/**
 * The full-size photo over the page — markings on a board, a serial number,
 * a burn mark aren't readable on the thumbnail. Esc and a click outside the
 * image close it (Radix Dialog behaviour).
 *
 * The content box shrinks to the image, so the dimmed overlay around it is the
 * "outside". 90vw / 85vh are viewport-relative caps that the spacing scale has
 * no equivalent for.
 */
export const PhotoLightbox = ({ url, alt, onClose }: PhotoLightboxProps) => (
  <Dialog open onOpenChange={(open) => !open && onClose()}>
    <DialogContent
      hideClose
      aria-describedby={undefined}
      className="w-auto max-w-[90vw] border-0 bg-transparent p-0 shadow-none sm:rounded-md"
    >
      <DialogTitle className="sr-only">{alt}</DialogTitle>
      <img
        src={url}
        alt={alt}
        className="block max-h-[85vh] max-w-[90vw] rounded-md object-contain"
      />
    </DialogContent>
  </Dialog>
);
