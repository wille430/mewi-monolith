import { Module } from "@nestjs/common";
import { UsersService } from "./users.service";
import { UsersController } from "./users.controller";
import { EmailModule } from "@/email/email.module";
import { PrismaModule } from "@/prisma/prisma.module";

@Module({
  imports: [EmailModule, PrismaModule],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [EmailModule, PrismaModule],
})
export class UsersModule {}
