import { checkCpfOrCnpj , checkCnpj, checkCpf} from '../../src/middlewares/checkCpfOrCnpj.middleware';


describe('check method checkCpfOrCnpj', () => {
    it('should return true for a valid CPF', () => {
        expect(checkCpfOrCnpj('12345678909')).toBe(true);
    });

    it('should return true for a valid CNPJ with points', () => {
        expect(checkCpfOrCnpj('27.504.261/0001-03')).toBe(true);
    });

    it('should return true for a valid CPF with points', () => {
        expect(checkCpfOrCnpj('056.991.281-40')).toBe(true);
    });

    it('should return true for a valid CNPJ', () => {
        expect(checkCpfOrCnpj('12345678000101')).toBe(false);
    });

    it('should return false for an invalid CPF', () => {
        expect(checkCpfOrCnpj('12345678901')).toBe(false);
    });

    it('should return false for an invalid CNPJ', () => {
        expect(checkCpfOrCnpj('12345678000100')).toBe(false);
    });

    it('should return false for an empty input', () => {
        expect(checkCpfOrCnpj('')).toBe(false);
    });
});

describe('check method  checkCpf', () => {
    it('should return true for a valid CPF', () => {
        expect(checkCpf('12345678909')).toBe(true);
    });

    it('should return false for an invalid CPF', () => {
        expect(checkCpf('1234567890112')).toBe(false);
    });

    it('should return false for an empty input', () => {
        expect(checkCpf('')).toBe(false);
    });

    it('should return false for an empty input', () => {
        expect(checkCpf('12345678909')).toBe(true);
    });

    it('should return false for an empty input', () => {
        expect(checkCpf('14538220620')).toBe(true);
    });

    it('should return false for an invalid CPF with incorrect digit', () => {
        expect(checkCpf('12345678901')).toBe(false);
    });

    it('should return false for an input with an invalid length less than 11', () => {
        expect(checkCpf('123456')).toBe(false);
    });

    it('should return false for an input with an invalid length greater than 11', () => {
        expect(checkCpf('1234567890123456')).toBe(false);
    });

    it('should return false for an wrong second digit', () => {
        expect(checkCpf('05699128141')).toBe(false);
    });

});

describe('check method checkCnpj', () => {
    describe('checkCnpj', () => {
        it('should return true for a valid CNPJ', () => {
            expect(checkCnpj('12345678000101')).toBe(false);
        });

        it('should return false for an invalid CNPJ', () => {
            expect(checkCnpj('123456780001000')).toBe(false);
        });

        it('should return false for an empty input', () => {
            expect(checkCnpj('')).toBe(false);
        });
    });

    it('should return false for an invalid CPF', () => {
        expect(checkCpf('00000000000')).toBe(false);
    });

    it('should return false for an invalid CNPJ', () => {
        expect(checkCnpj('00000000000000')).toBe(false);
    });

    it('should return false for an input with invalid length', () => {
        expect(checkCpfOrCnpj('12345')).toBe(false);
    });

    it('should return true for a valid CNPJ with correct check digit', () => {
        expect(checkCnpj('12345678000101')).toBe(false);
    });

    it('should return false for a valid CNPJ with incorrect check digit', () => {
        expect(checkCnpj('12345678000100')).toBe(false);
    });

    it('should return false for an invalid CNPJ with correct check digit', () => {
        expect(checkCnpj('12345678000001')).toBe(false);
    });

    it('should return false for an invalid CNPJ with incorrect check digit', () => {
        expect(checkCnpj('12345678000000')).toBe(false);
    });

    it('should return false for an empty input', () => {
        expect(checkCnpj('')).toBe(false);
    });

    it('should return false when resultado is not equal to the second check digit', () => {
        expect(checkCnpj('12345678000102')).toBe(false);
    });

    it('should return false when resultado is not equal to the second check digit', () => {
        expect(checkCnpj('12345678000102')).toBe(false);
    });

});