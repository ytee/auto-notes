(() => {
const C=window.PREP_CONTENT;
const state=JSON.parse(localStorage.getItem('fsPrepState')||'{"done":{},"ratings":{},"bookmarks":{}}');
const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
const esc=s=>String(s).replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#039;','"':'&quot;'}[c]));
function save(){localStorage.setItem('fsPrepState',JSON.stringify(state));progress();}
function progress(){const n=C.questions.filter(q=>state.done[q.id]).length;$('#progressText').textContent=`${n} / ${C.questions.length} complete`;$('#progressBar').style.width=`${100*n/C.questions.length}%`;}
function getFilters(){return{text:$('#search').value.trim().toLowerCase(),tier:$('#tierFilter').value,track:$('#trackFilter').value,status:$('#statusFilter').value};}
function match(q,f){
 const hay=[q.question,q.kind,q.tier,...q.tracks,...q.answer,...q.probes,...q.refs].join(' ').toLowerCase();
 return !(f.text&&!hay.includes(f.text))&&!(f.tier&&q.tier!==f.tier)&&!(f.track&&!q.tracks.includes(f.track))&&
 !(f.status==='done'&&!state.done[q.id])&&!(f.status==='open'&&state.done[q.id])&&!(f.status==='bookmarked'&&!state.bookmarks[q.id]);
}
function card(q){
 const tags=[q.tier,q.kind,...q.tracks].map((t,i)=>`<span class="tag ${i===0?'tier':''}">${esc(t)}</span>`).join('');
 const rates=[1,2,3,4,5].map(n=>`<button class="rate ${state.ratings[q.id]===n?'selected':''}" data-rate="${n}">${n}</button>`).join('');
 return `<article class="question-card ${state.done[q.id]?'done':''}" data-id="${q.id}">
 <div class="question-top"><div><div class="meta">${tags}<span class="tag">${q.minutes} min</span></div><h3>${q.id}: ${esc(q.question)}</h3></div>
 <button class="bookmark ${state.bookmarks[q.id]?'bookmarked':''}" title="Bookmark">${state.bookmarks[q.id]?'★':'☆'}</button></div>
 <div class="actions"><button class="reveal">Reveal guidance</button><button class="complete">${state.done[q.id]?'Completed ✓':'Mark complete'}</button>
 <div class="rating"><span>Self-rate</span>${rates}</div></div>
 <div class="answer"><div class="answer-grid"><div><h4>Expected answer structure</h4><ul>${q.answer.map(x=>`<li>${esc(x)}</li>`).join('')}</ul></div>
 <div><h4>Interviewer follow-ups</h4><ul>${q.probes.map(x=>`<li>${esc(x)}</li>`).join('')}</ul></div></div>
 <div class="refs"><strong>Clause map:</strong> ${q.refs.map(esc).join(' · ')}</div></div></article>`;
}
function bind(container){
 container.querySelectorAll('.question-card').forEach(el=>{
  const id=el.dataset.id;
  el.querySelector('.reveal').onclick=e=>{const a=el.querySelector('.answer');a.classList.toggle('open');e.target.textContent=a.classList.contains('open')?'Hide guidance':'Reveal guidance';};
  el.querySelector('.complete').onclick=()=>{state.done[id]=!state.done[id];save();renderAll();};
  el.querySelector('.bookmark').onclick=()=>{state.bookmarks[id]=!state.bookmarks[id];save();renderAll();};
  el.querySelectorAll('.rate').forEach(b=>b.onclick=()=>{state.ratings[id]=Number(b.dataset.rate);save();renderAll();});
 });
}
function renderPlan(){
 const f=getFilters();
 $('#dayNav').innerHTML=C.days.map(d=>`<button class="day-chip" data-day="${d.day}">Day ${d.day}</button>`).join('');
 $('#dayNav').querySelectorAll('button').forEach(b=>b.onclick=()=>document.getElementById(`day-${b.dataset.day}`).scrollIntoView());
 $('#daySections').innerHTML=C.days.map(d=>{
  const qs=C.questions.filter(q=>q.day===d.day&&match(q,f));
  return `<section id="day-${d.day}" class="day-section"><header class="day-head"><div class="day-no">${d.day}</div><div><h2>${esc(d.title)}</h2><p>${esc(d.focus)}</p></div><div class="target">${d.target}</div></header>
  <div class="deliverable"><strong>Daily deliverable:</strong> ${esc(d.deliverable)}</div><div class="question-list">${qs.length?qs.map(card).join(''):'<div class="empty">No questions match the filters.</div>'}</div></section>`;
 }).join('');
 bind($('#daySections'));
}
function renderTracks(){
 const f=getFilters();
 $('#trackCards').innerHTML=C.tracks.map(t=>{const n=C.questions.filter(q=>q.tracks.includes(t.name)).length;return `<button class="track-card" data-track="${esc(t.name)}"><h3>${esc(t.name)}</h3><p>${esc(t.desc)}</p><p><strong>ISO interface:</strong> ${esc(t.iso)}</p><span class="count">${n} questions</span></button>`;}).join('');
 $('#trackCards').querySelectorAll('.track-card').forEach(b=>b.onclick=()=>{
  $('#trackFilter').value=b.dataset.track;
  $$('#trackCards .track-card').forEach(x=>x.classList.toggle('active',x===b));
  const qs=C.questions.filter(q=>q.tracks.includes(b.dataset.track)&&match(q,getFilters()));
  $('#trackQuestionResults').innerHTML=`<header class="section-head"><p class="eyebrow">SELECTED TRACK</p><h2>${esc(b.dataset.track)}</h2></header><div class="question-list">${qs.map(card).join('')}</div>`;
  bind($('#trackQuestionResults'));
 });
 if(f.track){const b=[...$('#trackCards').children].find(x=>x.dataset.track===f.track);if(b)b.click();}
 else $('#trackQuestionResults').innerHTML='<div class="empty">Select a topic track for focused revision.</div>';
}
function renderTables(){
 $('#matrixBody').innerHTML=C.matrix.map(r=>`<tr>${r.map(c=>`<td>${esc(c)}</td>`).join('')}</tr>`).join('');
 $('#jdBody').innerHTML=C.jdMap.map(r=>`<tr>${r.map(c=>`<td>${esc(c)}</td>`).join('')}</tr>`).join('');
}
function renderQuiz(){
 $('#quiz').innerHTML=C.quiz.map((x,i)=>`<article class="quiz-card" data-answer="${x.answer}"><h3>${i+1}. ${esc(x.q)}</h3><div class="quiz-options">${x.options.map((o,j)=>`<button class="quiz-option" data-index="${j}">${esc(o)}</button>`).join('')}</div><p class="quiz-why">${esc(x.why)}</p></article>`).join('');
 $$('.quiz-card').forEach(c=>c.querySelectorAll('.quiz-option').forEach(b=>b.onclick=()=>{
  const a=Number(c.dataset.answer),v=Number(b.dataset.index);c.querySelectorAll('.quiz-option').forEach((x,j)=>{x.disabled=true;if(j===a)x.classList.add('correct');});
  if(v!==a)b.classList.add('wrong');c.querySelector('.quiz-why').style.display='block';
 }));
}
function renderAll(){renderPlan();renderTracks();renderTables();renderQuiz();progress();}
C.tracks.map(t=>t.name).sort().forEach(t=>$('#trackFilter').insertAdjacentHTML('beforeend',`<option>${esc(t)}</option>`));
['search','tierFilter','trackFilter','statusFilter'].forEach(id=>$('#'+id).addEventListener(id==='search'?'input':'change',renderAll));
$$('.tab').forEach(b=>b.onclick=()=>{$$('.tab').forEach(x=>x.classList.remove('active'));b.classList.add('active');$$('.view').forEach(v=>v.classList.remove('active'));$('#view-'+b.dataset.view).classList.add('active');if(b.dataset.view==='tracks')renderTracks();});
let seconds=45*60,timerId=null;function paint(){const m=Math.floor(seconds/60),s=seconds%60;$('#timer').textContent=`${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`;}
$('#timerToggle').onclick=()=>{if(timerId){clearInterval(timerId);timerId=null;$('#timerToggle').textContent='Start';}else{timerId=setInterval(()=>{if(seconds){seconds--;paint();}else{clearInterval(timerId);timerId=null;$('#timerToggle').textContent='Start';}},1000);$('#timerToggle').textContent='Pause';}};
$('#timerReset').onclick=()=>{if(timerId)clearInterval(timerId);timerId=null;seconds=45*60;paint();$('#timerToggle').textContent='Start';};
paint();renderAll();
})();