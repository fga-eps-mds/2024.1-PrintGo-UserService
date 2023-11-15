export type UnidadeCreateInput = {
    nome: string;
    rua: string;
    logradouro: string;
    complemento: string;
    bairro: string;
    cidade: string;
    cep: string;
    numero: number;
    id_referencia_schedule: string;
}

export type UnidadeCreateOutput = {
    id: string;
    nome: string;
    rua: string;
    logradouro: string;
    complemento: string;
    bairro: string;
    cidade: string;
    cep: string;
    numero: number;
    id_referencia_schedule: string;
}