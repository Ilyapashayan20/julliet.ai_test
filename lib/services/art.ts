import { openai } from '@/utils/openai';
import { SupabaseClient } from '@supabase/supabase-js';
import fetch from 'node-fetch';

export const getArtsByUserid = async ({
  supabase,
  userId
}: {
  supabase: SupabaseClient;
  userId: string;
}) => {
  const response = await supabase
    .from('arts')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (response.error) {
    throw response.error;
  }

  if (response.data.length === 0) {
    throw 'Arts Not Founded';
  }

  return response;
};

export const generateArt = async ({
  supabase,
  user,
  prompt,
  n,
  size
}: {
  supabase: SupabaseClient;
  user: any;
  prompt: string;
  n: number;
  size: any;
}) => {
  try {
    const generateImagePromise = openai.images.generate({
      model: 'dall-e-3',
      prompt,
      n,
      size
    });

    // You can perform other asynchronous tasks while waiting for the OpenAI API call
    // For example, fetching additional data or performing other computations

    const response = await generateImagePromise;

    if (!response) {
      throw new Error(`OpenAI API error: ${response}`);
    }

    const imageUrl = response.data[0]?.url;

    if (!imageUrl) {
      throw new Error('Image URL not found in the response');
    }

    // Other asynchronous tasks can be performed here, if needed

    // const imageResponse = await fetch(imageUrl);
    // const imageBuffer = await imageResponse.buffer();

    // const { data: storageData, error: storageError } = await supabase.storage
    //   .from('Arts')
    //   .upload(`images/${user.id}/${Date.now()}.jpg`, imageBuffer);

    // if (storageError) {
    //   throw storageError;
    // }

    // const path = storageData.path;

    // const { data: upsertData, error: upsertError } = await supabase
    //   .from('arts')
    //   .upsert([
    //     {
    //       user_id: user.id,
    //       path: imageUrl 
    //     }
    //   ]);

    // if (upsertError) {
    //   throw upsertError;
    // }

    return imageUrl;
  } catch (error) {
    throw error;
  }
};



export const saveImage = async ({
  supabase,
  user,
  imageUrl,
}: {
  supabase: SupabaseClient;
  user: any;
  imageUrl: string;
}) => {
  try {
    // Check if the image URL is available
    if (!imageUrl) {
      throw new Error('Image URL not found in the response');
    }

    // Fetch image asynchronously
    const imageResponse = await fetch(imageUrl);
    const imageBuffer = await imageResponse.buffer();

    // Upload image to Supabase Storage and get path
    const { data: storageData, error: storageError } = await supabase.storage
      .from('Arts')
      .upload(`images/${user.id}/${Date.now()}.jpg`, imageBuffer);

    if (storageError) {
      throw new Error(`Error uploading image to storage: ${storageError.message}`);
    }

    const path = storageData.path;

    // Upsert image information to the 'arts' table
    const { error: upsertError } = await supabase
      .from('arts')
      .upsert([
        {
          user_id: user.id,
          path: imageUrl,
        },
      ]);

    if (upsertError) {
      throw new Error(`Error upserting image information: ${upsertError.message}`);
    }

    return imageUrl;
  } catch (error) {
    console.error('Error in saveImage:', error);
    throw error;
  }
};
