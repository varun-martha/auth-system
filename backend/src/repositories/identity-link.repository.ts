import { IdentityLinkModel, type IdentityLinkDocument } from "@/models/identity-link.model.js";

export async function createIdentityLink(input: {
  userId: string;
  provider: "credentials" | "google";
  providerSubject?: string;
  providerEmail?: string;
}): Promise<IdentityLinkDocument> {
  const createdLink = await IdentityLinkModel.create({
    userId: input.userId,
    provider: input.provider,
    providerSubject: input.providerSubject,
    providerEmail: input.providerEmail
  });

  return createdLink.toObject() as IdentityLinkDocument;
}

export async function findIdentityLinkByProviderSubject(
  provider: "credentials" | "google",
  providerSubject: string
): Promise<IdentityLinkDocument | null> {
  return IdentityLinkModel.findOne({ provider, providerSubject })
    .lean<IdentityLinkDocument>()
    .exec();
}

export async function touchIdentityLink(linkId: string): Promise<void> {
  await IdentityLinkModel.findByIdAndUpdate(linkId, {
    lastUsedAt: new Date()
  }).exec();
}
