# Porra electoral · instruccions per publicar-la a Netlify

## 1. Puja el projecte a GitHub
1. Crea un compte a github.com (gratuït) si no en tens.
2. Crea un repositori nou (botó **New**), per exemple `porra-electoral`.
3. Al repositori, tria **uploading an existing file** i arrossega-hi **tot el contingut d'aquesta carpeta** (`public`, `netlify`, `package.json`, `netlify.toml`). Fes **Commit changes**.

## 2. Connecta'l a Netlify
1. Entra a app.netlify.com amb un compte gratuït.
2. **Add new project → Import an existing project → GitHub** i tria el repositori.
3. Deixa la configuració que et proposa (ja ve a `netlify.toml`) i fes **Deploy**.

## 3. Posa els dos codis (important)
A Netlify: **Project configuration → Environment variables**, afegeix:
- `ACCESS_CODE` → el codi que donaràs als companys (per exemple `porra2026`).
- `ADMIN_CODE` → un codi només teu, que no comparteixis.

Després fes **Deploys → Trigger deploy → Deploy project** perquè s'apliquin.

## 4. Configura la porra
1. Obre l'adreça del teu lloc (`https://xxxxx.netlify.app`).
2. Escriu el teu nom, el codi d'accés i, desplegant **Sóc l'organitzador**, el codi d'organitzador.
3. Posa el títol, el tancament, els partits (`Partit | Cap de llista`), els totals i les fotos.

## 5. Comparteix-la
Envia als companys **l'adreça + el codi d'accés**. Només han de posar el seu nom i el codi.

## Coses a saber
- Qui escrigui el mateix nom que un altre sobreescriu la seva predicció: demana que cadascú faci servir nom i cognom.
- Les prediccions dels altres no es veuen fins al tancament.
- Al tancament és el servidor qui rebutja noves prediccions.
- No canviïs la llista de partits ni els totals un cop hi ha prediccions.
- Els resultats oficials els poses des del panell d'organitzador.
