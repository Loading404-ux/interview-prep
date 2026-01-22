import { Test, TestingModule } from '@nestjs/testing';
import { CodingService } from './coding.service';
import { SubmissionVerdict } from '../schema/coding-submission.schema';
import { Types } from 'mongoose';
import { CodingRepository } from './coding.repository';

describe('CodingService', () => {
  let service: CodingService;
  let repo: jest.Mocked<CodingRepository>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CodingService, {
        provide: CodingRepository,
        useValue: {
          createInitialSubmission: jest.fn(),
        },
      },],
    }).compile();

    service = module.get<CodingService>(CodingService);
    repo = module.get(CodingRepository);
  });

  it('should create a submission for a user', async () => {
    const fakeUserId = new Types.ObjectId().toString();

    const dto = {
      questionId: new Types.ObjectId().toString(),
      solutionText: 'function twoSum() {}',
      explanation: 'Using hashmap',
    };

    const mockSubmission = {
      _id: new Types.ObjectId(),
      userId: new Types.ObjectId(fakeUserId),
      questionId: new Types.ObjectId(dto.questionId),
      solutionText: dto.solutionText,
      explanation: dto.explanation,
      verdict: SubmissionVerdict.NEEDS_IMPROVEMENT,
    };

    repo.createInitialSubmission.mockResolvedValue(mockSubmission as any);

    const result = await service.submitSolution(fakeUserId, fakeUserId, dto);

    expect(repo.createInitialSubmission).toHaveBeenCalledWith({
      userId: expect.any(Types.ObjectId),
      questionId: expect.any(Types.ObjectId),
      solutionText: dto.solutionText,
      explanation: dto.explanation,
    });

    expect(result.verdict).toBe(SubmissionVerdict.NEEDS_IMPROVEMENT);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});


//NOTE for integration mongodb

// describe('CodingService (integration)', () => {
//   let service: CodingService;
//   let mongo: MongoMemoryServer;

//   beforeAll(async () => {
//     mongo = await MongoMemoryServer.create();

//     const module = await Test.createTestingModule({
//       imports: [
//         MongooseModule.forRoot(mongo.getUri()),
//         MongooseModule.forFeature([
//           { name: CodingSubmission.name, schema: CodingSubmissionSchema },
//         ]),
//       ],
//       providers: [CodingService, CodingRepository],
//     }).compile();

//     service = module.get(CodingService);
//   });

//   afterAll(async () => {
//     await mongo.stop();
//   });

//   it('should insert submission into database', async () => {
//     const userId = new Types.ObjectId().toString();

//     const dto = {
//       questionId: new Types.ObjectId().toString(),
//       solutionText: 'solution',
//       explanation: 'explanation',
//     };

//     const result = await service.submitSolution(userId, dto);

//     expect(result._id).toBeDefined();
//     expect(result.verdict).toBe(SubmissionVerdict.NEEDS_IMPROVEMENT);
//   });
// });