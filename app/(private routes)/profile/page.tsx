import { getMe } from '@/lib/api/serverApi';
import css from './ProfilePage.module.css';
import Link from 'next/link';
import Image from 'next/image';
import type { Metadata } from 'next';

export async function generateMetadata(): Promise<Metadata> {
  const user = await getMe();
  return {
    title: `${user.username} | Profile`,
    description: `Profile page of ${user.username}`,
  };
}

const Profile = async () => {
  const user = await getMe();

  return (
    <>
      <main className={css.mainContent}>
        <div className={css.profileCard}>
          <div className={css.header}>
            <h1 className={css.formTitle}>Profile Page</h1>
            <Link href="/profile/edit" className={css.editProfileButton}>
              Edit Profile
            </Link>
          </div>
          <div className={css.avatarWrapper}>
            <Image
              src={user.avatar}
              alt="User Avatar"
              width={120}
              height={120}
              className={css.avatar}
            />
          </div>
          <div className={css.profileInfo}>
            <p>Username: {user.username}</p>
            <p>Email: {user.email}</p>
          </div>
        </div>
      </main>
    </>
  );
};

export default Profile;