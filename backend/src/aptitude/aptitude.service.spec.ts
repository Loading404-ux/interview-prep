import { Test, TestingModule } from '@nestjs/testing';
import { AptitudeService } from './aptitude.service';

describe('AptitudeService', () => {
  let service: AptitudeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AptitudeService],
    }).compile();

    service = module.get<AptitudeService>(AptitudeService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
