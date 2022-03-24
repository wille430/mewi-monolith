import { Test, TestingModule } from '@nestjs/testing';
import { WatchersService } from './watchers.service';

describe('WatchersService', () => {
  let service: WatchersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [WatchersService],
    }).compile();

    service = module.get<WatchersService>(WatchersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
