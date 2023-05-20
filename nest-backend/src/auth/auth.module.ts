import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './entities/user.entity';

@Module({
  controllers: [AuthController],
  providers: [AuthService],
  imports: [
    ConfigModule.forRoot(), //! apuntes 3

    MongooseModule.forFeature([
      {
        name: User.name,
        schema: UserSchema
      }
    ]),
  ]
})
export class AuthModule { }
