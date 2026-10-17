import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
// Load the core entry point first; the debrid services import each other.
import '../index.js';
import type { PlaybackInfo } from './base.js';
import { buildResolveKey } from './utils.js';

const playbackInfo: PlaybackInfo = {
  type: 'usenet',
  hash: 'release-hash',
  nzb: 'https://indexer.example/download?link=release-1',
};

describe('buildResolveKey', () => {
  it('shares usenet resolve locks across client IPs but keeps cache keys scoped', () => {
    const preloadIp = '172.23.0.1';
    const clientIp = '192.168.2.1';
    const lockFlags = { cacheAndPlay: false, includeClientIp: false };

    const preloadCacheKey = buildResolveKey(
      'uss:cache',
      'nzbdav',
      playbackInfo,
      'episode.mkv',
      'token',
      preloadIp
    );
    const clientCacheKey = buildResolveKey(
      'uss:cache',
      'nzbdav',
      playbackInfo,
      'episode.mkv',
      'token',
      clientIp
    );
    const preloadLockKey = buildResolveKey(
      'uss:lock',
      'nzbdav',
      playbackInfo,
      'episode.mkv',
      'token',
      preloadIp,
      lockFlags
    );
    const clientLockKey = buildResolveKey(
      'uss:lock',
      'nzbdav',
      playbackInfo,
      'episode.mkv',
      'token',
      clientIp,
      lockFlags
    );

    assert.notEqual(preloadCacheKey, clientCacheKey);
    assert.equal(preloadLockKey, clientLockKey);
  });
});
