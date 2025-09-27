/**
 * Função para validar o formato de um CPF.
 * @param {string} cpf - O número de CPF a ser validado (pode conter ou não pontuação).
 * @returns {boolean} Retorna true se o CPF for válido e false caso contrário.
 */
export function validarCPF(cpf: string): boolean {
  // 1. Limpa o CPF, removendo pontuação e espaços.
  const cpfLimpo = cpf.replace(/[^\d]/g, '');

  // 2. Verifica se o CPF tem 11 dígitos.
  if (cpfLimpo.length !== 11) {
    return false;
  }

  // 3. Impede sequências de números iguais, como '111.111.111-11'.
  if (/^(\d)\1{10}$/.test(cpfLimpo)) {
    return false;
  }

  let soma = 0;
  let resto;

  // 4. Valida o primeiro dígito verificador.
  for (let i = 1; i <= 9; i++) {
    soma = soma + parseInt(cpfLimpo.substring(i - 1, i)) * (11 - i);
  }

  resto = (soma * 10) % 11;
  if ((resto === 10) || (resto === 11)) {
    resto = 0;
  }

  if (resto !== parseInt(cpfLimpo.substring(9, 10))) {
    return false;
  }

  soma = 0;

  // 5. Valida o segundo dígito verificador.
  for (let i = 1; i <= 10; i++) {
    soma = soma + parseInt(cpfLimpo.substring(i - 1, i)) * (12 - i);
  }

  resto = (soma * 10) % 11;
  if ((resto === 10) || (resto === 11)) {
    resto = 0;
  }

  if (resto !== parseInt(cpfLimpo.substring(10, 11))) {
    return false;
  }

  // 6. Se todas as verificações passarem, o CPF é válido.
  return true;
}