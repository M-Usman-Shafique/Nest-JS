import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Post } from './post.entity';

@Entity()
export class Thumbnail {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  orientation: 'portrait' | 'landscape';

  @Column()
  size: number;

  @OneToOne(() => Post, (post) => post.thumbnail)
  @JoinColumn()
  post: Post;
}
