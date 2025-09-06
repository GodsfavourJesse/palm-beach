import { useEffect } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase/firebase';

export const useChatEffects = ({
    scrollRef,
    messages,
    selectedUser,
    currentUser,
    lastMsgCount,
    setLastMsgCount,
    setIsAtBottom,
    setShowNewMsgBadge,
    isAtBottom,
    scrollToBottom,
    setIsTyping,
}) => {
    useEffect(() => {
        const scrollEl = scrollRef.current;
        const handleScroll = () => {
            if (!scrollEl) return;
            const nearBottom =
                scrollEl.scrollHeight - scrollEl.scrollTop <= scrollEl.clientHeight + 80;
            setIsAtBottom(nearBottom);
            if (nearBottom) setShowNewMsgBadge(false);
        };

        scrollEl?.addEventListener('scroll', handleScroll);
        return () => scrollEl?.removeEventListener('scroll', handleScroll);
    }, [scrollRef]);

    useEffect(() => {
        if (!messages || messages.length === 0) return;

        const latest = messages[messages.length - 1];
        const isFromOtherUser =
        latest.senderId === selectedUser?.id && latest.receiverId === currentUser?.uid;

        if (messages.length > lastMsgCount) {
            if (isFromOtherUser) {
                const sound = new Audio('/sounds/notification.mp3');
                sound.play().catch((e) => console.log('Audio play blocked:', e));
                if (navigator.vibrate) navigator.vibrate(200);
                if (!isAtBottom) setShowNewMsgBadge(true);
            } else {
                scrollToBottom();
            }
        }

        setLastMsgCount(messages.length);
    }, [messages]);

    useEffect(() => {
    if (!selectedUser?.id || !currentUser?.uid) return;  // ✅ ensure valid IDs

    const typingRef = doc(db, 'users', selectedUser.id);
    const unsubscribe = onSnapshot(typingRef, (docSnap) => {
        const data = docSnap.data();
        setIsTyping?.(data?.typingTo === currentUser.uid);
    });

    return () => unsubscribe();
}, [selectedUser, currentUser]);

};
