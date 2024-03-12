import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Board } from 'src/entity/board.entity';
import { User } from 'src/entity/user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { hash, compare } from 'bcrypt';
import { LoginUserDto } from './dto/login-user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async getUser() {
    const qb = this.userRepository.createQueryBuilder();
    qb.addSelect((subQuery) => {
      return subQuery
        .select('count(id)')
        .from(Board, 'Board')
        .where('Board.userId = User.id');
    }, 'User_boardCount');

    return qb.getMany();
  }

  async createUser(data: CreateUserDto) {
    const { username, password, name } = data;

    const encryptedPW = await this.encryptPassword(password);

    return this.userRepository.save({
      username,
      name,
      password: encryptedPW,
    });
  }

  async loginUser(data: LoginUserDto) {
    const { username, password } = data;

    const user = await this.userRepository.findOneBy({
      username,
    });
    if (!user) throw new HttpException('Not Found', HttpStatus.NOT_FOUND);

    const match = await compare(password, user.password);

    console.log(match);

    if (!match)
      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);

    return user;
  }

  async encryptPassword(password: string) {
    const DEFAULT_SALT = 11;
    return hash(password, DEFAULT_SALT);
  }
}
