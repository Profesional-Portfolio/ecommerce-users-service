import { ExtractJwt, Strategy } from "passport-jwt";
import { PassportStrategy } from "@nestjs/passport";
import { Injectable } from "@nestjs/common";
import { env } from "../config";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: env.JWT_SECRET || "your-super-secret-jwt-key",
    });
  }

  async validate(payload: any) {
    return {
      id: payload.sub,
      email: payload.email,
      roles: payload.roles,
    };
  }
}
