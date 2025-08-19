import React from 'react';
import { motion } from 'framer-motion';

const TypingIndicator = ({ username }) => {
    return (
        <div className="flex items-center gap-2 p-3 text-sm text-gray-400">
            <div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center text-white text-xs font-bold uppercase">
                {username ? username[0] : '?'}
            </div>
            <div className="flex items-center gap-1">
                <span>{username || 'Someone'} is typing</span>
                <motion.div
                    className="flex gap-1"
                    initial={{ opacity: 0.6 }}
                    animate={{ opacity: 1 }}
                    transition={{
                        repeat: Infinity,
                        duration: 0.8,
                        repeatType: 'loop',
                        ease: 'easeInOut'
                    }}
                >
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:.1s]"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:.3s]"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:.5s]"></div>
                </motion.div>
            </div>
        </div>
    );
};

export default TypingIndicator;


// import React from 'react';
// import Lottie from 'lottie-react';
// import typingAnimation from '../../assets/lotties/typing.json'; // save the JSON from the link

// const TypingIndicator = ({ user }) => {
//   return (
//     <div className="flex items-center gap-2 px-3">
//       <img
//         src={user?.photoURL || '/default-avatar.png'}
//         alt="typing user"
//         className="w-6 h-6 rounded-full"
//       />
//       <div className="w-16">
//         <Lottie animationData={typingAnimation} loop autoplay />
//       </div>
//       <p className="text-xs text-gray-400">{user?.displayName} is typing...</p>
//     </div>
//   );
// };

// export default TypingIndicator;

