import React, { useEffect, useState } from 'react';
import './styles/LoadingScreenStyle.css';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';

const LoadingScreen = () => {
    const { isLoading } = useSelector((state: RootState) => state.loadingState);
    return (
        isLoading ? (
            <div className="loading-overlay">
                <div className="spinner"></div>
            </div>
        ) : <div />
    );
};

export default LoadingScreen;