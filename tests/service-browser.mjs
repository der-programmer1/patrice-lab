import assert from 'node:assert/strict';
import {createServer} from 'node:http';
import {readFile} from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {chromium, webkit} from 'playwright';

const root = fileURLToPath(new URL('../dist/', import.meta.url));
const mount = '/patrice-lab/';
const types = {'.html':'text/html; charset=utf-8','.css':'text/css','.js':'text/javascript','.svg':'image/svg+xml','.ttf':'font/ttf','.jpg':'image/jpeg','.png':'image/png'};
const server = createServer(async (req,res) => {
  try {
    const pathname = decodeURIComponent(new URL(req.url,'http://localhost').pathname);
    if (!pathname.startsWith(mount)) throw new Error('outside mount');
    const target = path.resolve(root, pathname.slice(mount.length)+(pathname.endsWith('/')?'index.html':''));
    if (!target.startsWith(root)) throw new Error('outside dist');
    const content = await readFile(target);
    res.writeHead(200, {'Content-Type':types[path.extname(target)]||'application/octet-stream'});
    res.end(content);
  } catch { res.writeHead(404).end(); }
});
await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
const base = `http://127.0.0.1:${server.address().port}${mount}`;
const noOverflow = async page => {
  const layout = await page.evaluate(() => ({
    ok:document.documentElement.scrollWidth<=innerWidth+1,
    width:innerWidth, documentWidth:document.documentElement.scrollWidth,
    theme:document.documentElement.dataset.theme,
    overflow:[...document.querySelectorAll('body *')].map(node=>({
      tag:node.tagName, class:node.className, id:node.id,
      right:Math.round(node.getBoundingClientRect().right),
      width:Math.round(node.getBoundingClientRect().width)
    })).filter(node=>node.right>innerWidth+1&&node.width>0).slice(0,12)
  }));
  assert.ok(layout.ok, `${page.url()}: ${JSON.stringify(layout)}`);
};

try {
  for (const [name, launcher] of Object.entries({chromium,webkit})) {
    const browser = await launcher.launch();
    try {
      const context = await browser.newContext({colorScheme:'light'});
      const page = await context.newPage();
      const errors = [];
      const submissions = [];
      page.on('pageerror',error=>errors.push(error.message));
      page.on('request',request=>{
        if(request.method()!=='GET'||['fetch','xhr'].includes(request.resourceType()))submissions.push(request.url());
      });
      for(const width of [320,390,768,1280]) {
        await page.setViewportSize({width,height:900});
        await page.goto(base);
        for(const mode of ['light','dark']) {
          await page.getByRole('combobox',{name:'Farbschema'}).selectOption(mode);
          await noOverflow(page);
        }
        await page.getByRole('link',{name:'Leistungen & Ablauf ansehen',exact:true}).click();
        await page.waitForURL(new URL('angebot.html',base).href);
        await page.getByRole('form',{name:'Website-Anfrage vorbereiten'}).waitFor();
        for(const mode of ['light','dark']) {
          await page.getByRole('combobox',{name:'Farbschema'}).selectOption(mode);
          await noOverflow(page);
        }
      }
      await page.getByLabel('Dein Name',{exact:true}).fill('Mia Müller');
      await page.getByLabel('Wofür ist deine Website?',{exact:true}).selectOption('portfolio');
      await page.getByLabel('Was möchtest du zeigen?',{exact:true}).fill('Ich möchte meine Projekte & Bewerbungsunterlagen auf meiner Website zeigen.');
      await page.getByRole('button',{name:'Anfrage vorbereiten'}).click();
      const draft=page.locator('[data-request-preview]');
      await draft.waitFor();
      const link=new URL(await page.locator('[data-prepared-mail]').getAttribute('href'));
      assert.equal(link.pathname,'ich.der.programmer@gmail.com');
      assert.match(link.searchParams.get('body'),/Mia Müller/);
      assert.match(link.searchParams.get('subject'),/350 € einmalig/);
      await page.getByRole('button',{name:'Anfragetext kopieren'}).click();
      await page.waitForFunction(()=>/kopiert|markiert/.test(document.querySelector('[data-inquiry-status]').textContent));
      await page.getByLabel('Dein Name',{exact:true}).fill('Anderer Name');
      assert.equal(await draft.isVisible(),false);
      assert.deepEqual(errors,[]);
      assert.deepEqual(submissions,[]);
      await context.close();
      const plain=await browser.newContext({javaScriptEnabled:false,viewport:{width:320,height:850}});
      const plainPage=await plain.newPage();
      await plainPage.goto(new URL('angebot.html',base).href);
      assert.equal(await plainPage.getByRole('link',{name:'ich.der.programmer@gmail.com',exact:true}).count(),1);
      assert.equal(await plainPage.locator('.service-form').isVisible(),false);
      await noOverflow(plainPage);
      await plain.close();
      console.log(`PASS ${name}: portfolio and offer in both themes, mobile layout, request draft, clipboard fallback and direct contact without JavaScript`);
    } finally { await browser.close(); }
  }
} finally { await new Promise(resolve=>server.close(resolve)); }
