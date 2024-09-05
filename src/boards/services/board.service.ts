import {
  ForbiddenException,
  HttpException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { BoardRepository } from '../repositories/board.repository';
import { CreateBoardDto } from '../dtos/create.request.dto';
import { UpdateBoardDto } from '../dtos/update.request.dto';
import { UserRepository } from 'src/users/repositories/user.repository';

@Injectable()
export class BoardService {
  constructor(
    private readonly boardRepository: BoardRepository,
    private readonly userRepository: UserRepository,
  ) {}

  // NotFoundException? 이 맞는지 모르겠네.
  // 게시글 작성 - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  async createBoard(
    body: CreateBoardDto,
    file: Express.Multer.File,
    userId: number,
  ) {
    try {
      const user = await this.userRepository.findUserById(userId);

      if (!user) {
        throw new HttpException('User Not Found', 500);
      }

      const imagePath = `/uploads/${file.filename}`;

      const createBoard = await this.boardRepository.createBoard(
        body,
        imagePath,
        user,
      );
      // 리스폰스 디티오 별도 관리 인원
      return {
        id: createBoard.id,
        title: createBoard.title,
        imagePath: createBoard.imageUrl,
        content: createBoard.content,
        createdAt: createBoard.createdAt,
        userId: createBoard.user.id,
        email: createBoard.user.email,
        nickName: createBoard.user.nickName,
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      } else {
        throw new HttpException('Server Error', 500);
      }
    }
  }

  // 게시글 전체 조회 - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  async findAllBoard() {
    try {
      return await this.boardRepository.findAllBoard();
    } catch (error) {
      throw new HttpException('Server Error', 500);
    }
  }

  // 게시글 상세 보기 - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  async findOneBoard(id: number) {
    try {
      const board = await this.boardRepository.findOneBoard(id);
      if (!board) {
        throw new HttpException(`Community with id ${id} not found.`, 500);
      }
      return board;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      } else {
        throw new HttpException('Server Error', 500);
      }
    }
  }

  // 게시글 수정  - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  async updateBoard(id: number, body: UpdateBoardDto, userId: number) {
    try {
      const user = await this.userRepository.findUserById(userId);
      if (!user) {
        throw new HttpException('User Not Found', 500);
      }

      const updateBoard = await this.boardRepository.updateBoard(
        id,
        body,
        user,
      );

      // 해당 게시판이 존재 하지 않을 시.
      if (!updateBoard) {
        throw new HttpException(`Board with id ${id} not found`, 404);
      }
      // 해당 게시판 권한이 없을 시.
      if (updateBoard.user.id !== user.id) {
        throw new HttpException(
          'You Do Not Have Permission To Edit This Post',
          403,
        );
      }

      // 리스폰스 디티오 별도 관리 인원
      return {
        id: updateBoard.id,
        title: updateBoard.title,
        content: updateBoard.content,
        createdAt: updateBoard.createdAt,
        updatedAt: updateBoard.updatedAt,
        userId: updateBoard.user.id,
        email: updateBoard.user.email,
        nickName: updateBoard.user.nickName,
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      } else {
        throw new HttpException('Server Error', 500);
      }
    }
  }

  // 게시글 삭제 - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  async deleteBoard(id: number, userId: number) {
    try {
      const user = await this.userRepository.findUserById(userId);
      if (!user) {
        throw new HttpException('User Not Found', 400);
      }
      const deleteBoard = await this.boardRepository.deleteBoard(id, user);

      if (!deleteBoard) {
        throw new HttpException(`Board with id ${id} not found`, 404);
      }

      if (deleteBoard.user.id !== user.id) {
        throw new HttpException(
          'You Do Not Have Permission To Edit This Post',
          403,
        );
      }

      if (deleteBoard.deletedAt !== null) {
        throw new HttpException('Already Gone.', 400);
      }

      return {
        id: deleteBoard.id,
        title: deleteBoard.title,
        content: deleteBoard.content,
        createdAt: deleteBoard.createdAt,
        updatedAt: deleteBoard.updatedAt,
        userId: deleteBoard.user.id,
        email: deleteBoard.user.email,
        nickName: deleteBoard.user.nickName,
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      } else {
        throw new HttpException('Server Error', 500);
      }
    }
  }
}
