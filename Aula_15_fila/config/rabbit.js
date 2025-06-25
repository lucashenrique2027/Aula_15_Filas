import amqplib from 'amqplib';
import dotenv from 'dotenv';
import net from 'net';
import { URL } from 'url';

dotenv.config();

let sharedChannel = null;

const {
    RABBITMQ_USER,
    RABBITMQ_PASSWORD,
    RABBITMQ_HOST,
    RABBITMQ_PORT,
} = process.env;

const login = `${RABBITMQ_USER}:${RABBITMQ_PASSWORD}`;
const AMQP_URL = `amqp://${login}@${RABBITMQ_HOST}:${RABBITMQ_PORT}`;

// Utilizado apenas pelo WORKER
async function waitForRabbit(url, timeoutMs = 60000) {  // Aumentamos o tempo de timeout para 60 segundos
    const { hostname: host, port } = new URL(url);
    const portNum = parseInt(port, 10);
    const start = Date.now();

    return new Promise((resolve, reject) => {
        const tryConnect = () => {
            const socket = net.createConnection({ host, port: portNum });
            let done = false;

            socket
                .once('connect', () => {
                    if (!done) {
                        done = true;
                        socket.destroy();
                        console.log(`[RabbitMQ] Conexão bem-sucedida com ${host}:${portNum}`);
                        resolve();
                    }
                })
                .once('error', (err) => {
                    socket.destroy();
                    if (Date.now() - start > timeoutMs) {
                        if (!done) {
                            done = true;
                            console.error(`[RabbitMQ] Erro: Timeout esperando RabbitMQ em ${host}:${portNum}`);
                            reject(new Error(`Timeout esperando RabbitMQ em ${host}:${portNum}`));
                        }
                    } else {
                        console.log(`[RabbitMQ] Tentando conectar a ${host}:${portNum}...`);
                        setTimeout(tryConnect, 1000);
                    }
                });
        };

        tryConnect();
    });
}

// Para WORKERS (espera Rabbit)
export async function getConnection() {
    if (sharedChannel) return sharedChannel;

    console.log(`[RabbitMQ] Tentando conectar a ${AMQP_URL}...`);
    await waitForRabbit(AMQP_URL, 60000); // Aqui também configuramos o timeout para 60 segundos

    try {
        const connection = await amqplib.connect(AMQP_URL);
        console.log(`[RabbitMQ] Conexão estabelecida com sucesso.`);
        
        const channel = await connection.createChannel();
        sharedChannel = channel;
        return channel;
    } catch (error) {
        console.error(`[RabbitMQ] Falha na conexão: ${error.message}`);
        throw new Error('Falha ao conectar ao RabbitMQ');
    }
}

// Para PRODUCERS (rápido e pontual)
export async function quickConnect() {
    try {
        const connection = await amqplib.connect(AMQP_URL);
        const channel = await connection.createChannel();
        console.log(`[RabbitMQ] Conexão rápida bem-sucedida`);
        return { connection, channel };
    } catch (error) {
        console.error(`[RabbitMQ] Falha na conexão rápida: ${error.message}`);
        throw new Error('Falha ao conectar rapidamente ao RabbitMQ');
    }
}
