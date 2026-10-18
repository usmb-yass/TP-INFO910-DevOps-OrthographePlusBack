import { Schema, model, Types } from "mongoose";
import Subscription from '#shared/types/Subscription';

const SubscriptionSchema = new Schema<Subscription<Types.ObjectId>>({
    userId: { type: Schema.Types.ObjectId, ref: "users", required: true },
    plan: { type: String, required: true },
    status: { type: String, required: true },
    startedAt: { type: Date, required: true },
    expiresAt: { type: Date, required: true },
    cancelAtPeriodEnd: { type: Boolean, required: true, default: false }
}, {
    timestamps: true
});

const SubscriptionModel = model<Subscription<Types.ObjectId>>("subscriptions", SubscriptionSchema);
export default SubscriptionModel;
