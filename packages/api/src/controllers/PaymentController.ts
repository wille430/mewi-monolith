import Stripe from "stripe"
import StripeService from "../services/StripeService"

const PaymentController = {
    createSession: async (req, res) => {
        const session = await StripeService.createSession()

        res.redirect(303, session.url)
    },
    webhook: async (req, res) => {

        const signature = req.headers["stripe-signature"] as string

        const endpointSecret = "whsec_..."

        let event: Stripe.Event

        try {
            event = StripeService.stripe.webhooks.constructEvent(req.body.rawBody, signature, endpointSecret)
        } catch (e) {
            res.status(400).end()
            return
        }

        try {
            await StripeService.handleEvent(event)
            res.status(200).end()
        } catch (e) {
            res.status(400).end()
            return
        }
    }
}

export default PaymentController