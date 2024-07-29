import { IsInt, IsString } from 'class-validator';

export class CommunityDTO {
  @IsInt()
  id: number;

  @IsString()
  title: string;

  @IsString()
  content: string;
}
