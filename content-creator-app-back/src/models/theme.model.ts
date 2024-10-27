import mongoose, { Schema, Document } from 'mongoose';
import { IsString, IsArray, IsDate, IsOptional } from 'class-validator';

export interface ITheme extends Document {
  name: string;
  description: string;
  categoriesIds: string[];
  coverImage: string;
  createdAt: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}

const ThemeSchema: Schema = new Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  categoriesIds: [{ type: Schema.Types.ObjectId, ref: 'Category' }],
  coverImage: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date },
  deletedAt: { type: Date }
}, { timestamps: false });

export default mongoose.model<ITheme>('Theme', ThemeSchema);

export class ThemeDto {
  @IsString()
  name!: string;

  @IsString()
  description!: string;

  @IsArray()
  @IsString({ each: true })
  categoriesIds!: string[];

  @IsString()
  coverImage!: string;

  @IsDate()
  createdAt!: Date;

  @IsOptional()
  @IsDate()
  updatedAt?: Date;

  @IsOptional()
  @IsDate()
  deletedAt?: Date;
}
