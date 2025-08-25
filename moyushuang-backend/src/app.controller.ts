import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { NeedLogin } from './decorator/custom.decorator';

@Controller()
@NeedLogin()
export class AppController {
  constructor(private readonly appService: AppService) {}
}
