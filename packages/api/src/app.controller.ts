import { Controller, Get, VERSION_NEUTRAL } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';

@ApiTags('Start')
@Controller({
  path: '',
  version: VERSION_NEUTRAL,
})
@Throttle()
export class AppController {
  constructor() {
    //
  }

  @Get('')
  getRoot() {
    return 'ok';
  }
}
