export type LotacaoCreateInput = {
    nome: string;
    rua: string;
    logradouro: string;
    complemento: string;
    bairro: string;
    cidade: string;
    cep: string;
    numero: number;
}

export type LotacaoCreateOutput = {
    id: string;
    nome: string;
    rua: string;
    logradouro: string;
    complemento: string;
    bairro: string;
    cidade: string;
    cep: string;
    numero: number;
}