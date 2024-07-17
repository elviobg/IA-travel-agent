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
    const country = 'inglaterra';
    const question =
      'Vou viajar para Londres em dezembro de 2024. Quero que faça para um roteiro de viagem para mim com eventos que irão ocorrer na data da viagem e com o preço de passagem de São Paulo para Londres.';
    return this.appService.execute(country, question);
  }
}
