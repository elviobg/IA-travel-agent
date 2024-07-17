import { Controller, Get, Param, Query } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('health-check')
  getHealtCheck(): string {
    return 'Ok!';
  }

  @Get()
  async askChatGPT(
    @Query() queryParams: any
  ): Promise<string> {
    const country = queryParams.pais
    const question =
      `Vou viajar para ${queryParams.destino} em ${queryParams.data}. Quero que faça para um roteiro de viagem para mim com eventos que irão ocorrer na data da viagem e com o preço de passagem de ${queryParams.origem} para ${queryParams.destino}.`;
    return this.appService.execute(country, question);
  }
}
