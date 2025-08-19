export const groupMessagesByDate = (messages) => {
    const grouped = {};

    messages.forEach((msg) => {
        const dateObj = msg.timestamp?.toDate?.();
        if (!dateObj) return;

        const today = new Date();
        const msgDate = new Date(dateObj);
        const msgDay = msgDate.toDateString();
        const todayStr = today.toDateString();
        const yesterday = new Date(today);
        yesterday.setDate(today.getDate() - 1);
        const yesterdayStr = yesterday.toDateString();

        let label = msgDay === todayStr ? "Today"
                : msgDay === yesterdayStr ? "Yesterday"
                : msgDate.toLocaleDateString();

        if (!grouped[label]) grouped[label] = [];
        grouped[label].push(msg);
    });

    return Object.entries(grouped).map(([label, messages]) => ({ label, messages }));
};
