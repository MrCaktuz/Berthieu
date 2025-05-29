import fs from "fs";
import path from "path";
import sharp from "sharp";

const cache = new Map();

export default async function getBase64ImageUrl(image: ImageProps): Promise<string> {
  let url = cache.get(image);
  if (url) {
    return url;
  }

  const imagePath = path.join(process.cwd(), "public", image.public_id);

  const imageBuffer = fs.readFileSync(imagePath);

  const resizedImageBuffer = await sharp(imageBuffer)
    .resize(8) // petite taille pour le blur
    .jpeg({ quality: 70 })
    .toBuffer();

  url = `data:image/jpeg;base64,${resizedImageBuffer.toString("base64")}`;
  cache.set(image, url);
  return url;
}
