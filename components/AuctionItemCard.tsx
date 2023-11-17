import React from 'react';
import { Button } from './ui/button';
import { Card, CardHeader, CardTitle, CardContent } from './ui/card';
import { Listing } from '@/lib/schemas/listing';
import Link from 'next/link';
import Image from './Image';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { cn } from '@/lib/utils';
import fallbackImg from '@/public/fallback-image.webp';

dayjs.extend(relativeTime);

type Props = {
  listing: Listing;
};

const AuctionItemCard = ({ listing }: Props) => {
  const isEndingSoon = doesAuctionEndSoon(listing.endsAt);
  const endingTimeFormatted = dayjs(listing.endsAt).fromNow(true);

  return (
    <Card className='flex flex-col bg-secondary'>
      <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
        <CardTitle className='text-lg font-bold text-secondary-foreground lg:text-2xl'>
          <Link href={`/item/${listing.id}`} className='line-clamp-1'>
            {listing.title}
          </Link>
        </CardTitle>
      </CardHeader>
      <CardContent className='grid  flex-1 '>
        <div className='flex aspect-[16/10] items-center overflow-hidden rounded-md'>
          <Link href={`/item/${listing.id}`} className='w-full'>
            <Image
              src={listing.media.at(0) || fallbackImg}
              width={600}
              height={400}
              alt='Product Image'
              className='w-full'
            />
          </Link>
        </div>

        <p className='mt-2 line-clamp-2 max-h-[50px] text-gray-400 sm:text-sm md:text-lg'>
          {listing.description}
        </p>
        <div className='flex items-center justify-between pb-4 sm:flex-col sm:items-start sm:justify-start'>
          <p className='mt-2 text-xl text-card-foreground'>
            ${listing?.bids?.at(-1)?.amount || '0'}
          </p>
          <p className='text-gray-400'>
            Ends in{' '}
            <span
              className={cn(
                isEndingSoon ? 'font-bold text-accent' : 'font-medium',
              )}
            >
              {endingTimeFormatted}
            </span>
          </p>
        </div>
        <Button
          className='border border-accent bg-transparent text-secondary-foreground transition-colors duration-200 hover:bg-accent hover:text-accent-foreground'
          size='lg'
        >
          See more
        </Button>
      </CardContent>
    </Card>
  );
};

export default AuctionItemCard;

function doesAuctionEndSoon(endsAt: string) {
  const endingTime = new Date(endsAt).getTime();
  const now = new Date().getTime();
  const twelveHoursInMs = 13 * 60 * 60 * 1000;
  const isEndingSoon = endingTime - now < twelveHoursInMs;

  return isEndingSoon;
}
