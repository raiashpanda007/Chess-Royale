import { createClient, RedisClientType } from 'redis';

export default class RedisClient {
  private static instance: RedisClient;
  private client: RedisClientType;

  // Private constructor to prevent direct instantiation
  private constructor() {
    this.client = createClient({ url: process.env.REDIS_URL });

    // Handle connection events
    this.client.on('connect', () => {
      console.log('Redis connected');
    });

    this.client.on('error', (err) => {
      console.error('Redis connection error:', err);
    });

    this.client.connect(); // Connect to Redis when the instance is created
  }

  // Public method to get the singleton instance
  public static getInstance(): RedisClient {
    if (!RedisClient.instance) {
      RedisClient.instance = new RedisClient();
    }

    return RedisClient.instance;
  }

  // Public method to access the Redis client
  public getClient(): RedisClientType {
    return this.client;
  }
}
