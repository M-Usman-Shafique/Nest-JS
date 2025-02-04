import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Post } from './entities/post.entity';
import { PaginationDTO } from './dto/pagination.dto';
import { createPostgresDatabase } from 'typeorm-extension';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(Post)
    private postRepo: Repository<Post>,
  ) {}
  async create(postBody: CreatePostDto, user: any) {
    const newPost = this.postRepo.create({
      ...postBody,
      user,
    });

    return await this.postRepo.save(newPost);
  }

  async findAll(paginationDTO: PaginationDTO) {
    const { skip = 0, limit = 10 } = paginationDTO;

    const posts = await this.postRepo.find({
      skip,
      take: limit,
      relations: ['user'],
    });

    return posts;
  }

  async findOne(id: number) {
    const post = await this.postRepo.findOne({ where: { id } });

    if (!post) throw new NotFoundException();
    return post;
  }

  async update(id: number, updatePostDto: UpdatePostDto) {
    return await this.postRepo.update({ id }, updatePostDto);
  }

  async delete(id: number) {
    const post = await this.postRepo.findOne({ where: { id } });

    if (!post) {
      throw new NotFoundException(`Post with ID ${id} not found.`);
    }

    await this.postRepo.remove(post);
    return { message: 'Post deleted successfully.' };
  }
}
