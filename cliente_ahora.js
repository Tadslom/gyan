// ============================================================
//  cliente_ahora.js — pégalo en tu reproductor (musica.html / app del celular)
//
//  Avisa al servidor qué estás escuchando para que el ESP32 lo muestre.
//  NO he visto tu musica.html, así que ADAPTA las 3 funciones de abajo a tus nombres reales:
//    - ahoraAudio()   → tu elemento <audio> (o el objeto que reproduce)
//    - ahoraCancion() → la canción actual: { id, titulo, artista, album, album_id }
//    - ahoraToken()   → tu token de sesión (el que usas en "Authorization: Bearer ...")
//  apiMusicaUrl es la misma variable que ya usas para llamar a tu API.
// ============================================================

const ahoraAudio   = () => document.querySelector("audio");                 // ADAPTA
const ahoraCancion = () => window.cancionActual;                            // ADAPTA
const ahoraToken   = () => localStorage.getItem("token");                   // ADAPTA

async function ahoraEnviar() {
  const a = ahoraAudio(), c = ahoraCancion(), tk = ahoraToken();
  if (!a || !c || !tk) return;
  try {
    await fetch(apiMusicaUrl + "/api/mis/ahora", {
      method: "POST",
      headers: { "Content-Type": "application/json", "Authorization": "Bearer " + tk },
      body: JSON.stringify({
        cancionId: c.id, albumId: c.album_id || c.albumId || 0,
        titulo: c.titulo, artista: c.artista, album: c.album || c.album_titulo || "",
        posicion: a.currentTime || 0, duracion: isFinite(a.duration) ? a.duration : 0,
        pausado: a.paused
      })
    });
  } catch (e) { /* sin red: se reintenta en el próximo aviso */ }
}

(function iniciarAhora() {
  const a = ahoraAudio();
  if (!a) return;
  ["play", "pause", "seeked", "loadedmetadata"].forEach(ev => a.addEventListener(ev, ahoraEnviar));
  setInterval(() => { if (!a.paused) ahoraEnviar(); }, 10000);   // latido mientras suena
})();
