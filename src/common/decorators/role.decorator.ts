import { SetMetadata } from "@nestjs/common";
import { RoleType } from "../type/role.type";

export const Roles = (...roles: RoleType[]): any => SetMetadata('role', roles);