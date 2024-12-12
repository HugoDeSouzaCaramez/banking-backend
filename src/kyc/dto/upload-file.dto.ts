import { IsString, IsBase64, IsIn } from 'class-validator';

export class UploadFileDto {
  @IsString()
  @IsBase64()
  file: string;

  @IsString()
  @IsIn(['document', 'selfie'], { message: 'fileType must be either "document" or "selfie"' })
  fileType: string;
}