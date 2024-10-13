import { Kafka, logLevel } from "kafkajs";

const kafka = new Kafka({
    clientId: 'task-management-app',
    brokers: ['localhost:9092'],
    logLevel: logLevel.NOTHING
});

const consumer = kafka.consumer({ groupId: 'task-data-consumer' });
const topic = 'task';

export const readMessages = async () => {
    try {
        await consumer.connect();
        await consumer.subscribe({ topic: topic, fromBeginning: false });
        await consumer.run({
            eachMessage: async ({ topic, partition, message }) => {
                console.log(`Consumer received : ${message.value?.toString()} on topic : ${topic} for partition : ${partition}`);
            }
        });
    } catch (error) {
        console.error(error);
    }
}