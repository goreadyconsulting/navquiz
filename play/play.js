(function(){
  var N=window.NAVRANG;
  var selectedTeam="Red",player=null,state=null,offset=0,pollTimer=null,tickTimer=null,renderKey="";
  var code=N.code();
  var codeInput=document.getElementById("codeInput");
  var nameInput=document.getElementById("nameInput");
  var joinBtn=document.getElementById("joinBtn");
  var joinError=document.getElementById("joinError");
  var joinView=document.getElementById("joinView");
  var gameView=document.getElementById("gameView");
  var stage=document.getElementById("playerStage");
  var connection=document.getElementById("connection");
  codeInput.value=code;

  document.querySelectorAll(".team-pick").forEach(function(btn){
    btn.addEventListener("click",function(){
      selectedTeam=btn.dataset.team;
      document.querySelectorAll(".team-pick").forEach(function(b){b.classList.toggle("selected",b===btn);});
    });
  });

  function savePlayer(){
    if(!player)return;
    localStorage.setItem("navrang_code",code);
    localStorage.setItem("navrang_player_"+code,JSON.stringify(player));
  }
  function loadPlayer(){
    try{return JSON.parse(localStorage.getItem("navrang_player_"+code)||"null");}catch(e){return null;}
  }
  function myAnswer(qid){
    try{var v=localStorage.getItem("navrang_answer_"+qid);return v===null?null:Number(v);}catch(e){return null;}
  }
  function saveAnswer(qid,index){localStorage.setItem("navrang_answer_"+qid,String(index));}

  function enterGame(){
    joinView.hidden=true;gameView.hidden=false;
    document.getElementById("playerName").textContent=player.display_name||player.displayName||"Player";
    var team=player.team||selectedTeam;
    var color=N.teamColor(team);
    document.getElementById("playerTeam").innerHTML='<i class="team-dot" style="--team:'+color+'"></i>'+N.esc(team)+" Team";
    schedulePoll(20);
  }

  joinBtn.addEventListener("click",join);
  nameInput.addEventListener("keydown",function(e){if(e.key==="Enter")join();});

  function join(){
    code=(codeInput.value||"NAV26").trim().toUpperCase();
    var name=nameInput.value.trim();
    if(name.length<2){joinError.textContent="Enter your name to join.";return;}
    joinBtn.disabled=true;joinError.textContent="";
    N.api({action:"join",code:code,name:name,team:selectedTeam}).then(function(res){
      if(!res.ok){throw new Error(res.error||"Could not join");}
      player=res.participant;savePlayer();enterGame();
    }).catch(function(err){
      joinError.textContent=String(err.message||err).replaceAll("_"," ");
    }).finally(function(){joinBtn.disabled=false;});
  }

  function schedulePoll(ms){
    clearTimeout(pollTimer);
    pollTimer=setTimeout(poll,ms==null?2200:ms);
  }

  function poll(){
    if(!player)return;
    N.api({action:"state",code:code,participantId:player.id,token:player.player_token}).then(function(res){
      if(!res.ok)throw new Error(res.error||"state_failed");
      connection.classList.remove("offline");connection.textContent="CONNECTED";
      state=res;
      offset=Date.parse(res.serverNow)-Date.now();
      if(res.player){player=Object.assign(player,res.player);savePlayer();}
      updateHud();
      render();
      var delay=res.session.phase==="question"?1500:2400;
      if(res.question&&res.question.kind==="dash")delay=1100;
      schedulePoll(delay);
    }).catch(function(){
      connection.classList.add("offline");connection.textContent="RECONNECTING";
      schedulePoll(3200);
    });
  }

  function updateHud(){
    if(!state)return;
    var r=state.round;
    document.getElementById("hudRound").textContent=r?state.session.currentRound+" / 9":"WAITING";
    document.getElementById("hudScore").textContent=N.fmt(player.score||0);
    document.getElementById("hudStreak").textContent=(player.streak||0)+" 🔥";
    if(r)N.setAccent(r.accent);
  }

  function render(){
    var s=state.session,q=state.question,r=state.round;
    var key=s.phase+":"+(q?q.id:"none")+":"+(s.reveal?"1":"0");
    if(key===renderKey)return;
    renderKey=key;
    clearInterval(tickTimer);

    if(s.phase==="lobby"||s.status==="lobby"){renderLobby();return;}
    if(s.phase==="intro"){renderIntro(r);return;}
    if(s.phase==="question"&&q){renderQuestion(q,false);return;}
    if(s.phase==="reveal"&&q){renderReveal(q);return;}
    if(s.phase==="round_results"){renderRoundResults(r);return;}
    if(s.phase==="leaderboard"){renderLookAtStage("LEADERBOARD","Your score is "+N.fmt(player.score||0));return;}
    if(s.phase==="finale"||s.status==="finished"){renderFinale();return;}
    renderLobby();
  }

  function renderLobby(){
    stage.innerHTML='<div class="fade-up"><p class="overline">YOU ARE IN</p><div class="waiting-orb"></div><h2 style="font-size:30px;margin:0 0 8px">Waiting for the celebration to begin</h2><p class="muted">Keep this page open. The next round will appear here.</p></div>';
  }

  function renderIntro(r){
    if(!r)return renderLobby();
    stage.innerHTML='<div class="fade-up"><p class="round-number">ROUND '+state.session.currentRound+' OF 9</p><h2 class="round-title">'+N.esc(r.name)+'</h2><p class="round-kicker">'+N.esc(r.kicker)+'</p><div class="waiting-orb"></div><p class="muted">'+N.esc(r.description)+'</p></div>';
  }

  function renderQuestion(q){
    var delay=(q.kind==="memory"?4300:q.kind==="rhythm"?3000:0);
    var started=Date.parse(state.session.questionStartedAt);
    var elapsed=(Date.now()+offset)-started;
    var locked=myAnswer(q.id);
    var watch=delay>0&&elapsed<delay;
    var letters=["A","B","C","D"];
    var html='<div class="question-head"><span class="category">'+N.esc(q.category)+'</span><span id="phoneTimer" class="timer-pill">00</span></div>';
    if(q.kind==="emoji"&&q.media&&q.media.emoji)html+='<div style="font-size:45px;margin:4px 0 12px">'+N.esc(q.media.emoji)+'</div>';
    html+='<h2 class="question-text">'+N.esc(q.prompt)+'</h2>';
    if(watch)html+='<div id="watchMsg" class="watch-stage">'+(q.kind==="rhythm"?"Listen to the main stage":"Watch the colour sequence on the main stage")+'</div>';
    html+='<div id="phoneAnswers" class="answers-grid'+(watch?" locked":"")+'">';
    q.options.forEach(function(o,i){
      var cls="answer-btn"+(locked===i?" chosen":"")+(locked!==null?" locked":"");
      html+='<button class="'+cls+'" data-answer="'+i+'" '+(locked!==null||watch?"disabled":"")+'><b>'+letters[i]+'</b><span>'+N.esc(o)+'</span></button>';
    });
    html+='</div>';
    if(locked!==null)html+='<div class="locked-state"><div class="lock-mark">✓</div><b>Answer locked</b><p class="muted">Look at the main screen for the reveal.</p></div>';
    stage.innerHTML=html;

    document.querySelectorAll("[data-answer]").forEach(function(btn){
      btn.addEventListener("click",function(){submitAnswer(q,Number(btn.dataset.answer));});
    });

    tickTimer=setInterval(function(){
      var rem=N.remain(state.session,offset);
      var t=document.getElementById("phoneTimer");if(t)t.textContent=Math.ceil(rem/1000)+"s";
      var nowElapsed=(Date.now()+offset)-started;
      if(nowElapsed>=delay&&delay>0){
        var w=document.getElementById("watchMsg");if(w)w.remove();
        document.querySelectorAll("[data-answer]").forEach(function(b){if(myAnswer(q.id)===null)b.disabled=false;});
        delay=0;
      }
      if(rem<=0)clearInterval(tickTimer);
    },120);
  }

  function submitAnswer(q,index){
    if(myAnswer(q.id)!==null)return;
    saveAnswer(q.id,index);
    document.querySelectorAll("[data-answer]").forEach(function(b){
      b.disabled=true;b.classList.add("locked");if(Number(b.dataset.answer)===index)b.classList.add("chosen");
    });
    var responseMs=Math.max(0,Math.round((Date.now()+offset)-Date.parse(state.session.questionStartedAt)));
    N.api({action:"answer",code:code,participantId:player.id,token:player.player_token,questionId:q.id,answer:index,responseMs:responseMs}).then(function(res){
      if(!res.ok&&res.error!=="question_closed"&&res.error!=="too_late")throw new Error(res.error||"answer_failed");
      renderKey="";
      renderQuestion(q);
    }).catch(function(){N.toast("Answer saved locally. Reconnecting…");});
  }

  function renderReveal(q){
    var mine=myAnswer(q.id),right=q.correct_index,won=mine!==null&&mine===right;
    var letters=["A","B","C","D"];
    var html='<div class="question-head"><span class="category">ANSWER REVEAL</span><span class="timer-pill">'+(won?"NICE!":"NEXT ONE")+'</span></div>';
    html+='<h2 class="question-text">'+N.esc(q.prompt)+'</h2><div class="answers-grid">';
    q.options.forEach(function(o,i){
      var cls="answer-btn locked";
      if(i===right)cls+=" correct";
      else if(i===mine)cls+=" wrong";
      html+='<div class="'+cls+'"><b>'+letters[i]+'</b><span>'+N.esc(o)+'</span></div>';
    });
    html+='</div><p class="muted" style="margin-top:18px">'+N.esc(q.explanation||"")+'</p>';
    if(won)html+='<div class="reveal-points">+'+N.fmt(player.last_score||0)+'</div><div class="mini-score">'+N.fmt(player.score||0)+' total • '+(player.streak||0)+' answer streak</div>';
    else html+='<div class="mini-score" style="margin-top:24px">'+N.fmt(player.score||0)+' total • New question, new chance.</div>';
    stage.innerHTML=html;
    if(won)smallConfetti();
  }

  function renderRoundResults(r){
    stage.innerHTML='<div class="fade-up"><p class="overline">ROUND COMPLETE</p><h2 class="round-title">'+N.esc(r?r.name:"NAVRANG")+'</h2><div class="reveal-points">'+N.fmt(player.score||0)+'</div><p class="muted">Your score so far</p><p style="margin-top:28px">Look at the main screen for the live team standings.</p></div>';
  }

  function renderLookAtStage(title,text){
    stage.innerHTML='<div class="fade-up"><p class="overline">'+N.esc(title)+'</p><div class="waiting-orb"></div><h2 style="font-size:30px">'+N.esc(text)+'</h2><p class="muted">The live standings are on the main screen.</p></div>';
  }

  function renderFinale(){
    stage.innerHTML='<div class="fade-up"><p class="overline">NAVRANG COMPLETE</p><h2 class="round-title">What a night!</h2><div class="reveal-points">'+N.fmt(player.score||0)+'</div><p class="muted">Your final score</p><p style="margin-top:24px">Look at the stage for the champions and winning team.</p></div>';
    smallConfetti();
  }

  function smallConfetti(){
    for(var i=0;i<24;i++){
      var d=document.createElement("i");var colors=["#ff5b54","#fee440","#37d67a","#00bbf9","#9b5de5","#f15bb5"];
      d.style.cssText="position:fixed;z-index:80;left:"+(10+Math.random()*80)+"vw;top:-12px;width:6px;height:11px;background:"+colors[i%colors.length]+";transform:rotate("+Math.random()*180+"deg);transition:transform 1.5s linear,top 1.5s ease-in;pointer-events:none";
      document.body.appendChild(d);
      (function(x){requestAnimationFrame(function(){x.style.top="105vh";x.style.transform+=" rotate(500deg)";});setTimeout(function(){x.remove();},1700);})(d);
    }
  }

  player=loadPlayer();
  if(player){selectedTeam=player.team||"Red";enterGame();}
})();