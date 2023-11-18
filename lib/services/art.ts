import { openai } from '@/utils/openai';
import { SupabaseClient } from '@supabase/supabase-js';
import fetch from 'node-fetch';
import { addMonths, format } from 'date-fns';
import { utcToZonedTime } from 'date-fns-tz';
import { getSubscriptionByUserId } from './subscriptions';

const ITEM_PER_PAGE = 50;

const getFromAndTo = (page: number) => {
  let from = page * ITEM_PER_PAGE;
  let to = from + ITEM_PER_PAGE;
  if (page > 0) {
    from += 1;
  }

  return { from, to };
};

export const getArtsByUserid = async ({
  supabase,
  userId,
  page = 0
}: {
  supabase: SupabaseClient;
  userId: string;
  page: number;
}) => {
  const { from, to } = getFromAndTo(page);

  const response = await supabase
    .from('arts')
    .select('*', { count: 'exact' })
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .range(from, to);

  if (response.error) {
    throw response.error;
  }

  if (response.data.length === 0) {
    throw 'Arts Not Founded';
  }

  return { response, per_page: ITEM_PER_PAGE };
};

export const generateArt = async ({
  supabase,
  prompt,
  size,
  user
}: {
  supabase: SupabaseClient;
  prompt: string;
  size: any;
  user: any;
}) => {
  try {
    const { data } = await supabase.auth.getUser();

    let isSubscriped;
    let isSubscripedMontly;
    let isSubscripedYearly;

    const subscription = await getSubscriptionByUserId({
      supabase,
      userId: user.id
    });

    if (subscription) {
      isSubscriped =
        subscription.subscription_plan_id ==
          process.env.NEXT_PUBLIC_PADDLE_PLAN_PRO_MONTHLY_ID ||
        subscription.subscription_plan_id ==
          process.env.NEXT_PUBLIC_PADDLE_PLAN_PRO_YEARLY_ID;
      isSubscripedMontly =
        subscription.subscription_plan_id ==
        process.env.NEXT_PUBLIC_PADDLE_PLAN_PRO_MONTHLY_ID;
      isSubscripedYearly =
        subscription.subscription_plan_id ==
        process.env.NEXT_PUBLIC_PADDLE_PLAN_PRO_YEARLY_ID;
    }
    const limit = isSubscripedMontly ? 100 : isSubscripedYearly ? 1200 : 10;

    const userRegistrationDay = new Date(
      String(data.user?.created_at)
    ).getDate();

    const userRegistrationTime = new Date(String(data.user?.created_at));

    const zonedUserRegistrationTime = utcToZonedTime(
      userRegistrationTime,
      'UTC'
    );

    const currentDate = new Date();

    let startDate, endDate;
    if (!isSubscriped) {
      if (userRegistrationDay > currentDate.getDate()) {
        startDate =
          format(addMonths(currentDate, -1), 'yyyy-MM') +
          `-${userRegistrationDay}T${format(
            zonedUserRegistrationTime,
            'HH:mm:ss.SSS'
          )}Z`;
        endDate =
          format(currentDate, 'yyyy-MM') +
          `-${format(userRegistrationTime, 'dd')}T${format(
            zonedUserRegistrationTime,
            'HH:mm:ss.SSS'
          )}Z`;
      } else if (userRegistrationDay < currentDate.getDate()) {
        startDate =
          format(currentDate, 'yyyy-MM') +
          `-${format(userRegistrationTime, 'dd')}T${format(
            zonedUserRegistrationTime,
            'HH:mm:ss.SSS'
          )}Z`;
        endDate =
          format(addMonths(currentDate, 1), 'yyyy-MM') +
          `-${format(userRegistrationTime, 'dd')}T${format(
            zonedUserRegistrationTime,
            'HH:mm:ss.SSS'
          )}Z`;
      } else {
        startDate =
          format(currentDate, 'yyyy-MM') +
          `-${format(userRegistrationTime, 'dd')}T${format(
            zonedUserRegistrationTime,
            'HH:mm:ss.SSS'
          )}Z`;
        endDate =
          format(addMonths(currentDate, 1), 'yyyy-MM') +
          `-${format(userRegistrationTime, 'dd')}T${format(
            zonedUserRegistrationTime,
            'HH:mm:ss.SSS'
          )}Z`;
      }
    }

    const { count: monthlyArtsCount, error: monthlyArtsError } = await supabase
      .from('arts')
      .select('count', { count: 'exact' })
      .eq('user_id', data.user?.id)
      .gte('created_at', isSubscriped ? subscription?.created_at : startDate)
      .lte(
        'created_at',
        isSubscriped ? subscription?.next_bill_date + 'T00:00:00.00Z' : endDate
      );

    if (monthlyArtsCount) {
      if (monthlyArtsCount >= limit) {
        throw { limit_exceeded: 'Monthly generation limit exceeded' };
      }
    }

    const generateImagePromise = openai.images.generate({
      model: 'dall-e-3',
      prompt,
      n: 1,
      size
    });

    const response = await generateImagePromise;

    if (!response) {
      throw new Error(`OpenAI API error: ${response}`);
    }

    const imageUrl = response.data[0]?.url;

    if (!imageUrl) {
      throw new Error('Image URL not found in the response');
    }

    return imageUrl;
  } catch (error) {
    throw error;
  }
};

export const saveImage = async ({
  supabase,
  user,
  imageUrl,
  description
}: {
  supabase: SupabaseClient;
  user: any;
  imageUrl: string;
  description: string;
}) => {
  try {
    if (!imageUrl) {
      throw new Error('Image URL not found in the response');
    }

    const imageResponse = await fetch(imageUrl);
    const imageBuffer = await imageResponse.buffer();

    const { data: storageData, error: storageError } = await supabase.storage
      .from('images')
      .upload(`arts/${user.id}/${Date.now()}.jpg`, imageBuffer);

    if (storageError) {
      throw new Error(
        `Error uploading image to storage: ${storageError.message}`
      );
    }

    const path = storageData.path;
    const { error: upsertError } = await supabase.from('arts').upsert([
      {
        user_id: user.id,
        path: path,
        description: description
      }
    ]);

    if (upsertError) {
      throw new Error(
        `Error upserting image information: ${upsertError.message}`
      );
    }

    return path;
  } catch (error) {
    console.error('Error in saveImage:', error);
    throw error;
  }
};
