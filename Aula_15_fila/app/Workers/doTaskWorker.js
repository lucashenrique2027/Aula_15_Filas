import amqplib from 'amqplib';
import dotenv from 'dotenv';
import DoTaskJob from '../../app/Jobs/DoTaskJob.js';

dotenv.config();

const {
  RABBITMQ_USER,
  RABBITMQ_PASSWORD,
  RABBITMQ_HOST,
  RABBITMQ_PORT,
  RABBITMQ_QUEUE = 'do-task-queue',
  RABBITMQ_CONCURRENCY = '1',
} = process.env;

const concurrency = parseInt(RABBITMQ_CONCURRENCY, 10) || 1;

async function startWorker() {
  try {
    const amqpUrl = `amqp://${RABBITMQ_USER}:${RABBITMQ_PASSWORD}@${RABBITMQ_HOST}:${RABBITMQ_PORT}`;

    console.log(`[Worker] Conectando no RabbitMQ em ${amqpUrl}`);

    const connection = await amqplib.connect(amqpUrl);
    const channel = await connection.createChannel();

    await channel.assertQueue(RABBITMQ_QUEUE, { durable: true });
    channel.prefetch(concurrency);

    console.log(`[Worker] Escutando fila "${RABBITMQ_QUEUE}" com concorrência ${concurrency}`);

    channel.consume(
      RABBITMQ_QUEUE,
      async (msg) => {
        if (!msg) return;

        try {
          const payload = JSON.parse(msg.content.toString());
          console.log('[Worker] Processando job:', payload);

          await DoTaskJob.handle(payload);

          console.log('[Worker] Job processado com sucesso:', payload);
          channel.ack(msg);
        } catch (error) {
          console.error('[Worker] Erro ao processar job:', error);
          channel.nack(msg, false, false); // descarta a mensagem
        }
      },
      { noAck: false }
    );

    process.on('SIGINT', async () => {
      console.log('[Worker] Finalizando...');
      await channel.close();
      await connection.close();
      process.exit(0);
    });
  } catch (error) {
    console.error('[Worker] Erro ao iniciar:', error);
    process.exit(1);
  }
}

startWorker();
