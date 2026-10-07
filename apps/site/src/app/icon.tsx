import { createIconImage } from "./_lib/icon-image";

export function generateImageMetadata() {
  return [32, 48].map((size) => ({
    id: String(size),
    size: { width: size, height: size },
    contentType: "image/png",
  }));
}

export default async function Icon({ id }: { id: Promise<string> }) {
  return createIconImage(Number(await id));
}
