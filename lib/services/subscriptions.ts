import {ISubscription} from '@/types';
import {SupabaseClient} from '@supabase/supabase-js';

export async function getSubscriptionByUserId({
    supabase,
    userId
}: {
    supabase: SupabaseClient;
    userId: string;
}): Promise<ISubscription | null> {
    const {data, error} = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', userId)
        .eq('status', 'active')
        .order('id', {ascending: false});

    if (error) {
        throw error;
    }

    if (!data || data.length === 0) {
        return null;
    }

    return data[0];
}
