import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {

    return 'Hello 10n1s backend!';
  }
}
