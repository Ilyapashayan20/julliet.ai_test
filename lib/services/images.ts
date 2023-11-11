import Replicate from 'replicate-js';

const replicate = new Replicate({
  token: process.env.REPLICATE_TOKEN
});

interface StableDiffusionInput {
  prompt: string;
  num_outputs?: number;
  guidance_scale?: number;
  num_inference_steps?: number;
  width?: number;
  height?: number;
  prompt_strength?: number;
  scheduler?: string;
  seed?: number;
}

export const getImageFromPrompt = async (props: StableDiffusionInput) => {
  const model = await replicate.models.get('stability-ai/stable-diffusion');
  const result = await model.predict(props);
  return result;
};
