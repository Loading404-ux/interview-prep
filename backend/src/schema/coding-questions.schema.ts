import { Document,Schema as MongooseSchema  } from "mongoose";
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ _id: false }) // IMPORTANT: prevents Mongo from creating _id
export class Editorial {

  @Prop({ required: true })
  approach: string;

  @Prop({ required: true })
  timeComplexity: string;

  @Prop({ required: true })
  spaceComplexity: string;
}

const EditorialSchema = SchemaFactory.createForClass(Editorial);

@Schema({ _id: false }) // IMPORTANT
export class Example {


  @Prop({ type: MongooseSchema.Types.Mixed, required: true })
  input: any;

  @Prop({ type: MongooseSchema.Types.Mixed, required: true })
  output: any;
}

const ExampleSchema = SchemaFactory.createForClass(Example);
@Schema({ timestamps: true })
export class CodingQuestion extends Document {

  @Prop({type:String, required: true })
  title: string;

  @Prop({ enum: ['Easy', 'Medium', 'Hard'], required: true })
  difficulty: string;

  @Prop({ type: [String], index: true })
  topics: string[];

  @Prop({ index: true })
  company: string;

  @Prop({ required: true })
  problem: string;

  @Prop({ type: EditorialSchema, required: true })
  editorial: Editorial;

  @Prop({ type: [ExampleSchema], default: [] })
  examples: Example[];

}

export const CodingQuestionSchema = SchemaFactory.createForClass(CodingQuestion);