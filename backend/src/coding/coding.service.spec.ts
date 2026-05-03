// import { Test, TestingModule } from '@nestjs/testing';
// import { CodingService } from './coding.service';
// import { SubmissionVerdict } from '../schema/coding-submission.schema';
// import { Types } from 'mongoose';
// import { CodingRepository } from './coding.repository';

// describe('CodingService', () => {
//   let service: CodingService;
//   let repo: jest.Mocked<CodingRepository>;

//   beforeEach(async () => {
//     const module: TestingModule = await Test.createTestingModule({
//       providers: [CodingService, {
//         provide: CodingRepository,
//         useValue: {
//           createInitialSubmission: jest.fn(),
//         },
//       },],
//     }).compile();

//     service = module.get<CodingService>(CodingService);
//     repo = module.get(CodingRepository);
//   });

//   it('should create a submission for a user', async () => {
//     const fakeUserId = new Types.ObjectId().toString();

//     const dto = {
//       questionId: new Types.ObjectId().toString(),
//       solutionText: 'function twoSum() {}',
//       explanation: 'Using hashmap',
//     };

//     const mockSubmission = {
//       _id: new Types.ObjectId(),
//       userId: new Types.ObjectId(fakeUserId),
//       questionId: new Types.ObjectId(dto.questionId),
//       solutionText: dto.solutionText,
//       explanation: dto.explanation,
//       verdict: SubmissionVerdict.NEEDS_IMPROVEMENT,
//     };

//     repo.createInitialSubmission.mockResolvedValue(mockSubmission as any);

//     const result = await service.submitSolution(fakeUserId, fakeUserId, dto);

//     expect(repo.createInitialSubmission).toHaveBeenCalledWith({
//       userId: expect.any(Types.ObjectId),
//       questionId: expect.any(Types.ObjectId),
//       solutionText: dto.solutionText,
//       explanation: dto.explanation,
//     });

//     expect(result.verdict).toBe(SubmissionVerdict.NEEDS_IMPROVEMENT);
//   });

//   it('should be defined', () => {
//     expect(service).toBeDefined();
//   });
// });


// //NOTE for integration mongodb

// // describe('CodingService (integration)', () => {
// //   let service: CodingService;
// //   let mongo: MongoMemoryServer;

// //   beforeAll(async () => {
// //     mongo = await MongoMemoryServer.create();

// //     const module = await Test.createTestingModule({
// //       imports: [
// //         MongooseModule.forRoot(mongo.getUri()),
// //         MongooseModule.forFeature([
// //           { name: CodingSubmission.name, schema: CodingSubmissionSchema },
// //         ]),
// //       ],
// //       providers: [CodingService, CodingRepository],
// //     }).compile();

// //     service = module.get(CodingService);
// //   });

// //   afterAll(async () => {
// //     await mongo.stop();
// //   });

// //   it('should insert submission into database', async () => {
// //     const userId = new Types.ObjectId().toString();

// //     const dto = {
// //       questionId: new Types.ObjectId().toString(),
// //       solutionText: 'solution',
// //       explanation: 'explanation',
// //     };

// //     const result = await service.submitSolution(userId, dto);

// //     expect(result._id).toBeDefined();
// //     expect(result.verdict).toBe(SubmissionVerdict.NEEDS_IMPROVEMENT);
// //   });
// // });

import { Test, TestingModule } from '@nestjs/testing';
import { Types } from 'mongoose';

import { CodingService } from './coding.service';
import { CodingDiscussionRepository, CodingQuestionRepository, CodingSubmissionRepository } from './coding.repository';
import { AiService } from 'src/ai/ai.service';
import { ActivityService } from 'src/activity/activity.service';
import { UserProgressService } from 'src/user/user-progress.service';
import { ActivityLogType } from 'src/schema/activity-log.schema';
import { SubmissionVerdict } from 'src/schema/coding-submission.schema';

// import { CodingQuestionRepository } from './coding-question.repository';
// import { CodingSubmissionRepository } from './repositories/coding-submission.repository';
// import { CodingDiscussionRepository } from './repositories/coding-discussion.repository';

// import { AiService } from '../../ai/ai.service';
// import { ActivityService } from '../../activity/activity.service';
// import { UserProgressService } from '../../user/user-progress.service';

// import { SubmissionVerdict } from './enums/submission-verdict.enum';
// import { ActivityLogType } from '../../activity/enums/activity-log-type.enum';

