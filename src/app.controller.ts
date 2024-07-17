import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHealtCheck(): string {
    return 'Ok!';
  }

  @Get('init')
  async askChatGPT(): Promise<string> {
    const country = 'Inglaterra';
    return this.appService.execute(country);
  }
}
