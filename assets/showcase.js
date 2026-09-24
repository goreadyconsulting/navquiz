(function(){
  var counters=document.querySelectorAll("[data-count]");
  var counted=false;
  function animateCounters(){
    if(counted)return;counted=true;
    counters.forEach(function(el){
      var target=Number(el.dataset.count||0),start=performance.now(),duration=1100;
      function step(now){
        var p=Math.min(1,(now-start)/duration),e=1-Math.pow(1-p,3);
        el.textContent=Math.round(target*e)+(target===500?"+":"");
        if(p<1)requestAnimationFrame(step);
      }
      requestAnimationFrame(step);
    });
  }
  setTimeout(animateCounters,350);

  var io=new IntersectionObserver(function(entries){
    entries.forEach(function(entry){
      if(entry.isIntersecting){
        entry.target.classList.add("in");
        if(entry.target.classList.contains("crowd-card")){
          entry.target.querySelectorAll(".vote-row i").forEach(function(bar){bar.style.width=bar.dataset.width+"%";});
        }
        if(entry.target.classList.contains("team-board")){
          entry.target.querySelectorAll(".team-row i").forEach(function(bar){bar.style.width=getComputedStyle(bar).getPropertyValue("--w");});
        }
      }
    });
  },{threshold:.18});
  document.querySelectorAll(".section-copy,.section-heading,.round-card,.stage-preview,.question-card,.crowd-card,.team-board,.micro-awards,.final-copy").forEach(function(el){el.classList.add("reveal");io.observe(el);});

  var answers=document.querySelectorAll("#answerGrid button");
  var result=document.getElementById("demoResult");
  var timer=document.getElementById("demoTimer");
  var remaining=15,answered=false;
  var tick=setInterval(function(){if(answered)return;remaining--;timer.textContent=remaining;if(remaining<=0){remaining=15;timer.textContent=remaining;}},1000);
  answers.forEach(function(btn){
    btn.addEventListener("click",function(){
      if(answered)return;answered=true;
      var choice=Number(btn.dataset.answer);
      answers.forEach(function(b){b.disabled=true;b.classList.add("dim");});
      answers[0].classList.remove("dim");answers[0].classList.add("correct");
      if(choice!==0){btn.classList.remove("dim");btn.classList.add("wrong");}
      result.innerHTML=choice===0
        ?'<strong>Correct. +1,012 points</strong><p>Bathukamma is a major floral festival of Telangana.</p>'
        :'<strong>Telangana was the answer.</strong><p>Bathukamma is a major floral festival of Telangana.</p>';
      burst();
      setTimeout(resetDemo,4500);
    });
  });
  function resetDemo(){
    answered=false;remaining=15;timer.textContent=15;
    answers.forEach(function(b){b.disabled=false;b.className="";});
    result.innerHTML="<p>Choose an answer to see the reveal.</p>";
  }

  var audio=null;
  document.getElementById("soundBtn").addEventListener("click",function(){
    try{
      audio=audio||new (window.AudioContext||window.webkitAudioContext)();
      var now=audio.currentTime;
      [0,.25,.5,.82,1.06,1.3,1.63,1.87].forEach(function(t,i){
        var o=audio.createOscillator(),g=audio.createGain();
        o.type=i%2?"triangle":"sine";
        o.frequency.setValueAtTime(150+i*15,now+t);
        o.frequency.exponentialRampToValueAtTime(58,now+t+.18);
        g.gain.setValueAtTime(.0001,now+t);
        g.gain.exponentialRampToValueAtTime(.22,now+t+.01);
        g.gain.exponentialRampToValueAtTime(.0001,now+t+.2);
        o.connect(g);g.connect(audio.destination);o.start(now+t);o.stop(now+t+.21);
      });
      this.textContent="CELEBRATION SOUND PLAYING";
      var self=this;setTimeout(function(){self.textContent="PLAY CELEBRATION SOUND";},2200);
    }catch(e){}
  });

  function burst(){
    var colors=["#ff5b54","#ff9f43","#fee440","#37d67a","#00bbf9","#9b5de5","#f15bb5"];
    for(var i=0;i<26;i++){
      var d=document.createElement("i");
      d.style.cssText="position:fixed;z-index:80;left:"+(20+Math.random()*60)+"vw;top:-15px;width:6px;height:11px;background:"+colors[i%colors.length]+";pointer-events:none;transition:top 1.4s ease-in,transform 1.4s linear";
      document.body.appendChild(d);
      requestAnimationFrame(function(x){return function(){x.style.top="105vh";x.style.transform="rotate(560deg)";};}(d));
      setTimeout(function(x){return function(){x.remove();};}(d),1600);
    }
  }

  var final=document.querySelector(".final-section"),confettiStarted=false;
  var finalObserver=new IntersectionObserver(function(entries){
    if(entries[0].isIntersecting&&!confettiStarted){confettiStarted=true;drawConfetti();}
  },{threshold:.4});finalObserver.observe(final);
  function drawConfetti(){
    var c=document.getElementById("confetti"),ctx=c.getContext("2d"),rect=final.getBoundingClientRect(),dpr=window.devicePixelRatio||1;
    c.width=rect.width*dpr;c.height=rect.height*dpr;ctx.scale(dpr,dpr);
    var colors=["#ff5b54","#ff9f43","#fee440","#37d67a","#00bbf9","#9b5de5","#f15bb5"],bits=[];
    for(var i=0;i<160;i++)bits.push({x:Math.random()*rect.width,y:-20-Math.random()*rect.height*.6,vx:(Math.random()-.5)*3,vy:1.8+Math.random()*4,r:3+Math.random()*5,c:colors[i%colors.length],a:Math.random()*6});
    var frames=0;(function frame(){
      ctx.clearRect(0,0,rect.width,rect.height);
      bits.forEach(function(b){b.x+=b.vx;b.y+=b.vy;b.vy+=.018;b.a+=.08;ctx.save();ctx.translate(b.x,b.y);ctx.rotate(b.a);ctx.fillStyle=b.c;ctx.fillRect(-b.r,-b.r/2,b.r*2,b.r);ctx.restore();});
      if(frames++<280)requestAnimationFrame(frame);
    })();
  }
})();