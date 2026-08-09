'use client';
import { FormEvent } from 'react';
import Image from 'next/image';
import css from './EditProfilePage.module.css';
import { updateMe } from '@/lib/api/clientApi';
import { useAuthStore } from '@/lib/store/authStore';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { AxiosError } from 'axios';

const EditProfile = () => {
  const user = useAuthStore(state => state.user);
  const setUser = useAuthStore(state => state.setUser);

  const router = useRouter();

  const handleSaveUser = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      const formData = new FormData(event.currentTarget);
      const username = formData.get('username') as string;
      const res = await updateMe({ username });
      setUser(res);
      router.push('/profile');
    } catch (error) {
      toast.error(
        (error as AxiosError<{ error: string }>).response?.data?.error ?? 'Failed to update profile'
      );
    }
  };

  return (
    <>
      <main className={css.mainContent}>
        <div className={css.profileCard}>
          <h1 className={css.formTitle}>Edit Profile</h1>
          {user && (
            <Image
              src={user.avatar}
              alt="User Avatar"
              width={120}
              height={120}
              className={css.avatar}
            />
          )}

          <form className={css.profileInfo} onSubmit={handleSaveUser}>
            <div className={css.usernameWrapper}>
              <label htmlFor="username">Username:</label>
              <input
                id="username"
                type="text"
                name="username"
                className={css.input}
                defaultValue={user?.username ?? ''}
              />
            </div>

            <p>Email: {user?.email}</p>

            <div className={css.actions}>
              <button type="submit" className={css.saveButton}>
                Save
              </button>
              <button type="button" className={css.cancelButton} onClick={() => router.back()}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      </main>
    </>
  );
};

export default EditProfile;