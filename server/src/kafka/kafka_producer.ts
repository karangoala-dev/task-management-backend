import { Kafka, logLevel } from 'kafkajs';

const kafka = new Kafka({
    clientId: 'task-management-app',
    brokers: ['localhost:9092'],
    logLevel: logLevel.ERROR
});

const producer = kafka.producer();

export const sendMessage = async (message: string) => {
    await producer.connect();
    await producer.send({
        topic: 'task',
        messages: [{ value: message }]
    });
    await producer.disconnect();
}