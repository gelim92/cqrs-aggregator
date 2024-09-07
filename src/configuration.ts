export default () => ({
  port: 4200,
  cqrsQueueUrl: 'amqp://localhost',
  cqrsOrderQueueName: 'cqrsOrder',
});
