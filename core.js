/* Pure data functions shared by the website and regression tests. */
(function(root){
  const categories=['全部餐點','飯食・餐盒','麵食','麵包・甜點','飲品','其他餐點'];
  function normalize(value){return String(value).normalize('NFKC').toLowerCase().replace(/台/g,'臺').replace(/[\s·・\-()（）]/g,'');}
  function distanceKm(a,b){if(!a||!Number.isFinite(b.lat)||!Number.isFinite(b.lng))return Infinity;const r=Math.PI/180,dlat=(b.lat-a.lat)*r,dlng=(b.lng-a.lng)*r;const v=Math.sin(dlat/2)**2+Math.cos(a.lat*r)*Math.cos(b.lat*r)*Math.sin(dlng/2)**2;return 6371*2*Math.atan2(Math.sqrt(v),Math.sqrt(Math.max(0,1-v)));}
  function selectMeals(data,state){
    const byStore=new Map(data.stores.map(s=>[s.id,s]));const groups=new Map();const terms=normalize(state.query||'').split(/[,，]/).filter(Boolean);
    for(const offer of data.offers){const store=byStore.get(offer.storeId);if(!store)continue;
      if(state.category&&state.category!=='全部餐點'&&offer.category!==state.category)continue;
      if(state.health&&!offer.health.includes(state.health))continue;
      if(state.town&&store.town!==state.town)continue;
      const haystack=normalize([offer.name,store.name,store.town,offer.category,store.address].join(' '));
      if(!terms.every(term=>haystack.includes(term)))continue;
      const km=distanceKm(state.location,store);
      if(state.location&&state.radius&&km>Number(state.radius))continue;
      if(!groups.has(offer.name))groups.set(offer.name,{name:offer.name,category:offer.category,offers:[],order:groups.size});
      groups.get(offer.name).offers.push({...offer,store,km});
    }
    const meals=[...groups.values()];
    for(const meal of meals){meal.offers.sort((a,b)=>a.km-b.km||a.store.id-b.store.id);meal.nearest=meal.offers[0];meal.health=[...new Set(meal.offers.flatMap(o=>o.health))];}
    if(state.sort==='distance'&&state.location)meals.sort((a,b)=>a.nearest.km-b.nearest.km||a.order-b.order);
    if(state.sort==='name')meals.sort((a,b)=>a.name.localeCompare(b.name,'zh-Hant'));
    return meals;
  }
  const api={categories,normalize,distanceKm,selectMeals};if(typeof module!=='undefined')module.exports=api;else root.MealCore=api;
})(typeof window==='undefined'?this:window);
