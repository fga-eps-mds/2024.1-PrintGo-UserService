import bcrypt from 'bcryptjs';

export const encryptPassword = (password: string): string  => {
    return bcrypt.hashSync(password, 10);
};