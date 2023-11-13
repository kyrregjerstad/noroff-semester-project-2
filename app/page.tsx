import AuctionItemCard from '@/components/auctionItemCard';
import useGetAllAuctionItems from '@/lib/hooks/useGetAllAuctionItems';

export default async function Home() {
  const listings = await useGetAllAuctionItems();

  return (
    <main className='flex min-h-screen flex-col items-center justify-between p-24'>
      {!listings ? (
        <div className='flex flex-col items-center justify-center'>
          <p className='mt-4 text-xl font-bold text-secondary-foreground'>
            No listings found
          </p>
        </div>
      ) : (
        <div className='grid grid-cols-3 gap-4'>
          {listings.map((listing) => (
            <AuctionItemCard key={listing.id} listing={listing} />
          ))}
        </div>
      )}
    </main>
  );
}
