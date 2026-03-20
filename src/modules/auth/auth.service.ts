import {
  Injectable,
  UnauthorizedException,
  ConflictException,
} from "@nestjs/common";
import { RpcException } from "@nestjs/microservices";
import { JwtService } from "@nestjs/jwt";
import { UserService } from "../user/user.service";
import { CreateUserDto } from "../user/dto/create-user.dto";
import { LoginDto } from "../user/dto/login.dto";
import { User } from "../user/entities/user.entity";

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async register(createUserDto: CreateUserDto) {
    try {
      const { password, ...user } =
        await this.userService.create(createUserDto);
      const payload = { email: user.email, sub: user.id, roles: user.roles };

      return {
        message: "User registered successfuylly",
        data: { ...user },
        access_token: this.jwtService.sign(payload),
      };
    } catch (error) {
      if (error instanceof RpcException) {
        throw error;
      }
      throw new RpcException({
        status: 500,
        message: "Internal Server Error",
      });
    }
  }

  async login(loginDto: LoginDto) {
    const { password, ...user } = await this.validateUser(
      loginDto.email,
      loginDto.password,
    );

    if (!user.isActive) {
      throw new RpcException({
        status: 401,
        message: "User deactivated",
      });
    }

    await this.userService.updateLastLogin(user.id);

    const payload = { email: user.email, sub: user.id, roles: user.roles };

    return {
      message: "Login exitoso",
      user: { ...user },
      access_token: this.jwtService.sign(payload),
    };
  }

  async validateUser(email: string, password: string): Promise<User> {
    try {
      const user = await this.userService.findByEmail(email);

      if (user && (await user.validatePassword(password))) {
        return user;
      }

      throw new RpcException({
        status: 401,
        message: "Invalid credentials",
      });
    } catch (error) {
      if (error instanceof RpcException) {
        throw error;
      }
      throw new RpcException({
        status: 500,
        message: "Internal Server Error",
      });
    }
  }

  async validateToken(token: string) {
    try {
      const payload = this.jwtService.verify(token);
      const { password, ...user } = await this.userService.findOne(payload.sub);

      return {
        valid: true,
        user: { ...user },
      };
    } catch (error) {
      throw new RpcException({
        status: 400,
        message: "Token no valid or expired",
      });
    }
  }
}
