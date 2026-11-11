import { MODES, INTERESTS, matchesFilter, resolveCommand } from './content.js';

const byId = id => document.getElementById(id);
const hero = document.querySelector('.hero-visual');
const modeButtons = [...document.querySelectorAll('.mode-switcher button')];
modeButtons.forEach(button => button.addEventListener('click', () => {
  const mode = MODES[button.dataset.mode];
  if (!mode) return;
  hero.dataset.mode = button.dataset.mode;
  byId('hero-image').src = new URL('./assets/' + mode.image, import.meta.url).href;
  byId('hero-image').alt = mode.alt;
  byId('hero-index').textContent = mode.index;
  byId('hero-kicker').textContent = mode.kicker;
  byId('hero-headline').textContent = mode.headline;
  byId('hero-tag').textContent = mode.tag;
  modeButtons.forEach(item => item.setAttribute('aria-pressed', String(item === button)));
}));

const filterButtons = [...document.querySelectorAll('[data-filter]')];
const projectCards = [...document.querySelectorAll('[data-categories]')];
filterButtons.forEach(button => button.addEventListener('click', () => {
  let count = 0;
  projectCards.forEach(card => {
    const visible = matchesFilter(card.dataset.categories, button.dataset.filter);
    card.hidden = !visible;
    if (visible) count++;
  });
  filterButtons.forEach(item => item.setAttribute('aria-pressed', String(item === button)));
  byId('filter-status').textContent = String(count).padStart(2, '0') + (count === 1 ? ' PROJEKT' : ' PROJEKTE');
}));

const interestDialog = byId('interest-dialog');
interestDialog.setAttribute('aria-labelledby', 'detail-title');
document.querySelectorAll('[data-interest]').forEach(button => button.addEventListener('click', () => {
  const key = button.dataset.interest;
  const detail = INTERESTS[key];
  const mode = MODES[key];
  if (!detail || !mode) return;
  byId('detail-image').src = new URL('./assets/' + mode.image, import.meta.url).href;
  byId('detail-image').alt = mode.alt;
  byId('detail-kicker').textContent = detail.kicker;
  byId('detail-title').textContent = detail.title;
  byId('detail-description').textContent = detail.description;
  byId('detail-tags').replaceChildren(...detail.tags.map(tag => {
    const span = document.createElement('span');
    span.textContent = tag;
    return span;
  }));
  const link = byId('detail-link');
  link.href = detail.href;
  link.textContent = detail.link + ' ↗';
  if (detail.href.startsWith('https:')) {
    link.target = '_blank'; link.rel = 'noopener noreferrer';
  } else {
    link.removeAttribute('target'); link.removeAttribute('rel');
  }
  interestDialog.showModal();
}));
byId('detail-link').addEventListener('click', () => interestDialog.close());

document.querySelectorAll('[data-open-dialog]').forEach(button => button.addEventListener('click', () => {
  byId(button.dataset.openDialog).showModal();
}));
document.querySelectorAll('[data-close-dialog]').forEach(button => button.addEventListener('click', () => {
  button.closest('dialog').close();
}));
document.querySelectorAll('dialog').forEach(dialog => dialog.addEventListener('click', event => {
  if (event.target !== dialog) return;
  const rect = dialog.getBoundingClientRect();
  if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) dialog.close();
}));

const terminalDialog = byId('terminal-dialog');
const terminalInput = byId('terminal-input');
const terminalOutput = byId('terminal-output');
byId('terminal-trigger').addEventListener('click', () => {
  terminalDialog.showModal();
  terminalInput.focus();
});

function runCommand(raw) {
  const result = resolveCommand(raw);
  if (result.clear) { terminalOutput.replaceChildren(); return; }
  if (!result.text) return;
  const entry = document.createElement('div');
  entry.className = 'terminal-entry';
  const command = document.createElement('p');
  command.className = 'terminal-command';
  command.textContent = '$ ' + raw;
  const output = document.createElement('div');
  output.className = 'terminal-result';
  output.textContent = result.text;
  if (result.links) result.links.forEach(item => {
    const line = document.createElement('p');
    const link = document.createElement('a');
    link.textContent = item.label + ' ↗';
    link.href = item.url;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    line.append(link);
    output.append(line);
  });
  entry.append(command, output);
  terminalOutput.append(entry);
  if (terminalOutput.children.length > 24) terminalOutput.firstElementChild.remove();
  terminalOutput.scrollTop = terminalOutput.scrollHeight;
}
byId('terminal-form').addEventListener('submit', event => {
  event.preventDefault();
  runCommand(terminalInput.value.trim());
  terminalInput.value = '';
  terminalInput.focus();
});
document.querySelectorAll('[data-command]').forEach(button => button.addEventListener('click', () => {
  runCommand(button.dataset.command);
  terminalInput.value = '';
  terminalInput.focus();
}));
byId('year').textContent = String(new Date().getFullYear());
