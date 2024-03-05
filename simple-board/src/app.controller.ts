import { Controller, Get, Query } from '@nestjs/common';
import { AppService } from './app.service';
import { Ip } from './decorators/ip.decorator';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('name')
  getName(@Ip('ip') ip: string, @Query('name') name: string): string {
    console.log(ip);
    return `${name} (${ip}) hello`;
  }
}
