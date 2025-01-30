import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { pgConfig } from 'pgConfig';
import { PostModule } from './post/post.module';

@Module({
  imports: [UserModule, TypeOrmModule.forRoot(pgConfig), PostModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
