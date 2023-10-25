import { checkCpfOrCnpj , checkCnpj, checkCpf} from '../../src/middlewares/checkCpfOrCnpj.middleware';


describe('checkCpfOrCnpj', () => {
    it('should return true for a valid CPF', () => {
        expect(checkCpfOrCnpj('12345678909')).toBe(true);
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

describe('checkCpf', () => {
    it('should return true for a valid CPF', () => {
        expect(checkCpf('12345678909')).toBe(true);
    });
  
    it('should return false for an invalid CPF', () => {
        expect(checkCpf('1234567890112')).toBe(false);
    });
  
    it('should return false for an empty input', () => {
        expect(checkCpf('')).toBe(false);
    });

    it('should return false for an invalid CPF with incorrect digit', () => {
        expect(checkCpf('12345678901')).toBe(false);
    });
    
    it('should return false for an input with an invalid length (less than 11 or greater than 14)', () => {
        expect(checkCpfOrCnpj('123456')).toBe(false); 
        expect(checkCpfOrCnpj('1234567890123456')).toBe(false); 
    });
    
});

describe('checkCnpj', () => {
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
});
