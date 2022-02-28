import { ConfigService } from '@nestjs/config';
import { Injectable } from '@nestjs/common';
import { SQS } from 'aws-sdk';
import { IResizeMessage } from './dto/resize-message';

@Injectable()
export class SqsService {
  private readonly sqs: SQS;
  private readonly queueName: string;
  private readonly accountId: string;
  private readonly queueUrl: string;

  constructor(private readonly configService: ConfigService) {
    this.sqs = new SQS({
      accessKeyId: this.configService.get('AWS_ACCESS_KEY_ID'),
      secretAccessKey: this.configService.get('AWS_SECRET_ACCESS_KEY'),
      region: this.configService.get('AWS_REGION'),
      apiVersion: 'latest',
    });

    this.accountId = this.configService.get('SQS_ACCOUNT_ID');
    this.queueName = this.configService.get('SQS_QUEUE_NAME');
    this.queueUrl = `https://sqs.us-east-1.amazonaws.com/${this.accountId}/${this.queueName}`
  }

  async sendToQueue(message: IResizeMessage) {

    // Create SQS service client
    // Setup the sendMessage parameter object
    const params = {
      MessageBody: JSON.stringify(message),
      QueueUrl: this.queueUrl
    };

    this.sqs.sendMessage(params, (err, data) => {
      if (err) {
        console.log("Error", err);
      } else {
        console.log("Successfully added message", data.MessageId);
      }
    });
  }

  async sendToMultipleQueue(messages: IResizeMessage[]) {
    // Iterate and send to queue
    if (messages.length > 0) {
      for (let i = 0; i < messages.length; i++) {
        this.sendToQueue(messages[i]);
      }
    }
  }
}
