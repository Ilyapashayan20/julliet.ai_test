import wpapi from 'wpapi';
import { NextApiRequest, NextApiResponse } from 'next';
import { getIntegrationById } from '@/lib/services/integrations';
import { getDocumentById } from '@/lib/services/documents';
import { withTokenAuth } from '@/lib/utils/decorators';
import { SupabaseClient } from '@supabase/auth-helpers-nextjs';
import { getDataAsHtml } from '@/lib/utils/slate';

async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
  supabase: SupabaseClient
) {
  const { id, documentId } = req.query;

  const integration = await getIntegrationById({
    supabase,
    integrationId: id as string
  });

  const document = await getDocumentById({
    supabase,
    id: documentId as string
  });

  const wp = new wpapi({
    endpoint: integration.endpoint,
    username: integration.username,
    password: integration.password
  });

  const html = getDataAsHtml(document.data);
  try {
    const post = await wp.posts().create({
      title: document.title,
      content: html,
      status: 'publish'
    });
    res.status(200).json(post);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error });
  }
}

export default withTokenAuth(handler);
