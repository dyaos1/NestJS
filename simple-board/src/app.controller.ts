import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Logger,
  Query,
} from '@nestjs/common';
import { AppService } from './app.service';
import { Ip } from './decorators/ip.decorator';
import { ConfigService } from '@nestjs/config';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly configService: ConfigService,
  ) {}

  private readonly logger = new Logger(AppController.name);

  @Get()
  getHello(): string {
    console.log(this.configService.get<string>('ENVIRONMENT'));
    return this.appService.getHello();
    // throw new HttpException('NotFound', HttpStatus.NOT_FOUND);
  }

  @Get('name')
  getName(@Ip('ip') ip: string, @Query('test') name: string): string {
    this.logger.log(ip);
    this.logger.debug(ip);
    this.logger.error(ip);
    this.logger.verbose(ip);
    this.logger.warn(ip);
    return `${name} (${ip}) hello`;
  }
}
