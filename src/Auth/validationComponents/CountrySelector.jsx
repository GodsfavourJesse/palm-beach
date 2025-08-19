import React, { useEffect, useRef, useState } from "react";
import { FaChevronDown } from "react-icons/fa6";
export const countries = [
    { name: "Nigeria", code: "NG", dialCode: "+234", flag: "🇳🇬" },
    { name: "United States", code: "US", dialCode: "+1", flag: "🇺🇸" },
    { name: "India", code: "IN", dialCode: "+91", flag: "🇮🇳" },
];

function CountrySelector({ selectedCountry, setSelectedCountry }) {

    const [search, setSearch] = useState('');
    const [showDropdown, setShowDropdown] = useState(false);
    const [highlightIndex, setHighlightIndex] = useState(0);
    const containerRef = useRef();

    // Hide dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (containerRef.current && !containerRef.current.contains(e.target)) {
                setShowDropdown(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const filteredCountries = countries.filter((c) =>
        c.name.toLowerCase().includes(search.toLowerCase())
    );

    const handleSelect = (country) => {
        setSelectedCountry(country);
        setSearch(country.name);
        setShowDropdown(false);
        setHighlightIndex(0);
    };

    const handleKeyDown = (e) => {
        if (e.key === "ArrowDown") {
            e.preventDefault();
            setHighlightIndex((prev) => (prev + 1) % filteredCountries.length);
        } else if (e.key === "ArrowUp") {
            e.preventDefault();
            setHighlightIndex((prev) => (prev - 1 + filteredCountries.length) % filteredCountries.length);
        } else if (e.key === "Enter" && showDropdown) {
            e.preventDefault();
            handleSelect(filteredCountries[highlightIndex]);
        }
    };

    useEffect(() => {
        if (!selectedCountry) setSearch("");
    }, [selectedCountry]);

    return (
        <div ref={containerRef} className="relative">
            <div className="relative">
                <input
                    type="text"
                    placeholder="Select Country"
                    className="w-full h-[50px] px-3 pr-10 border rounded-xl border-gray-500 focus:border-indigo-700 bg-[#212121] text-white"
                    value={search}
                    onChange={(e) => {
                        setSearch(e.target.value);
                        setShowDropdown(true);
                    }}
                    onFocus={() => setShowDropdown(true)}
                    onKeyDown={handleKeyDown}
                />
                <FaChevronDown
                    size={20}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white cursor-pointer"
                    onClick={() => setShowDropdown(!showDropdown)}
                />
            </div>
            {showDropdown && filteredCountries.length > 0 && (
                <ul className="absolute z-10 mt-1 w-full max-h-60 overflow-y-auto rounded-xl bg-[#212121] border border-gray-600 text-white">
                    {filteredCountries.map((c) => (
                        <li
                            key={c.code}
                            className="px-3 py-2 hover:bg-indigo-700 cursor-pointer"
                            onClick={() => handleSelect(c)}
                        >
                            {c.flag} {c.name} ({c.dialCode})
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

export default CountrySelector;
