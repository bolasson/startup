import React from 'react';
import useSlider from '../customHooks/useSlider.jsx';
import '../styles.css';

export default function Dev() {
    const { value, handleChange } = useSlider(5);

    return (
        <div style={{ margin: '20px' }}>
            <h2>Slider Value: {value}</h2>
            <div style={{ display: 'flex', alignItems: 'center' }}>
                <span style={{ marginRight: '10px' }}>Ancient</span>
                <input
                    type="range"
                    min="1"
                    max="10"
                    value={value}
                    onChange={handleChange}
                    style={{ flex: 1 }}
                />
                <span style={{ marginLeft: '10px' }}>Modern</span>
            </div>
        </div>
    );
}
