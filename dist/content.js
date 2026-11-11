export const MODES = Object.freeze({
  code: {index:'01 / 04', image:'code.jpg', alt:'Laptop auf einem Schreibtisch als Symbol für mein Interesse am Programmieren', kicker:'ZWISCHEN IDEE UND COMMIT', headline:'AUS GEDANKEN.\nWIRD CODE.', tag:'APPS / WEB / EIGENE PROJEKTE'},
  security: {index:'02 / 04', image:'security.jpg', alt:'Leuchtende Leiterbahnen als Symbol für mein Interesse an Hacking und Security', kicker:'HINTER DIE OBERFLÄCHE', headline:'FRAGEN STELLEN.\nTIEFER GRABEN.', tag:'HACKING / SECURITY / VERSTEHEN'},
  hardware: {index:'03 / 04', image:'hardware.jpg', alt:'Nahaufnahme einer Platine als Symbol für meine Begeisterung für Hardware', kicker:'AN DER WERKBANK', headline:'KLEINE CHIPS.\nGROSSE IDEEN.', tag:'ESP-PROJEKTE / LÖTEN / TÜFTELN'},
  gym: {index:'04 / 04', image:'gym.jpg', alt:'Trainingsraum als Symbol für Gym und Bankdrücken', kicker:'AUSGLEICH MIT GEWICHT', headline:'KOPF AUS.\nDRANBLEIBEN AN.', tag:'BANKDRÜCKEN / GYM / FORTSCHRITT'}
});

export const INTERESTS = Object.freeze({
  code: {kicker:'01 / CODE & PROGRAMMIEREN', title:'Die Idee ist erst der Anfang.', description:'Mich reizt der Moment, in dem aus einer Idee etwas wird, das man wirklich öffnen und ausprobieren kann. Ich programmiere eigene Apps und Web-Projekte und teile sie über GitHub. AppShelf ist ihr gemeinsames Zuhause. Nicht jeder Versuch ist fertig. Aber jeder bringt mich weiter.', tags:['Apps bauen','Web-Projekte','GitHub'], href:'#projekte', link:'Meine Projekte entdecken'},
  security: {kicker:'02 / HACKING & SECURITY', title:'Was steckt unter der Oberfläche?', description:'Mich interessiert, wie Systeme zusammenspielen, wo Annahmen an ihre Grenzen kommen und warum etwas so funktioniert, wie es funktioniert. Hacking ist für mich technische Neugier: Fragen stellen, Zusammenhänge entdecken und in eigenen oder freigegebenen Umgebungen dazulernen.', tags:['Systeme verstehen','Security entdecken','Weiterlernen'], href:'https://github.com/der-programmer1', link:'Mein GitHub entdecken'},
  hardware: {kicker:'03 / ESP-PROJEKTE & LÖTEN', title:'Code zum Anfassen.', description:'An der Werkbank wird aus Software etwas Greifbares. Ich beschäftige mich mit ESP-Projekten, löte Verbindungen und probiere eigene Schaltungen aus. Mich begeistert das Zusammenspiel von kleinen Boards, Elektronik und selbst geschriebenem Code. Konkrete Projektberichte können hier mitwachsen.', tags:['ESP-Projekte','Löten','Elektronik'], href:'https://github.com/der-programmer1', link:'Meine Projekte auf GitHub'},
  gym: {kicker:'04 / GYM & BANKDRÜCKEN', title:'Fortschritt kommt vom Dranbleiben.', description:'Im Gym bekomme ich den Kopf frei und arbeite an mir. Bankdrücken gehört dazu – genauso wie Training allgemein und die Freude, Stück für Stück besser zu werden. Manchmal treffen sich meine Interessen sogar: Mit GymDelay ist aus Programmieren und Training ein eigenes App-Projekt geworden.', tags:['Bankdrücken','Training','Ausgleich'], href:'https://der-programmer1.github.io/AppShelf/apps/gymdelay/', link:'GymDelay entdecken'}
});

export const PROJECTS = Object.freeze([
  {name:'AppShelf', url:'https://der-programmer1.github.io/AppShelf/', categories:['web']},
  {name:'Bananenblick · Prototyp', url:'https://der-programmer1.github.io/Bananenblick/', categories:['web','ai']},
  {name:'GymDelay', url:'https://der-programmer1.github.io/AppShelf/apps/gymdelay/', categories:['web','gym']}
]);

export function matchesFilter(categories, filter) {
  return filter === 'all' || categories.split(/\s+/).includes(filter);
}

export function resolveCommand(raw) {
  const command = raw.trim().toLowerCase().replace(/\s+/g,' ');
  switch(command) {
    case '': return {text:''};
    case 'help': return {text:'about     → Wer ich bin\nprojects  → Meine veröffentlichten Projekte\nhobbies   → Was mich außerhalb des Codes begeistert\ngithub    → Mein GitHub-Profil\nclear     → Terminal leeren'};
    case 'about': return {text:'Hi, ich bin Patrice.\nIch programmiere Apps, entdecke Security, tüftle an ESP-Projekten und trainiere im Gym.\nCode. Kraft. Neugier.'};
    case 'projects': case 'ls': return {text:'Meine Projekte – echte Links, eigener Code:', links:PROJECTS.map(({name,url})=>({label:name,url}))};
    case 'hobbies': return {text:'↗ Code & eigene Apps\n↗ Hacking & Security\n↗ ESP-Projekte & Löten\n↗ Gym & Bankdrücken\n\nVier Interessen. Ein Kopf, der gerne wissen will, was noch geht.'};
    case 'github': return {text:'Hier findest du meine Repositories:', links:[{label:'@der-programmer1',url:'https://github.com/der-programmer1'}]};
    case 'clear': return {clear:true};
    case 'whoami': return {text:'Du bist im Lab von Patrice. Schön, dass du reinschaust.'};
    default: return {text:'Diesen Portfolio-Befehl kenne ich noch nicht. Mit help findest du alle Befehle.'};
  }
}
