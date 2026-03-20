import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { UserPayload } from "../../modules/auth/interfaces/user-payload.interface";

export const User = createParamDecorator(
  (data: keyof UserPayload | undefined, ctx: ExecutionContext) => {
    const payload = ctx.switchToRpc().getData();
    const user: UserPayload = payload?.user;
    return data ? user?.[data] : user;
  },
);
