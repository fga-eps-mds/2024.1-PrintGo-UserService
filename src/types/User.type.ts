import { Cargo } from './enum/Cargos.enum';

export type UserCreateInput= {
    nome: string;
    email: string;
    senha: string;
    documento: string;
    lotacao_id: string;
    cargos: Cargo[];
}

export type UserUpdateInput= {
    nome?: string;
    email?: string;
    senhaAntiga?: string;
    senhaNova?: string;
    documento?: string;
    lotacao_id?: string;
    cargos?: Cargo[];
}