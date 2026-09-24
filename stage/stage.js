(function(){
  var N=window.NAVRANG,code=N.code(),state=null,offset=0,pollTimer=null,tickTimer=null,lastQuestion="",audio=null,started=false;
  var view=document.getElementById("stageView"),playersEl=document.getElementById("stagePlayers"),roundEl=document.getElementById("stageRound"),codeEl=document.getElementById("stageCode");
  codeEl.textContent=code;

  document.getElementById("startStageBtn").addEventListener("click",function(){
    started=true;document.getElementById("startStage").classList.add("hidden");
    try{audio=new (window.AudioContext||window.webkitAudioContext)();audio.resume();}catch(e){}
    if(document.documentElement.requestFullscreen)document.documentElement.requestFullscreen().catch(function(){});
    poll();
  });

  function poll(){
    N.api({action:"stage_state",code:code}).then(function(res){
      if(!res.ok)throw new Error(res.error||"state_failed");
      state=res;offset=Date.parse(res.serverNow)-Date.now();
      playersEl.textContent=N.fmt(res.boards.count||0);
      roundEl.textContent=res.session.currentRound?res.session.currentRound+" / 9":"LOBBY";
      if(res.round)N.setAccent(res.round.accent);
      render();
      clearTimeout(pollTimer);pollTimer=setTimeout(poll,900);
    }).catch(function(){
      clearTimeout(pollTimer);pollTimer=setTimeout(poll,2500);
    });
  }

  function render(){
    if(!state)return;
    var s=state.session,r=state.round,q=state.question;
    if(s.phase==="lobby"||s.status==="lobby"){renderLobby();return;}
    if(s.phase==="intro"){renderIntro(r);return;}
    if(s.phase==="question"&&q){renderQuestion(q,false);return;}
    if(s.phase==="reveal"&&q){renderQuestion(q,true);return;}
    if(s.phase==="round_results"){renderBoards("ROUND "+s.currentRound+" COMPLETE",r?r.name:"NAVRANG");return;}
    if(s.phase==="leaderboard"){renderBoards("LIVE STANDINGS","NAVRANG");return;}
    if(s.phase==="finale"||s.status==="finished"){renderFinale();return;}
  }

  function mandala(){
    var colors=["#ff5b54","#ff9f43","#fee440","#37d67a","#00c2a8","#00bbf9","#6c63ff","#9b5de5","#f15bb5"];
    var h='<div class="mandala">';
    colors.forEach(function(c,i){h+='<i style="--n:'+i+';--c:'+c+'"></i>';});
    h+='<div class="mandala-core"><small>નવરાત્રી</small><b>'+Math.max(1,state.session.currentRound||1)+'</b><span>OF 9</span></div></div>';
    return h;
  }

  function renderLobby(){
    var joinUrl=new URL("../play/?code="+encodeURIComponent(code),location.href).href;
    var qr="https://api.qrserver.com/v1/create-qr-code/?size=420x420&margin=0&data="+encodeURIComponent(joinUrl);
    view.innerHTML='<div class="stage-lobby fade-up"><div><p class="overline">THE OFFICE NAVRATRI GAME</p><h1>NAVRANG</h1><h2>Nine colours. Nine rounds. One celebration.</h2><p class="muted">Scan the code, choose your team and join from your phone.</p><div class="join-code"><span class="muted">GAME CODE</span><b>'+N.esc(code)+'</b></div><div style="display:flex;gap:11px;flex-wrap:wrap"><span class="meta-pill">🔴 RED</span><span class="meta-pill">🟡 YELLOW</span><span class="meta-pill">🟢 GREEN</span><span class="meta-pill">🔵 BLUE</span><span class="meta-pill">🟣 PURPLE</span></div></div><div class="qr-card card"><div class="qr-wrap"><img src="'+qr+'" alt="Join NAVRANG QR code"></div><strong>SCAN TO PLAY</strong><span>'+N.esc(joinUrl.replace(/^https?:\/\//,""))+'</span></div></div>';
  }

  function renderIntro(r){
    if(!r)return;
    view.innerHTML='<div class="stage-round fade-up"><p class="overline">ROUND '+state.session.currentRound+' OF 9</p>'+mandala()+'<h1 class="round-title">'+N.esc(r.name)+'</h1><p class="round-kicker">'+N.esc(r.kicker)+'</p><p class="muted" style="font-size:16px">'+N.esc(r.description)+'</p></div>';
  }

  function renderQuestion(q,reveal){
    var key=q.id+":"+(reveal?"r":"q");
    var letters=["A","B","C","D"];
    var correct=reveal?q.correct_index:null;
    var html='<div class="stage-question fade-up"><section class="question-panel card">';
    html+='<div class="question-head"><span class="category">ROUND '+q.round_no+' • '+N.esc(q.category)+'</span><span>'+(q.kind==="dash"?"DANDIYA DASH":q.kind==="finale"?"MAHA AARTI":q.kind==="team"?"TEAM RAAS":"NAVRANG")+'</span></div>';
    if(q.kind==="emoji"&&q.media&&q.media.emoji)html+='<div style="font-size:70px;text-align:center;margin:8px 0">'+N.esc(q.media.emoji)+'</div>';
    html+='<h2 class="question-text">'+N.esc(q.prompt)+'</h2><div class="stage-options">';
    q.options.forEach(function(o,i){
      var cls="stage-option";
      if(reveal){if(i===correct)cls+=" correct";else cls+=" dim";}
      html+='<div class="'+cls+'"><b>'+letters[i]+'</b><span>'+N.esc(o)+'</span></div>';
    });
    html+='</div>';
    if(reveal)html+='<p style="margin:20px 0 0;color:#bfb2ca">'+N.esc(q.explanation||"")+'</p>';
    html+='</section><aside class="question-side"><div class="big-timer card"><strong id="bigTimer">00</strong><span>'+(reveal?"ANSWER REVEAL":"SECONDS")+'</span></div><div class="answer-count card"><b id="answerCount">'+N.fmt(state.stats?state.stats.total:0)+'</b><span>ANSWERS LOCKED</span></div>';
    if(reveal)html+=distribution();
    else html+='<div class="card" style="padding:22px;text-align:center"><p class="overline">PLAY TOGETHER</p><div style="font-size:48px">💃 🥁 🕺</div><p class="muted">Accuracy first. Speed adds bonus points.</p></div>';
    html+='</aside></div>';
    view.innerHTML=html;

    if(reveal){
      document.getElementById("bigTimer").textContent="✓";
      if(state.stats&&state.stats.fastest){
        var d=document.querySelector(".distribution");
        if(d)d.insertAdjacentHTML("beforeend",'<p style="margin:16px 0 0;font-size:11px;color:#a99cb4">⚡ Fastest correct: <b style="color:white">'+N.esc(state.stats.fastest.display_name)+'</b> • '+(state.stats.fastest.response_ms/1000).toFixed(2)+'s</p>');
      }
      if(lastQuestion!==key)chime();
    }else{
      startClock();
      if(lastQuestion!==key){
        if(q.kind==="memory")playMemory(q.media&&q.media.sequence?q.media.sequence:[]);
        if(q.kind==="rhythm")playRhythm(q.media&&q.media.pattern?q.media.pattern:[]);
      }
    }
    lastQuestion=key;
  }

  function distribution(){
    var counts=state.stats&&state.stats.counts?state.stats.counts:[0,0,0,0],total=Math.max(1,state.stats?state.stats.total:0),letters=["A","B","C","D"];
    var h='<div class="distribution card"><p class="overline">THE ROOM VOTED</p>';
    counts.forEach(function(n,i){var pct=Math.round(n/total*100);h+='<div class="dist-row"><b>'+letters[i]+'</b><div class="dist-track"><i class="dist-fill" style="width:'+pct+'%"></i></div><span>'+pct+'%</span></div>';});
    h+='</div>';return h;
  }

  function startClock(){
    clearInterval(tickTimer);
    function draw(){
      var el=document.getElementById("bigTimer");if(!el)return;
      var rem=N.remain(state.session,offset);el.textContent=String(Math.ceil(rem/1000)).padStart(2,"0");
      var c=document.getElementById("answerCount");if(c)c.textContent=N.fmt(state.stats?state.stats.total:0);
      if(rem<=0)clearInterval(tickTimer);
    }
    draw();tickTimer=setInterval(draw,100);
  }

  function playMemory(seq){
    if(!seq||!seq.length)return;
    var overlay=document.getElementById("memoryOverlay"),flash=document.getElementById("memoryFlash"),i=0;
    overlay.classList.add("show");
    function step(){
      if(i>=seq.length){setTimeout(function(){overlay.classList.remove("show");},450);return;}
      flash.style.background=seq[i];flash.style.color=seq[i];flash.style.animation="none";void flash.offsetWidth;flash.style.animation="flashIn .5s ease both";
      softTone(420+i*70,.12);i++;setTimeout(step,650);
    }
    setTimeout(step,350);
  }

  function playRhythm(pattern){
    var overlay=document.getElementById("rhythmOverlay");overlay.classList.add("show");
    var icon=document.getElementById("rhythmIcon");
    (pattern||[]).forEach(function(ms){
      setTimeout(function(){drum();icon.style.transform="scale(1.28)";setTimeout(function(){icon.style.transform="scale(1)"},100);},650+ms);
    });
    var last=pattern&&pattern.length?pattern[pattern.length-1]:1800;
    setTimeout(function(){overlay.classList.remove("show");},last+1500);
  }

  function drum(){
    if(!audio)return;
    var o=audio.createOscillator(),g=audio.createGain(),t=audio.currentTime;
    o.type="sine";o.frequency.setValueAtTime(150,t);o.frequency.exponentialRampToValueAtTime(58,t+.16);
    g.gain.setValueAtTime(.0001,t);g.gain.exponentialRampToValueAtTime(.35,t+.01);g.gain.exponentialRampToValueAtTime(.0001,t+.22);
    o.connect(g);g.connect(audio.destination);o.start(t);o.stop(t+.24);
  }
  function softTone(f,d){if(!audio)return;var o=audio.createOscillator(),g=audio.createGain(),t=audio.currentTime;o.frequency.value=f;g.gain.value=.03;o.connect(g);g.connect(audio.destination);o.start(t);g.gain.exponentialRampToValueAtTime(.0001,t+d);o.stop(t+d);}
  function chime(){softTone(523,.18);setTimeout(function(){softTone(659,.18)},100);setTimeout(function(){softTone(784,.3)},210);}

  function renderBoards(kicker,title){
    var p=state.boards.players||[],teams=state.boards.teams||[];
    var maxTeam=Math.max.apply(null,[1].concat(teams.map(function(t){return t.score;})));
    var html='<div class="board-view fade-up"><section class="leader-card card"><div class="board-title"><div><p class="overline">'+N.esc(kicker)+'</p><h2>'+N.esc(title)+'</h2></div><span class="muted">'+N.fmt(state.boards.count||0)+' playing</span></div>';
    if(!p.length)html+='<p class="muted">Scores will appear here.</p>';
    p.slice(0,10).forEach(function(x,i){html+='<div class="leader-row"><span class="rank">'+(i+1)+'</span><div><strong>'+N.esc(x.display_name)+'</strong><small><i class="team-dot" style="--team:'+N.teamColor(x.team)+'"></i>'+N.esc(x.team)+' Team • '+x.max_streak+' max streak</small></div><b>'+N.fmt(x.score)+'</b></div>';});
    html+='</section><aside class="team-card card"><div class="board-title"><div><p class="overline">TEAM RAAS</p><h2>Teams</h2></div></div>';
    teams.forEach(function(t){var pct=Math.round(t.score/maxTeam*100);html+='<div class="team-row" style="--team:'+N.teamColor(t.team)+'"><div class="team-row-head"><b>'+N.esc(t.team)+'</b><span>'+N.fmt(t.score)+'</span></div><div class="team-bar"><i style="width:'+pct+'%"></i></div></div>';});
    html+='</aside></div>';view.innerHTML=html;
  }

  function renderFinale(){
    var p=state.boards.players||[],teams=state.boards.teams||[],top=p.slice(0,3);
    var first=top[0]||{display_name:"NAVRANG",score:0,team:""};
    var html='<div class="finale fade-up"><p class="overline">NINE ROUNDS COMPLETE</p><h1>NAVRANG</h1><p class="round-kicker">Tonight’s champions</p><div class="podium">';
    [top[1],top[0],top[2]].forEach(function(x,i){if(!x)return;var place=i===1?"1ST":i===0?"2ND":"3RD";html+='<div style="--team:'+N.teamColor(x.team)+'"><small>'+place+'</small><b>'+N.esc(x.display_name)+'</b><strong>'+N.fmt(x.score)+'</strong><small>'+N.esc(x.team)+' Team</small></div>';});
    html+='</div>';
    if(teams[0])html+='<div style="margin-top:28px"><p class="overline">WINNING TEAM</p><h2 style="font-family:Yatra One;font-size:48px;margin:0;color:'+N.teamColor(teams[0].team)+'">'+N.esc(teams[0].team)+' TEAM</h2><p class="muted">'+N.fmt(teams[0].score)+' team points</p></div>';
    html+='</div>';view.innerHTML=html;
    if(lastQuestion!=="finale"){confetti(320);lastQuestion="finale";}
  }

  function confetti(count){
    var c=document.getElementById("confetti"),ctx=c.getContext("2d"),dpr=window.devicePixelRatio||1;
    c.width=innerWidth*dpr;c.height=innerHeight*dpr;ctx.setTransform(dpr,0,0,dpr,0,0);
    var colors=["#ff5b54","#ff9f43","#fee440","#37d67a","#00bbf9","#9b5de5","#f15bb5"],bits=[];
    for(var i=0;i<count;i++)bits.push({x:Math.random()*innerWidth,y:-30-Math.random()*innerHeight*.6,vx:(Math.random()-.5)*5,vy:2+Math.random()*5,r:3+Math.random()*5,c:colors[i%colors.length],a:Math.random()*6});
    var frame=0;(function draw(){ctx.clearRect(0,0,innerWidth,innerHeight);bits.forEach(function(b){b.x+=b.vx;b.y+=b.vy;b.vy+=.025;b.a+=.1;ctx.save();ctx.translate(b.x,b.y);ctx.rotate(b.a);ctx.fillStyle=b.c;ctx.fillRect(-b.r,-b.r/2,b.r*2,b.r);ctx.restore();});if(frame++<300)requestAnimationFrame(draw);})();
  }

  if(!started)renderLobby();
})();