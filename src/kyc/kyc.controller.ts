import { Controller, Post, UseGuards, Request, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { KycService } from './kyc.service';
import { UploadFileDto } from './dto/upload-file.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('kyc')
@ApiBearerAuth()
@Controller('kyc')
export class KycController {
  constructor(private readonly kycService: KycService) {}

  @UseGuards(JwtAuthGuard)
  @Post('upload-doc')
  @ApiOperation({ summary: 'Fazer upload de um documento KYC' })
  @ApiResponse({ status: 201, description: 'Documento enviado com sucesso.' })
  @ApiResponse({ status: 401, description: 'Usuário não autenticado.' })
  async uploadDocument(@Request() req, @Body() uploadFileDto: UploadFileDto) {
    return this.kycService.uploadFile(req.user.id, { ...uploadFileDto, fileType: 'document' });
  }

  @UseGuards(JwtAuthGuard)
  @Post('upload-selfie')
  @ApiOperation({ summary: 'Fazer upload de uma selfie KYC' })
  @ApiResponse({ status: 201, description: 'Selfie enviada com sucesso.' })
  @ApiResponse({ status: 401, description: 'Usuário não autenticado.' })
  async uploadSelfie(@Request() req, @Body() uploadFileDto: UploadFileDto) {
    return this.kycService.uploadFile(req.user.id, { ...uploadFileDto, fileType: 'selfie' });
  }
}
