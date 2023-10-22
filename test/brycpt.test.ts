import bcrypt from 'bcryptjs';
import { encryptPassword } from '../src/adapters/bcrypt.adapter';

describe('encryptPassword', () => {
    it('deve retornar uma senha criptografada', () => {
        const password = 'password123';
        const hashedPassword = encryptPassword(password);

        // Verifique se a senha criptografada não é igual à senha original
        expect(hashedPassword).not.toBe(password);

        // Verifique se a senha criptografada pode ser verificada corretamente
        const isMatch = bcrypt.compareSync(password, hashedPassword);
        expect(isMatch).toBe(true);
    });
});
