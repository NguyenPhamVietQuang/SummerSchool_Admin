import { IsArray, IsNotEmpty, IsOptional, IsString } from "class-validator"

export class CreateCourseOrderDTO {

  @IsString()
  @IsOptional()
  note!:string;

  @IsArray()
  course_ids!:Array<number>
}