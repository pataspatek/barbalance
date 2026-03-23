function About() {
    return (
        <section className="about">
            <div className="about-content">
                <h2>Proč si vybrat BarBalance?</h2>
                <p className="about-text">
                    Věříme, že skutečné zdraví pochází z rovnováhy—rovnováha výživy, pohybu a vědomí. 
                    Náš holistický přístup se zaměřuje na udržitelné změny životního stylu, které trvají.
                </p>
                <div className="values-grid">
                    <div className="value-card">
                        <div className="value-icon">✓</div>
                        <h3>Vědecky podložené</h3>
                        <p>Vědecky podpořené strategie pro skutečné výsledky</p>
                    </div>
                    <div className="value-card">
                        <div className="value-icon">✓</div>
                        <h3>Personalizované</h3>
                        <p>Přizpůsobeno vašim jedinečným potřebám a životnímu stylu</p>
                    </div>
                    <div className="value-card">
                        <div className="value-icon">✓</div>
                        <h3>Udržitelné</h3>
                        <p>Budování zvyků, které zůstanou dlouhodobě</p>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default About;
