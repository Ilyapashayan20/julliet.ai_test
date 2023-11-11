import { acceptSuggestion } from '@/lib/services/suggestion';
import { SupabaseClient } from '@supabase/supabase-js';
import {NextApiRequest, NextApiResponse} from 'next';


export default async function handler(req:NextApiRequest, res:NextApiResponse,  supabase: SupabaseClient,) {
    if (req.method !== 'POST') {
      return res.status(405).end(); 
    }
  
    const { suggestionId } = req.body;
  
    try {
      const result = await acceptSuggestion({ supabase, suggestionId });
  
      return res.status(200).json(result);
    } catch (error) {
      console.error('Error accepting suggestion:', error);
      return res.status(500).end(); 
    }
  }
  