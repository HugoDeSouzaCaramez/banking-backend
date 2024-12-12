import { Controller, Post, UseGuards, Request, Body } from '@nestjs/common';
import { KycService } from './kyc.service';
import { UploadFileDto } from './dto/upload-file.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('kyc')
export class KycController {
  constructor(private readonly kycService: KycService) {}

  @UseGuards(JwtAuthGuard)
  @Post('upload-doc')
  async uploadDocument(@Request() req, @Body() uploadFileDto: UploadFileDto) {
    return this.kycService.uploadFile(req.user.id, { ...uploadFileDto, fileType: 'document' });
  }

  @UseGuards(JwtAuthGuard)
  @Post('upload-selfie')
  async uploadSelfie(@Request() req, @Body() uploadFileDto: UploadFileDto) {
    return this.kycService.uploadFile(req.user.id, { ...uploadFileDto, fileType: 'selfie' });
  }
}
