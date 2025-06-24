import { Controller } from '@nestjs/common';
import { JudgeService } from './judge.service';

@Controller('judge')
export class JudgeController {
  constructor(private readonly judgeService: JudgeService) {}
}
