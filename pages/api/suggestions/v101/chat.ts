import {withTokenAuth} from '@/lib/utils/decorators';
import {getChatSuggestionByPayload, getSimpleSuggestionV2} from '@/lib/services/suggestion';
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

    const payload =
        req.body;

    if (!payload) {
        res.status(400).send({message: 'Missing payload'});
        return;
    }

    const suggestion = await getChatSuggestionByPayload({
        supabase: supabase,
        userId: user.id,
        payload: payload
    });

    res.status(200).json(suggestion);
}

export default withTokenAuth(handler);
