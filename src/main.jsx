import React from "react";
import { createRoot } from "react-dom/client";
import "./style.css";

function App() {
  return (
    <main>
      <header>
        <div className="logo">🎣</div>
        <h1>Mijn Visboek</h1>
        <p>Jouw persoonlijke viscoach</p>
      </header>

      <section className="welcome">
        <h2>Welkom bij Mijn Visboek!</h2>
        <p>Registreer je vangsten, leer bij en word een betere visser.</p>
      </section>

      <section className="menu">
        <article>📖<h3>Mijn visdagboek</h3><p>Bewaar al je vangsten.</p></article>
        <article>🐟<h3>Karper & snoek</h3><p>Leer alles over vissen.</p></article>
        <article>🧠<h3>Slimme viscoach</h3><p>Ontvang persoonlijke tips.</p></article>
        <article>🌦️<h3>Weer & water</h3><p>Bekijk je omstandigheden.</p></article>
        <article>📸<h3>Mijn foto's</h3><p>Bewaar en deel je vangsten.</p></article>
        <article>📚<h3>Mijn karperboek</h3><p>Tussen Rigs en Dromen.</p></article>
      </section>

      <footer>Mijn Visboek © 2026</footer>
    </main>
  );
}

createRoot(document.getElementById("root")).render(<App />);
