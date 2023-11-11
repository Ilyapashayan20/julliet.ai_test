import {
    createBrowserSupabaseClient,
    SupabaseClient
} from '@supabase/auth-helpers-nextjs';
import type {Database} from 'types_db';
import {getSubscriptionByUserId} from './subscriptions';

export const supabase = createBrowserSupabaseClient<Database>();

export const updateUserName = async (
    userId: string,
    name: string,
    referral_source: string
) => {
    await supabase
        .from('users')
        .update({
            full_name: name,
            referral_source: referral_source
        })
        .eq('id', userId);
};

export const getUserWordCount = async ({
    supabase,
    userId
}: {
    supabase: SupabaseClient;
    userId: string;
}): Promise<number> => {
    const {data, error} = await supabase.rpc('get_user_word_count', {
        my_id: userId
    });

    if (error) {
        throw error;
    }

    return Number(data) || 0;
};

export const getUserAvailableWordCount = async ({
    supabase,
    userId
}: {
    supabase: SupabaseClient;
    userId: string;
}) => {
    const subscription = await getSubscriptionByUserId({supabase, userId});
    if (subscription) {
        const unlimited =
            subscription.subscription_plan_id ===
            process.env.NEXT_PUBLIC_PADDLE_PLAN_PRO_MONTHLY_ID ||
            subscription.subscription_plan_id ===
            process.env.NEXT_PUBLIC_PADDLE_PLAN_PRO_YEARLY_ID;

        if (unlimited) {
            return 99999999
        }

    }

    let monthlyWordCount = await getUserWordCount({supabase, userId});
    let TOTAL_WORD_COUNT = 2000;
    return TOTAL_WORD_COUNT - monthlyWordCount;
};

export async function getUserDetailByUserId({
    supabase,
    userId
}: {
    supabase: SupabaseClient;
    userId: string;
}) {
    const {data, error} = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();

    if (error) {
        return null;
    }

    return data;
}

export async function setTutorialSeen({
    supabase,
    userId
}: {
    supabase: SupabaseClient;
    userId: string;
}) {
    const {data, error} = await supabase
        .from('users')
        .update({
            is_tutorial_seen: true
        })
        .eq('id', userId);

    if (error) {
        return null;
    }

    return data;
}

export async function getUserByEmail({
    supabase,
    email
}: {
    supabase: SupabaseClient;
    email: string;
}) {
    const {data, error} = await supabase
        .from('users')
        .select('*')
        .eq('email', email)
        .single();

    if (error) {
        return null;
    }

    return data;
}


export type saveUserOnboardingPayload = {
    userId: string;
    role: string;
    howHeFoundUs: string;
}

export async function saveUserOnboarding(
    {
        supabase,
        payload
    }: {
        supabase: SupabaseClient;
        payload: saveUserOnboardingPayload;
    },
) {
    const {data, error} = await supabase
        .from('users')
        .update({
            role: payload.role,
            how_he_found_us: payload.howHeFoundUs,
            is_onboarded: true
        })
        .eq('id', payload.userId);

    if (error) {
        return null;
    }

    return data;
}
