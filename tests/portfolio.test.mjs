import test from 'node:test';
import assert from 'node:assert/strict';
import { access, readFile } from 'node:fs/promises';
import { MODES, INTERESTS, PROJECTS, matchesFilter, resolveCommand } from '../dist/content.js';

test('every interest has a hero photo and a complete, matching detail entry', async () => {
  assert.deepEqual(Object.keys(MODES), ['code', 'security', 'hardware', 'gym']);
  for (const [key, mode] of Object.entries(MODES)) {
    await access(new URL('../dist/assets/' + mode.image, import.meta.url));
    assert.ok(mode.alt.length > 20);
    assert.ok(INTERESTS[key].description.length > 100);
    assert.ok(INTERESTS[key].tags.length > 1);
  }
});
test('public project filters show the intended work', () => {
  const shown = filter => PROJECTS.filter(project => matchesFilter(project.categories.join(' '), filter)).map(project=>project.name);
  assert.equal(shown('all').length, 3);
  assert.deepEqual(shown('ai'), ['Bananenblick · Prototyp']);
  assert.deepEqual(shown('gym'), ['Satzfenster']);
  assert.equal(shown('web').length, 3);
  assert.deepEqual(shown('invalid'), []);
});
test('category matching uses whole categories, not substrings', () => {
  assert.equal(matchesFilter('web ai', 'a'), false);
  assert.equal(matchesFilter('web\tai', 'ai'), true);
});
test('terminal normalizes whitespace and case', () => {
  assert.deepEqual(resolveCommand('  PROJECTS  '), resolveCommand('projects'));
  assert.deepEqual(resolveCommand('  Help\n'), resolveCommand('help'));
  assert.deepEqual(resolveCommand('   '), {text:''});
});
test('terminal exposes only verified public projects and no automatic navigation', () => {
  const result = resolveCommand('projects');
  assert.equal(result.links.length, 3);
  result.links.forEach(link => {
    assert.equal(new URL(link.url).protocol, 'https:');
    assert.equal(new URL(link.url).hostname, 'der-programmer1.github.io');
  });
});
test('unknown or hostile input stays plain text and cannot become a command', () => {
  const unknown = resolveCommand('nonsense');
  assert.deepEqual(resolveCommand('<img src=x onerror=alert(1)>'), unknown);
  assert.deepEqual(resolveCommand('javascript:alert(1)'), unknown);
  assert.deepEqual(resolveCommand('rm -rf /'), unknown);
  assert.deepEqual(resolveCommand('clear'), {clear:true});
});
test('bio reflects Patrice and the supplied interests without invented lifting records', () => {
  assert.match(resolveCommand('about').text, /Patrice/);
  assert.match(resolveCommand('hobbies').text, /ESP-Projekte & Löten/);
  assert.match(INTERESTS.gym.description, /Bankdrücken/);
  assert.doesNotMatch(INTERESTS.gym.description, /\d+\s*(kg|Jahre|Wiederholungen)/);
});
test('all project cards have real navigation and the public banana release is a prototype', async () => {
  const html = await readFile(new URL('../dist/index.html', import.meta.url), 'utf8');
  PROJECTS.forEach(project=>assert.ok(html.includes(`href="${project.url}"`)));
  assert.match(html, /prototype-label">PROTOTYP/);
});
