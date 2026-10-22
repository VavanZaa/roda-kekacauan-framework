// Authored art direction. Themes affect rendering only, never game rules or odds.
export const THEMES = [
  {id:'race',name:'Ras',title:'Kamu terlahir sebagai…',concept:'Papan silsilah',material:'wood',accent:'#507963',light:'#d7e2cf',dark:'#263f34',motif:'branch',props:['leaf','token'],mark:'R',reaction:'Oke. Kita mulai dari sini.'},
  {id:'archetype',name:'Archetype',title:'Kerjaan kamu apa?',concept:'Papan kontrak petualang',material:'cloth',accent:'#976847',light:'#ead9bd',dark:'#573c2c',motif:'crossed-blades',props:['blade','badge'],mark:'A',reaction:'CV-nya mulai kebentuk.'},
  {id:'backstory',name:'Backstory',title:'Sebelum semua ini…',concept:'Buku perjalanan',material:'paper',accent:'#837054',light:'#e9dfc8',dark:'#4b4134',motif:'quill',props:['book','ink'],mark:'B',reaction:'Lore baru kebuka.'},
  {id:'size',name:'Size',title:'Segede apa kamu?',concept:'Meja ukur',material:'wood',accent:'#657b77',light:'#d8e0d1',dark:'#384c49',motif:'ruler',props:['ruler','compass'],mark:'S',reaction:'Oke, segitu ukurannya.'},
  {id:'strength',name:'Strength',title:'Seberapa kuat?',concept:'Bengkel besi',material:'stone',accent:'#aa6954',light:'#edd5bd',dark:'#5f3c32',motif:'hammer',props:['hammer','weight'],mark:'STR',reaction:'Tenaganya segini.'},
  {id:'speed',name:'Speed',title:'Seberapa ngebut?',concept:'Lintasan angin',material:'cloth',accent:'#617f87',light:'#d8e7df',dark:'#344e55',motif:'feather',props:['feather','pulley'],mark:'SPD',reaction:'Gas dulu.'},
  {id:'durability',name:'Durability',title:'Kuat nahan berapa?',concept:'Benteng batu',material:'stone',accent:'#748477',light:'#dfe3d0',dark:'#404c42',motif:'shield',props:['shield','stone'],mark:'DUR',reaction:'Semoga nggak gampang tumbang.'},
  {id:'intelligence',name:'Intelligence',title:'Otaknya sampai mana?',concept:'Ruang strategi',material:'paper',accent:'#66828b',light:'#dce5dd',dark:'#394e57',motif:'lens',props:['lens','book'],mark:'INT',reaction:'Ada rencana di kepala.'},
  {id:'fight',name:'Fight',title:'Jago berantem?',concept:'Arena latihan',material:'cloth',accent:'#9b7552',light:'#ead9be',dark:'#553f2e',motif:'fist',props:['wrap','staff'],mark:'FIGHT',reaction:'Skill dulu, baru gaya.'},
  {id:'weapon',name:'Weapon',title:'Senjata kamu…',concept:'Rak persenjataan',material:'wood',accent:'#857563',light:'#e8dcc5',dark:'#493f35',motif:'sword',props:['blade','anvil'],mark:'W',reaction:'Ya udah. Pakai ini.'},
  {id:'weapon-mastery',name:'Weapon Mastery',title:'Bisa pakainya nggak?',concept:'Batu asah',material:'stone',accent:'#68878a',light:'#d6e5da',dark:'#354d50',motif:'whetstone',props:['blade','whetstone'],mark:'WM',reaction:'Latihannya kelihatan.'},
  {id:'enchantment',name:'Enchantment',title:'Senjatanya dapat apa?',concept:'Meja alkimia',material:'paper',accent:'#9a7960',light:'#ecdfc5',dark:'#544132',motif:'bottle',props:['bottle','rune'],mark:'E',reaction:'Ada bonus di senjatanya.'},
  {id:'power',name:'Power',title:'Power kamu…',concept:'Kabinet artefak',material:'orbit',accent:'#7d7598',light:'#e0d9e7',dark:'#453e57',motif:'orb',props:['orb','crystal'],mark:'P',reaction:'Power baru kebuka.'},
  {id:'power-mastery',name:'Power Mastery',title:'Seberapa terkendali?',concept:'Astrolabe',material:'orbit',accent:'#737c97',light:'#dde2eb',dark:'#3d455c',motif:'astrolabe',props:['compass','orb'],mark:'PM',reaction:'Semua power pakai mastery ini.'},
  {id:'weakness',name:'Weakness',title:'Ada kelemahannya?',concept:'Catatan tambalan',material:'paper',accent:'#9d7865',light:'#efdecc',dark:'#5a4237',motif:'patch',props:['patch','note'],mark:'?',reaction:'Tetap ada celahnya.'},
  {id:'chaos',name:'Roda Kekacauan',title:'Takdir ikut campur.',concept:'Neraca dua sisi',material:'orbit',accent:'#8d746b',light:'#ede0cc',dark:'#4c3c38',motif:'balance',props:['coin','hourglass'],mark:'RK',reaction:'Nah. Mulai aneh.'},
  {id:'title',name:'Gelar',title:'Kamu bakal dikenal sebagai…',concept:'Piagam dan stempel',material:'paper',accent:'#967444',light:'#eee0bd',dark:'#554328',motif:'seal',props:['scroll','seal'],mark:'G',reaction:'Namanya udah dapet.'},
  {id:'holy',name:'Holy Power',title:'Satu berkah untukmu.',concept:'Lilin dan reliqui',material:'paper',accent:'#9c8954',light:'#eee5c7',dark:'#544c31',motif:'candle',props:['candle','rune'],mark:'H',reaction:'Berkahnya masuk.'},
  {id:'cursed',name:'Cursed Power',title:'Ada harga di baliknya.',concept:'Buku kutukan',material:'paper',accent:'#856b7d',light:'#e5d9df',dark:'#4b3747',motif:'eye',props:['book','chain'],mark:'C',reaction:'Agak merinding.'},
  {id:'divine',name:'Divine Power',title:'Takdir memberi kuasa.',concept:'Marmer dan piringan surya',material:'stone',accent:'#a48b58',light:'#f0e6cb',dark:'#594d31',motif:'sun',props:['sun','column'],mark:'D',reaction:'Kuasa baru masuk.'},
  {id:'angelic',name:'Angelic Power',title:'Berkah dari atas.',concept:'Sayap dan pita',material:'cloth',accent:'#82918a',light:'#e5eadb',dark:'#46534b',motif:'wing',props:['feather','candle'],mark:'AN',reaction:'Langit lagi baik.'},
  {id:'demonic',name:'Demonic Power',title:'Kuasa dari jurang.',concept:'Besi gelap dan kontrak',material:'stone',accent:'#9b6b62',light:'#e8d5ca',dark:'#553732',motif:'horn',props:['chain','scroll'],mark:'DM',reaction:'Kontraknya masuk.'},
  {id:'blood',name:'Blood Power',title:'Darah ikut bicara.',concept:'Kaca dan tinta merah',material:'paper',accent:'#a16c70',light:'#ecd6d6',dark:'#58393f',motif:'drop',props:['bottle','drop'],mark:'BL',reaction:'Bekal baru.'},
  {id:'cosmic',name:'Cosmic Power',title:'Sejauh semesta.',concept:'Peta bintang',material:'orbit',accent:'#6e7f99',light:'#dbe2ee',dark:'#37475e',motif:'planet',props:['planet','compass'],mark:'CO',reaction:'Skalanya udah jauh.'},
  {id:'symbiote',name:'Symbiote Power',title:'Kalian makin menyatu.',concept:'Jaringan organik',material:'organic',accent:'#7b817b',light:'#dce2d6',dark:'#3d4941',motif:'tendril',props:['tendril','orb'],mark:'SY',reaction:'Inangnya dapat bekal.'},
  {id:'element',name:'Element',title:'Elemen apa?',concept:'Dua belas unsur · motif dan warna berbeda',material:'stone',accent:'#75866e',light:'#e3e6d0',dark:'#3f4d38',motif:'element',props:['crystal','leaf'],mark:'EL',reaction:'Elemennya ketemu.'}
];

