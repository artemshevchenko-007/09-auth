'use client';
import { useRouter } from 'next/navigation';
import css from './SignInPage.module.css';
import { AxiosError } from 'axios';
import { useAuthStore } from '@/lib/store/authStore';
import { login, LoginRequest } from '@/lib/api/clientApi';
import { toast } from 'sonner';

export type ApiError = AxiosError<{ error: string }>;

const SignInPage = () => {
  const router = useRouter();
  const setUser = useAuthStore(state => state.setUser);

  const handleSubmit = async (formData: FormData) => {
    try {
      const formValues = Object.fromEntries(formData) as LoginRequest;

      const res = await login(formValues);

      if (res) {
        setUser(res);
        router.push('/profile');
      } else {
        toast.error('Invalid email or password');
      }
    } catch (error) {
      toast.error(
        (error as ApiError).response?.data?.error ??
          (error as ApiError).message ??
          'Oops... some error'
      );
    }
  };
  return (
    <>
      <main className={css.mainContent}>
        <form className={css.form} action={handleSubmit}>
          <h1 className={css.formTitle}>Sign in</h1>

          <div className={css.formGroup}>
            <label htmlFor="email">Email</label>
            <input id="email" type="email" name="email" className={css.input} required />
          </div>

          <div className={css.formGroup}>
            <label htmlFor="password">Password</label>
            <input id="password" type="password" name="password" className={css.input} required />
          </div>

          <div className={css.actions}>
            <button type="submit" className={css.submitButton}>
              Log in
            </button>
          </div>


        </form>
      </main>
    </>
  );
};

export default SignInPage;