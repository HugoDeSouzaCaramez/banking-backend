import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { MockAuthService } from './mock-auth.service';

@Module({
    imports: [HttpModule],
    providers: [MockAuthService],
    exports: [MockAuthService],
})
export class MockAuthModule {}
