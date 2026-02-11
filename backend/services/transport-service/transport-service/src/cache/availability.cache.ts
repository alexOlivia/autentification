import { ClientRedis } from 'redis';
import { promisify } from 'util';

export class AvailabilityCache {
    private redis: ClientRedis;

    constructor(redisClient: ClientRedis) {
        this.redis = redisClient;
    }

    async getAvailability(vehicleId: string, tripId: string): Promise<any> {
        const key = this.generateKey(vehicleId, tripId);
        const getAsync = promisify(this.redis.get).bind(this.redis);
        const data = await getAsync(key);
        return data ? JSON.parse(data) : null;
    }

    async cacheAvailability(vehicleId: string, tripId: string, data: any, expiration: number = 600): Promise<void> {
        const key = this.generateKey(vehicleId, tripId);
        const setAsync = promisify(this.redis.setex).bind(this.redis);
        await setAsync(key, expiration, JSON.stringify(data));
    }

    async invalidateCache(vehicleId: string): Promise<void> {
        const keyPattern = `availability:${vehicleId}:*`;
        const keys = await this.redis.keys(keyPattern);
        if (keys.length > 0) {
            const delAsync = promisify(this.redis.del).bind(this.redis);
            await Promise.all(keys.map(key => delAsync(key)));
        }
    }

    private generateKey(vehicleId: string, tripId: string): string {
        return `availability:${vehicleId}:${tripId}`;
    }
}