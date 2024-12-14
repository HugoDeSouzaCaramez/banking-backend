import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsBase64, IsIn } from 'class-validator';

export class UploadFileDto {
  @ApiProperty({ description: 'Conteúdo do arquivo em Base64', example: 'dGVzdCBjb250ZW50' })
  @IsString()
  @IsBase64()
  file: string;

  @ApiProperty({
    description: 'Tipo do arquivo enviado',
    example: 'document',
    enum: ['document', 'selfie'],
  })
  @IsString()
  @IsIn(['document', 'selfie'], { message: 'fileType must be either "document" or "selfie"' })
  fileType: string;
}
