import Api from '.';

interface ListPermission {
    page: number,
    perPage: number,
    search: string,
}

export const ListAllPermissions= async () => {
    const { data } = await Api.get('/permission/list-all');
    return data;
};

export const CountPermissionProfile = async () => {
    const { data } = await Api.get('/permission/profile/count');
    return data;
};

export const ListPermissionProfile = async (model: ListPermission) => {
    const { data } = await Api.post('/permission/profile/list', model);
    return data;
};

export const GetPermissionProfile = async (id: number) => {
    const { data } = await Api.get(`/permission/profile/list/${id}`);
    return data;
};

export const CreatePermissionProfile = async (model: any) => {
    const { data } = await Api.post('/permission/profile/create', model);
    return data;
};

export const UpdatePermissionProfile = async (model: any) => {
    const { data } = await Api.put('/permission/profile/update', model);
    return data;
};

export const DeletePermissionProfile = async (id: any) => {
    const { data } = await Api.put(`/permission/profile/delete`, id);
    return data;
};