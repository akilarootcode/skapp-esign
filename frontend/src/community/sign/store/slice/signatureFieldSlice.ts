import { SetType } from "~community/common/types/CommonTypes";
import { SignatureFieldData } from "~community/sign/types/ESignFormTypes";
import { SignatureFieldSliceType } from "~community/sign/types/SliceTypes";

export const signatureFieldSlice = (set: SetType<SignatureFieldSliceType>) => ({
  signatureFields: [],
  signatureIdCounter: 0,
  currentField: null,
  signatureLink: null,
  setSignatureLink: (signatureLink: string | null) => set({ signatureLink }),
  setSignatureFields: (fields: SignatureFieldData[]) =>
    set({ signatureFields: fields }),
  addSignatureField: (field: SignatureFieldData) =>
    set((state) => ({ signatureFields: [...state.signatureFields, field] })),
  removeSignatureField: (fieldId: number) =>
    set((state) => ({
      signatureFields: state.signatureFields.filter(
        (field) => field.id !== fieldId
      )
    })),
  incrementSignatureIdCounter: () =>
    set((state) => ({ signatureIdCounter: state.signatureIdCounter + 1 })),
  resetSignatureFields: () =>
    set({ signatureFields: [], signatureIdCounter: 0 }),
  updateSignatureField: (id: number, updates: Partial<SignatureFieldData>) =>
    set((state) => ({
      signatureFields: state.signatureFields.map((field) =>
        field.id === id ? { ...field, ...updates } : field
      )
    })),
  setCurrentField: (field: SignatureFieldData | null) =>
    set({ currentField: field })
});
