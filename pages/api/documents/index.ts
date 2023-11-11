import { NextApiRequest, NextApiResponse } from 'next';
import { paginate, getPagination } from '@/lib/utils/pagination';
import { SupabaseClient } from '@supabase/auth-helpers-nextjs';
import { getDocumentsByUser } from '@/lib/services';

import { withTokenAuth } from '@/lib/utils/decorators';
import { IDocument } from '@/types';
import { createDocument } from '@/lib/services/documents';
import { sendMessage } from '@/lib/services/slack';

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

const getHandler = async (
  req: NextApiRequest,
  res: NextApiResponse,
  supabase: SupabaseClient,
  user: any
) => {
  const { pageSize, page, query } = getPagination(req);

  const documents = await getDocumentsByUser({
    supabase,
    userId: user.id,
    query,
    pageSize,
    page
  });

  const paginatedDocuments = paginate(documents, pageSize, page);

  res.status(200).json(paginatedDocuments);
};

const postHandler = async (
  req: NextApiRequest,
  res: NextApiResponse,
  supabase: SupabaseClient,
  user: any
) => {
  const data = req.body;

  const [document] = await createDocument({
    supabase,
    user_id: user.id,
    document: data.document as IDocument
  });

  await sendMessage({
    channel: '#notifications',
    text: `*Nuevo Documento Creado*\n*Email:* ${user.email}\n*Plantilla*: ${document.type}\n*Titulo*: ${document.title}\n*Generation Mode*: ${document.generation_mode}\n*Contexto*: ${document.context}`
  });

  res.status(200).json(document);
};

export default withTokenAuth(handler);
