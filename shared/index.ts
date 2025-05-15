// Storage Functions
export { getOnStorage } from "./storageFunctions";
export { setOnStorage } from "./storageFunctions";
export { updateOnStorage } from "./storageFunctions";
export { removeFromStorage } from "./storageFunctions";
export { updateSpecificFieldInStorage } from "./storageFunctions";

// Packing Types
export { default as packingTypes } from "./packing";

// Format Currency
export { calcPrice } from "./calculatePrices";
export { formatCurrency } from "./formatCurrency";

// Form Validators
export { formatCode } from "./formValidator";
export { emailRegex } from "./formValidator";
export { formatTelephone } from "./formValidator";
export { formatCPF } from "./formValidator";
export { isFullNameValid } from "./formValidator";
export { isEmailValid } from "./formValidator";

// Format
export { validateCNPJ } from "./formValidator";
export { formatCNPJ } from "./formValidator";
export { cleanStr, arrToObj } from "./commonFunctions";

// Packing
export { default as PackingTypes } from "./packing";

// Payment terms
export { default as PaymentTypes } from './payments';

// Use Back Navigation
export { default as useBackNavigation } from "./useBackNavigation";