import { ForbiddenException, HttpException, Injectable, NotFoundException } from '@nestjs/common';
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
  async createBoard(body: CreateBoardDto, userId: number) {
    try {
      const user = await this.userRepository.findUserById(userId);

      if (!user) {
        throw new NotFoundException('User Not Found');
      }

      const createBoard = await this.boardRepository.createBoard(body, user);
      // 리스폰스 디티오 별도 관리 인원
      return {
        id: createBoard.id,
        title: createBoard.title,
        content: createBoard.content,
        createdAt: createBoard.createdAt,
        userId: createBoard.user.id,
        email: createBoard.user.email,
        nickName: createBoard.user.nickName,
      };
    } catch (error) {
      throw new HttpException('Server Error', 500);
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
        throw new NotFoundException(`Community with id ${id} not found.`);
      }
      return board;
    } catch (error) {
      throw new HttpException('Server Error', 500);
    }
  }

  // 게시글 수정  - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  async updateBoard(id: number, body: UpdateBoardDto, userId: number) {
    try {
      const user = await this.userRepository.findUserById(userId);
      if (!user) {
        throw new NotFoundException('User Not Founed?');
      }

      const updateBoard = await this.boardRepository.updateBoard(
        id,
        body,
        user,
      );

      // 해당 게시판이 존재 하지 않을 시.
      if(!updateBoard) {
        throw new NotFoundException(`Board with id ${id} not found`);
      }
      // 해당 게시판 권한이 없을 시.
      if (updateBoard.user.id !== user.id) {
        throw new ForbiddenException(
          'You Do Not Have Permission To Edit This Post',
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
      throw new HttpException('Server Error', 500);
    }
  }

  // 게시글 삭제 - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  async deleteBoard(id: number, userId: number) {
    try {
      const user = await this.userRepository.findUserById(userId);
      if (!user) {
        throw new NotFoundException('User Not Found?');
      }
      const deleteBoard = await this.boardRepository.deleteBoard(id, user);

      if (!deleteBoard) {
        throw new NotFoundException(`Board with id ${id} not found`);
      }

      if (deleteBoard.user.id !== user.id) {
        throw new ForbiddenException(
          'You Do Not Have Permission To Edit This Post',
        );
      }

      if (deleteBoard.deletedAt !== null) {
        throw new HttpException('Already Gone.', 200);
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
      throw new HttpException('Server Error', 500);
    }
  }
}
