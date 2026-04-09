import { useContext } from 'react';
import { AuthContext } from '../../utils/AuthContext';
import './LoadingWrapper.scss';

function LoadingWrapper({ children }) {
    const { loading } = useContext(AuthContext);

    if (loading) {
        return (
            <div className="loading-wrapper">
                <div className="loader-shell">
                    <div className="loader">
                        <div className="spinner"></div>
                        <p className="loader-kicker">Bar Balance</p>
                        <h2>Loading your session</h2>
                        <p className="loader-text">Preparing the page and checking authentication.</p>
                    </div>
                </div>
            </div>
        );
    }

    return children;
}

export default LoadingWrapper;
