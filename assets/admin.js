(function(){
  const people=[
    ["aanya.shah@gosh.com",23912,24,2.08,.72,0],["arjun.mehra@gosh.com",23460,24,2.24,.84,0],
    ["meera.nair@gosh.com",22870,23,1.96,.91,1],["kabir.khan@gosh.com",22195,23,2.42,1.02,0],
    ["ishita.rao@gosh.com",21930,22,2.13,.88,0],["vihaan.patel@gosh.com",21482,22,2.67,1.14,2],
    ["saanvi.iyer@gosh.com",20910,21,2.35,.79,0],["rohan.das@gosh.com",20584,21,2.89,1.31,1],
    ["diya.kapoor@gosh.com",20176,20,2.47,.95,0],["aarav.reddy@gosh.com",19730,20,3.04,1.22,0],
    ["nisha.verma@gosh.com",19386,20,3.11,1.44,2],["rahul.sen@gosh.com",18765,19,3.26,1.52,0],
    ["tara.jain@gosh.com",18124,18,3.08,1.10,1],["dev.menon@gosh.com",17680,18,3.42,1.66,0],
    ["riya.bose@gosh.com",17115,17,3.39,1.37,3]
  ].map(function(p,i){
    return {email:p[0],score:p[1],correct:p[2],avg:p[3],fast:p[4],exits:p[5],status:i===14?"In progress":"Completed"};
  });

  const questions=[
    ["NAVRATRI CULTURE","Garba is most strongly associated with which Indian state?"],
    ["NAVRATRI CULTURE","What do dancers traditionally hold while playing Dandiya Raas?"],
    ["NAVRATRI STYLE","Which outfit is most commonly associated with women's Garba attire?"],
    ["NAVRATRI STYLE","Which traditional garment is commonly worn by men for Garba in Gujarat?"],
    ["NAVRATRI CULTURE","Garba is commonly danced in which formation?"],
    ["BOLLYWOOD BEATS","“Dholi Taro Dhol Baaje” is from which film?"],
    ["BOLLYWOOD BEATS","“Nagada Sang Dhol” appears in which film?"],
    ["BOLLYWOOD BEATS","The song “Chogada” is from which film?"],
    ["BOLLYWOOD BEATS","“Shubhaarambh” is a song from which film?"],
    ["BOLLYWOOD BEATS","“Udi Udi Jaye” features in which Shah Rukh Khan film?"],
    ["BOLLYWOOD BEATS","“Ghoomar” is from which film?"],
    ["BOLLYWOOD BEATS","“London Thumakda” is from which film?"],
    ["BOLLYWOOD BEATS","“Gallan Goodiyaan” appears in which film?"],
    ["BOLLYWOOD BEATS","“Badtameez Dil” is from which film?"],
    ["BOLLYWOOD BEATS","“Kala Chashma” is from which film?"],
    ["BOLLYWOOD BEATS","“Kar Gayi Chull” appears in which film?"],
    ["BOLLYWOOD BEATS","The modern Bollywood version of “Aankh Marey” appears in which film?"],
    ["BOLLYWOOD BEATS","“Apna Time Aayega” is from which film?"],
    ["BOLLYWOOD BEATS","“Kesariya” is from which film?"],
    ["BOLLYWOOD BEATS","“Senorita” is from which road-trip film?"],
    ["BOLLYWOOD","Who played Raj and Simran in Dilwale Dulhania Le Jayenge?"],
    ["BOLLYWOOD","Who plays Rani, the lead character in the film Queen?"],
    ["BOLLYWOOD","Who directed Zindagi Na Milegi Dobara?"],
    ["BOLLYWOOD","Who directed 3 Idiots?"],
    ["BOLLYWOOD","Bunny and Naina are the central characters of which film?"]
  ];

  const titles={overview:"Overview",leaderboard:"Leaderboard",participants:"Participants",questions:"Questions",settings:"Quiz settings"};

  function initials(email){
    return email.split("@")[0].split(/[._-]/).slice(0,2).map(function(x){return x[0] ? x[0].toUpperCase() : "";}).join("");
  }
  function colour(i){
    return ["#087f7d","#2a8fe7","#f05e9e","#8563d9","#e59e19"][i%5];
  }
  function show(view){
    document.querySelectorAll(".view").forEach(function(v){v.classList.remove("active-view");});
    document.querySelectorAll(".nav-item").forEach(function(v){v.classList.toggle("active",v.dataset.view===view);});
    document.getElementById("view-"+view).classList.add("active-view");
    document.getElementById("viewTitle").textContent=titles[view];
  }
  document.querySelectorAll(".nav-item").forEach(function(b){b.addEventListener("click",function(){show(b.dataset.view);});});
  document.querySelectorAll("[data-jump]").forEach(function(b){b.addEventListener("click",function(){show(b.dataset.jump);});});

  function mini(){
    document.getElementById("miniLeaderboard").innerHTML=people.slice(0,5).map(function(p,i){
      return '<div class="mini-row">'+
        '<span class="rank">'+String(i+1).padStart(2,"0")+'</span>'+
        '<span class="avatar" style="background:'+colour(i)+'">'+initials(p.email)+'</span>'+
        '<div class="person"><strong>'+p.email.split("@")[0]+'</strong><small>'+p.correct+'/25 correct · '+p.avg.toFixed(2)+'s avg.</small></div>'+
        '<strong>'+p.score.toLocaleString("en-IN")+'</strong>'+
      '</div>';
    }).join("");
  }

  function leaderboard(){
    document.getElementById("fullLeaderboard").innerHTML=people.filter(function(p){return p.status==="Completed";}).map(function(p,i){
      const width=Math.max(18,100-(p.avg/7*100));
      return '<div class="leader-row '+(i<3?"top-"+(i+1):"")+'">'+
        '<span class="rank">#'+(i+1)+'</span>'+
        '<span class="avatar" style="background:'+colour(i)+'">'+initials(p.email)+'</span>'+
        '<div class="person"><strong>'+p.email+'</strong><small>'+p.correct+'/25 correct</small></div>'+
        '<div><div class="speed-meter"><i style="width:'+width+'%"></i></div><small style="color:#87979f;font-size:8px">'+p.avg.toFixed(2)+'s avg.</small></div>'+
        '<div class="leader-score"><strong>'+p.score.toLocaleString("en-IN")+'</strong><small>POINTS</small></div>'+
      '</div>';
    }).join("");
  }

  function participantRows(list,target){
    document.getElementById(target).innerHTML=list.map(function(p){
      return '<tr>'+
        '<td><strong>'+p.email+'</strong></td>'+
        '<td class="'+(p.status==="Completed"?"status-complete":"status-progress")+'">'+p.status+'</td>'+
        '<td><strong>'+(p.status==="Completed"?p.score.toLocaleString("en-IN"):"—")+'</strong></td>'+
        '<td>'+p.correct+'/25</td><td>'+p.avg.toFixed(2)+'s</td><td>'+p.fast.toFixed(2)+'s</td><td>'+p.exits+'</td>'+
      '</tr>';
    }).join("");
  }

  const completedTimes=["16:02","15:58","15:54","15:49","15:46","15:41"];
  document.getElementById("recentTable").innerHTML=people.slice(0,6).map(function(p,i){
    return '<tr><td><strong>'+p.email+'</strong></td><td><strong>'+p.score.toLocaleString("en-IN")+
      '</strong></td><td>'+p.correct+'/25</td><td>'+p.avg.toFixed(2)+'s</td><td>Today · '+completedTimes[i]+'</td></tr>';
  }).join("");

  participantRows(people,"participantsTable");
  document.getElementById("participantSearch").addEventListener("input",function(e){
    const q=e.target.value.trim().toLowerCase();
    participantRows(people.filter(function(p){return p.email.toLowerCase().includes(q);}),"participantsTable");
  });

  document.getElementById("questionList").innerHTML=questions.map(function(q,i){
    return '<div class="question-row"><span class="question-no">'+String(i+1).padStart(2,"0")+
      '</span><span class="question-category">'+q[0]+'</span><span class="question-text">'+q[1]+
      '</span><span class="question-time">7 seconds</span></div>';
  }).join("");

  const bars=[22,35,28,42,50,63,58,72,66,80,88,74,92,83,95,68,76,60,52,44];
  document.getElementById("activityBars").innerHTML=bars.map(function(v){
    return '<i class="bar" style="height:'+v+'%"></i>';
  }).join("");

  let isOpen=true;
  document.getElementById("toggleQuiz").addEventListener("click",function(){
    isOpen=!isOpen;
    const pill=document.getElementById("statusPill");
    pill.classList.toggle("closed",!isOpen);
    pill.querySelector("span").textContent=isOpen?"QUIZ OPEN":"QUIZ CLOSED";
    this.textContent=isOpen?"CLOSE QUIZ":"OPEN QUIZ";
    document.getElementById("settingsStatus").textContent=isOpen?"Open":"Closed";
    toast("Quiz state changed in this admin preview.");
  });

  document.querySelectorAll(".toggle").forEach(function(t){
    t.addEventListener("click",function(){t.classList.toggle("on");});
  });

  document.getElementById("exportCsv").addEventListener("click",function(){
    const head=["email","status","score","correct","avg_response_seconds","fastest_response_seconds","fullscreen_exits"];
    const rows=people.map(function(p){return [p.email,p.status,p.score,p.correct,p.avg,p.fast,p.exits];});
    const csv=[head].concat(rows).map(function(r){
      return r.map(function(v){return '"'+String(v).replace(/"/g,'""')+'"';}).join(",");
    }).join("\n");
    const blob=new Blob([csv],{type:"text/csv"});
    const url=URL.createObjectURL(blob);
    const a=document.createElement("a");
    a.href=url;a.download="gosh-navratri-quiz-results.csv";a.click();
    URL.revokeObjectURL(url);
    toast("CSV exported.");
  });

  function toast(msg){
    const el=document.getElementById("toast");
    el.textContent=msg;el.classList.add("show");
    clearTimeout(el._t);
    el._t=setTimeout(function(){el.classList.remove("show");},2200);
  }

  mini();
  leaderboard();
})();