export const validateCNPJ = (inputCNPJ: string): boolean => {
  const cnpj = inputCNPJ.replace(/\D/g, ""); // Remove non-digits

  if (cnpj.length !== 14) return false;
  if (/^(\d)\1+$/.test(cnpj)) return false; // Checks for repeated numbers like 11111111111111

  // Calculate first digit
  const weights1 = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
  let sum = 0;
  for (let i = 0; i < 12; i++) {
    sum += parseInt(cnpj.charAt(i)) * weights1[i];
  }
  let remainder = sum % 11;
  let digit1 = remainder < 2 ? 0 : 11 - remainder;

  const weights2 = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
  sum = 0;
  for (let i = 0; i < 13; i++) {
    sum += parseInt(cnpj.charAt(i)) * weights2[i];
  }
  remainder = sum % 11;
  let digit2 = remainder < 2 ? 0 : 11 - remainder;

  return (
    digit1 === parseInt(cnpj.charAt(12)) && digit2 === parseInt(cnpj.charAt(13))
  );
};

export const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const formatCode = (value: any) => {
  const cleanInput = value?.replace(/\D/g, "") || "";

  if (cleanInput.length === 11) {
    return cleanInput.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
  } else if (cleanInput.length === 14) {
    return cleanInput.replace(
      /(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/,
      "$1.$2.$3/$4-$5"
    );
  } else {
    return null;
  }
};

export const formatTelephone = (telephone: any) => {
  const cleanInput = telephone?.replace(/\D/g, "") || "";

  if (cleanInput.length === 11) {
    return cleanInput.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3");
  } else if (cleanInput.length === 10) {
    return cleanInput.replace(/(\d{2})(\d{4})(\d{4})/, "($1) $2-$3");
  } else {
    return null;
  }
};

export const formatCNPJ = (cnpj: string) => {
  const cleanedCNPJ = cnpj.replace(/\D/g, ""); // Remove caracteres não numéricos

  if (cleanedCNPJ.length <= 2) return cleanedCNPJ; // Retorna os dois primeiros dígitos
  if (cleanedCNPJ.length <= 5) return cleanedCNPJ.replace(/(\d{2})(\d{1,3})/, "$1.$2");
  if (cleanedCNPJ.length <= 8) return cleanedCNPJ.replace(/(\d{2})(\d{3})(\d{1,3})/, "$1.$2.$3");
  if (cleanedCNPJ.length <= 12) return cleanedCNPJ.replace(/(\d{2})(\d{3})(\d{3})(\d{1,4})/, "$1.$2.$3/$4");

  return cleanedCNPJ.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{1,2})/, "$1.$2.$3/$4-$5");
};

export const formatCPF = (cpf: string) => {
  const cleanCPF = cpf.replace(/\D/g, "");

  if (cleanCPF.length <= 11) {
    return cleanCPF
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
  } else {
    return cleanCPF;
  }
};

export const isFullNameValid = (name: string) => {
  const trimmedName = name.trim();

  const nameParts = trimmedName.split(" ");

  const hasTwoOrMoreParts = nameParts.length >= 2;
  const allPartsHaveValidLength = nameParts.every(part => part.length >= 2);

  const allPartsAreAlphabetic = nameParts.every(part => /^[A-Za-zÀ-ÿ]+$/.test(part));

  return hasTwoOrMoreParts && allPartsHaveValidLength && allPartsAreAlphabetic;
};

export const isEmailValid = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};