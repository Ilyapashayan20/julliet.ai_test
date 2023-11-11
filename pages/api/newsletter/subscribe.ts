import { NextApiRequest, NextApiResponse } from 'next';
import { subscribe } from '@/lib/services/mailchimp';
import { sendMessage } from '@/lib/services/slack';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (!(req.method === 'POST')) {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { email } = req.body;
  try {
    const response = await subscribe(email);
    if (response) {
      return res.status(400).json({
        error: 'ERROR_SUBSCRIBING_TO_NEWSLETTER',
        message: 'Error subscribing to newsletter'
      });
    }

    await sendMessage({
      channel: 'notifications',
      text: `New newsletter subscriber: ${email}`
    });

    res.status(200).json({ message: 'Success' });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Error' });
  }
};
