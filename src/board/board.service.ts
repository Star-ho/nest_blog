import { Injectable, UnauthorizedException } from '@nestjs/common';
import Board from "../entity/board.entity";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";

@Injectable()
export class BoardService {
  constructor(
    @InjectRepository(Board) private readonly board: Repository<Board>
  ) {}


  //게시글 생성
  createBoardFunc(user:any,createBoard: Board) {
    createBoard.user=user.userId
    return this.board.create(createBoard).save();
  }

    
  //전체 게시글 조회
  async listBoard() {
    let res = await this.board.find({ select: ["id","title","text","createdAt"], order: { createdAt: -1 },take: 6  });
    res = res.map(v=>{
      if(v.text.length>=20){
        v.text=v.text.slice(0,18)+'...'
      }
      return v
    })
    return res
  }

  //하나의 게시글 조회
  async detailBoard(id: number) {
    const contents =  await this.board.findOne({id:id},{relations:["user"]});
    const date=new Date(contents.createdAt);
    return {title:contents.title,text:contents.text,date:contents.createdAt,username:contents.user.username};
  }

    //게시글 변경
    async updateBoardAuth(user:any,id: number) {
      let property= await this.board.findOne({id:id},{relations:["user"]});
      if(property.user.identifedNumber!=user.userId){
        throw new UnauthorizedException();
      }
      return {title:property.title, text:property.text} ;
    }

  //게시글 변경
  async updateBoard(user:any,id: number,updateData:Board) {
    let property= await this.board.findOne({id:id},{relations:["user"]});
    if(property.user.identifedNumber!=user.userId){
      throw new UnauthorizedException();
    }
    property.title=updateData.title;
    property.text=updateData.text;
    let {text,title,...ret}= await this.board.save(property)
    return "ok" ;
  }

  //게시글 삭제 
  async removeBoard(user:any,id: number) {
    let property= await this.board.findOne({id:id},{relations:["user"]});
    if(property.user.identifedNumber!=user.userId){
      throw new UnauthorizedException();
    }
    this.board.delete(id)
    return "success";
  }

}
