import React from 'react'
import BackgroundSelector from '../BackgroundSelector'
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../../firebase/firebase';

const Display = () => {

    const [user, loading] = useAuthState(auth);
    const [selectedBg, setSelectedBg] = useState({ 
        index: 0, 
        customImage: null,
        textColor: 'text-white',
    });

    return (
        <div>
            <BackgroundSelector
                user={user}
                onChange={(index, customImage, textColor) => setSelectedBg({ index, customImage, textColor })}
            />
        </div>
    )
}

export default Display