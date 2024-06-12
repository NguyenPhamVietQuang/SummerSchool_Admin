import { IsEmail, IsNumber, IsOptional, IsString } from "class-validator";

export class UserRegisterDTO {
  @IsString()
  fullName!: string;

  @IsString()
  username!: string;

  @IsString()
  @IsEmail()
  email!: string;

  @IsString()
  password!: string;

  @IsOptional()
  dateOfBirth!:string;

  @IsNumber()
  objectUserId!:number;

  @IsNumber()
  knowledge_id!:number
}