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

export const generateAndSaveArt = async ({
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
    // const monthlyLimit = 2 ;

    // const currentDate = new Date();
    // const currentMonth = currentDate.getMonth() + 1;
    // const currentYear = currentDate.getFullYear();

    // const { count: count, error: monthlyArtsError } = await supabase
    //   .from('arts')
    //   .select('id', { count: 'exact' })
    //   .eq('user_id', user.id)
    //   .gte('created_at', `${currentYear}-${currentMonth}-01T00:00:00Z`);

    // if (monthlyArtsError) {
    //   throw monthlyArtsError;
    // }
   
    // const monthlyArtsCount = count || 0 ;


    // if (monthlyArtsCount >= monthlyLimit) {
    //     throw {limit_exceeded: true}
    // }

    const response = await openai.images.generate({
      model: 'dall-e-3',
      prompt,
      n,
      size
    });

    if (response) {
      const imageUrl = response.data[0].url

      if (!imageUrl) {
        throw new Error('Image URL not found in the response');
      }

      const imageResponse = await fetch(imageUrl);
      const imageBuffer = await imageResponse.buffer();

      // const { data: storageData, error: storageError } = await supabase.storage
      //   .from('Arts')
      //   .upload(`images/${user.id}/${Date.now()}.jpg`, imageBuffer);

      // if (storageError) {
      //   throw storageError;
      // }

      // const path = storageData.path;

      const { data: upsertData, error: upsertError } = await supabase
        .from('arts')
        .upsert([
          {
            user_id: user.id,
            path: imageUrl 
          }
        ]);

      // if (upsertError) {
      //   throw upsertError;
      // }

      return imageUrl;
    } else {
      throw new Error(`OpenAI API error: ${response}`);
    }
  } catch (error) {
    throw error;
  }
};


