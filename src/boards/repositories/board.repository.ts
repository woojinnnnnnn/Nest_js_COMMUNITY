import {
  ForbiddenException,
  HttpException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Board } from 'src/entities/board.entity';
import { User } from 'src/entities/user.entity';
import { CreateBoardDto } from '../dtos/create.request.dto';
import { UpdateBoardDto } from '../dtos/update.request.dto';

@Injectable()
export class BoardRepository {
  constructor(
    @InjectRepository(Board)
    private readonly boardRepository: Repository<Board>,
  ) {}

  // 게시글 작성 - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  async createBoard(body: CreateBoardDto, imagePath: string, user: User) {
    const { title, content } = body;
    const board = this.boardRepository.create({
      title,
      imageUrl: imagePath,
      content,
      user, 
    });
    return await this.boardRepository.save(board);
  }

  // 게시글 전체 조회 - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  async findAllBoard() {
    try {
      const boards = await this.boardRepository.find({
        where: {
          deletedAt: null,
        },
        select: {
          id: true,
          title: true,
          veiwCount: true,
          createdAt: true,
          updatedAt: true,
          user: {
            id: true,
            email: true,
            nickName: true,
          },
        },
        relations: ['user'],
      });

      return boards;
    } catch (error) {
      throw new HttpException('Server Error', 500);
    }
  }

  // 게시글 상세 보기 - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  async findOneBoard(id: number) {
    try {
      const board = await this.boardRepository.findOne({
        where: { id, deletedAt: null },
      });
      // 레포 로직에서 veiw 카운트 올리긴 하는데 .. 이건 서비스 로직으로 옮기는게 나을지.. ?
      board.veiwCount = board.veiwCount + 1;
      await this.boardRepository.save(board);
      return board;
    } catch (error) {
      throw new HttpException('Server Error', 500);
    }
  }

  // 게시글 수정 - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  async updateBoard(id: number, body: UpdateBoardDto, user: User) {
    try {
      const board = await this.boardRepository.findOne({
        where: { id, deletedAt: null },
        relations: ['user'],
      });

      board.title = body.title;
      board.content = body.content;

      await this.boardRepository.save(board);
      return board;
    } catch (error) {
      throw new HttpException('Server Error', 500);
    }
  }

  // 게시글 삭제 - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  async deleteBoard(id: number, user: User) {
    try {
      const board = await this.boardRepository.findOne({
        where: { id, deletedAt: null },
        relations: ['user'],
      });
      await this.boardRepository.softDelete(id);
      return board;
    } catch (error) {
      throw new HttpException('Server Error', 500);
    }
  }

  // 게시글 id 값 찾기.
  async findOneBoardId(id: number) {
    return await this.boardRepository.findOne({
      where: { id, deletedAt: null },
    });
  }
}


// 확인 끝