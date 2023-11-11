import { NextApiRequest, NextApiResponse } from 'next';
import { SupabaseClient } from '@supabase/supabase-js';
import { getPagination, paginate } from '@/lib/utils/pagination';
import {
  getSuggestionsByDocument,
  getChatSuggestionByPrompt,
  getChatSuggestionByPromptV2
} from '@/lib/services/suggestion';
import { getDocumentById } from '@/lib/services/documents';
import { withTokenAuth } from '@/lib/utils/decorators';

const handler = async (
  req: NextApiRequest,
  res: NextApiResponse,
  supabase: SupabaseClient,
  user: any
) => {
  switch (req.method) {
    case 'GET':
      return await getHandler(req, res, supabase, user);
    case 'POST':
      return await postHandler(req, res, supabase, user);
    default:
      return res
        .status(405)
        .json({ error: `Method ${req.method} Not Allowed` });
  }
};

const postHandler = async (
  req: NextApiRequest,
  res: NextApiResponse,
  supabase: SupabaseClient,
  user: any
) => {
  let {
    data: { session: session },
    error
  } = await supabase.auth.getSession();

  if (!session?.user || error) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const { tabId } = req.body;
  if (!tabId) {
    return res.status(400).json({ error: 'Missing tabId' });
  }

  try {
    const suggestion = await getChatSuggestionByPromptV2({
      supabase,
      userId: session.user.id,
      tabId: tabId as string
    });

    res.status(200).json(suggestion);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: error });
  }
};

const getHandler = async (
  req: NextApiRequest,
  res: NextApiResponse,
  supabase: SupabaseClient,
  user: any
) => {
  const { id } = req.query;
  const { pageSize, page, query } = getPagination(req);

  try {
    const document = await getDocumentById({ supabase, id: id as string });
    const suggestions = await getSuggestionsByDocument({
      supabase: supabase,
      documentId: document.id as string,
      pageSize,
      page,
      query,
      ascending: false,
      sortBy: 'created_at'
    });

    res.status(200).json(paginate(suggestions, page, pageSize));
  } catch (error) {
    if (error === 'DocumentNotFound') {
      res.status(404).json({ error: `Document with id ${id} not found` });
      return;
    }

    if (error === 'SuggestionsNotFound') {
      res
        .status(404)
        .json({ error: `Suggestions for document with id ${id} not found` });
      return;
    }

    res.status(500).json({ error: error });
    return;
  }
};

export default withTokenAuth(handler);
