import { Test, TestingModule } from '@nestjs/testing';
import { AptitudeController } from './aptitude.controller';

describe('AptitudeController', () => {
  let controller: AptitudeController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AptitudeController],
    }).compile();

    controller = module.get<AptitudeController>(AptitudeController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
