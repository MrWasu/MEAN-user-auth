import { Injectable, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { UpdateAuthDto } from './dto/update-user.dto';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcryptjs from 'bcryptjs'; //! apuntes 8 junto con hassync
import { InjectModel } from '@nestjs/mongoose';
import { User } from './entities/user.entity';
import { Model } from 'mongoose';

@Injectable()
export class AuthService {

  constructor(
    @InjectModel(User.name) //! apuntes 6 que hace esto
    private userModel: Model<User>,

    //private jwtService: JwtService,
  ) { }


  async create(createUserDto: CreateUserDto): Promise<User> { //! apuntes 7

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

  findAll() {
    return `This action returns all auth`;
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
