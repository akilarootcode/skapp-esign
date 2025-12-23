import { create } from "zustand";
import { devtools } from "zustand/middleware";

import { createContactSlice } from "~community/sign/store/slice/createContactSlice";
import { SignStore } from "~community/sign/types/ESignStoreTypes";

import { completeSigningFlow } from "./slice/completeSignSlice";
import { createDocumentSlice } from "./slice/createDocumentSlice";
import { eSignConfigSlice } from "./slice/eSignConfigSlice";
import { envelopeInboxSlice } from "./slice/envelopeInboxSlice";
import { envelopeLimitSlice } from "./slice/envelopeLimitSlice";
import { envelopeSentSlice } from "./slice/envelopeSentSlice";
import { reminderSlice } from "./slice/reminderSlice";
import { signatureFieldSlice } from "./slice/signatureFieldSlice";

export const useESignStore = create<
  SignStore,
  [["zustand/devtools", never], ["zustand/persist", SignStore]]
>(
  devtools(
    (set) => ({
      ...createDocumentSlice(set),
      ...signatureFieldSlice(set),
      ...createContactSlice(set),
      ...reminderSlice(set),
      ...eSignConfigSlice(set),
      ...completeSigningFlow(set),
      ...envelopeInboxSlice(set),
      ...envelopeSentSlice(set),
      ...envelopeLimitSlice(set)
    }),
    { name: "eSignStore" }
  )
);
