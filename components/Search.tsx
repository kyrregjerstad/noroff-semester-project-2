'use client';

import { Search as SearchIcon } from 'lucide-react';
import { createUrl } from '@/lib/utils';
import { useRouter, useSearchParams } from 'next/navigation';
import { Input } from './ui/input';
import { FormEvent } from 'react';
import { Button } from './ui/button';

const SearchInput = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const searchValue = (e.target as HTMLFormElement).search.value;
    const newParams = new URLSearchParams(searchParams.toString());
    searchValue ? newParams.set('q', searchValue) : newParams.delete('q');
    router.push(createUrl('/search', newParams));
  };

  return (
    <form
      onSubmit={onSubmit}
      className='w-max-[550px] relative w-full lg:w-80 xl:w-full'
    >
      <Input
        key={searchParams?.get('q')}
        type='text'
        name='search'
        placeholder='Search...'
        defaultValue={searchParams?.get('q') || ''}
        className='w-full rounded-lg border bg-background px-4 py-2 text-sm text-foreground placeholder:text-neutral-500'
        autoComplete='off'
      />
      <div className='absolute right-0 top-0 mr-3 flex h-full items-center'>
        <Button variant='text' className='text-foreground'>
          <SearchIcon />
        </Button>
      </div>
    </form>
  );
};

export default SearchInput;
