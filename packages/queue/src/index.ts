import { createClient } from 'redis';
import { RedisClientType } from 'redis';

const RedisClient: RedisClientType = createClient({url:'redis://localhost:6379'});

RedisClient.connect()
  .then(() => {
    console.log('Redis connected');
  })
  .catch((err) => {
    console.error('Redis connection error:', err);
  });

export default RedisClient;
