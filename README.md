# Patrice / Lab

Persönliches Portfolio von Patrice: eigene Apps, Hacking und Security, ESP-Projekte und Löten sowie Gym und Bankdrücken.

**[Website öffnen](https://der-programmer1.github.io/patrice-lab/)** · **[GitHub-Profil](https://github.com/der-programmer1)**

## Was die Seite zeigt

- Wechselnder Einstieg mit vier Perspektiven auf meine Interessen.
- Echte Projektvorschauen und Links zu AppShelf, Bananenblick und Satzfenster.
- Filterbare Projekte, vertiefende Einblicke und Farbschema nach Systemvorgabe oder eigener Auswahl.
- Persönliche Vorstellung und Verlinkung zum GitHub-Profil.
- Ein kleines Portfolio-Terminal als Easter Egg. Es führt keinen Systemcode aus.

Die Seite ist ein Portfolio. Bananenblick wird ausdrücklich als Prototyp gezeigt. Die dortige Modell- und Geräteabnahme wird nicht durch diese Website ersetzt. Die Fotos sind Symbolbilder; Hardware-Bauten, Trainingsbestleistungen oder Zertifikate werden nicht erfunden.

## Technik und Weiterentwicklung

Statisches HTML, CSS und JavaScript ohne Framework, npm-Abhängigkeiten, externe Einbettungen oder Buildschritt. Sämtliche Bild- und Fontdateien liegen in `dist/assets/`. Keine Analysewerkzeuge, Cookies oder Serverformulare.

- Texte und Struktur: `dist/index.html`
- Layout und responsive Regeln: `dist/style.css`
- Interessen-Inhalte und Portfolio-Befehle: `dist/content.js`
- Interaktionen: `dist/app.js`
- Bildquellen, Schriftlizenzen und Datenschutz: `dist/credits.html`

Mit Node.js 24 prüfen:

```bash
npm run check
npm test
```

Zum lokalen Ansehen `dist/` über einen normalen statischen HTTP-Server ausliefern. In einer Codex-Cloud-Umgebung gelten deren Preview-Vorgaben. Die Pfade sind relativ und funktionieren unter `/patrice-lab/` und auf einer eigenen Domain.

## GitHub Pages

In **Settings → Pages → Build and deployment** die Quelle **GitHub Actions** auswählen. Der Workflow `.github/workflows/pages.yml` prüft zuerst Dateien und Interaktionslogik und veröffentlicht danach `dist/`. Pull Requests werden geprüft, aber nicht veröffentlicht. Ein Push auf `main` oder ein manueller Workflow-Lauf veröffentlicht die neue Version.

## Quellen und Prüfgrenzen

Die Projektvorschauen stammen aus dem öffentlichen AppShelf-Katalog. Alle verlinkten Projekte gehören zum GitHub-Account `der-programmer1`. Die Fotos stammen von Unsplash und sind ausdrücklich Symbolbilder. Space Grotesk und IBM Plex Mono werden mit ihren OFL-Lizenzen mitgeliefert.

Automatische Prüfungen decken lokale Assets, Unterpfade, Sprungziele, Bildbeschreibungen, zugängliche Dialognamen, Syntax und die Filter-/Terminal-Inhaltslogik ab. Sie ersetzen keinen visuellen Browser- oder Gerätetest. Die Darstellung wird je Browser gespeichert und auf demselben Host mit AppShelf geteilt.