describe('CodingService', () => {
  let service: CodingService;

  // ---- mocks ----
  const questionRepo = {
    getQuestions: jest.fn(),
    getQuestionById: jest.fn(),
  };

  const submissionRepo = {
    submitSolution: jest.fn(),
    findSubmissionById: jest.fn(),
    updateValue: jest.fn(),
    findVote: jest.fn(),
    createVote: jest.fn(),
    deleteVote: jest.fn(),
    updateVote: jest.fn(),
    getSubmissionsByQuestionId: jest.fn(),
  };

  const discussionRepo = {
    newDiscussion: jest.fn(),
    increateReplyCount: jest.fn(),
    getDiscussionsByQuestion: jest.fn(),
    findVote: jest.fn(),
    createVote: jest.fn(),
    deleteVote: jest.fn(),
    updateVote: jest.fn(),
  };

  const aiService = {
    aiCodeReview: jest.fn(),
  };

  const activityService = {
    record: jest.fn(),
  };

  const progressService = {
    onCodingAccepted: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CodingService,
        { provide: CodingQuestionRepository, useValue: questionRepo },
        { provide: CodingSubmissionRepository, useValue: submissionRepo },
        { provide: CodingDiscussionRepository, useValue: discussionRepo },
        { provide: AiService, useValue: aiService },
        { provide: ActivityService, useValue: activityService },
        { provide: UserProgressService, useValue: progressService },
      ],
    }).compile();

    service = module.get<CodingService>(CodingService);
    jest.clearAllMocks();
  });

  // ---------------- Questions ----------------
  it('should return all coding questions', async () => {
    questionRepo.getQuestions.mockResolvedValue(['q1', 'q2']);
    const result = await service.getQuestions();
    expect(result).toEqual(['q1', 'q2']);
  });

  // ---------------- Submissions ----------------
  it('should add submission, record activity, and trigger AI review', async () => {
    const submissionId = new Types.ObjectId();
    submissionRepo.submitSolution.mockResolvedValue({ _id: submissionId });

    jest
      .spyOn<any, any>(service, 'triggerAiReview')
      .mockResolvedValue(undefined);

    const result = await service.addSubmission(
      new Types.ObjectId().toString(),
      'clerk_123',
      {} as any,
    );

    expect(submissionRepo.submitSolution).toHaveBeenCalled();
    expect(activityService.record).toHaveBeenCalledWith(
      expect.objectContaining({
        eventType: ActivityLogType.CODING_SUBMITTED,
        referenceId: submissionId,
      }),
    );
    expect(result).toBe(true);
  });

  // ---------------- Votes ----------------
  it('should create vote if not exists', async () => {
    submissionRepo.findVote.mockResolvedValue(null);

    await service.toggleSubmissionVotes(
      new Types.ObjectId().toString(),
      'clerk_123',
      { submissionId: new Types.ObjectId().toString() } as any,
    );

    expect(submissionRepo.createVote).toHaveBeenCalled();
    expect(submissionRepo.updateVote).toHaveBeenCalledWith(
      expect.any(Types.ObjectId),
      1,
    );
  });

  it('should remove vote if already exists', async () => {
    submissionRepo.findVote.mockResolvedValue({ _id: 'vote' });

    await service.toggleSubmissionVotes(
      new Types.ObjectId().toString(),
      'clerk_123',
      { submissionId: new Types.ObjectId().toString() } as any,
    );

    expect(submissionRepo.deleteVote).toHaveBeenCalled();
    expect(submissionRepo.updateVote).toHaveBeenCalledWith(
      expect.any(Types.ObjectId),
      -1,
    );
  });

  // ---------------- Discussions ----------------
  // it('should add discussion and increase reply count if parent exists', async () => {
  //   discussionRepo.newDiscussion.mockResolvedValue({ _id: 'd1' });

  //   const result = await service.addDiscussion(
  //     new Types.ObjectId().toString(),
  //   );

  //   expect(discussionRepo.increateReplyCount).toHaveBeenCalled();
  //   expect(result).toBeDefined();
  // });

  // ---------------- AI Review ----------------
  it('should process AI review and update submission + progress', async () => {
    const submissionId = new Types.ObjectId();
    const userId = new Types.ObjectId();

    submissionRepo.findSubmissionById.mockReturnValue({
      populate: jest.fn().mockResolvedValue({
        _id: submissionId,
        solution: 'code',
        questionId: new Types.ObjectId(),
        userId,
        clerkUserId: 'clerk_123',
      }),
    });

    questionRepo.getQuestionById.mockResolvedValue({
      title: 'Two Sum',
      problem: 'desc',
      examples: [],
      constraints: [],
      topics: ['array'],
      difficulty: 'easy',
    });

    aiService.aiCodeReview.mockResolvedValue({
      verdict: SubmissionVerdict.ACCEPTED,
      aiFeedback: {
        clarityScore: 8,
        correctnessScore: 9,
      },
    });

    await (service as any).triggerAiReview(submissionId.toString());

    expect(submissionRepo.updateValue).toHaveBeenCalled();
    expect(progressService.onCodingAccepted).toHaveBeenCalledWith(
      expect.any(Types.ObjectId),
      8.5,
    );
    expect(activityService.record).toHaveBeenCalledWith(
      expect.objectContaining({
        eventType: ActivityLogType.CODING_ACCEPTED,
      }),
    );
  });
});
