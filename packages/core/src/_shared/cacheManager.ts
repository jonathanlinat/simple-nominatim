/**
 * MIT License
 *
 * Copyright (c) 2023-2025 Jonathan Linat <https://github.com/jonathanlinat>
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software:"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

import { LRUCache } from "lru-cache";

/**
 * Configuration options for the cache
 */
export interface CacheConfig {
  /**
   * Enable or disable caching
   * @default true
   */
  enabled?: boolean;

  /**
   * Time-to-live for cached entries in milliseconds
   * @default 300000 (5 minutes)
   */
  ttl?: number;

  /**
   * Maximum number of cached entries
   * @default 500
   */
  maxSize?: number;
}

/**
 * Cache manager for Nominatim API responses
 *
 * Uses LRU (Least Recently Used) cache to store API responses
 * and reduce redundant API calls. Cached entries expire after
 * the configured TTL (default: 5 minutes).
 *
 * @internal
 */
export class CacheManager<T extends object = object> {
  private cache: LRUCache<string, T>;
  private enabled: boolean;
  private hits = 0;
  private misses = 0;

  /**
   * Creates a new CacheManager instance
   *
   * @param config Cache configuration options
   */
  constructor(config: CacheConfig = {}) {
    this.enabled = config.enabled ?? true;
    this.cache = new LRUCache<string, T>({
      max: config.maxSize ?? 500,
      ttl: config.ttl ?? 300000,
      updateAgeOnGet: false,
      updateAgeOnHas: false,
    });
  }

  /**
   * Generate a cache key from endpoint and parameters
   *
   * @param endpoint The API endpoint
   * @param params URL search parameters
   * @returns A unique cache key
   */
  private generateKey(endpoint: string, params: URLSearchParams): string {
    const sortedParams = new URLSearchParams(
      Array.from(params.entries()).sort(([a], [b]) => a.localeCompare(b)),
    );

    return `${endpoint}:${sortedParams.toString()}`;
  }

  /**
   * Get a cached value if it exists
   *
   * @param endpoint The API endpoint
   * @param params URL search parameters
   * @returns The cached value or undefined
   */
  get(endpoint: string, params: URLSearchParams): T | undefined {
    if (!this.enabled) return undefined;

    const key = this.generateKey(endpoint, params);
    const value = this.cache.get(key);

    if (value !== undefined) {
      this.hits++;
    } else {
      this.misses++;
    }

    return value;
  }

  /**
   * Store a value in the cache
   *
   * @param endpoint The API endpoint
   * @param params URL search parameters
   * @param value The value to cache
   */
  set(endpoint: string, params: URLSearchParams, value: T): void {
    if (!this.enabled) return;

    const key = this.generateKey(endpoint, params);
    this.cache.set(key, value);
  }

  /**
   * Check if a cached entry exists
   *
   * @param endpoint The API endpoint
   * @param params URL search parameters
   * @returns True if the entry exists and is not expired
   */
  has(endpoint: string, params: URLSearchParams): boolean {
    if (!this.enabled) return false;

    const key = this.generateKey(endpoint, params);

    return this.cache.has(key);
  }

  /**
   * Clear all cached entries
   */
  clear(): void {
    this.cache.clear();
    this.hits = 0;
    this.misses = 0;
  }

  /**
   * Get cache statistics
   *
   * @returns Object containing cache hits, misses, and hit rate
   */
  getStats(): { hits: number; misses: number; hitRate: number; size: number } {
    const total = this.hits + this.misses;
    const hitRate = total > 0 ? this.hits / total : 0;

    return {
      hits: this.hits,
      misses: this.misses,
      hitRate: Math.round(hitRate * 100) / 100,
      size: this.cache.size,
    };
  }

  /**
   * Check if caching is enabled
   *
   * @returns True if caching is enabled
   */
  isEnabled(): boolean {
    return this.enabled;
  }

  /**
   * Enable or disable caching
   *
   * @param enabled Whether to enable caching
   */
  setEnabled(enabled: boolean): void {
    this.enabled = enabled;

    if (!enabled) {
      this.clear();
    }
  }
}
