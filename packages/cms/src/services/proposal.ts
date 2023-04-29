import Api from '.';

interface ListProposal {
    page: number,
    perPage: number,
    search: string,
}

export const ListProposal = async (model: ListProposal) => {
    const { data } = await Api.post('/proposal/list', model);
    return data;
};

export const GetProposal = async (id: number) => {
    const { data } = await Api.get(`/proposal/list/${id}`);
    return data;
};

export const CreateProposal = async (model: any) => {
    const { data } = await Api.post('/proposal/create', model);
    return data;
};

export const UpdateProposal = async (model: any) => {
    const { data } = await Api.put('/proposal/update', model);
    return data;
};

export const DeleteProposal = async (id: any) => {
    const { data } = await Api.put(`/proposal/delete`, id);
    return data;
};