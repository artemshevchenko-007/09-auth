'use client';
import { useRouter } from 'next/navigation';
import css from './SignUpPage.module.css';
import { register, RegisterRequest } from '@/lib/api/clientApi';
import { AxiosError } from 'axios';
import { useAuthStore } from '@/lib/store/authStore';
import { toast } from 'sonner';

export type ApiError = AxiosError<{ error: string }>;
const SignUp = () => {
  const router = useRouter();
  const setUser = useAuthStore(state => state.setUser);

  const handleSubmit = async (formData: FormData) => {
    try {
      const formValues = Object.fromEntries(formData) as RegisterRequest;
      const res = await register(formValues);
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
    <main className={css.mainContent}>
      <h1 className={css.formTitle}>Sign up</h1>
      <form className={css.form} action={handleSubmit}>
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
            Register
          </button>
        </div>
      </form>
    </main>
  );
};

export default SignUp;