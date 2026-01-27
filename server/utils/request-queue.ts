/**
 * Simple request queue to throttle API requests and prevent rate limiting
 */

interface QueuedRequest {
  key: string;
  fn: () => Promise<any>;
  resolve: (value: any) => void;
  reject: (error: any) => void;
}

class RequestQueue {
  private queue: QueuedRequest[] = [];
  private processing = false;
  private requestTimestamps = new Map<string, number[]>();
  private maxRequestsPerSecond = 2; // Max 2 requests per second per endpoint
  private minIntervalBetweenRequests = 500; // Minimum 500ms between requests to same endpoint

  async enqueue<T>(key: string, fn: () => Promise<T>): Promise<T> {
    return new Promise((resolve, reject) => {
      this.queue.push({ key, fn, resolve, reject });
      this.process();
    });
  }

  private async process() {
    if (this.processing || this.queue.length === 0) {
      return;
    }

    this.processing = true;

    while (this.queue.length > 0) {
      const request = this.queue.shift();
      if (!request) break;

      try {
        // Wait if needed to respect rate limiting
        await this.waitIfNeeded(request.key);

        // Track this request
        this.recordRequest(request.key);

        // Execute the request
        const result = await request.fn();
        request.resolve(result);
      } catch (error) {
        request.reject(error);
      }

      // Small delay between requests to different endpoints
      await this.delay(100);
    }

    this.processing = false;
  }

  private waitIfNeeded(key: string): Promise<void> {
    return new Promise((resolve) => {
      const timestamps = this.requestTimestamps.get(key) || [];
      const now = Date.now();

      // Remove timestamps older than 1 second
      const recentTimestamps = timestamps.filter(
        (ts) => now - ts < 1000
      );

      if (recentTimestamps.length >= this.maxRequestsPerSecond) {
        // Wait until oldest request expires
        const oldestTimestamp = recentTimestamps[0];
        const waitTime = Math.max(0, oldestTimestamp + 1000 - now + 100);
        setTimeout(resolve, waitTime);
      } else {
        // Check if enough time has passed since last request
        if (recentTimestamps.length > 0) {
          const lastTimestamp = recentTimestamps[recentTimestamps.length - 1];
          const timeSinceLastRequest = now - lastTimestamp;
          if (timeSinceLastRequest < this.minIntervalBetweenRequests) {
            const waitTime =
              this.minIntervalBetweenRequests - timeSinceLastRequest;
            setTimeout(resolve, waitTime);
          } else {
            resolve();
          }
        } else {
          resolve();
        }
      }
    });
  }

  private recordRequest(key: string): void {
    const now = Date.now();
    const timestamps = this.requestTimestamps.get(key) || [];

    // Remove timestamps older than 1 second
    const recentTimestamps = timestamps.filter((ts) => now - ts < 1000);
    recentTimestamps.push(now);

    this.requestTimestamps.set(key, recentTimestamps);
  }

  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}

// Export singleton instance
export const requestQueue = new RequestQueue();
