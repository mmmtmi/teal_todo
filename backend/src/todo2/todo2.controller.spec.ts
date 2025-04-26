import { Test, TestingModule } from '@nestjs/testing';
import { Todo2Controller } from './todo2.controller';
import { Todo2Service } from './todo2.service';

describe('Todo2Controller', () => {
  let controller: Todo2Controller;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [Todo2Controller],
      providers: [Todo2Service],
    }).compile();

    controller = module.get<Todo2Controller>(Todo2Controller);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
