import { Injectable } from '@nestjs/common';
import { CreateBoardDto } from './dto/create-board.dto';
import { UpdateBoardDto } from './dto/update-board.dto';

@Injectable()
export class BoardService {
  boards = [
    {
      id: 1,
      name: 'hello',
      contents: 'world',
    },
    {
      id: 2,
      name: 'hi',
      contents: 'there',
    },
    {
      id: 3,
      name: 'stay a while',
      contents: 'and listen!',
    },
    {
      id: 4,
      name: 'it is good day',
      contents: 'to die',
    },
    {
      id: 5,
      name: 'say hello to',
      contents: 'democracy!',
    },
  ];

  findAll() {
    console.log(this.getNextId());
    return this.boards;
  }

  find(id: number) {
    const targetBoardIdx = this.getBoardId(id);
    return this.boards[targetBoardIdx];
  }

  create(data: CreateBoardDto) {
    const newBoard = {
      id: this.getNextId(),
      ...data,
    };
    this.boards.push(newBoard);
    return newBoard;
  }

  update(id: number, data: UpdateBoardDto) {
    const targetBoardIdx = this.getBoardId(id);
    if (targetBoardIdx > -1) {
      this.boards[targetBoardIdx] = {
        ...this.boards[targetBoardIdx],
        ...data,
      };
      return this.boards[targetBoardIdx];
    }
    return null;
  }

  remove(id: number) {
    const targetBoardIdx = this.getBoardId(id);
    if (targetBoardIdx > -1) {
      const deleteBoard = this.boards[targetBoardIdx];
      this.boards.splice(targetBoardIdx, 1);
      return deleteBoard;
    }
    return null;
  }

  getBoardId(id: number) {
    return this.boards.findIndex((it) => it.id === id);
  }

  getNextId() {
    const max =
      this.boards.sort((a, b) => {
        return b.id - a.id;
      })[0].id + 1;
    return max;
  }
}
