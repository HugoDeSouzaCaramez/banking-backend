import { IsString, IsBase64 } from 'class-validator';

export class UploadFileDto {
  @IsString()
  @IsBase64()
  file: string;

  @IsString()
  fileType: string;
}
