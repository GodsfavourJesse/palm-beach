import React from 'react';

// Nigeria Time (UTC+1)
const TimeDisplay = ({ timestamp }) => {
    if (!timestamp?.toDate) return null;

    const date = timestamp.toDate();

    // Convert to Nigeria time (UTC+1)
    const nigeriaTime = new Date(date.toLocaleString('en-US', { timeZone: 'Africa/Lagos' }));

    const formatted = nigeriaTime.toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
    });

    return (
        <span className="text-[10px]">{formatted}</span>
    );
};

export default TimeDisplay;
