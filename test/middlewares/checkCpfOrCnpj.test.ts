import { checkCpfOrCnpj , checkCnpj, checkCpf} from '../../src/middlewares/checkCpfOrCnpj.middleware';


describe('checkCpfOrCnpj', () => {
    it('deve retornar verdadeiro para um CPF válido', () => {
        expect(checkCpfOrCnpj('12345678909')).toBe(true);
    });

    it('deve retornar falso para um CPF inválido', () => {
        expect(checkCpfOrCnpj('12345678901')).toBe(false);
    });

    it('deve retornar falso para um CNPJ inválido', () => {
        expect(checkCpfOrCnpj('12345678000122')).toBe(false);
    });

    it('deve retornar falso para uma entrada com comprimento incorreto', () => {
        expect(checkCpfOrCnpj('123456')).toBe(false);
    });
});

describe('checkCpf', () => {
    it('deve retornar verdadeiro para um CPF válido', () => {
        expect(checkCpf('12345678909')).toBe(true);
    });

    it('deve retornar falso para um CPF inválido', () => {
        expect(checkCpf('12345678901')).toBe(false);
    });

    it('deve retornar falso para uma entrada com comprimento incorreto', () => {
        expect(checkCpf('123456')).toBe(false);
    });
});

describe('checkCnpj', () => {
    it('deve retornar verdadeiro para um CNPJ válido', () => {
        expect(checkCnpj('12345678000123')).toBe(false);
    });

    it('deve retornar falso para um CNPJ inválido', () => {
        expect(checkCnpj('12345678000122')).toBe(false);
    });

    it('deve retornar falso para uma entrada com comprimento incorreto', () => {
        expect(checkCnpj('123456')).toBe(false);
    });
});
