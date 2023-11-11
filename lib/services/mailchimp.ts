import mailchimp from '@mailchimp/mailchimp_marketing';

mailchimp.setConfig({
  apiKey: process.env.MAILCHIMP_API_KEY,
  server: process.env.MAILCHIMP_SERVER_PREFIX
});

export async function subscribe(email: string) {
  const listId = process.env.MAILCHIMP_LIST_ID;
  const subscribingUser = {
    email: email
  };

  try {
    const response = await mailchimp.lists.addListMember(listId as string, {
      email_address: subscribingUser.email,
      status: 'subscribed',
      tags: ['newsletter']
    });
    return response;
  } catch (error) {
    return { error: error };
  }
}
