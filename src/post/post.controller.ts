import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { PostService } from './post.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PaginationDTO } from './dto/pagination.dto';
import { JwtGuard } from 'src/guards/jwt.guard';

@Controller('post')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Post()
  @UseGuards(JwtGuard)
  create(@Body() postBody: CreatePostDto, @Request() req: any) {
    const user = req.user;
    return this.postService.create(postBody, user);
  }

  @Get()
  findAll(@Query() paginationDTO: PaginationDTO) {
    return this.postService.findAll(paginationDTO);
  }

  // @Get(':id')
  // findOne(@Param('id', ParseIntPipe) id: number) {
  //   return this.postService.findOne(id);
  // }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateBodyDto: UpdatePostDto,
  ) {
    return this.postService.update(id, updateBodyDto);
  }

  @Delete(':id')
  delete(@Param('id', ParseIntPipe) id: number) {
    return this.postService.delete(id);
  }
}
