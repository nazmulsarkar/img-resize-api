import { Test, TestingModule } from '@nestjs/testing';
import { GaleryService } from './galery.service';

describe('GaleryService', () => {
  let service: GaleryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GaleryService],
    }).compile();

    service = module.get<GaleryService>(GaleryService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
