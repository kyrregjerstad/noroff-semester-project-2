/* eslint-disable @typescript-eslint/no-unused-vars */
import NextAuth from 'next-auth/next';

declare module 'next-auth' {
  interface Session {
    user: {
      name: string;
      email: string;
      credits: number;
      avatar?: string;
      accessToken: string;
    };
  }
}
