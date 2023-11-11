import {NextApiRequest, NextApiResponse} from 'next';
import {verifyPaddleWebhook} from 'verify-paddle-webhook';
import {
    createServerSupabaseClient,
    SupabaseClient
} from '@supabase/auth-helpers-nextjs';
import {getUserByEmail} from '@/lib/services/users';
import {sendMessage} from '@/lib/services/slack';

// @ts-ignore
const PUBLIC_KEY = new Buffer.from(
    process.env.PADDLE_PUBLIC_KEY as string,
    'base64'
).toString('ascii');

function isValid(data: any) {
    return verifyPaddleWebhook(PUBLIC_KEY, data);
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (!req.body) return res.status(400).json({error: 'No request body'});
    const supabase = createServerSupabaseClient({req, res}) as SupabaseClient;

    if (req.body.alert_name === 'subscription_created') {
        if (!isValid(req.body)) {
            return res.status(400).json({error: 'Invalid request'});
        }

        const {data, error} = await createPaddleSubscriptionCreated(
            supabase,
            req.body
        );
        if (error) {
            console.log('error', error);
            return res.status(400).json({error: 'Invalid request'});
        }
        console.log('subscription_created', req.body);
        res.status(200).json({success: true});
    }

    if (req.body.alert_name === 'subscription_payment_succeeded') {
        console.log('subscription_payment_succeeded', req.body);
        if (!isValid(req.body)) {
            return res.status(400).json({error: 'Invalid request'});
        }

        const {data, error} = await createPaddleSubscriptionSuccess(
            supabase,
            req.body
        );

        if (error) {
            console.log('error', error);
            return res.status(400).json({error: 'Invalid request'});
        }

        console.log('subscription_payment_succeeded', req.body);
        res.status(200).json({success: true});
    }

    if (req.body.alert_name === 'subscription_updated') {
        if (!isValid(req.body)) {
            return res.status(400).json({error: 'Invalid request'});
        }

        const {data, error} = await createPaddleSubscriptionUpdated(
            supabase,
            req.body
        );
        if (error) {
            console.log('error', error);
            return res.status(400).json({error: 'Invalid request'});
        }
        console.log('subscription_updated', req.body);
        res.status(200).json({success: true});
    }

    if (req.body.alert_name === 'subscription_cancelled') {
        if (!isValid(req.body)) {
            return res.status(400).json({error: 'Invalid request'});
        }

        const {data, error} = await createPaddleSubscriptionCancelled(
            supabase,
            req.body
        );
        if (error) {
            console.log('error', error);
            return res.status(400).json({error: 'Invalid request'});
        }
        console.log('subscription_cancelled', req.body);
        res.status(200).json({success: true});
    }
}

async function createPaddleSubscriptionSuccess(
    supabase: SupabaseClient,
    hook: any
) {
    const {data, error} = await supabase
        .from('subscriptions')
        .update({
            subscription_id: hook.subscription_id,
            status: hook.status,
            email: hook.email,
            paddle_user_id: hook.user_id,
            marketing_consent: hook.marketing_consent,
            update_url: hook.update_url,
            cancel_url: hook.cancel_url,
            subscription_plan_id: hook.subscription_plan_id,
            next_bill_date: hook.next_bill_date,
            passthrough: hook.passthrough,
            currency: hook.currency,
            checkout_id: hook.checkout_id,
            source: hook.source,
            linked_subscriptions: hook.linked_subscriptions,
            custom_data: hook.custom_data,
            quantity: hook.quantity,
            unit_price: hook.unit_price,
            country: hook.country,
            earnings: hook.earnings,
            plan_name: hook.plan_name,
            fee: hook.fee,
            sale_gross: hook.sale_gross,
            coupon: hook.coupon,
            receipt_url: hook.receipt_url,
            instalments: hook.instalments,
            next_payment_amount: hook.next_payment_amount,
            balance_gross: hook.balance_gross,
            balance_fee: hook.balance_fee,
            balance_earnings: hook.balance_earnings,
            balance_currency: hook.balance_currency,
            event_time: hook.event_time
        })
        .eq('subscription_id', hook.subscription_id);


    await sendMessage({
        channel: '#subscriptions',
        text: `Congratulations! ${hook.email} has subscribed to ${hook.plan_name}! :tada:`
    });

    return {data, error};
}

