import React from 'react'

const KeepLoggedIn = ({ keepLoggedIn, setKeepLoggedIn}) => {
    return (
        <div className="flex items-center mt-4">
            <input
                id="keepLoggedIn"
                type="checkbox"
                checked={keepLoggedIn}
                onChange={() => {
                    const newValue = !keepLoggedIn;
                    setKeepLoggedIn(newValue);
                    localStorage.setItem("keepLoggedIn", newValue); // Save to localStorage
                }}
                className="accent-indigo-600 mr-2"
            
            />
            <label htmlFor="keepLoggedIn" className="text-sm text-gray-400">
                Keep me logged in
            </label>
        </div>

    )
}

export default KeepLoggedIn