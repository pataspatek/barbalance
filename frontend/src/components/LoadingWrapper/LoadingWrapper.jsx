import { useContext } from 'react';
import { AuthContext } from '../../utils/AuthContext';
import './LoadingWrapper.scss';

function LoadingWrapper({ children }) {
    const { loading } = useContext(AuthContext);

    if (loading) {
        return (
            <div className="loading-wrapper">
                <div className="loader">
                    <div className="spinner"></div>
                    <p>Loading...</p>
                </div>
            </div>
        );
    }

    return children;
}

export default LoadingWrapper;
