export function formatLastSeen(date) {
    if (!date || isNaN(new Date(date))) return '—';

    const now = new Date();
    const lastSeen = date instanceof Date ? date : new Date(date);
    const diffMs = now - lastSeen;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return 'just now';
    if (diffMins < 5) return `${diffMins} min${diffMins > 1 ? 's' : ''} ago`;
    if (diffHours < 3) return `today at ${lastSeen.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    if (diffDays === 0) return `today at ${lastSeen.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    if (diffDays === 1) return `yesterday at ${lastSeen.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    if (diffDays <= 3) return `${diffDays} days ago`;

    return lastSeen.toLocaleDateString();
}
