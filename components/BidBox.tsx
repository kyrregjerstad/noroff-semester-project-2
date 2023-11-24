'use client';

import { placeBid } from '@/lib/services/placeBid';
import { use, useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { getServerSession } from 'next-auth';
import { useSession } from 'next-auth/react';
import { QueryClient, useMutation } from '@tanstack/react-query';

type BidBoxProps = {
  listingId: string;
  currentBid: number;
};

const BidBox = ({ listingId, currentBid }: BidBoxProps) => {
  const session = useSession();
  const [amount, setAmount] = useState(Math.round(currentBid * 1.1));

  const { data } = session;

  const queryClient = new QueryClient();

  const { mutate } = useMutation({
    mutationFn: (amount: number) =>
      placeBid({
        listingId,
        amount: amount,
        jwt: data!.user.accessToken,
      }),
    onSettled: () =>
      queryClient.invalidateQueries({
        queryKey: ['currentBid', listingId, currentBid],
      }),
    mutationKey: ['currentBid', listingId, currentBid],
  });

  if (!data?.user) return null;

  const handleSubmit = async () => {
    mutate(amount);
  };

  return (
    <div className='flex w-full max-w-sm items-center space-x-2'>
      <Input
        type='number'
        placeholder={`${Math.round(currentBid * 1.1)}`}
        className='w-24'
        min={currentBid + 1}
        onChange={(e) => setAmount(Number(e.target.value))}
        value={amount}
      />

      <Button
        className='bg-accent text-white'
        variant='default'
        onClick={handleSubmit}
      >
        Place a bid
      </Button>
    </div>
  );
};

export default BidBox;
