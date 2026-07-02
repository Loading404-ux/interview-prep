import { IsMongoId, IsEnum, IsNumber, IsString, IsOptional } from 'class-validator';
import { AptitudeSessionType } from 'src/schema/aptitude-session.schema';

export class StartAptitudeSessionDto {
    @IsEnum(AptitudeSessionType)
    @IsString()
    mode: 'RAPID' | 'STANDARD';

    @IsNumber()
    @IsOptional()
    onOfquestions?: number;
}

export class SubmitAptitudeAnswerDto {
    @IsMongoId()
    sessionId: string;

    @IsMongoId()
    questionId: string;

    @IsNumber()
    selectedOption: number;
}

export class CompleteAptitudeSessionDto {
  @IsMongoId()
  sessionId: string;
}