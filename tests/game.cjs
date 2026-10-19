// Exercise the actual inline game in a deterministic DOM/Canvas stub.
const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const script=fs.readFileSync('index.html','utf8').match(/<script>([\s\S]*)<\/script>/)[1];
function harness(blocked=false){const nodes=new Map(),data=new Map();function node(k){if(!nodes.has(k))nodes.set(k,{style:{},textContent:'',addEventListener(){},querySelector:node,getContext:()=>new Proxy({},{get:()=>()=>{}})});return nodes.get(k)}
const context=vm.createContext({console,Math,JSON,Number,Set,innerWidth:1280,innerHeight:800,devicePixelRatio:1,window:{},document:{querySelector:node,querySelectorAll:()=>[],addEventListener(){}},addEventListener(){},requestAnimationFrame(){},localStorage:{getItem(k){if(blocked)throw Error('denied');return data.get(k)||null},setItem(k,v){if(blocked)throw Error('denied');data.set(k,String(v))},removeItem(k){if(blocked)throw Error('denied');data.delete(k)}}});
vm.runInContext(script.replace('})();',"globalThis.inspect=code=>eval(code);})();"),context);return {run:context.inspect,data}}
let passed=0;function test(name,fn){fn();passed++;console.log('PASS',name)}
let h=harness(),run=h.run;
test('storage denial does not crash startup or victory',()=>{const b=harness(true);b.run('begin();player.x=127*T;step(1/120)');assert.equal(b.run('state'),'won')});
test('enemy feet touch terrain',()=>assert.equal(run('enemies.every(e=>e.y+e.h===240)'),true));
test('ground collision',()=>{run('begin();for(let i=0;i<120;i++)step(1/120)');assert.equal(run('player.y+player.h'),240)});
test('crate top is solid',()=>{run('player.x=16*T+2;player.y=7*T-23;player.vy=120;player.y+=2;collide("y")');assert.equal(run('player.y+player.h'),168)});
test('crate side is solid',()=>{run('player.x=16*T-16;player.y=7*T+1;player.vx=100;collide("x")');assert.equal(run('player.x+player.w'),384)});
test('crate underside grants one reward',()=>{run('player.x=16*T+2;player.y=7*T+22;player.vy=-100;collide("y")');assert.equal(run('crates[0].used'),true);const score=run('score');run('player.y=7*T+22;player.vy=-100;collide("y")');assert.equal(run('score'),score)});
test('independent input sources release correctly',()=>{run('input("jump",1,true);input("jump",2,true);input("jump",1,false)');assert.equal(run('keys.jump'),true);run('input("jump",2,false)');assert.equal(run('keys.jump'),false)});
test('pause clears held input and resumes position',()=>{run('input("right",3,true)');const x=run('player.x');run('pause();pause()');assert.equal(run('keys.right'),false);assert.equal(run('player.x'),x)});
test('jump starts and short release reduces height',()=>{function height(held){run('begin();for(let i=0;i<100;i++)step(1/120);setKey("jump",true)');let min=300;for(let i=0;i<80;i++){if(i===held)run('setKey("jump",false)');run('step(1/120)');min=Math.min(min,run('player.y'))}return min}assert.ok(height(40)<height(2)-20)});
test('checkpoint restores collected items without farming',()=>{run('begin();gems[0].got=true;coins=1;score=100;player.x=64*T;player.y=100;step(1/120);gems[1].got=true;coins=2;score=200;hurt()');assert.equal(run('coins'),1);assert.equal(run('gems[0].got'),true);assert.equal(run('gems[1].got'),false)});
test('continue restores checkpoint snapshot',()=>{run('begin(true)');assert.equal(run('checkpoint'),1440);assert.equal(run('gems[0].got'),true);assert.equal(run('coins'),1)});
test('legacy save loads',()=>{h.data.set('pq_save',JSON.stringify({x:1440,coins:4,score:900,lives:2}));run('begin(true)');assert.equal(run('coins'),4);assert.equal(run('lives'),2)});
test('game over stops the physics loop immediately',()=>{run('begin();lives=1;player.y=500;step(1/120)');assert.equal(run('state'),'lost');assert.equal(h.data.has('pq_save'),false)});
test('full level traversable using running jumps',()=>{run('begin();keys.run=keys.right=true;enemies.forEach(e=>e.alive=false)');for(let i=0;i<4000&&run('state')==='play';i++){run(`setKey('jump',true);if(player.onGround&&[24*T,54*T,88*T].some(edge=>edge-player.x>20&&edge-player.x<55))jumpBuffer=.13;step(1/120)`)}assert.equal(run('state'),'won');assert.ok(run('lives')>0)});
console.log(`${passed} tests passed`);
