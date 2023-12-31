import { LoginForm, loginSchema } from '@/lib/schemas';
import clearCachesByServerAction from '@/lib/server/clearCachesByServerAction';
import { zodResolver } from '@hookform/resolvers/zod';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { SubmitHandler, useForm } from 'react-hook-form';

const useLoginForm = () => {
  const router = useRouter();
  const form = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const { setError, handleSubmit } = form;

  const onSubmit: SubmitHandler<LoginForm> = async ({ email, password }) => {
    try {
      const res = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      if (!res) {
        setError('root', {
          type: 'manual',
          message: 'No response',
        });
        throw new Error('No response');
      }

      if (!res.ok) {
        setError('root', {
          type: 'server',
          message: 'Email and password combination not found',
        });
        throw new Error('Response not ok');
      }

      clearCachesByServerAction();
      router.push('/');
    } catch (error) {
      console.log(error);
    }
  };

  const handleLogin = handleSubmit(onSubmit);

  return { form, handleLogin };
};

export default useLoginForm;
