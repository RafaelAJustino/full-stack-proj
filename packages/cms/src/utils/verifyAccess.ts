import { useNavigate } from "react-router-dom";
import { deleteUser, getJwtToken } from "./token";
import { deleteJwtToken } from "./token";
import { getUser } from "./token";

export async function verifyAccess() {
    const isAuthenticated = getJwtToken() !== null;

    let access = {
        permission: {
            create: false,
            read: false,
            update: false,
            delete: false,
        },
        user: {
            create: false,
            read: false,
            update: false,
            delete: false,
        }
    }
    try {
        const temp = await getUser();
        const listAccess = temp?.accessProfileUser
            .map((a: any) => a?.accessProfile?.permissionProfile).flat();

        if (!isAuthenticated) {
            return access;
        } else {
            access = {
                permission: {
                    create: !!listAccess.some(
                        (a: any) => a?.permission?.name == 'PERMISSION' && a?.create
                    ),
                    read: !!listAccess.some(
                        (a: any) => a?.permission?.name == 'PERMISSION' && a?.read
                    ),
                    update: !!listAccess.some(
                        (a: any) => a?.permission?.name == 'PERMISSION' && a?.update
                    ),
                    delete: !!listAccess.some(
                        (a: any) => a?.permission?.name == 'PERMISSION' && a?.delete
                    ),
                },
                user: {
                    create: !!listAccess.some(
                        (a: any) => a?.permission?.name == 'USER' && a?.create
                    ),
                    read: !!listAccess.some(
                        (a: any) => a?.permission?.name == 'USER' && a?.read
                    ),
                    update: !!listAccess.some(
                        (a: any) => a?.permission?.name == 'USER' && a?.update
                    ),
                    delete: !!listAccess.some(
                        (a: any) => a?.permission?.name == 'USER' && a?.delete
                    ),
                }
            }
            return access;
        }
    } catch (e) {
        console.log(e);
        return access;
    }

}