import { Response } from 'express';
import { UserCreateOutput } from './User.type';
import { LotacaoCreateOutput } from './Lotacao.type';

export type ResponseDefault = Response & {
    error?: boolean;
    message?: string;
};

export type ResponseCreateUser = ResponseDefault & {
    data?: UserCreateOutput
}

export type ResponseCreateLotacao = ResponseDefault & {
    data?: LotacaoCreateOutput
}

export type ResponseListLotacoes = ResponseDefault & {
    data?: LotacaoCreateOutput[]
}

