export const validarCpf = (cpf: string): boolean => {

    if (cpf.length !== 11) {
        return false;
    }

    // Cálculo do primeiro dígito verificador.
    let soma = 0;
    for (let i = 0; i < 9; i++) {
        soma += parseInt(cpf.charAt(i)) * (10 - i);
    }
    let digito1 = 11 - (soma % 11);

    if (digito1 > 9) {
        digito1 = 0;
    }

    // Verifique o primeiro dígito.
    if (digito1 !== parseInt(cpf.charAt(9))) {
        return false;
    }

    // Cálculo do segundo dígito verificador.
    soma = 0;
    for (let i = 0; i < 10; i++) {
        soma += parseInt(cpf.charAt(i)) * (11 - i)
    }
    let digito2 = 11 - (soma % 11);

    if (digito2 > 9) {
        digito2 = 0;
    }

    // Verifique o segundo dígito.
    if (digito2 !== parseInt(cpf.charAt(10))) {
        return false;
    }

    // Verificação concluída.
    return true;
}