export const LAYERS = [
  ['00-background','Latar',false],['01-surface','Panel obsidian',false],
  ['02-rear-props','Aksesori belakang',false],['03-shadow','Bayangan roda',false],
  ['04-bezel','Bingkai roda',false],['05-sectors','Bidang roda',true],
  ['06-labels','Label roda',true],['07-hub','Pusat roda',false],
  ['08-pointer','Penunjuk',false],['09-front-props','Aksesori depan',false],
  ['10-heading','Judul tahap',false],['11-context','Konteks',false],
  ['12-readout','Nama di penunjuk',false],['13-result','Kartu hasil',false],
  ['14-reaction','Reaksi dan caption',false],['15-guides','Panduan editor',false]
].map(([id,name,rotating],z)=>({id,name,z,rotating,pivot:rotating?[490,785]:null,editorOnly:id==='15-guides'}));

export const LAYOUT = {width:1080,height:1920,cx:490,cy:785,radius:380,
  safe:{x:72,y:180,width:840,height:1440},
  exclusions:{right:168,bottom:300,top:180},
  mascot:{x:82,y:1302,width:261,height:319},
  regions:{heading:[90,180,798,108],context:[92,306,790,39],wheel:[125,366,730,750],readout:[115,1174,750,76],result:[90,1120,800,160],reaction:[404,1309,462,154]},
  safeZoneStatus:'Authored conservative guide, adjustable; verify against current TikTok UI, device and caption length.'};

