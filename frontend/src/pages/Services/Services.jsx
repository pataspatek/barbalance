import './Services.scss';

function Services() {
    return (
        <section className="services">
            <div className="services-container">
                <h2>Naše služby</h2>
                <p className="services-intro">Komplexní zdravotnická řešení přizpůsobená vašim cílům</p>
                <div className="services-grid">
                    <div className="service-card">
                        <div className="service-icon">🥗</div>
                        <h3>Poradenství v oblasti výživy</h3>
                        <p>Personalizované plány jídel, poradenství v oblasti výživy a stravovací strategie k optimalizaci vašeho zdraví a energetické hladiny.</p>
                    </div>
                    <div className="service-card">
                        <div className="service-icon">💪</div>
                        <h3>Fitness tréninky</h3>
                        <p>Vlastní tréninková programy navržené pro vaše cíle, ať už jde o hubnutí, budování síly nebo celkový wellness.</p>
                    </div>
                    <div className="service-card">
                        <div className="service-icon">📊</div>
                        <h3>Sledování pokroku</h3>
                        <p>Pravidelné posouzení a poznatky řízené daty, které vás motivují a udržují na trati s vašimi cíli.</p>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default Services;
