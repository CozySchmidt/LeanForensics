import React from 'react';
import './GlobalFilter.css';

export const GlobalFilter = ({ filter, setFilter }) => {
    return (
        <div className="samples--search">
            Search: {' '}
            <input value={filter || ''} onChange={e=> setFilter(e.target.value)}/>
        </div>
    )
};