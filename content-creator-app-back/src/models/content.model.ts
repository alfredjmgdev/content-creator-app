import mongoose, { Schema, Document } from 'mongoose';
import { IsString, IsArray, IsDate, IsOptional, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export interface IContent extends Document {
  title: string;
  themesIds: string[];
  values: {
    categoryId: string;
    value: string;
  }[];
  userId: string;
  createdAt: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}

class ContentValue {
  @IsString()
  categoryId!: string;

  @IsString()
  value!: string;
}

export class ContentDto {
  @IsString()
  title!: string;

  @IsArray()
  @IsString({ each: true })
  themesIds!: string[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ContentValue)
  values!: ContentValue[];

  @IsString()
  userId!: string;

  @IsDate()
  createdAt!: Date;

  @IsOptional()
  @IsDate()
  updatedAt?: Date;

  @IsOptional()
  @IsDate()
  deletedAt?: Date;
}

const ContentSchema: Schema = new Schema({
  title: { type: String, required: true },
  themesIds: [{ type: Schema.Types.ObjectId, ref: 'Theme' }],
  values: [{
    categoryId: { type: Schema.Types.ObjectId, ref: 'Category' },
    value: String
  }],
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date },
  deletedAt: { type: Date }
}, { timestamps: false });

export default mongoose.model<IContent>('Content', ContentSchema);