async function createPaddleSubscriptionCreated(
    supabase: SupabaseClient,
    hook: any
) {
    //parse the passthrough
    const passthrough = JSON.parse(hook.passthrough);
    let user_id = passthrough.user_id;

    if (!user_id) {
        const user = await getUserByEmail({
            supabase,
            email: hook.email
        });
        user_id = user?.id;
    }

    const {data, error} = await supabase.from('subscriptions').upsert(
        {
            subscription_id: hook.subscription_id,
            status: hook.status,
            email: hook.email,
            paddle_user_id: hook.user_id,
            user_id: passthrough.user_id,
            marketing_consent: hook.marketing_consent,
            update_url: hook.update_url,
            cancel_url: hook.cancel_url,
            subscription_plan_id: hook.subscription_plan_id,
            next_bill_date: hook.next_bill_date,
            passthrough: hook.passthrough,
            currency: hook.currency,
            checkout_id: hook.checkout_id,
            source: hook.source,
            linked_subscriptions: hook.linked_subscriptions,
            custom_data: hook.custom_data,
            quantity: hook.quantity,
            unit_price: hook.unit_price
        },
        {onConflict: 'subscription_id'}
    );

    return {data, error};
}

async function createPaddleSubscriptionUpdated(
    supabase: SupabaseClient,
    hook: any
) {
    const {data, error} = await supabase
        .from('subscriptions')
        .update({
            subscription_id: hook.subscription_id,
            status: hook.status,
            email: hook.email,
            paddle_user_id: hook.user_id,
            marketing_consent: hook.marketing_consent,
            update_url: hook.update_url,
            cancel_url: hook.cancel_url,
            subscription_plan_id: hook.subscription_plan_id,
            next_bill_date: hook.next_bill_date,
            passthrough: hook.passthrough,
            currency: hook.currency,
            checkout_id: hook.checkout_id,
            source: hook.source,
            linked_subscriptions: hook.linked_subscriptions,
            custom_data: hook.custom_data,
            quantity: hook.quantity,
            unit_price: hook.unit_price,
            country: hook.country,
            earnings: hook.earnings,
            plan_name: hook.plan_name,
            fee: hook.fee,
            sale_gross: hook.sale_gross,
            coupon: hook.coupon,
            receipt_url: hook.receipt_url,
            instalments: hook.instalments,
            next_payment_amount: hook.next_payment_amount,
            balance_gross: hook.balance_gross,
            balance_fee: hook.balance_fee,
            balance_earnings: hook.balance_earnings,
            balance_currency: hook.balance_currency,
            event_time: hook.event_time
        })
        .eq('subscription_id', hook.subscription_id);
    return {data, error};
}

async function createPaddleSubscriptionCancelled(
    supabase: SupabaseClient,
    hook: any
) {
    const {data, error} = await supabase
        .from('subscriptions')
        .update({
            subscription_id: hook.subscription_id,
            status: hook.status,
            email: hook.email,
            paddle_user_id: hook.user_id,
            marketing_consent: hook.marketing_consent,
            update_url: hook.update_url,
            cancel_url: hook.cancel_url,
            subscription_plan_id: hook.subscription_plan_id,
            next_bill_date: hook.next_bill_date,
            passthrough: hook.passthrough,
            currency: hook.currency,
            checkout_id: hook.checkout_id,
            source: hook.source,
            linked_subscriptions: hook.linked_subscriptions,
            custom_data: hook.custom_data,
            quantity: hook.quantity,
            unit_price: hook.unit_price,
            country: hook.country,
            earnings: hook.earnings,
            plan_name: hook.plan_name,
            fee: hook.fee,
            sale_gross: hook.sale_gross,
            coupon: hook.coupon,
            receipt_url: hook.receipt_url,
            instalments: hook.instalments,
            next_payment_amount: hook.next_payment_amount,
            balance_gross: hook.balance_gross,
            balance_fee: hook.balance_fee,
            balance_earnings: hook.balance_earnings,
            balance_currency: hook.balance_currency,
            event_time: hook.event_time
        })
        .eq('subscription_id', hook.subscription_id);


    await sendMessage({
        channel: '#subscriptions',
        text: `Oh no! ${hook.email} has cancelled their subscription to ${hook.plan_name}! :sob:`
    });

    return {data, error};
}
