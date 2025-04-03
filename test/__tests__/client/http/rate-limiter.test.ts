import { RateLimiter } from '../../../../src/client/http/rate-limiter';

describe('RateLimiter', () => {
  // Use a shorter window for faster tests
  const maxRequests = 3;
  const timeWindow = 100; // 100ms

  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('should allow requests within limit', async () => {
    const limiter = new RateLimiter(maxRequests, timeWindow);

    // Make requests up to the limit
    for (let i = 0; i < maxRequests; i++) {
      await limiter.waitIfNeeded();
    }
  });

  it('should delay request when limit reached', async () => {
    const limiter = new RateLimiter(maxRequests, timeWindow);

    // Make requests up to the limit
    for (let i = 0; i < maxRequests; i++) {
      await limiter.waitIfNeeded();
    }

    // Next request should be delayed
    const waitPromise = limiter.waitIfNeeded();

    // Fast-forward to the end of the window
    jest.advanceTimersByTime(timeWindow);

    await waitPromise;
  });

  it('should reset counter after window', async () => {
    const limiter = new RateLimiter(maxRequests, timeWindow);

    // Fill up the window
    for (let i = 0; i < maxRequests; i++) {
      await limiter.waitIfNeeded();
    }

    // Advance time past the window
    jest.advanceTimersByTime(timeWindow);

    // Should be able to make more requests
    for (let i = 0; i < maxRequests; i++) {
      await limiter.waitIfNeeded();
    }
  });
});
