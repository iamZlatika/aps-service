import { useMutation } from "@tanstack/react-query";

async function fetchImageBlob(url: string): Promise<void> {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Failed to download image: ${response.status}`);
  }

  const blob = await response.blob();
  const objectUrl = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = objectUrl;
  a.download = url.split("/").pop() ?? "image";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);

  setTimeout(() => URL.revokeObjectURL(objectUrl), 100);
}

type UseDownloadImageReturn = {
  download: (url: string) => void;
  isPending: boolean;
};

export function useDownloadImage(): UseDownloadImageReturn {
  const { mutate: download, isPending } = useMutation({
    mutationFn: fetchImageBlob,
  });

  return { download, isPending };
}