export function resolveTheme({themeId,wheelId='',parentThemeId='race'}={}) {
  const explicit=THEMES.find(t=>t.id===themeId); if(explicit)return explicit;
  const routes={'race-family':'race',archetype:'archetype',backstory:'backstory',size:'size','size-normal':'size','size-raksasa':'size',
    strength:'strength',speed:'speed',durability:'durability',intelligence:'intelligence',fight:'fight',
    'weapon':'weapon','weapon-main':'weapon','weapon-mastery':'weapon-mastery',enchantment:'enchantment',
    'power':'power','power-main':'power','power-mastery':'power-mastery',weakness:'weakness',apex:'chaos','roda-kekacauan-side':'chaos',title:'title'};
  let id=routes[wheelId];
  if(!id)id=THEMES.find(t=>wheelId===`power-${t.id}`)?.id;
  if(!id && wheelId==='element-universal')id='element';
  return THEMES.find(t=>t.id===(id||parentThemeId))||THEMES[0];
}

export function resolveWheelTheme(plan,options={}){
  const base=resolveTheme({...options,wheelId:plan.wheelId});
  const primary=new Set(['race-family','archetype','backstory','size','size-normal','size-raksasa','strength','speed','durability','intelligence','fight','weapon','weapon-main','weapon-mastery','enchantment','power','power-main','power-mastery','weakness','apex','roda-kekacauan-side','title','element-universal',...['holy','cursed','blood','cosmic','symbiote','divine','demonic','angelic'].map(t=>'power-'+t)]);
  if(!plan.wheelId||primary.has(plan.wheelId))return base;
  let hash=2166136261;for(const c of plan.wheelId){hash^=c.charCodeAt(0);hash=Math.imul(hash,16777619);}hash>>>=0;
  const color=base.accent.match(/\w\w/g).map(v=>parseInt(v,16)),delta=[-12,-6,0,6,12][hash%5];
  const accent='#'+color.map((v,i)=>Math.max(45,Math.min(170,v+delta+(i===(hash%3)?10:0))).toString(16).padStart(2,'0')).join('');
  const child={...base,accent,variantId:plan.wheelId,concept:base.concept+' / '+(plan.wheelLabel||plan.wheelId),
    name:plan.wheelLabel||base.name,title:plan.displayPrompt||(/\?$/.test(plan.wheelLabel||'')?plan.wheelLabel:'Putar '+(plan.wheelLabel||base.name)+'.')};
  if(/machine|android|cyborg|tech|mecha|transformer/.test(plan.wheelId)){child.material='orbit';child.motif='astrolabe';child.props=['ruler','lens'];}
  else if(/elf|fae|fairy|season|animal|siluman/.test(plan.wheelId)){child.material='cloth';child.motif=/season/.test(plan.wheelId)?'element':'leaf';child.props=['leaf','feather'];}
  else if(/gambler|chance|compatibility|takeover/.test(plan.wheelId)){child.motif='coin';child.props=['coin','hourglass'];}
  else if(/count|amount|army|follower|number/.test(plan.wheelId)){child.motif='ruler';child.props=['token','ruler'];}
  if(/dwarf-armor/.test(plan.wheelId)){child.material='stone';child.motif=/count/.test(plan.wheelId)?'armor-count':'armor';child.props=['helmet','boots'];child.mark='ARMOR';}
  if(/dwarf-armor/.test(plan.wheelId)){child.material='stone';child.motif=/count/.test(plan.wheelId)?'armor-count':'armor';child.props=['helmet','boots'];child.mark='ARMOR';}
  if(/dwarf-armor/.test(plan.wheelId)){child.material='stone';child.motif=/count/.test(plan.wheelId)?'armor-count':'armor';child.props=['helmet','boots'];child.mark='ARMOR';}
  return child;
}
