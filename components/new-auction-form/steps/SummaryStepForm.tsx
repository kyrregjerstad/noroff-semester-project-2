'use client';

import useMultiStepAuctionForm from '@/lib/hooks/forms/useMultiStepForm';
import useAuctionFormStore from '@/lib/hooks/useAuctionFormStore';
import useStore from '@/lib/hooks/useStore';
import { Label } from '@radix-ui/react-dropdown-menu';
import Image from '../../Image';
import StepNavigation from './StepNavigation';

const SummaryStepForm = () => {
  const { summary, saveStep } = useMultiStepAuctionForm({
    mode: 'create',
    listing: null,
    step: 'summary',
  });

  const auctionFormData = useStore(useAuctionFormStore, (state) =>
    state.getStore(),
  );

  const formState = auctionFormData;

  const {
    control,
    formState: { isDirty, isSubmitting, isSubmitSuccessful },
    setValue,
    getValues,
  } = summary;

  return (
    <div>
      <div className='flex w-full max-w-lg flex-col gap-5'>
        <div className='flex flex-col gap-4'>
          <div className='flex flex-col gap-2'>
            <Label>Title</Label>
            <p>{formState?.title}</p>
          </div>
          <div className='flex flex-col gap-2'>
            <Label>Description</Label>
            <p>{formState?.description}</p>
          </div>
          <div className='flex flex-col gap-2'>
            <Label>Tags</Label>
            <p>{formState?.tags}</p>
          </div>
          <div className='flex flex-col gap-2'>
            <Label>Images</Label>
            <div className='flex flex-col gap-2'>
              {formState?.imageUrls && formState.imageUrls.length > 0 && (
                <>
                  <div className='flex max-w-full flex-wrap gap-1'>
                    {formState?.imageUrls.map((image) => (
                      <Image
                        key={image}
                        src={image}
                        width={100}
                        height={100}
                        alt='image'
                        className='h-24 w-24'
                      />
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
          <div className='flex flex-col gap-2'>
            <Label>End Date</Label>
            <p>{formState?.dateTime?.toLocaleDateString?.() || ''}</p>
          </div>
          <div className='flex flex-col gap-2'>
            <Label>End Time</Label>
            <p>
              {formState?.dateTime?.toLocaleTimeString?.([], {
                hour: '2-digit',
                minute: '2-digit',
              }) || ''}
            </p>
          </div>
        </div>

        <StepNavigation />
      </div>

      {/* <Debugger json={JSON.stringify(formState, null, 2)} /> */}
    </div>
  );
};

export default SummaryStepForm;
