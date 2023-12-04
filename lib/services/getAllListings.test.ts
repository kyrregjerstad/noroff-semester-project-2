import { describe, it, expect, vi, Mock } from 'vitest';
import { getAllListings } from './getAllListings';
import * as auctionAPIFetcherModule from './auctionAPIFetcher';
import { allListingsSchema } from '../schemas/listing';
import { emptyBid, emptyListing } from '../mocks/data';

vi.mock('./auctionAPIFetcher', () => {
  return {
    default: vi.fn(),
  };
});

vi.mock('../schemas/listing', () => {
  return {
    allListingsSchema: {},
  };
});

describe('getAllListings', () => {
  const mockFetchResponse = [
    {
      ...emptyListing,
      id: '1',
      title: 'Listing 1',
      description: 'Description 1',
      bids: [
        { ...emptyBid, amount: 100 },
        { ...emptyBid, amount: 50 },
      ],
    },
  ];

  it('should fetch listings with default parameters', async () => {
    (auctionAPIFetcherModule.default as Mock).mockResolvedValue(
      mockFetchResponse,
    );

    const listings = await getAllListings({});

    expect(auctionAPIFetcherModule.default).toHaveBeenCalledWith({
      endpoint: '/listings',
      schema: allListingsSchema,
      queryParams: {
        _seller: true,
        _bids: true,
        _active: true,
        sort: 'created',
        order: 'desc',
        limit: undefined,
        offset: undefined,
      },
    });

    expect(listings[0].bids[0].amount).toBe(100);
  });
});
