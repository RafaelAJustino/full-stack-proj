import Api from '.';

interface ListAccessProfile {
    page: number,
    perPage: number,
    search: string,
}

export const CountAccessProfile = async () => {
    const { data } = await Api.get('/access-profile/count');
    return data;
};

export const ListAllAccessProfile = async () => {
    const { data } = await Api.get('/access-profile/list-all');
    return data;
};

export const ListAccessProfile = async (model: ListAccessProfile) => {
    const { data } = await Api.post('/access-profile/list', model);
    return data;
};

export const GetAccessProfile = async (id: number) => {
    const { data } = await Api.get(`/access-profile/list/${id}`);
    return data;
};

export const CreateAccessProfile = async (model: any) => {
    const { data } = await Api.post('/access-profile/create', model);
    return data;
};

export const UpdateAccessProfile = async (model: any) => {
    const { data } = await Api.put('/access-profile/update', model);
    return data;
};

export const DeleteAccessProfile = async (id: any) => {
    const { data } = await Api.put(`/access-profile/delete`, id);
    return data;
};