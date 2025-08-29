import React, { useEffect, useState } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../../firebase/firebase';

const statusMap = {
  online: { label: '🟢 Online', dot: 'bg-green-500' },
  away: { label: '🕒 Away', dot: 'bg-yellow-400' },
  busy: { label: '🔴 Busy', dot: 'bg-red-500' },
  offline: { label: '⚫ Offline', dot: 'bg-gray-500' },
};

const UserStatusIndicator = ({ userId }) => {
  const [status, setStatus] = useState(null);

  useEffect(() => {
    if (!userId) return;

    const unsub = onSnapshot(doc(db, 'users', userId), (snap) => {
      if (snap.exists()) {
        const { isOnline, status: state, lastSeen } = snap.data();

        // handle 10s grace period
        if (isOnline) {
          setStatus(statusMap[state || 'online']);
        } else {
          const now = Date.now();
          const lastSeenTime = lastSeen?.toMillis?.() || 0;
          if (now - lastSeenTime < 10000) {
            // still show Online for 10s after disconnect
            setStatus(statusMap['online']);
          } else {
            setStatus({
              ...statusMap['offline'],
              label: `⚫ Last seen ${new Date(lastSeenTime).toLocaleTimeString()}`
            });
          }
        }
      } else {
        setStatus(statusMap['offline']);
      }
    });

    return () => unsub();
  }, [userId]);

  if (!status) return <span className="text-sm text-gray-400">Loading...</span>;

  return (
    <span className="text-sm text-gray-400 flex items-center gap-1">
      <span className={`w-2 h-2 rounded-full ${status.dot}`} />
      {status.label}
    </span>
  );
};

export default UserStatusIndicator;
