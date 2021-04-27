import { Controller, Put, Body, Patch, Get, Param, UseGuards,Request, Delete, Query } from "@nestjs/common";
import Board from "../entity/board.entity";
import { BoardService } from "./board.service";
import { JwtAuthGuard } from '../auth/jwt-auth.guard';


  @Controller('board')//컨트롤러 생성
  export class BoardController  {
    constructor(private readonly boardService: BoardService) {}
  
  //전체 게시글 조회
  @Get('list')
  list() {
    return this.boardService.listBoard();;
  }
    
  //게시글 생성
  @UseGuards(JwtAuthGuard)
  @Put("create")
  async create(@Request() req,@Body() createBoard: Board) {
    const ret = await this.boardService.createBoardFunc(req.user,createBoard);
    return ret;
  }

  //id에 해당하는 게시글 조회
  @Get(":id")
  detail(@Param("id") boardId: number) {
    return this.boardService.detailBoard(boardId);
  }

  //id에 해당하는 게시글 업데이트, jwt로 인증하여 IdentificationNuber가 같아야 변경가능
  @UseGuards(JwtAuthGuard)
  @Get("update/:id")
  async updateboard(@Request() req,@Param("id") boardId: number) {
    const ret = await this.boardService.updateBoardAuth(req.user,boardId);
    return ret;
  }

  @UseGuards(JwtAuthGuard)
  @Patch("update/:id")
  async update(@Request() req,@Param("id") boardId: number,@Body() updateData: Board) {
    console.log(123)
    const ret = await this.boardService.updateBoard(req.user,boardId,updateData);
    return ret;
  }
  
  //id에 해당하는 게시글 삭제, jwt로 인증하여 IdentificationNuber가 같아야 삭제
  @UseGuards(JwtAuthGuard)
  @Delete("delete/:id")
  async delete(@Request() req,@Param("id") boardId: number) {
    const ret = await this.boardService.removeBoard(req.user,boardId);
    return ret;
  }
}