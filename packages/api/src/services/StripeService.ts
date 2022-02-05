import Stripe from 'stripe'

class StripeService {
    static stripe = new Stripe(
        'sk_test_51HkomQLTeDsRddXB9z6cxhSb2Zn0wyK6rJjcxkV6qvtelzEIPza6C35MGUFcC9usBojUQaHIQR8LV6rnC8sZuxGN00A7Z3cczp',
        {} as Stripe.StripeConfig
    )

    static async createSession() {
        const session = await StripeService.stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [
                {
                    price_data: {
                        currency: 'sek',
                        product_data: {
                            name: 'Mewi Premium',
                        },
                        unit_amount: 2000,
                    },
                    quantity: 1,
                },
            ],
            mode: 'payment',
            success_url: 'https://startup1.netlify.com/?status=success',
            cancel_url: 'https://startup1.netlify.com/?status=cancelled',
        })
        return session
    }

    static async fulfillOrder(intent: Stripe.PaymentIntent) {
        console.log('Fulfilling order for ' + intent.id)
    }

    static async handleEvent(event: Stripe.Event) {
        const intent: any = event.data.object
        switch (event.type) {
            case 'payment_intent.succeeded':
                await this.fulfillOrder(intent)
                break
            default:
                console.log(event.type)
        }
    }
}

export default StripeService
