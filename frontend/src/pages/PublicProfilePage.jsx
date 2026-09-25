import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { fetchUserProfile } from '../api/users.js';
import { DeveloperProfile } from '../components/profile/DeveloperProfile.jsx';


export default function PublicProfilePage() {
  const { userId } = useParams();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    fetchUserProfile(userId)
      .then((res) => setUser(res.data))
      .finally(() => setLoading(false));
  }, [userId]);


  if (loading) return <p className="p-8 text-center text-sm text-ink-400">Loading…</p>;
  if (!user) return <p className="p-8 text-center text-sm text-ink-400">User not found</p>;


  return <DeveloperProfile user={user} mode="public" onUpdated={() => {}} />;
}
