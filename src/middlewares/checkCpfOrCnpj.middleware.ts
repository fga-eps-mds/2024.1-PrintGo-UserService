export const checkCpfOrCnpj = (documento: string): boolean => {

    if (documento.length !== 11 && documento.length !== 14) {
        return false;
    }
    return documento.length === 11 ? checkCpf(documento) : checkCnpj(documento);
};

export const checkCpf = (documento:string): boolean => {
    let soma = 0;
    for (let i = 0; i < 9; i++) {
        soma += parseInt(documento.charAt(i)) * (10 - i);
    }
    let digito1 = 11 - (soma % 11);

    if (digito1 > 9) {
        digito1 = 0;
    }

    // Verifique o primeiro dígito.
    if (digito1 !== parseInt(documento.charAt(9))) {
        return false;
    }

    // Cálculo do segundo dígito verificador.
    soma = 0;
    for (let i = 0; i < 10; i++) {
        soma += parseInt(documento.charAt(i)) * (11 - i);
    }
    let digito2 = 11 - (soma % 11);

    if (digito2 > 9) {
        digito2 = 0;
    }

    // Verifique o segundo dígito.
    if (digito2 !== parseInt(documento.charAt(10))) {
        return false;
    }

    // Verificação concluída.
    return true;
};

export const checkCnpj = (documento:string): boolean => {
    return documento ? false: true;
};