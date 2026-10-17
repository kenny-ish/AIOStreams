import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { IdParser } from '../../utils/id-parser.js';
import { matchTorrents } from './matching.js';

describe('matchTorrents', () => {
  it('matches a movie by a contained filename when the torrent name is a collection', async () => {
    const parsedId = IdParser.parse('tmdb:165', 'movie');
    assert.ok(parsedId);

    const results = await matchTorrents(
      [
        {
          id: 'download-1',
          hash: 'hash-1',
          name: 'Back to the Future 30th Anniversary Edition',
          status: 'cached',
          files: [
            {
              index: 0,
              name: 'Back to the Future (1985) 1080p BluRay.mkv',
              size: 1,
            },
            {
              index: 1,
              name: 'Back to the Future Part II (1989) 1080p BluRay.mkv',
              size: 1,
            },
          ],
        },
      ],
      { titles: ['Back to the Future Part II'], year: 1989 },
      parsedId
    );

    assert.equal(results.length, 1);
    assert.equal(results[0]?.hash, 'hash-1');
  });
});
