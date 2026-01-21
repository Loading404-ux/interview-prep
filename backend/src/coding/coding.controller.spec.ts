import { Test, TestingModule } from '@nestjs/testing';
import { CodingController } from './coding.controller';

describe('CodingController', () => {
  let controller: CodingController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CodingController],
    }).compile();

    controller = module.get<CodingController>(CodingController);
  });

  // describe('root', () => {
  //   it('should return "Hello World!"', () => {
  //     expect(controller.subbmition(null,)).toBe('Hello World!');
  //   });
  // });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
