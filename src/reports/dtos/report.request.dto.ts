import { IsEnum, IsNotEmpty, IsNumber, IsString } from "class-validator";
import { reportTag } from "src/entities/report.entity";

export class ReportRequestDto {
      @IsNotEmpty()
      @IsString()
      reason: string

      @IsEnum(reportTag)
      tags: reportTag;
}