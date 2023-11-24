'use client';

import ImageGallery from '@/components/ImageGallery';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Bid } from '@/lib/schemas/listing';
import { getSingleListing } from '@/lib/services/getSingleListing';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

import { Button, buttonVariants } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { placeBid } from '@/lib/services/placeBid';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

dayjs.extend(relativeTime);

const SingleListingPage = ({ listingId }: { listingId: string }) => {
  const session = useSession();
  const { data } = session;

  const queryClient = useQueryClient();

  const { data: singleListing, isLoading } = useQuery({
    queryKey: ['singleListing', listingId],
    queryFn: () => getSingleListing(listingId),
    refetchInterval: 10000, // refetch every 10 seconds
  });

  const isLoggedInUser = useIsLoggedInUser(singleListing?.seller.name);
  const isAuthenticated = session.status === 'authenticated';

  const calculateStartingAmount = (currentBid: number) =>
    Math.max(Math.round(currentBid * 1.1), currentBid + 1);

  const startingBid = calculateStartingAmount(
    singleListing?.bids?.at(-1)?.amount || 0,
  );

  const currentBid = singleListing?.bids?.at(-1)?.amount || 0;
  const [amount, setAmount] = useState(startingBid); // default to 10% more than the current bid (rounded), or 1 more than the current for low values

  const {
    mutate,
    isPending,
    variables: pendingAmount,
  } = useMutation({
    mutationFn: async (newAmount: number) =>
      placeBid({
        listingId,
        amount: newAmount,
        jwt: data!.user.accessToken,
      }),

    onSettled: async () => {
      return await queryClient.invalidateQueries({
        queryKey: ['singleListing', listingId],
      });
    },
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!singleListing) {
    return <div>No listing found</div>;
  }

  const { title, description, seller, media, bids } = singleListing;

  return (
    <>
      <ImageGallery images={media} />
      <div className='space-y-6'>
        <h1 className='text-3xl font-bold'>{title}</h1>
        <div className='flex items-end text-xl font-bold text-white'>
          {/* <AnimatedCounter
            value={isPending ? pendingAmount : currentBid}
            className='font-mono text-5xl tracking-tighter'
            incrementColor='#ea0062'
          /> */}
          <div className='text-5xl'>
            ${' '}
            {isPending ? (
              <span className='opacity-50'>{pendingAmount}</span>
            ) : (
              <span>{currentBid}</span>
            )}
          </div>
        </div>
        {isLoggedInUser ? (
          <Link
            href={`/listing/${listingId}/edit`}
            className={buttonVariants({ variant: 'accent' })}
          >
            Edit Listing
          </Link>
        ) : (
          <div className='flex w-full max-w-sm items-center space-x-2'>
            <Input
              type='number'
              placeholder={`${Math.round(currentBid * 1.1)}`}
              className='w-24'
              min={currentBid + 1}
              onChange={(e) => setAmount(Number(e.target.value))}
              value={amount}
              disabled={!isAuthenticated || isPending}
            />

            <Button
              className='bg-accent text-white'
              variant='default'
              onClick={() => mutate(amount)}
              disabled={!isAuthenticated || isPending}
            >
              Place a bid
            </Button>
            {!isAuthenticated && (
              <p className='text-sm text-gray-400'>
                You must be logged in to place a bid
              </p>
            )}
          </div>
        )}
        <p className='text-lg'>{description}</p>
        <div className='rounded-lg bg-zinc-800/50 p-6'>
          <h2 className='text-xl font-semibold'>Seller Information</h2>
          <div className='mt-4 flex items-center gap-2'>
            {seller.avatar ? (
              <Avatar className='h-8 w-8 border border-accent'>
                <AvatarImage src={seller.avatar} />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
            ) : (
              <svg
                className=' mr-2 h-8 w-8'
                fill='none'
                height='24'
                stroke='currentColor'
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth='2'
                viewBox='0 0 24 24'
                width='24'
                xmlns='http://www.w3.org/2000/svg'
              >
                <path d='M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2' />
                <circle cx='12' cy='7' r='4' />
              </svg>
            )}
            <span className='font-medium'>
              <Link href={`/user/${seller.name}`} className='hover:underline'>
                {seller.name}
              </Link>
            </span>
          </div>
          <div className='mt-2 flex items-center'>
            <svg
              className=' h-6 w-6 fill-accent'
              fill='none'
              height='24'
              stroke='currentColor'
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth='2'
              viewBox='0 0 24 24'
              width='24'
              xmlns='http://www.w3.org/2000/svg'
            >
              <polyline points='20 6 9 17 4 12' />
            </svg>
            <span className='ml-2'>Verified Seller</span>
          </div>
        </div>
        <BidHistory bids={bids} isLoggedIn={isAuthenticated} />
      </div>
    </>
  );
};

export default SingleListingPage;

function BidHistory({
  bids,
  isLoggedIn,
}: {
  bids?: Bid[];
  isLoggedIn: boolean;
}) {
  if (!isLoggedIn) {
    return (
      <div className='w-full max-w-md rounded-lg p-6 text-foreground'>
        <h2 className='mb-6 text-lg font-semibold text-accent'>Bid History</h2>
        <div className='relative m-3 leading-loose'>
          <div className='absolute left-[10px] top-2 h-full w-[2px]  bg-gradient-to-b from-accent' />
          <div className='flex h-32 items-center justify-center'>
            <p className='text-gray-400'>
              You must be logged in to view bid history
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (!bids || bids.length === 0) {
    return (
      <div className='w-full max-w-md rounded-lg p-6 text-foreground'>
        <h2 className='mb-6 text-lg font-semibold text-accent'>Bid History</h2>
        <div className='relative m-3 leading-loose'>
          <div className='absolute left-[10px] top-2 h-full w-[2px]  bg-gradient-to-b from-accent' />
          <div className='flex h-32 items-center justify-center'>
            <p className='text-gray-400'>No bids yet</p>
          </div>
        </div>
      </div>
    );
  }
  const reversedBids = bids.toReversed(); // get the most recent bids first
  return (
    <div className='w-full max-w-md rounded-lg p-6 text-foreground'>
      <h2 className='mb-6 text-lg font-semibold text-accent'>Bid History</h2>
      <div className='relative m-3 leading-loose'>
        <div className='absolute left-[10px] top-2 h-full w-[2px]  bg-gradient-to-b from-accent' />
        <ScrollArea className='h-96'>
          <ul className='list-none'>
            {reversedBids.map((bid, index) => (
              <BidHistoryItem key={bid.id} bid={bid} index={index} />
            ))}
          </ul>
        </ScrollArea>
      </div>
    </div>
  );
}

function BidHistoryItem({ bid, index }: { bid: Bid; index: number }) {
  const { created, amount, bidderName } = bid;
  const bidDate = dayjs(created).fromNow();
  return (
    <li className='mb-3'>
      <div className={`mb-1 flex items-center`}>
        <div
          className={`${
            index === 0 ? 'bg-accent' : 'bg-gray-600'
          } z-10 h-6 w-6 rounded-full`}
        />
        <div className='ml-4 flex-1 font-medium'>{bidDate}</div>
      </div>
      <div className='ml-12'>
        <h3 className='font-semibold'>${amount}</h3>
        <p className='text-sm text-gray-400'>{bidderName}</p>
      </div>
    </li>
  );
}

const useIsLoggedInUser = (username: string | undefined) => {
  const session = useSession();
  const { data } = session;
  if (!username || !data) {
    return false;
  }
  return session.status === 'authenticated' && data.user.name === username;
};