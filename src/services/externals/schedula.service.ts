import axios from 'axios';

export const api = axios.create({
    baseURL: process.env.APIGATEWAY_API_URL,
    timeout: 5000,
    headers: {
        'Content-Type': 'application/json',
    },
});

type WorkstationOutputType = {
    id: string;
    name: string;
    phone: string;
    ip: string;
    gateway: string
    is_regional: boolean;
    vpn: boolean;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    parent_workstation: any;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    child_workstations: any;
}

export const getWorkstations = async (id) => {
    try {
        const response = await api.get(`/schedular/workstations/${id}`);

        if(response.status !== 200) {
            return {error:true, message: 'Não foi possível encontrar Unidade no servico Schedula'};
        }
        return {error: false, data: response.data as WorkstationOutputType};
    } catch (error) {
        return {error:true, message: 'Erro: Unidade não encontrada no servico Schedula'};
    }
};