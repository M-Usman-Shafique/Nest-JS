import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    JwtModule.register({ secret: 'abc123', signOptions: { expiresIn: '1d' } }),
  ],
  exports: [JwtModule],
})
export class SharedModule {}
