import { Controller, Logger } from "@nestjs/common";
import { MessagePattern, Payload } from "@nestjs/microservices";
import { AuthService } from "./auth.service";
import { CreateUserDto } from "../user/dto/create-user.dto";
import { LoginDto } from "../user/dto/login.dto";
import { UserService } from "../user/user.service";

@Controller("auth")
export class AuthController {
  private readonly logger: Logger = new Logger(AuthController.name);
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  @MessagePattern({ cmd: "auth.register.user" })
  async register(@Payload() createUserDto: CreateUserDto) {
    return this.authService.register(createUserDto);
  }

  @MessagePattern({ cmd: "auth.login.user" })
  async login(@Payload() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @MessagePattern({ cmd: "auth.validate.token" })
  async validateToken(@Payload("token") token: string) {
    return this.authService.validateToken(token);
  }

  @MessagePattern({ cmd: "auth.profile.user" })
  async getProfile(@Payload() id: string) {
    return this.userService.findOne(id);
  }
}
