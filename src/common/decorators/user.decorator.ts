import { createParamDecorator, ExecutionContext } from "@nestjs/common";

export const User = createParamDecorator(
  (data: string, ctx: ExecutionContext) => {
    const payload = ctx.switchToRpc().getData();
    return data ? payload?.user?.[data] : payload?.user;
  },
);
