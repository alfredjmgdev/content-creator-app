import mongoose, { Schema, Document } from 'mongoose';
import { IsString, IsEmail, IsDate, IsOptional, MinLength, MaxLength, IsEnum } from 'class-validator';

// Define UserType as an enum
export enum UserTypeEnum {
  ADMIN = 'admin',
  CREATOR = 'creator',
  READER = 'reader'
}

// Define UserType as a type alias
export type UserType = 'admin' | 'creator' | 'reader';

export interface IUser extends Document {
  _id: mongoose.Types.ObjectId;
  username: string;
  email: string;
  password: string;
  createdAt: Date;
  updatedAt?: Date;
  deletedAt?: Date;
  type: UserType;
}

export class UserDto {
  @IsString({ message: 'Username must be a string' })
  @MinLength(3, { message: 'Username must be at least 3 characters long' })
  @MaxLength(30, { message: 'Username must not exceed 30 characters' })
  username!: string;

  @IsEmail({}, { message: 'Invalid email format' })
  @MinLength(10, { message: 'Username must be at least 10 characters long' })
  @MaxLength(30, { message: 'Email must not exceed 30 characters' })
  email!: string;

  @IsString({ message: 'Password must be a string' })
  @MinLength(6, { message: 'Password must be at least 6 characters long' })
  @MaxLength(60, { message: 'Password must not exceed 60 characters' })
  password!: string;

  @IsDate({ message: 'Created date must be a valid date' })
  createdAt!: Date;

  @IsOptional()
  @IsDate({ message: 'Updated date must be a valid date' })
  updatedAt?: Date;

  @IsOptional()
  @IsDate({ message: 'Deleted date must be a valid date' })
  deletedAt?: Date;

  @IsEnum(UserTypeEnum, { message: 'Invalid user type' })
  type!: UserType;
}

const UserSchema: Schema = new Schema({
  username: { type: String, required: true, unique: true, minlength: 3, maxlength: 30 },
  email: { type: String, required: true, unique: true, minlength: 10, maxlength: 30 },
  password: { type: String, required: true, minlength: 6, maxlength: 60 },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date },
  deletedAt: { type: Date },
  type: { type: String, required: true, enum: Object.values(UserTypeEnum) },
}, { timestamps: false });

// Add a custom validator for email format
UserSchema.path('email').validate(function(email: string) {
  const emailRegex = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
  return emailRegex.test(email);
}, 'Invalid email format');

export default mongoose.model<IUser>('User', UserSchema);
