import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";

import { UserModule } from "./modules/user/user.module";
import { AuthModule } from "./modules/auth/auth.module";
import { User } from "./modules/user/entities/user.entity";
import { env } from "./modules/config";

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: "postgres",
      host: env.DATABASE_HOST,
      port: parseInt(env.DATABASE_PORT),
      username: env.DATABASE_USER,
      password: env.DATABASE_PASSWORD,
      database: env.DATABASE_NAME,
      entities: [User],
      synchronize: env.NODE_ENV === "development", // Solo en desarrollo
      logging: env.NODE_ENV === "development",
    }),
    PassportModule,
    JwtModule.register({
      secret: env.JWT_SECRET || "your-super-secret-jwt-key",
      signOptions: { expiresIn: "24h" },
    }),
    UserModule,
    AuthModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
