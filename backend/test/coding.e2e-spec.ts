import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';

import { AppModule } from '../src/app.module';
import { ClerkAuthGuard } from 'src/common/guard/clerk-auth.guard';
import { MockClerkAuthGuard } from './utils/mock-clerk-auth.guard';

describe('CodingModule E2E (auth overridden)', () => {
  let app: INestApplication;

  let questionId: string;
  let submissionId: string;
  let discussionId: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule =
      await Test.createTestingModule({
        imports: [AppModule], // uses real DatabaseModule
      })
        .overrideGuard(ClerkAuthGuard)
        .useClass(MockClerkAuthGuard)
        .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  /**
   * -------------------------
   * QUESTIONS
   * -------------------------
   */

  it('GET /coding/questions → returns questions', async () => {
    const res = await request(app.getHttpServer())
      .get('/coding/questions')
      .expect(200);

    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);

    questionId = res.body[0]._id;
  });

  it('GET /coding/question/:id → returns single question', async () => {
    const res = await request(app.getHttpServer())
      .get(`/coding/question/${questionId}`)
      .expect(200);

    expect(res.body._id).toBe(questionId);
  });

  /**
   * -------------------------
   * SUBMISSIONS
   * -------------------------
   */

  it('POST /coding/submit-solution → submit solution', async () => {
    const res = await request(app.getHttpServer())
      .post('/coding/submit-solution')
      .send({
        questionId,
        language: 'ts',
        code: 'console.log("e2e test")',
      })
      .expect(201);

    expect(res.body.questionId).toBe(questionId);
    submissionId = res.body._id;
  });

  it('GET /coding/submission/:id → get submissions', async () => {
    const res = await request(app.getHttpServer())
      .get(`/coding/submission/${questionId}`)
      .expect(200);

    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
  });

  it('PATCH /coding/submission/:id/vote → toggle vote', async () => {
    const res = await request(app.getHttpServer())
      .patch(`/coding/submission/${submissionId}/vote`)
      .send({ type: 'UP' })
      .expect(200);

    expect(res.body.upvotes).toBeDefined();
  });

  /**
   * -------------------------
   * DISCUSSIONS
   * -------------------------
   */

  it('POST /coding/discussion → add discussion', async () => {
    const res = await request(app.getHttpServer())
      .post('/coding/discussion')
      .send({
        content: 'E2E discussion test',
        parentId: questionId,
      })
      .expect(201);

    discussionId = res.body._id;
  });

  it('GET /coding/discussion/:id → get discussions', async () => {
    const res = await request(app.getHttpServer())
      .get(`/coding/discussion/${questionId}`)
      .expect(200);

    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
  });

  it('PATCH /coding/discussion/:id/vote → toggle vote', async () => {
    const res = await request(app.getHttpServer())
      .patch(`/coding/discussion/${discussionId}/vote`)
      .send({ type: 'UP' })
      .expect(200);

    expect(res.body.upvotes).toBeDefined();
  });
});
