import { singleListingSchema } from '@/lib/schemas/listing';

import { useClientJWT } from '../hooks/useClientJWT';
import auctionAPIFetcher from './auctionAPIFetcher';
import { AuctionFormComplete } from './postListing';

const workerUrl = process.env.NEXT_PUBLIC_WORKER_URL;

type Params = {
  formData: AuctionFormComplete;
};

const usePostListing = () => {
  const jwt = useClientJWT();

  const postListing = async ({ formData }: Params) => {
    const transformedMediaLinks = formData.imageUrls.map(
      (url) => `${workerUrl}/cache/${url}`,
    ); // add cloudflare worker url to cache the image, in order to reduce cloudinary costs

    const tagsArr = formData.tags?.split(' ').map((tag) => tag.trim()) || [];

    const transformedFormData = {
      title: formData.title,
      description: formData.description,
      media: transformedMediaLinks,
      tags: tagsArr,
      endsAt: formData.dateTime.toISOString(),
    };

    try {
      const res = await auctionAPIFetcher({
        endpoint: `/listings`,
        schema: singleListingSchema,
        jwt,
        method: 'POST',
        body: transformedFormData,
      });

      return res;
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  return { postListing };
};

export default usePostListing;