import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type ProductDocument = Product & Document;

@Schema({ timestamps: true })
export class Product {
  @Prop({ required: true, trim: true })
  name: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true, min: 0 })
  price: number;

  @Prop()
  imageUrl: string;

  @Prop({ type: Types.ObjectId, ref: 'Category', index: true })
  category: Types.ObjectId;

  @Prop({ required: true, min: 0, default: 0 })
  stockQuantity: number;
}

export const ProductSchema = SchemaFactory.createForClass(Product);

ProductSchema.index({ name: 'text', description: 'text' });
ProductSchema.index({ category: 1, createdAt: -1 });
ProductSchema.index({ price: 1 });
ProductSchema.index({ createdAt: -1 });
