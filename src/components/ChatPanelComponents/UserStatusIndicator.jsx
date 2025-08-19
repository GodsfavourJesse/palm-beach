import React from 'react';

const statusMap = {
  online: { label: '🟢 Online', dot: 'bg-green-500' },
  away: { label: '🕒 Away', dot: 'bg-yellow-400' },
  busy: { label: '🔴 Busy', dot: 'bg-red-500' },
  offline: { label: '⚫ Offline', dot: 'bg-gray-500' },
};

const UserStatusIndicator = ({ isOnline, state }) => {
  if (isOnline === null) return <span className="text-sm text-gray-400">Loading...</span>;

  const current = isOnline ? statusMap[state || 'online'] : statusMap['offline'];

  return (
    <span className="text-sm text-gray-400 flex items-center gap-1">
      <span className={`w-2 h-2 rounded-full ${current.dot}`}></span>
      {current.label}
    </span>
  );
};

export default UserStatusIndicator;
