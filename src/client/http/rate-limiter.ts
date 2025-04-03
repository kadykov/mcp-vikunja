/**
 * Client-side rate limiter for the Vikunja HTTP client
 */
export class RateLimiter {
  private counter: number = 0;
  private windowStart: number = Date.now();

  constructor(
    private maxRequests: number,
    private timeWindow: number
  ) {}

  /**
   * Check rate limit and wait if needed before making a request
   */
  async waitIfNeeded(): Promise<void> {
    const now = Date.now();
    if (now - this.windowStart >= this.timeWindow) {
      // New window started
      this.counter = 0;
      this.windowStart = now;
    }

    if (this.counter >= this.maxRequests) {
      // Wait for current window to end
      const waitTime = this.windowStart + this.timeWindow - now;
      await new Promise(resolve => setTimeout(resolve, waitTime));
      this.counter = 0;
      this.windowStart = Date.now();
    }

    this.counter++;
  }
}
