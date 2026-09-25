
import { useAuth } from '../context/AuthContext.jsx';
import { DeveloperProfile } from '../components/profile/DeveloperProfile.jsx';


export default function MyProfilePage() {
  const { user, refreshUser } = useAuth();


  if (!user) return null;


  return <DeveloperProfile user={user} mode="own" onUpdated={refreshUser} />;
}

