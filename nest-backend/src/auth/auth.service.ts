import { Injectable, BadRequestException, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { UpdateAuthDto } from './dto/update-user.dto';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcryptjs from 'bcryptjs'; 
import { InjectModel } from '@nestjs/mongoose';
import { User } from './entities/user.entity';
import { Model } from 'mongoose';
import { LoginDto } from './dto/login.dto';
import { LoginResponse } from './interfaces/login-response';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './interfaces/jwt-payload';
import { RegisterUserDto } from './dto/register-user.dto';

@Injectable()
export class AuthService {

  constructor(
    @InjectModel(User.name)
    private userModel: Model<User>,

    private jwtService: JwtService, 
  ) { }


  async create(createUserDto: CreateUserDto): Promise<User> { 

    try {
      const { password, ...userData } = createUserDto;

      const newUser = new this.userModel({
        password: bcryptjs.hashSync(password, 10),
        ...userData
      });

      await newUser.save();

      const { password:_, ...user } = newUser.toJSON(); // esto es el usuario no vea la contraseña

      return user;


    } catch (error) {
      if (error.code === 11000) {
        throw new BadRequestException(`${createUserDto.email} already exists!`)
      }
      throw new InternalServerErrorException('error servidor');
    }

    /* esto crea esto como respuesta:
    
{
    "email": "sdfa2sd@gmail.com",
    "name": "juan2",
    "password": "$2a$10$jVL7MQ1R0jAINNbf5HdjN.lW8BOHn05aZG9D4wW45K9j1Z88SbEzm",
    "isActive": true,
    "roles": [
        "user"
    ],
    "_id": "6467337bc71aa2ae3aea5f1a",
    "__v": 0
}*/
  }

  async register( registerDto: RegisterUserDto ): Promise<LoginResponse> {

    const user = await this.create( registerDto ); // se combina con .create

    return {
      user: user,
      token: this.getJwtToken({ id: user._id })
    }
  }

  async login( loginDto: LoginDto ):Promise<LoginResponse> { 

    const { email, password } = loginDto;

    const user = await this.userModel.findOne({ email });
    if ( !user ) {
      throw new UnauthorizedException('Not valid credentials');
    }
    
    if ( !bcryptjs.compareSync( password, user.password ) ) {
      throw new UnauthorizedException('Not valid credentials');
    }

    const { password:_, ...rest  } = user.toJSON();

    return {
      user: rest,
      token: this.getJwtToken({ id: user.id }),
    }
  }

  getJwtToken( payload: JwtPayload ) {
    const token = this.jwtService.sign(payload);
    return token;
  }

  findAll(): Promise<User[]> {
    return this.userModel.find();
  }

  async findUserById( id: string ) {
    const user = await this.userModel.findById( id );
    const { password, ...rest } = user.toJSON();
    return rest;
  }


  findOne(id: number) {
    return `This action returns a #${id} auth`;
  }

  update(id: number, updateAuthDto: UpdateAuthDto) {
    return `This action updates a #${id} auth`;
  }

  remove(id: number) {
    return `This action removes a #${id} auth`;
  }
}
