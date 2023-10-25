export const checkCpfOrCnpj = (documento: string): boolean => {

    if (documento.length !== 11 && documento.length !== 14) {
        return false;
    }

    return documento.length === 11 ? checkCpf(documento) : checkCnpj(documento);
};

const checkCpf = (documento:string): boolean => {
    documento = documento.replace(/[^\d]+/g, '');

    if (documento ===    '00000000000'
        || documento === '11111111111'
        || documento === '22222222222'
        || documento === '33333333333'
        || documento === '44444444444'
        || documento === '55555555555'
        || documento === '66666666666'
        || documento === '77777777777'
        || documento === '88888888888'
        || documento === '99999999999')
        return false;

    let soma = 0;
    for (let i = 0; i < 9; i++) {
        soma += parseInt(documento.charAt(i)) * (10 - i);
    }
    let digito1 = 11 - (soma % 11);

    if (digito1 > 9) {
        digito1 = 0;
    }

    if (digito1 !== parseInt(documento.charAt(9))) {
        return false;
    }

    soma = 0;
    for (let i = 0; i < 10; i++) {
        soma += parseInt(documento.charAt(i)) * (11 - i);
    }
    let digito2 = 11 - (soma % 11);

    if (digito2 > 9) {
        digito2 = 0;
    }

    if (digito2 !== parseInt(documento.charAt(10))) {
        return false;
    }

    return true;
};

const checkCnpj = (documento:string): boolean => {
    const cnpj = documento.replace(/[^\d]+/g, '');

    if (cnpj === '') return false;
    if (cnpj.length !== 14) return false;
    if (cnpj === '00000000000000'
        || cnpj === '11111111111111'
        || cnpj === '22222222222222'
        || cnpj === '33333333333333'
        || cnpj === '44444444444444'
        || cnpj === '55555555555555'
        || cnpj === '66666666666666'
        || cnpj === '77777777777777'
        || cnpj === '88888888888888'
        || cnpj === '99999999999999') return false;

    // Valida DVs
    let tamanho = cnpj.length - 2;
    let numeros = cnpj.substring(0, tamanho);
    const digitos = cnpj.substring(tamanho);
    let soma = 0;
    let pos = tamanho - 7;

    for (let i = tamanho; i >= 1; i--) {
        soma += parseInt(numeros.charAt(tamanho - i)) * pos--;
        if (pos < 2) pos = 9;
    }

    let resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;

    if (resultado !== parseInt(digitos.charAt(0))) return false;

    tamanho = tamanho + 1;
    numeros = cnpj.substring(0, tamanho);
    soma = 0;
    pos = tamanho - 7;
    for (let i = tamanho; i >= 1; i--) {
        soma += parseInt(numeros.charAt(tamanho - i)) * pos--;
        if (pos < 2) pos = 9;
    }

    resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;

    if (resultado !== parseInt(digitos.charAt(1))) return false;

    return true;
};