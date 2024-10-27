import mongoose, { Schema, Document } from 'mongoose';
import { IsString, IsDate, IsOptional } from 'class-validator';

export interface ICategory extends Document {
  type: string;
  label: string;
  createdAt: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}

const CategorySchema: Schema = new Schema({
  type: { type: String, required: true },
  label: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date },
  deletedAt: { type: Date }
}, { timestamps: false });

export default mongoose.model<ICategory>('Category', CategorySchema);

export class CategoryDto {
  @IsString()
  type!: string;

  @IsString()
  label!: string;

  @IsDate()
  createdAt!: Date;

  @IsOptional()
  @IsDate()
  updatedAt?: Date;

  @IsOptional()
  @IsDate()
  deletedAt?: Date;
}
