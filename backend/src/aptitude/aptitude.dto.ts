import { IsMongoId, IsEnum, IsNumber, IsString } from 'class-validator';

export class StartAptitudeSessionDto {
    @IsEnum(['RAPID', 'STANDARD'])
    @IsString()
    mode: 'RAPID' | 'STANDARD';
}

export class SubmitAptitudeAnswerDto {
    @IsMongoId()
    sessionId: string;

    @IsMongoId()
    questionId: string;

    @IsNumber()
    selectedOption: number;
}
