import Api from '.';

interface ListUser {
    page: number,
    perPage: number,
    search: string,
}

export const ListUser = async (model: ListUser) => {
    const { data } = await Api.post('/user/list', model);
    return data;
};

export const GetUser = async (id: number) => {
    const { data } = await Api.get(`/user/list/${id}`);
    return data;
};

export const CreateUser = async (model: any) => {
    const { data } = await Api.post('/user/create', model);
    return data;
};

export const EditUser = async (model: any) => {
    const { data } = await Api.put('/user/update', model);
    return data;
};

export const DeleteUser = async (id: any) => {
    const { data } = await Api.put(`/user/delete`, id);
    return data;
};

export const UpdateUserStatus = async (model: any) => {
    const { data } = await Api.put('/user/update/status', model);
    return data;
};