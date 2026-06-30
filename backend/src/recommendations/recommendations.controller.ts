import { Controller, Get, Request } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { RecommendationsService } from './recommendations.service';
import { Public } from '../common/decorators/public.decorator';

@ApiTags('recommendations')
@Controller('recommendations')
export class RecommendationsController {
  constructor(private readonly recommendationsService: RecommendationsService) {}

  @Public()
  @Get()
  getRecommendations(@Request() req: any) {
    const userId = req.user?.userId;
    return this.recommendationsService.getRecommendations(userId);
  }
}
