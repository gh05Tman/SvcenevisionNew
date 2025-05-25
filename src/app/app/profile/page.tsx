
import { ProfileView } from '@/components/profile/ProfileView';

export default function ProfilePage() {
  return (
    <div className="container mx-auto py-2">
      <h1 className="text-3xl font-bold mb-8 font-montserrat">Account & Settings</h1>
      <ProfileView />
    </div>
  );
}
