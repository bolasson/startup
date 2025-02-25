import { useState } from 'react';

export default function useSlider(initialValue = 5) {
    const [value, setValue] = useState(initialValue);

    const handleChange = (e) => {
        setValue(Number(e.target.value));
    };

    return { value, handleChange };
}