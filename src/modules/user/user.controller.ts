import { Controller, ParseUUIDPipe, UseGuards } from "@nestjs/common";
import { UserService } from "./user.service";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { MessagePattern, Payload } from "@nestjs/microservices";
import { RolesGuard } from "../../common/guards/roles.guard";
import { Roles } from "../../common/decorators/roles.decorator";
import { User } from "../../common/decorators/user.decorator";
import { UserPayload } from "../auth/interfaces/user-payload.interface";

@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @MessagePattern({ cmd: "users.create.one" })
  create(@Payload() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @MessagePattern({ cmd: "users.get.all" })
  findAll(@Payload() data: { page?: number; limit?: number; search?: string }) {
    const { page = 1, limit = 10, search } = data;
    return this.userService.findAll(page, limit, search);
  }

  @MessagePattern({ cmd: "users.find.one" })
  findOne(@Payload("id", ParseUUIDPipe) id: string) {
    return this.userService.findOne(id);
  }

  @MessagePattern({ cmd: "users.update.one" })
  @UseGuards(RolesGuard)
  @Roles("admin", "user")
  update(
    @Payload() data: { id: string; updateUserDto: UpdateUserDto },
    @User() user: UserPayload,
  ) {
    // Ejemplo de lógica de propiedad:
    // Si no es admin, solo puede actualizarse a sí mismo
    if (!user.roles.includes("admin") && user.id !== data.id) {
      throw new Error("No tienes permiso para actualizar este perfil");
    }
    return this.userService.update(data.id, data.updateUserDto);
  }

  @MessagePattern({ cmd: "users.remove.one" })
  @UseGuards(RolesGuard)
  @Roles("admin")
  remove(@Payload("id", ParseUUIDPipe) id: string, @User("id") adminId: string) {
    console.log(`Administrador ${adminId} eliminando usuario ${id}`);
    return this.userService.remove(id);
  }

  @MessagePattern({ cmd: "users.find.email" })
  findByEmail(@Payload("email") email: string) {
    return this.userService.findByEmail(email);
  }

  @MessagePattern({ cmd: "users.activate.one" })
  @UseGuards(RolesGuard)
  @Roles("admin")
  activate(@Payload("id", ParseUUIDPipe) id: string) {
    return this.userService.activate(id);
  }

  @MessagePattern({ cmd: "users.deactivate.one" })
  @UseGuards(RolesGuard)
  @Roles("admin")
  deactivate(@Payload("id", ParseUUIDPipe) id: string) {
    return this.userService.deactivate(id);
  }
}
