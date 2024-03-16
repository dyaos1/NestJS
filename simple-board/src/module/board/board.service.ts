import { HttpException, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateBoardDto } from './dto/create-board.dto';
import { UpdateBoardDto } from './dto/update-board.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/entity/user.entity';
import { Board } from 'src/entity/board.entity';

@Injectable()
export class BoardService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Board)
    private boardRepository: Repository<Board>,
  ) {}

  async findAll() {
    return await this.boardRepository.find();
  }

  async find(id: number) {
    const board = await this.boardRepository.findOne({
      where: {
        id,
      },
      relations: {
        user: true,
      },
    });

    if (!board) throw new HttpException('NotFound', HttpStatus.NOT_FOUND);

    return board;
  }

  create(data: CreateBoardDto) {
    const newBoard = this.boardRepository.create(data);
    return this.boardRepository.save(newBoard);
  }

  async update(userId: number, id: number, data: UpdateBoardDto) {
    const targetBoard = await this.getBoardById(id);
    if (!targetBoard)
      throw new HttpException('Not Found', HttpStatus.NOT_FOUND);

    if (userId !== targetBoard.userId) throw new UnauthorizedException();

    return this.boardRepository.update(id, {
      ...data,
    });
  }

  async remove(userId: number, id: number) {
    const targetBoard = await this.getBoardById(id);
    if (!targetBoard)
      throw new HttpException('Not Found', HttpStatus.NOT_FOUND);

    if (userId !== targetBoard.userId) throw new UnauthorizedException();

    return this.boardRepository.remove(targetBoard);
  }

  async getBoardById(id: number) {
    return this.boardRepository.findOneBy({
      id,
    });
  }
}
