
import React, { useState } from "react";
import { createRoot } from "react-dom/client";
import "./style.css";

const soorten = ["Karper", "Snoek", "Snoekbaars", "Baars", "Brasem", "Voorn", "Forel", "Andere"];

function App() {
  const [pagina, setPagina] = useState("home");
  const [sessie, setSessie] = useState({
    vis: "Karper",
    water: "",
    datum: new Date().toISOString().slice(0, 10),
    tijd: "",
    lucht: "",
    waterTemp: "",
    weer: "Bewolkt",
    regen: "Nee",
    wind: "",
    bodem: "Modder",
    diepte: "",
    aas: "",
    materiaal: "",
    duur: "",
    opmerkingen: ""
  });
  const [advies, setAdvies] = useState("");
  const [vangsten, setVangsten] = useState(() =>
    JSON.parse(localStorage.getItem("visboek-vangsten") || "[]")
  );
  const [vangst, setVangst] = useState({
    vis: "Karper", gewicht: "", lengte: "", aas: "", plaats: "", notitie: "", foto: ""
  });

  function wijzig(e) {
    setSessie({ ...sessie, [e.target.name]: e.target.value });
  }

  function analyseer() {
    let tips = [
      `Je vist op ${sessie.vis} in ${sessie.water || "een nog niet benoemd water"}.`,
      `Je noteerde ${sessie.weer.toLowerCase()} weer, een luchttemperatuur van ${sessie.lucht || "onbekend"} °C en een watertemperatuur van ${sessie.waterTemp || "onbekend"} °C.`
    ];

    if (sessie.vis === "Karper") {
      tips.push("Let op voedselrijke zones, plateaus, taluds en veilige obstakels. Pas je voeraanpak aan de visactiviteit aan.");
      if (Number(sessie.waterTemp) < 10) tips.push("Bij koud water kan de activiteit lager zijn. Begin voorzichtig met kleine hoeveelheden aas.");
      if (Number(sessie.waterTemp) > 20) tips.push("Bij warm water kunnen zuurstofrijke zones, windkanten en schaduw interessant zijn. Let op zuurstoftekort.");
    } else if (["Snoek", "Snoekbaars", "Baars"].includes(sessie.vis)) {
      tips.push("Zoek naar taluds, structuur, aasvis en overgangen. Stem kunstaas en snelheid af op diepte en activiteit.");
      if (Number(sessie.waterTemp) < 10) tips.push("Probeer een tragere presentatie en controleer verschillende dieptes.");
      if (Number(sessie.waterTemp) > 20) tips.push("Zoek zuurstofrijk water en vermijd onnodige stress voor gevangen vissen bij hoge temperaturen.");
    } else {
      tips.push("Onderzoek waar deze vissoort voedsel zoekt en pas aas, diepte en presentatie aan het water aan.");
    }

    if (sessie.wind) tips.push(`Je noteerde wind: ${sessie.wind}. Onderzoek of de wind voedsel naar een bepaalde oever brengt.`);
    if (sessie.bodem) tips.push(`Bodemtype: ${sessie.bodem}. Pas je aasaanbieding hieraan aan.`);
    if (sessie.aas) tips.push(`Beschikbaar aas: ${sessie.aas}. Test één aanpak tegelijk zodat je resultaten kunt vergelijken.`);
    tips.push("Dit is een eerste inschatting op basis van jouw antwoorden, geen garantie. Noteer aanbeten en pas je aanpak stap voor stap aan.");
    setAdvies(tips.join("\n\n"));
  }

  function bewaarVangst() {
    const nieuw = [...vangsten, { ...vangst, id: Date.now(), datum: new Date().toLocaleDateString("nl-BE") }];
    setVangsten(nieuw);
    localStorage.setItem("visboek-vangsten", JSON.stringify(nieuw));
    setVangst({ vis: "Karper", gewicht: "", lengte: "", aas: "", plaats: "", notitie: "", foto: "" });
    alert("Je vangst is opgeslagen!");
  }

  function fotoKiezen(e) {
    const bestand = e.target.files[0];
    if (!bestand) return;
    if (bestand.size > 1500000) {
      alert("Kies voorlopig een foto kleiner dan 1,5 MB.");
      return;
    }
    const lezer = new FileReader();
    lezer.onload = () => setVangst(v => ({ ...v, foto: lezer.result }));
    lezer.readAsDataURL(bestand);
  }

  const veld = (label, name, type = "text", extra = {}) => (
    <label>{label}
      <input name={name} type={type} value={sessie[name]} onChange={wijzig} {...extra} />
    </label>
  );

  return (
    <main>
      <header>
        <div className="logo">🎣</div>
        <h1>Mijn Visboek</h1>
        <p>Jouw persoonlijke viscoach</p>
      </header>

      <nav>
        {[
          ["home", "🏠 Start"],
          ["sessie", "🧠 Viscoach"],
          ["dagboek", "📖 Dagboek"],
          ["kennis", "🐟 Kennis"],
          ["video", "🎬 Video's"],
          ["boek", "📚 Mijn boek"]
        ].map(([id, tekst]) =>
          <button key={id} onClick={() => setPagina(id)}>{tekst}</button>
        )}
      </nav>

      {pagina === "home" && <>
        <section className="welcome">
          <h2>Welkom bij Mijn Visboek!</h2>
          <p>Bereid je vissessie voor, leer uit je vangsten en ontdek nieuwe technieken.</p>
          <button onClick={() => setPagina("sessie")}>Start een vissessie</button>
        </section>
        <section className="menu">
          <article onClick={() => setPagina("sessie")}>🧠<h3>Slimme viscoach</h3><p>Persoonlijk sessieadvies</p></article>
          <article onClick={() => setPagina("dagboek")}>📸<h3>Mijn vangsten</h3><p>Bewaar foto's en gegevens</p></article>
          <article onClick={() => setPagina("kennis")}>🐟<h3>Viskennis</h3><p>Leer over verschillende soorten</p></article>
          <article onClick={() => setPagina("video")}>🎬<h3>Videotheek</h3><p>Tips en technieken</p></article>
          <article onClick={() => setPagina("boek")}>📚<h3>Tussen Rigs en Dromen</h3><p>Mijn karperboek</p></article>
        </section>
      </>}

      {pagina === "sessie" && <section className="panel">
        <h2>🧠 Jouw vissessie voorbereiden</h2>
        <p>Vul zoveel mogelijk gegevens in. Je kunt onbekende velden leeg laten.</p>
        <label>Op welke vis ga je vissen?
          <select name="vis" value={sessie.vis} onChange={wijzig}>
            {soorten.map(s => <option key={s}>{s}</option>)}
          </select>
        </label>
        {veld("Naam van het water", "water")}
        {veld("Datum", "datum", "date")}
        {veld("Startuur", "tijd", "time")}
        {veld("Luchttemperatuur (°C)", "lucht", "number")}
        {veld("Watertemperatuur (°C)", "waterTemp", "number")}
        <label>Weer<select name="weer" value={sessie.weer} onChange={wijzig}>
          {["Zon", "Bewolkt", "Halfbewolkt", "Storm", "Mist"].map(x => <option>{x}</option>)}
        </select></label>
        <label>Regen<select name="regen" value={sessie.regen} onChange={wijzig}>
          {["Nee", "Lichte regen", "Veel regen"].map(x => <option>{x}</option>)}
        </select></label>
        {veld("Windrichting en windkracht", "wind")}
        <label>Bodemtype<select name="bodem" value={sessie.bodem} onChange={wijzig}>
          {["Modder", "Zand", "Grind", "Klei", "Wier", "Gemengd", "Onbekend"].map(x => <option>{x}</option>)}
        </select></label>
        {veld("Waterdiepte (meter)", "diepte", "number")}
        {veld("Welk aas heb je bij?", "aas")}
        {veld("Welk materiaal en welke rigs?", "materiaal")}
        {veld("Hoe lang ga je vissen?", "duur")}
        <label>Extra informatie<textarea name="opmerkingen" value={sessie.opmerkingen} onChange={wijzig}/></label>
        <button onClick={analyseer}>Maak mijn visadvies</button>
        {advies && <div className="resultaat"><h3>Jouw sessieanalyse</h3><p style={{whiteSpace:"pre-line"}}>{advies}</p></div>}
      </section>}

      {pagina === "dagboek" && <section className="panel">
        <h2>📖 Mijn visdagboek</h2>
        <label>Vissoort<select value={vangst.vis} onChange={e => setVangst({...vangst, vis:e.target.value})}>{soorten.map(s => <option>{s}</option>)}</select></label>
        <label>Gewicht (kg)<input type="number" value={vangst.gewicht} onChange={e => setVangst({...vangst, gewicht:e.target.value})}/></label>
        <label>Lengte (cm)<input type="number" value={vangst.lengte} onChange={e => setVangst({...vangst, lengte:e.target.value})}/></label>
        <label>Aas<input value={vangst.aas} onChange={e => setVangst({...vangst, aas:e.target.value})}/></label>
        <label>Water of stek<input value={vangst.plaats} onChange={e => setVangst({...vangst, plaats:e.target.value})}/></label>
        <label>Foto toevoegen<input type="file" accept="image/*" onChange={fotoKiezen}/></label>
        {vangst.foto && <img className="visfoto" src={vangst.foto} alt="Mijn vangst"/>}
        <label>Notities<textarea value={vangst.notitie} onChange={e => setVangst({...vangst, notitie:e.target.value})}/></label>
        <button onClick={bewaarVangst}>Vangst bewaren</button>
        <h3>Eerdere vangsten ({vangsten.length})</h3>
        {vangsten.map(v => <article key={v.id}>
          <b>{v.vis}</b> – {v.datum}<p>{v.gewicht} kg · {v.lengte} cm · {v.plaats}</p>
          {v.foto && <img className="visfoto" src={v.foto} alt="Vangst"/>}
          <p>{v.notitie}</p>
        </article>)}
      </section>}

      {pagina === "kennis" && <section className="panel">
        <h2>🐟 Viskennis</h2>
        {soorten.map(s => <article key={s}><h3>{s}</h3><p>Leer meer over leefgebied, voedsel, seizoenen, materiaal en vistechnieken voor {s.toLowerCase()}.</p></article>)}
        <p>De kennisbank wordt verder aangevuld met gecontroleerde, soortspecifieke informatie.</p>
      </section>}

      {pagina === "video" && <section className="panel">
        <h2>🎬 Videotheek</h2>
        <p>Hier komen praktische instructievideo's over rigs, knopen, aas, stekkeuze, warm en koud weer en roofvistechnieken.</p>
        <p>We voegen alleen video's toe waarvan de bron en inhoud gecontroleerd zijn.</p>
      </section>}

      {pagina === "boek" && <section className="panel">
        <h2>📚 Tussen Rigs en Dromen</h2>
        <p>Praktisch karperboek.</p>
        <p>De rechtstreekse Lulu-aankooplink voegen we toe zodra je die doorgeeft.</p>
      </section>}

      <footer>Mijn Visboek © 2026 · Leer van elke vissessie</footer>
    </main>
  );
}

createRoot(document.getElementById("root")).render(<App />);
