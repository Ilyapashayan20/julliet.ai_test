export interface LexicaImage {
  id: string;
  gallery: string;
  src: string;
  srcSmall: string;
  prompt: string;
  width: number;
  height: number;
  seed: number;
  grid: boolean;
  model: string;
  guidance: string;
  promptId: string;
  nsfw: boolean;
}

export interface LexicaImageResponse {
  images: LexicaImage[];
}

export const searchImage = async (
  query: string
): Promise<LexicaImageResponse> => {
  const response = await fetch(`https://lexica.art/api/v1/search?q=${query}`);
  const data = await response.json();
  return data;
};
