import { Schema, Types, model, type InferSchemaType } from "mongoose";

const authAuditEventSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "UserAccount",
      required: false
    },
    eventType: {
      type: String,
      enum: [
        "sign_up_success",
        "sign_in_success",
        "sign_in_failure",
        "google_sign_in_success",
        "google_sign_in_failure",
        "session_revoked",
        "unauthorized_access_attempt"
      ],
      required: true
    },
    provider: {
      type: String,
      enum: ["credentials", "google", "system"],
      required: true
    },
    occurredAt: {
      type: Date,
      required: true,
      default: Date.now
    },
    ipAddress: {
      type: String,
      required: true
    },
    userAgent: {
      type: String,
      required: true
    },
    metadata: {
      type: Schema.Types.Mixed,
      required: false
    }
  },
  {
    collection: "auth_audit_events"
  }
);

export type AuthAuditEventDocument = InferSchemaType<
  typeof authAuditEventSchema
> & { _id: Types.ObjectId };
export const AuthAuditEventModel = model(
  "AuthAuditEvent",
  authAuditEventSchema
);
