import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Public } from './common/decorators/public.decorator';

/**
 * Root controller. With the global `api` prefix these map to `/api` and
 * `/api/health`, giving a friendly response at the API base URL (instead of a
 * 404) and a simple health-check endpoint. Both are public (no auth required).
 */
@ApiTags('health')
@Controller()
export class AppController {
  @Public()
  @Get()
  getRoot() {
    return {
      name: 'E-Commerce API',
      status: 'ok',
      docs: '/api/docs',
      timestamp: new Date().toISOString(),
    };
  }

  @Public()
  @Get('health')
  getHealth() {
    return { status: 'ok', timestamp: new Date().toISOString() };
  }
}
