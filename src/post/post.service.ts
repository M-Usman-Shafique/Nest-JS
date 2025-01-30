import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Post } from './entities/post.entity';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(Post)
    private postRepo: Repository<Post>,
  ) {}
  async create(postBody: CreatePostDto) {
    return await this.postRepo.save(postBody);
  }

  async findAll() {
    const posts = await this.postRepo.find();

    if (posts.length === 0) throw new NotFoundException();
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
    return await this.postRepo.delete({ id });
  }
}
