import { RedisPubSub } from 'graphql-redis-subscriptions';
import dotenv from "dotenv";

dotenv.config()

export default new RedisPubSub({
	connection: {
		host: process.env.REDIS_HOST || "127.0.0.1",
		port: 6379,
	},
	retryStrategy: (times) => {
		// reconnect after
		return Math.min(times * 50, 2000);
	},
});