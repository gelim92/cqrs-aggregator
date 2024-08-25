import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AggregatorModule } from './aggregator/aggregator.module';
import { EmailModule } from './email/email.module';

@Module({
  imports: [AggregatorModule, EmailModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
