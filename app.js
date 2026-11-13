'use strict';
// Prices are stored in paise (integer minor units) to avoid floating-point totals.
const products=[
{id:'sage-notebook',name:'The Everyday Notebook',category:'Notebooks',description:'A soft sage cover for your next big idea.',price:34900,colour:'#b9c5a7',background:'#eef0e5',art:'book',tag:'A LITTLE FAVOURITE'},
{id:'pen-set',name:'The Good Ideas Pen Set',category:'Writing',description:'Three lovely colours. Endless possibilities.',price:24900,colour:'#c4b6cf',background:'#f1edf3',art:'pens',tag:'SET OF THREE'},
{id:'desk-tray',name:'The Little Things Tray',category:'Desk',description:'A thoughtful home for your desk essentials.',price:49900,colour:'#d3bea3',background:'#f2ece3',art:'tray',tag:'KEEP IT TOGETHER'},
{id:'rose-journal',name:'The Slow Days Journal',category:'Notebooks',description:'A fresh page for a slower kind of day.',price:39900,colour:'#d1b3ad',background:'#f5eeea',art:'book',tag:'MAKE A LITTLE TIME'},
{id:'sticky-notes',name:'The Tiny Reminders',category:'Desk',description:'Small notes for things worth remembering.',price:17900,colour:'#d7c78e',background:'#f4f1e5',art:'notes',tag:'LITTLE NOTES, BIG IDEAS'},
{id:'pencil-set',name:'The Sketch & Dream Set',category:'Writing',description:'Six pencils for wherever your mind wanders.',price:19900,colour:'#b0c2c9',background:'#eaf0f1',art:'pencils',tag:'LET YOUR IDEAS WANDER'}
];
const $=s=>document.querySelector(s);
const money=paise=>new Intl.NumberFormat('en-IN',{style:'currency',currency:'INR',maximumFractionDigits:0}).format(paise/100);
let cart=new Map(),category='all',sort='featured',toastTimer;
const storageKey='little-desk-cart-v1';
try{const saved=JSON.parse(localStorage.getItem(storageKey)||'[]');if(Array.isArray(saved))saved.forEach(item=>{if(products.some(p=>p.id===item.id)&&Number.isInteger(item.quantity)&&item.quantity>0&&item.quantity<=99)cart.set(item.id,item.quantity);});}catch{}
function save(){try{localStorage.setItem(storageKey,JSON.stringify([...cart].map(([id,quantity])=>({id,quantity}))));}catch{notify('Your bag is available for this visit; browser storage is unavailable.');}}
function notify(text){clearTimeout(toastTimer);$('#toast').textContent=text;toastTimer=setTimeout(()=>$('#toast').textContent='',3000);}
function artwork(p){
 let body='';const c=p.colour;
 if(p.art==='book')body='<g transform="rotate(-13 120 110)"><rect x="68" y="27" width="112" height="157" rx="8" fill="#54584b" opacity=".08" transform="translate(7 9)"/><rect x="68" y="27" width="112" height="157" rx="8" fill="'+c+'"/><path d="M75 30v151" stroke="#fff" stroke-opacity=".3" stroke-width="2"/><text x="94" y="92" font-family="Georgia,serif" font-size="17" fill="#fffff5">little</text><text x="94" y="114" font-family="Georgia,serif" font-size="17" fill="#fffff5">thoughts.</text><text x="92" y="156" font-family="Arial,sans-serif" font-size="4" letter-spacing="1" fill="#fffff5">YOUR EVERYDAY IDEAS</text><path d="M167 184v11l-5-5-5 5v-11" fill="#a4ad92"/></g>';
 else if(p.art==='pens'||p.art==='pencils'){
 const colours=p.art==='pens'?['#afbfa5','#c4b2cd','#d5b7a0']:['#a8bdc3','#bbc8ad','#c2b3ce','#d6bea3','#b5c4c8','#c8b6ae'];
 body='<g transform="rotate(21 120 110)">';colours.forEach((colour,i)=>{const x=76+i*(p.art==='pens'?30:17);body+='<rect x="'+x+'" y="32" width="10" height="140" rx="3" fill="'+colour+'"/><path d="m'+x+' 172 5 16 5-16Z" fill="#d2c6ae"/><path d="m'+(x+3)+' 182 2 6 2-6Z" fill="#70766b"/><path d="M'+(x+3)+' 35v120" stroke="#fff" stroke-opacity=".3" stroke-width="2"/>';});body+='</g>';
 }else if(p.art==='tray')body='<g transform="rotate(-12 120 110)"><rect x="34" y="63" width="181" height="103" rx="37" fill="#7b6b4e" opacity=".08" transform="translate(5 9)"/><rect x="34" y="56" width="181" height="103" rx="37" fill="'+c+'"/><rect x="44" y="65" width="161" height="84" rx="30" fill="#e4d6c1"/><path d="M58 113q20-35 35 0t34 0" fill="none" stroke="#baaa8c" stroke-width="2"/><rect x="145" y="79" width="7" height="53" rx="2" fill="#abb398" transform="rotate(15 145 79)"/><circle cx="179" cy="119" r="9" fill="none" stroke="#c4b290" stroke-width="3"/></g>';
 else body='<g transform="rotate(-12 120 110)"><rect x="57" y="68" width="105" height="104" rx="3" fill="#c3b5ce"/><rect x="74" y="48" width="105" height="104" rx="3" fill="#b8c6a7"/><rect x="91" y="28" width="105" height="104" rx="3" fill="'+c+'"/><path d="M106 57h53m-53 13h65m-65 13h37" stroke="#b3a263" stroke-opacity=".5" stroke-width="2"/><path d="M179 116h17l-17 16Z" fill="#eee4bc"/></g>';
 return '<svg viewBox="0 0 250 215" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">'+body+'</svg>';
}
function renderProducts(){
 let list=products.filter(p=>category==='all'||p.category===category);
 if(sort==='low')list.sort((a,b)=>a.price-b.price);if(sort==='high')list.sort((a,b)=>b.price-a.price);
 $('#productCount').textContent=list.length+' lovely little things';const grid=$('#productGrid');grid.replaceChildren();
 list.forEach(p=>{const article=document.createElement('article');article.className='product-card';
 const art=document.createElement('div');art.className='product-art';art.style.background=p.background;art.innerHTML=artwork(p);art.setAttribute('role','img');art.setAttribute('aria-label',p.name+' illustration');const tag=document.createElement('span');tag.className='product-tag';tag.textContent=p.tag;art.append(tag);
 const info=document.createElement('div');info.className='product-info';const cat=document.createElement('span');cat.className='product-category';cat.textContent=p.category;
 const titleRow=document.createElement('div');titleRow.className='product-title-row';const title=document.createElement('h3');title.textContent=p.name;const price=document.createElement('span');price.className='product-price';price.textContent=money(p.price);titleRow.append(title,price);
 const desc=document.createElement('p');desc.className='product-description';desc.textContent=p.description;
 const add=document.createElement('button');add.className='add-button';add.type='button';add.setAttribute('aria-label','Add '+p.name+' to bag');add.append(document.createTextNode('Add to bag'));const plus=document.createElement('span');plus.textContent='+';add.append(plus);add.addEventListener('click',()=>{const count=cart.get(p.id)||0;if(count>=99){notify('Maximum 99 of each item.');return;}cart.set(p.id,count+1);save();renderCart();notify(p.name+' added to your bag.');});
 info.append(cat,titleRow,desc,add);article.append(art,info);grid.append(article);});
}
function totals(){let count=0,total=0;cart.forEach((quantity,id)=>{const p=products.find(p=>p.id===id);if(p){count+=quantity;total+=quantity*p.price;}});return{count,total};}
function changeQuantity(id,delta){const next=(cart.get(id)||0)+delta;if(next<=0)cart.delete(id);else if(next<=99)cart.set(id,next);save();renderCart();}
function renderCart(){
 const {count,total}=totals();$('#bagCount').textContent=count;$('#openCart').setAttribute('aria-label','Open shopping bag, '+count+' items');$('#cartEmpty').hidden=count>0;$('#cartSummary').hidden=count===0;$('#subtotal').textContent=$('#total').textContent=money(total);
 const list=$('#cartItems');list.replaceChildren();
 cart.forEach((quantity,id)=>{const p=products.find(p=>p.id===id);if(!p)return;const row=document.createElement('div');row.className='cart-row';const thumb=document.createElement('div');thumb.className='cart-thumb';thumb.style.background=p.background;thumb.innerHTML=artwork(p);
 const details=document.createElement('div');details.className='cart-details';const name=document.createElement('h3');name.textContent=p.name;const price=document.createElement('span');price.textContent=money(p.price)+' each';const controls=document.createElement('div');controls.className='quantity';
 const minus=document.createElement('button');minus.textContent='−';minus.setAttribute('aria-label','Decrease '+p.name+' quantity');minus.addEventListener('click',()=>changeQuantity(id,-1));
 const number=document.createElement('span');number.textContent=quantity;number.setAttribute('aria-label','Quantity: '+quantity);
 const plus=document.createElement('button');plus.textContent='+';plus.disabled=quantity>=99;plus.setAttribute('aria-label','Increase '+p.name+' quantity');plus.addEventListener('click',()=>changeQuantity(id,1));controls.append(minus,number,plus);details.append(name,price,controls);
 const right=document.createElement('div');right.className='cart-right';const sum=document.createElement('strong');sum.textContent=money(p.price*quantity);const remove=document.createElement('button');remove.className='remove';remove.textContent='Remove';remove.setAttribute('aria-label','Remove '+p.name);remove.addEventListener('click',()=>{cart.delete(id);save();renderCart();notify('Item removed from your bag.');});right.append(sum,remove);row.append(thumb,details,right);list.append(row);});
}
function openCart(){renderCart();$('#cartDialog').showModal();}
$('#openCart').addEventListener('click',openCart);
$('#continueShopping').addEventListener('click',()=>$('#cartDialog').close());
document.querySelectorAll('[data-close]').forEach(b=>b.addEventListener('click',()=>document.getElementById(b.dataset.close).close()));
document.querySelectorAll('dialog').forEach(dialog=>dialog.addEventListener('click',event=>{if(event.target===dialog){const r=dialog.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)dialog.close();}}));
$('#checkout').addEventListener('click',()=>{const {count,total}=totals();if(!count)return;const list=$('#checkoutItems');list.replaceChildren();cart.forEach((quantity,id)=>{const p=products.find(p=>p.id===id);const row=document.createElement('div');row.className='preview-row';const name=document.createElement('span');name.textContent=p.name+' × '+quantity;const price=document.createElement('strong');price.textContent=money(p.price*quantity);row.append(name,price);list.append(row);});$('#checkoutCount').textContent=count;$('#checkoutTotal').textContent=money(total);$('#cartDialog').close();$('#checkoutDialog').showModal();});
$('#backToBag').addEventListener('click',()=>{$('#checkoutDialog').close();openCart();});
document.querySelectorAll('[data-filter]').forEach(b=>b.addEventListener('click',()=>{category=b.dataset.filter;document.querySelectorAll('[data-filter]').forEach(x=>{const on=x===b;x.classList.toggle('active',on);x.setAttribute('aria-pressed',String(on));});renderProducts();}));
$('#sort').addEventListener('change',()=>{sort=$('#sort').value;renderProducts();});
renderProducts();renderCart();
