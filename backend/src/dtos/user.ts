import { User } from "../entities/User";
import { ProjectUserResponse, mapProjectUserToResponse } from "./projectUser";

export interface UserResponse {
    id: number;
    email: string;
    name: string;
    createdAt: Date;
    updatedAt: Date;
    role: string;
    isBlocked: boolean;
    projectUsers?: ProjectUserResponse[];
}

export const mapUserToResponse = (user: User | null | undefined, includeProjects: boolean = false): UserResponse => {
    const baseResponse: UserResponse = {
        id: user?.id ?? 0,
        email: user?.email ?? "",
        name: user?.name ?? "",
        createdAt: user?.createdAt ?? new Date(),
        updatedAt: user?.updatedAt ?? new Date(),
        role: user?.role ?? "user",
        isBlocked: user?.isBlocked ?? false
    };

    if (includeProjects && user?.projectUsers) {
        console.log(`[mapUserToResponse] User ${user.id}: Found ${user.projectUsers.length} projectUsers`);
        const validProjectUsers = user.projectUsers
            .map((pu, index) => {
                // When mapping from user context, we don't need the user relation in ProjectUser
                const mapped = mapProjectUserToResponse(pu, true, false);
                if (!mapped) {
                    console.log(`[mapUserToResponse] ProjectUser ${pu.id} at index ${index}: project=${!!pu.project}, user=${!!pu.user}`);
                }
                return mapped;
            })
            .filter((pu): pu is ProjectUserResponse => pu !== null);
        console.log(`[mapUserToResponse] User ${user.id}: ${validProjectUsers.length} valid projectUsers after filtering`);
        baseResponse.projectUsers = validProjectUsers.length > 0 ? validProjectUsers : [];
    }

    return baseResponse;
};

export default UserResponse;