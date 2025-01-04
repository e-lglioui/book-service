import { registerAs } from '@nestjs/config';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';

export default registerAs('database', () => {
  const client = new DynamoDBClient({
    region: process.env.AWS_REGION || 'eu-north-1',
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID || 'your-access-key-id',
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || 'your-secret-access-key',
    },
  });

  const docClient = DynamoDBDocumentClient.from(client);

  return {
    dynamoDBClient: docClient,
    tableName: process.env.DYNAMODB_TABLE_NAME || 'sport_app',
  };
});
