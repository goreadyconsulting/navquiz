(function(){
  var N=window.NAVRANG,auth=null,state=null,pollTimer=null;
  var login=document.getElementById("hostLogin"),codeInput=document.getElementById("hostCode"),pinInput=document.getElementById("hostPin");
  codeInput.value=N.code();

  function setLinks(){
    var code=(auth&&auth.code)||codeInput.value||"NAV26";
    document.getElementById("stageLink").href="../stage/?code="+encodeURIComponent(code);
    document.getElementById("playLink").href="../play/?code="+encodeURIComponent(code);
  }
  setLinks();

  document.getElementById("loginBtn").addEventListener("click",doLogin);
  pinInput.addEventListener("keydown",function(e){if(e.key==="Enter")doLogin();});

  function doLogin(){
    var code=(codeInput.value||"NAV26").trim().toUpperCase(),pin=pinInput.value.trim();
    document.getElementById("loginError").textContent="";
    N.api({action:"host_state",code:code,pin:pin}).then(function(res){
      if(!res.ok)throw new Error(res.error||"Access denied");
      auth={code:code,pin:pin};localStorage.setItem("navrang_host",JSON.stringify(auth));localStorage.setItem("navrang_code",code);
      login.classList.add("hidden");setLinks();state=res;render();schedule(900);
    }).catch(function(err){document.getElementById("loginError").textContent=String(err.message||err).replaceAll("_"," ");});
  }

  function schedule(ms){clearTimeout(pollTimer);pollTimer=setTimeout(poll,ms||1000);}
  function poll(){
    if(!auth)return;
    N.api({action:"host_state",code:auth.code,pin:auth.pin}).then(function(res){
      if(!res.ok)throw new Error(res.error||"host_state_failed");
      state=res;render();schedule(900);
    }).catch(function(){N.toast("Control room reconnecting…");schedule(2200);});
  }

  function render(){
    if(!state)return;
    var s=state.session,r=state.round,q=state.question,stats=state.stats||{total:0,counts:[0,0,0,0]};
    if(r)N.setAccent(r.accent);
    document.getElementById("hPlayers").textContent=N.fmt(state.boards.count||0);
    document.getElementById("hRound").textContent=s.currentRound?s.currentRound+" / 9":"LOBBY";
    document.getElementById("hPhase").textContent=String(s.phase||"lobby").replaceAll("_"," ").toUpperCase();
    document.getElementById("hAnswers").textContent=N.fmt(stats.total||0);
    document.getElementById("hKicker").textContent=r?r.kicker:"READY";
    document.getElementById("hRoundName").textContent=r?r.name:"Lobby";
    document.getElementById("hQuestion").textContent=q?q.prompt:"Players can join now.";
    document.getElementById("hExplanation").textContent=(s.phase==="reveal"&&q)?q.explanation:"";
    renderDist(stats);
    renderQuestions();
    renderLeaders();
    renderTeams();
    updateButtons();
  }

  function renderDist(stats){
    var wrap=document.getElementById("hostDistribution");
    if(!state.question){wrap.innerHTML="";return;}
    var total=Math.max(1,stats.total||0),letters=["A","B","C","D"],h="";
    (stats.counts||[0,0,0,0]).forEach(function(n,i){
      var pct=Math.round(n/total*100);
      h+='<div class="dist-row"><b>'+letters[i]+'</b><div class="dist-track"><i class="dist-fill" style="width:'+pct+'%"></i></div><span>'+pct+'%</span></div>';
    });
    if(stats.fastest)h+='<p class="muted" style="font-size:11px">Fastest correct: <b style="color:white">'+N.esc(stats.fastest.display_name)+'</b> • '+(stats.fastest.response_ms/1000).toFixed(2)+'s</p>';
    wrap.innerHTML=h;
  }

  function renderQuestions(){
    var wrap=document.getElementById("questionList"),qs=state.questions||[],current=state.session.currentQuestionId;
    if(!qs.length){wrap.innerHTML='<p class="muted">No round loaded yet.</p>';return;}
    var currentSeq=state.question?state.question.sequence:0,h="";
    qs.forEach(function(q){
      var cls="qitem";
      if(q.id===current)cls+=" active";
      else if(currentSeq&&q.sequence<currentSeq)cls+=" done";
      h+='<div class="'+cls+'"><b>'+q.sequence+'</b><span>'+N.esc(q.prompt)+'</span><small>'+q.duration_seconds+'s</small></div>';
    });
    wrap.innerHTML=h;
  }

  function renderLeaders(){
    var p=(state.boards&&state.boards.players)||[],h="";
    if(!p.length)h='<p class="muted">Waiting for the first scores.</p>';
    p.slice(0,10).forEach(function(x,i){
      h+='<div class="leader-row"><span class="rank">'+(i+1)+'</span><div><strong>'+N.esc(x.display_name)+'</strong><small><i class="team-dot" style="--team:'+N.teamColor(x.team)+'"></i>'+N.esc(x.team)+' • '+x.streak+' streak</small></div><b>'+N.fmt(x.score)+'</b></div>';
    });
    document.getElementById("hostLeaders").innerHTML=h;
  }

  function renderTeams(){
    var teams=(state.boards&&state.boards.teams)||[],max=Math.max.apply(null,[1].concat(teams.map(function(t){return t.score;}))),h="";
    if(!teams.length)h='<p class="muted">Teams will appear as players join.</p>';
    teams.forEach(function(t){
      h+='<div class="team-row" style="--team:'+N.teamColor(t.team)+'"><div class="team-row-head"><b>'+N.esc(t.team)+'</b><span>'+N.fmt(t.score)+'</span></div><div class="team-bar"><i style="width:'+Math.round(t.score/max*100)+'%"></i></div></div>';
    });
    document.getElementById("hostTeams").innerHTML=h;
  }

  function updateButtons(){
    var s=state.session,phase=s.phase,q=state.question,last=q&&q.sequence>=4;
    document.getElementById("startGame").disabled=s.status!=="lobby";
    document.getElementById("openNext").disabled=!(phase==="intro"||phase==="reveal"||phase==="leaderboard");
    document.getElementById("openNext").textContent=last&&phase==="reveal"?"ROUND COMPLETE":"OPEN NEXT QUESTION";
    document.getElementById("reveal").disabled=phase!=="question";
    document.getElementById("roundResults").disabled=!(phase==="reveal"||phase==="question"||phase==="leaderboard");
    document.getElementById("showBoard").disabled=s.status==="lobby";
    document.getElementById("nextRound").disabled=!(phase==="round_results"||phase==="leaderboard"||(phase==="reveal"&&last));
    document.getElementById("finishGame").disabled=s.status==="lobby"||s.status==="finished";
    document.getElementById("backLobby").disabled=s.status==="lobby";
  }

  function command(cmd){
    if(!auth)return;
    var btn=document.activeElement;if(btn&&btn.tagName==="BUTTON")btn.disabled=true;
    N.api({action:"control",code:auth.code,pin:auth.pin,command:cmd}).then(function(res){
      if(!res.ok){
        if(res.error==="round_complete"){N.toast("Round complete. Show results or move to the next round.");return;}
        throw new Error(res.error||"control_failed");
      }
      poll();
    }).catch(function(err){N.toast(String(err.message||err).replaceAll("_"," "));}).finally(function(){if(btn&&btn.tagName==="BUTTON")btn.disabled=false;});
  }

  document.getElementById("startGame").onclick=function(){command("start_game");};
  document.getElementById("openNext").onclick=function(){
    if(state&&state.question&&state.question.sequence>=4&&state.session.phase==="reveal"){command("round_results");}
    else command("open_next");
  };
  document.getElementById("reveal").onclick=function(){command("reveal");};
  document.getElementById("roundResults").onclick=function(){command("round_results");};
  document.getElementById("showBoard").onclick=function(){command("leaderboard");};
  document.getElementById("nextRound").onclick=function(){command("next_round");};
  document.getElementById("finishGame").onclick=function(){if(confirm("Finish NAVRANG and show the final winners?"))command("finish");};
  document.getElementById("backLobby").onclick=function(){if(confirm("Return the stage to the lobby? Scores will stay."))command("back_lobby");};
  document.getElementById("resetGame").onclick=function(){if(confirm("Reset the event? This clears all players, answers and scores."))command("reset");};

  document.addEventListener("keydown",function(e){
    if(!auth||e.target.tagName==="INPUT")return;
    if(e.key===" "){e.preventDefault();if(!document.getElementById("openNext").disabled)document.getElementById("openNext").click();}
    if(e.key.toLowerCase()==="r"&&!document.getElementById("reveal").disabled)document.getElementById("reveal").click();
    if(e.key.toLowerCase()==="b"&&!document.getElementById("showBoard").disabled)document.getElementById("showBoard").click();
  });

  try{
    var saved=JSON.parse(localStorage.getItem("navrang_host")||"null");
    if(saved&&saved.code&&saved.pin){auth=saved;codeInput.value=saved.code;pinInput.value=saved.pin;doLogin();}
  }catch(e){}
})();