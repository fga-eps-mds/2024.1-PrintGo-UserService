import { Cargo } from './enum/Cargos.enum';

export type UserCreateInput= {
    nome: string;
    email: string;
    documento: string;
    lotacao_id: string;
    cargos: Cargo[];
}