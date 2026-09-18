(()=>{
  'use strict';
  const data=window.HEALTH_DATA,core=window.MealCore,$=id=>document.getElementById(id);
  const state={query:'',category:'全部餐點',health:'',town:'',radius:'',sort:'original',location:null,limit:12};
  let meals=[],locationRequest=0;
  const arrow='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m9 5 7 7-7 7"/></svg>';
  const escape=v=>String(v).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const kmText=km=>Number.isFinite(km)?(km<.1?'少於 100 公尺':km<1?`${Math.round(km*1000/10)*10} 公尺`:`${km.toFixed(1)} 公里`):'距離待確認';
  const tags=health=>health.map(t=>`<span class="tag ${t==='減糖'?'sugar':t==='符合飲食建議'?'balanced':''}">${escape(t)}</span>`).join('');
  $('categories').innerHTML=core.categories.map(c=>`<button type="button" aria-pressed="${c===state.category}" data-category="${c}">${c}</button>`).join('');
  [...new Set(data.stores.map(s=>s.town))].forEach(t=>$('town').add(new Option(t,t)));
  function render(){
    meals=core.selectMeals(data,state);
    const storeCount=new Set(meals.flatMap(m=>m.offers.map(o=>o.store.id))).size;
    $('count').textContent=`${meals.length} 道餐點 · ${storeCount} 家供應店家`;
    $('meals').innerHTML=meals.slice(0,state.limit).map((m,i)=>{
      const near=m.nearest;const many=m.offers.length>1;const located=state.location&&Number.isFinite(near.km);
      const subtitle=located?`${many?'最近供應：':''}${near.store.name} · ${near.store.town}${many?` · 另 ${m.offers.length-1} 家`:''}`:many?`${m.offers.length} 家供應店家 · ${[...new Set(m.offers.map(o=>o.store.town))].join('、')}`:`${near.store.name} · ${near.store.town}`;
      return `<article class="meal"><div><h3>${escape(m.name)}</h3><p class="meal-sub">${escape(subtitle)}</p></div><div class="tags" aria-label="餐點健康元素">${tags(located?near.health:m.health)}</div><div class="meal-actions">${state.location?`<span class="distance">${Number.isFinite(near.km)&&near.km>=.1?'約 ':''}${kmText(near.km)}</span>`:''}<button class="outline" data-meal="${i}" aria-label="查看${escape(m.name)}的供應店家">查看店家${arrow}</button></div></article>`;
    }).join('');
    $('empty').hidden=meals.length!==0;$('more').hidden=meals.length<=state.limit;
    $('more').textContent=`載入更多餐點（尚有 ${Math.max(0,meals.length-state.limit)} 道）`;
    const active=Boolean(state.query||state.category!=='全部餐點'||state.health||state.town||state.radius);
    $('reset').hidden=!active;
    $('filter-summary').textContent=state.location?'同餐點優先顯示最近店家 · 距離為直線估算':active?'依選擇條件顯示餐點與供應店家。':'先選想吃的，再看哪裡有。';
    [...$('categories').children].forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.category===state.category)));
  }
  function openMeal(index){const meal=meals[index];if(!meal)return;$('detail-title').textContent=meal.name;
    $('detail-stores').innerHTML=meal.offers.map((o,i)=>{const s=o.store;const destination=`${s.name} ${s.address}`;const mapUrl=s.mapUrl||`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(Number.isFinite(s.lat)&&Number.isFinite(s.lng)?`${s.lat},${s.lng}`:destination)}`;const nav=`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(Number.isFinite(s.lat)&&Number.isFinite(s.lng)?`${s.lat},${s.lng}`:destination)}`;
      return `<section class="store"><h3>${state.location&&Number.isFinite(o.km)&&i===0?'<span class="tag">最近供應</span> ':''}${escape(s.name)}</h3><div class="tags">${tags(o.health)}</div><p>${escape(s.address)}</p>${state.location?`<p>直線距離：${Number.isFinite(o.km)&&o.km>=.1?'約 ':''}${kmText(o.km)}</p>`:''}${s.note?`<p class="note">${escape(s.note)}</p>`:''}<p class="small">${escape(s.locationStatus)}${s.checkedAt?` · 查核日期 ${s.checkedAt}`:''}</p><div class="store-links"><a class="outline" href="${escape(nav)}" target="_blank" rel="noopener noreferrer">導航前往</a><a class="outline" href="${escape(mapUrl)}" target="_blank" rel="noopener noreferrer">Google Maps</a>${s.phones.map(p=>`<a class="outline" href="tel:${p.replace(/[^+\d]/g,'')}">撥打 ${escape(p)}</a>`).join('')}</div></section>`;
    }).join('');$('detail').showModal();
  }
  function update(){state.limit=12;render();}
  function reset(){state.query='';state.category='全部餐點';state.health='';state.town='';state.radius='';$('search').value='';['health','town','radius'].forEach(id=>$(id).value='');update();}
  $('search').addEventListener('input',e=>{state.query=e.target.value;update();});
  $('categories').addEventListener('click',e=>{const b=e.target.closest('[data-category]');if(b){state.category=b.dataset.category;update();}});
  ['health','town','radius','sort'].forEach(id=>$(id).addEventListener('change',e=>{state[id]=e.target.value;update();}));
  $('meals').addEventListener('click',e=>{const b=e.target.closest('[data-meal]');if(b)openMeal(Number(b.dataset.meal));});
  $('more').addEventListener('click',()=>{state.limit+=12;render();});
  $('reset').addEventListener('click',reset);$('empty-reset').addEventListener('click',reset);
  $('close-detail').addEventListener('click',()=>$('detail').close());
  $('detail').addEventListener('click',e=>{if(e.target===$('detail')){const r=$('detail').getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)$('detail').close();}});
  function status(message){$('location-panel').hidden=false;$('location-status').textContent=message;}
  $('locate').addEventListener('click',()=>{
    if(!navigator.geolocation){status('此瀏覽器不支援定位，請改用鄉鎮篩選。');return;}
    const request=++locationRequest;$('locate').disabled=true;$('locate').querySelector('span').textContent='正在取得位置…';status('請允許瀏覽器使用位置；位置僅在本頁計算距離。');
    navigator.geolocation.getCurrentPosition(pos=>{
      if(request!==locationRequest)return;
      state.location={lat:pos.coords.latitude,lng:pos.coords.longitude};state.sort='distance';$('sort').value='distance';$('sort').querySelector('[value=distance]').disabled=false;$('sort').value='distance';$('radius').disabled=false;$('clear-location').hidden=false;$('locate').disabled=false;$('locate').querySelector('span').textContent='更新我的位置';
      const unknown=data.stores.filter(s=>!Number.isFinite(s.lat)||!Number.isFinite(s.lng)).length;
      status(`已依距離排序；同餐點優先顯示最近的供應店家。${pos.coords.accuracy>1000?'目前定位較粗略，距離僅供參考。':''}${unknown?`另有 ${unknown} 家位置待確認，不納入距離篩選。`:''}`);update();
    },err=>{if(request!==locationRequest)return;$('locate').disabled=false;$('locate').querySelector('span').textContent=state.location?'更新我的位置':'使用我的位置';status(({1:'未開啟定位權限，仍可使用鄉鎮與餐點篩選。',2:'暫時無法取得位置，請稍後重試或改用鄉鎮篩選。',3:'定位逾時，請重試或改用鄉鎮篩選。'})[err.code]||'定位失敗，請使用鄉鎮篩選。');},{enableHighAccuracy:true,timeout:15000,maximumAge:60000});
  });
  $('clear-location').addEventListener('click',()=>{locationRequest++;state.location=null;state.radius='';state.sort='original';$('radius').value='';$('radius').disabled=true;$('sort').value='original';$('sort').querySelector('[value=distance]').disabled=true;$('locate').disabled=false;$('locate').querySelector('span').textContent='使用我的位置';$('clear-location').hidden=true;$('location-panel').hidden=true;update();});
  render();
})();

