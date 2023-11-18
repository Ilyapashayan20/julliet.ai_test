import { NextApiRequest, NextApiResponse } from 'next';
import { SupabaseClient } from '@supabase/supabase-js'; // Import the correct Supabase client library
import fetch from 'node-fetch';

import { withTokenAuth } from '@/lib/utils/decorators';
import { generateArt, getArtsByUserid, saveImage } from '@/lib/services/art';

const handler = async (
  req: NextApiRequest,
  res: NextApiResponse,
  supabase: SupabaseClient,
  user: any
) => {
  switch (req.method) {
    case 'GET':
      return await getImagesHandler(req, res, supabase, user);
    case 'POST':
      return await createArtHandler(req, res, supabase, user);
    default:
      return res
        .status(405)
        .json({ error: `Method ${req.method} Not Allowed` });
  }
};

const getImagesHandler = async (
  req: NextApiRequest,
  res: NextApiResponse,
  supabase: SupabaseClient,
  user: any
) => {
  try {
    const arts = await getArtsByUserid({
      supabase,
      userId: user.id,
      page: Number(req.query.page)
    });
    res.status(200).json(arts);
  } catch (error) {
    console.error('Error in getImagesHandler:', error);
    res.status(500).json({ error: error });
  }
};

const createArtHandler = async (
  req: NextApiRequest,
  res: NextApiResponse,
  supabase: SupabaseClient,
  user: any
) => {
  try {
    const payload = req.body.payload;

    if (!payload || !payload.prompt) {
      res.status(400).send({ message: 'Missing payload or prompt' });
      return;
    }

    const imageUrl = await generateArt({
      supabase,
      user,
      prompt: payload.prompt,
      size: payload.size
    });

    const path = await saveImage({
      supabase,
      user,
      imageUrl,
      description: payload.prompt
    });

    res.status(200).json(path);
  } catch (error: any) {
    console.error('Error in createImageHandler:', error);
    if (error.limit_exceeded) {
      res
        .status(422)
        .json({ message: error.message });
    } else {
      res.status(500).json({ error: error.message });
    }
  }
};

export default withTokenAuth(handler);
