import {withTokenAuth} from '@/lib/utils/decorators';
import {getSimpleSuggestionV2} from '@/lib/services/suggestion';
import {NextApiRequest, NextApiResponse} from 'next';
import {SupabaseClient} from '@supabase/supabase-js';

async function handler(
    req: NextApiRequest,
    res: NextApiResponse,
    supabase: SupabaseClient,
    user: any
) {
    if (req.method !== 'POST') {
        res.status(405).send('Method not allowed');
        return;
    }

    const {prompt} =
        req.body;

    const suggestion = await getSimpleSuggestionV2({
        supabase: supabase,
        prompt: prompt,
        userId: user.id,
    });

    res.status(200).json(suggestion);
}

export default withTokenAuth(handler);
