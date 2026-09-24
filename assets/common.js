(function(){
  var KEY="navrang_static_event_v1";
  var HOST_PIN="NAVRANG26";
  var TEAM_COLORS={Red:"#ff5b54",Yellow:"#fee440",Green:"#37d67a",Blue:"#00bbf9",Purple:"#9b5de5"};
  var rounds=[
    null,
    {round_no:1,name:"Shubh Aarambh",kicker:"LET THE CELEBRATION BEGIN",mechanic:"choice",accent:"#FFB347",description:"Warm-up questions to get the whole room playing."},
    {round_no:2,name:"Rang Pehchano",kicker:"WATCH THE COLOURS",mechanic:"memory",accent:"#FF4D8D",description:"Remember the colour sequence before it disappears."},
    {round_no:3,name:"Garba Beats",kicker:"FEEL THE RHYTHM",mechanic:"rhythm",accent:"#9B5DE5",description:"Listen to the stage rhythm and answer from your phone."},
    {round_no:4,name:"India Celebrates",kicker:"FESTIVALS ACROSS INDIA",mechanic:"choice",accent:"#00C2A8",description:"Culture and celebration from across the country."},
    {round_no:5,name:"Dandiya Dash",kicker:"FAST HANDS. FAST POINTS.",mechanic:"dash",accent:"#FF6B35",description:"A rapid-fire round with only a few seconds per question."},
    {round_no:6,name:"Filmy Garba",kicker:"LIGHTS. CAMERA. GARBA.",mechanic:"choice",accent:"#FFD166",description:"Bollywood, music and festive movie moments."},
    {round_no:7,name:"Emoji Garba",kicker:"DECODE THE CLUE",mechanic:"emoji",accent:"#F15BB5",description:"Read the emojis before the clock beats you."},
    {round_no:8,name:"Team Raas",kicker:"PLAY FOR YOUR COLOURS",mechanic:"team",accent:"#00BBF9",description:"Every correct answer pushes your team up the board."},
    {round_no:9,name:"Maha Aarti",kicker:"THE GRAND FINALE",mechanic:"finale",accent:"#FEE440",description:"Double-value questions to finish the night."}
  ];
  function q(id,r,s,kind,cat,prompt,options,a,ex,pts,dur,media){
    return{id:id,round_no:r,sequence:s,kind:kind,category:cat,prompt:prompt,options:options,correct_index:a,explanation:ex,base_points:pts,duration_seconds:dur,media:media||{}};
  }
  var questions=[
    q("r1q1",1,1,"choice","Navratri","How many nights are traditionally celebrated during Navratri?",["7","8","9","10"],2,"Navratri literally refers to nine nights.",700,18),
    q("r1q2",1,2,"choice","Garba","Garba is most strongly associated with which Indian state?",["Rajasthan","Gujarat","Maharashtra","Punjab"],1,"Garba is closely associated with Gujarat.",700,18),
    q("r1q3",1,3,"choice","India","Which city is home to the Taj Mahal?",["Agra","Jaipur","Lucknow","Delhi"],0,"The Taj Mahal is in Agra.",700,18),
    q("r1q4",1,4,"choice","Food","Paneer is traditionally made from what?",["Rice","Milk","Lentils","Wheat"],1,"Paneer is a fresh cheese made from milk.",700,18),

    q("r2q1",2,1,"memory","Rang Pehchano","Which colour appeared third in the sequence?",["Pink","Green","Orange","Blue"],2,"The third colour was orange.",800,16,{sequence:["#F15BB5","#00C2A8","#FF7A30","#00BBF9","#FEE440"]}),
    q("r2q2",2,2,"memory","Rang Pehchano","Which colour appeared first in the sequence?",["Purple","Yellow","Blue","Red"],0,"Purple opened the sequence.",800,16,{sequence:["#9B5DE5","#FEE440","#00BBF9","#FF4D5A","#00C2A8"]}),
    q("r2q3",2,3,"memory","Rang Pehchano","Which colour appeared immediately after blue?",["Yellow","Pink","Green","Orange"],1,"Pink appeared directly after blue.",800,16,{sequence:["#FEE440","#00BBF9","#F15BB5","#00C2A8","#FF7A30"]}),
    q("r2q4",2,4,"memory","Rang Pehchano","Which colour was the final flash?",["Green","Orange","Purple","Yellow"],3,"Yellow was the final colour.",800,16,{sequence:["#00C2A8","#FF7A30","#9B5DE5","#F15BB5","#FEE440"]}),

    q("r3q1",3,1,"rhythm","Garba Beats","How many beats did you hear?",["5","6","7","8"],2,"The rhythm contained seven beats.",850,16,{pattern:[0,260,520,870,1130,1390,1740]}),
    q("r3q2",3,2,"rhythm","Garba Beats","How many beats did you hear?",["6","8","9","10"],1,"The rhythm contained eight beats.",850,16,{pattern:[0,220,440,660,980,1200,1420,1640]}),
    q("r3q3",3,3,"rhythm","Garba Beats","How many beats did you hear?",["4","5","6","7"],1,"The rhythm contained five beats.",850,16,{pattern:[0,320,640,1030,1350]}),
    q("r3q4",3,4,"rhythm","Garba Beats","How many beats did you hear?",["7","8","9","11"],2,"The rhythm contained nine beats.",850,16,{pattern:[0,200,400,730,930,1130,1460,1660,1860]}),

    q("r4q1",4,1,"choice","Culture","Bathukamma is a floral festival primarily associated with which state?",["Telangana","Punjab","Goa","Assam"],0,"Bathukamma is a major floral festival of Telangana.",850,18),
    q("r4q2",4,2,"choice","Culture","Mysuru Dasara is especially associated with which state?",["Karnataka","Rajasthan","Bihar","Goa"],0,"Mysuru Dasara is one of Karnataka's best-known celebrations.",850,18),
    q("r4q3",4,3,"choice","Culture","Durga Puja is especially prominent in which Indian state?",["West Bengal","Gujarat","Kerala","Haryana"],0,"Durga Puja is especially prominent in West Bengal.",850,18),
    q("r4q4",4,4,"choice","Culture","Bihu is a major festival tradition of which state?",["Assam","Sikkim","Tamil Nadu","Rajasthan"],0,"Bihu is central to Assamese cultural life.",850,18),

    q("r5q1",5,1,"dash","Dandiya Dash","Capital of Gujarat?",["Ahmedabad","Gandhinagar","Surat","Vadodara"],1,"Gandhinagar is the capital of Gujarat.",650,10),
    q("r5q2",5,2,"dash","Dandiya Dash","Which planet is known as the Red Planet?",["Mars","Venus","Jupiter","Mercury"],0,"Mars is known as the Red Planet.",650,10),
    q("r5q3",5,3,"dash","Dandiya Dash","A hexagon has how many sides?",["5","6","7","8"],1,"A hexagon has six sides.",650,10),
    q("r5q4",5,4,"dash","Dandiya Dash","Which ocean is the largest?",["Atlantic","Indian","Pacific","Arctic"],2,"The Pacific is the world's largest ocean.",650,10),

    q("r6q1",6,1,"choice","Bollywood","Who played Rancho in 3 Idiots?",["Shah Rukh Khan","Aamir Khan","Ranbir Kapoor","Hrithik Roshan"],1,"Aamir Khan played Rancho.",850,16),
    q("r6q2",6,2,"choice","Bollywood","Which film features the characters Geet and Aditya?",["Jab We Met","Tamasha","Barfi!","Rockstar"],0,"Geet and Aditya are the central characters of Jab We Met.",850,16),
    q("r6q3",6,3,"choice","Music","Which Indian composer won Academy Awards for Slumdog Millionaire?",["A. R. Rahman","Ilaiyaraaja","Pritam","Shankar Mahadevan"],0,"A. R. Rahman won two Academy Awards for the film.",850,16),
    q("r6q4",6,4,"choice","Bollywood","Dholi Taro Dhol Baaje appears in which film?",["Devdas","Hum Dil De Chuke Sanam","Lagaan","Veer-Zaara"],1,"The song appears in Hum Dil De Chuke Sanam.",850,16),

    q("r7q1",7,1,"emoji","Emoji Garba","Decode the movie: 👽 📻 ❤️",["PK","Koi... Mil Gaya","Robot","Ra.One"],0,"The alien, radio and heart clue points to PK.",900,16,{emoji:"👽  📻  ❤️"}),
    q("r7q2",7,2,"emoji","Emoji Garba","Decode the movie: 👑 🤼‍♀️ 🇮🇳",["Dangal","Sultan","Mary Kom","Chak De! India"],0,"The wrestling and India clues point to Dangal.",900,16,{emoji:"👑  🤼‍♀️  🇮🇳"}),
    q("r7q3",7,3,"emoji","Emoji Garba","Decode the phrase: 💃 🥁 🌙",["Garba night","Morning yoga","Cricket match","Road trip"],0,"Dance, drum and moon together suggest a Garba night.",900,16,{emoji:"💃  🥁  🌙"}),
    q("r7q4",7,4,"emoji","Emoji Garba","Decode the landmark: 🕌 ❤️ 🇮🇳",["Hawa Mahal","Taj Mahal","India Gate","Gateway of India"],1,"The monument and love clue points to the Taj Mahal.",900,16,{emoji:"🕌  ❤️  🇮🇳"}),

    q("r8q1",8,1,"team","Team Raas","Which Indian state has the longest coastline?",["Tamil Nadu","Andhra Pradesh","Gujarat","Maharashtra"],2,"Gujarat has the longest coastline among Indian states.",950,18),
    q("r8q2",8,2,"team","Team Raas","Mohiniyattam is a classical dance form from which state?",["Kerala","Odisha","Manipur","Gujarat"],0,"Mohiniyattam originated in Kerala.",950,18),
    q("r8q3",8,3,"team","Team Raas","Kaziranga National Park is in which state?",["Assam","Sikkim","Jharkhand","Uttarakhand"],0,"Kaziranga National Park is in Assam.",950,18),
    q("r8q4",8,4,"team","Team Raas","Where is ISRO headquartered?",["Hyderabad","Mumbai","Bengaluru","Chennai"],2,"ISRO is headquartered in Bengaluru.",950,18),

    q("r9q1",9,1,"finale","Maha Aarti","What collective name is used for the nine forms of Goddess Durga worshipped across Navratri?",["Navadurga","Dashavatara","Ashtalakshmi","Saptamatrika"],0,"The nine forms are collectively known as Navadurga.",1400,20),
    q("r9q2",9,2,"finale","Maha Aarti","Garba of Gujarat joined UNESCO's Representative List of Intangible Cultural Heritage in which year?",["2019","2021","2023","2025"],2,"UNESCO inscribed Garba of Gujarat in 2023.",1400,20),
    q("r9q3",9,3,"finale","Maha Aarti","Which form of Durga is traditionally worshipped on the first day of Sharad Navratri?",["Kalaratri","Shailaputri","Siddhidatri","Mahagauri"],1,"Shailaputri is traditionally worshipped on the first day.",1400,20),
    q("r9q4",9,4,"finale","Maha Aarti","Which text attributed to Bharata Muni discusses drama, dance and performance?",["Arthashastra","Natya Shastra","Yoga Sutras","Panchatantra"],1,"The Natya Shastra is traditionally attributed to Bharata Muni.",1400,20)
  ];

  function fresh(){
    return{
      session:{code:"NAV26",title:"NAVRANG",status:"lobby",phase:"lobby",currentRound:0,currentQuestionId:null,questionStartedAt:null,questionDuration:18,reveal:false},
      players:[],answers:{},baseline:527,updatedAt:Date.now()
    };
  }
  function read(){
    try{
      var s=JSON.parse(localStorage.getItem(KEY)||"null");
      if(!s||!s.session)return fresh();
      return s;
    }catch(e){return fresh();}
  }
  function write(s){
    s.updatedAt=Date.now();
    localStorage.setItem(KEY,JSON.stringify(s));
    try{localStorage.setItem(KEY+"_ping",String(Date.now()));}catch(e){}
    return s;
  }
  function findQ(id){return questions.find(function(x){return x.id===id;})||null;}
  function currentQ(s){return findQ(s.session.currentQuestionId);}
  function roundQs(n){return questions.filter(function(x){return x.round_no===n;});}
  function publicQ(q,reveal){
    if(!q)return null;
    var copy={id:q.id,round_no:q.round_no,sequence:q.sequence,kind:q.kind,category:q.category,prompt:q.prompt,options:q.options.slice(),base_points:q.base_points,duration_seconds:q.duration_seconds,media:q.media||{}};
    if(reveal){copy.correct_index=q.correct_index;copy.explanation=q.explanation;}
    return copy;
  }
  function seededBoard(s){
    var names=[
      ["Aanya","Purple"],["Arjun","Blue"],["Meera","Yellow"],["Kabir","Red"],["Ishita","Green"],
      ["Vihaan","Blue"],["Saanvi","Purple"],["Rohan","Red"],["Diya","Yellow"],["Aarav","Green"]
    ];
    var progress=Math.max(0,s.session.currentRound-1)*3200;
    var base=[8650,8330,8120,7890,7640,7420,7110,6890,6680,6410];
    var people=names.map(function(n,i){return{id:"demo_"+i,display_name:n[0],team:n[1],score:progress+base[i],streak:(i+2)%6,max_streak:4+(i%5),last_score:700+(i*31),joined_at:new Date(Date.now()-i*1000).toISOString()};});
    s.players.forEach(function(p){people.push({id:p.id,display_name:p.display_name,team:p.team,score:p.score||0,streak:p.streak||0,max_streak:p.max_streak||0,last_score:p.last_score||0,joined_at:p.joined_at});});
    people.sort(function(a,b){return b.score-a.score;});
    return people.slice(0,20);
  }
  function teamBoard(s){
    var seed={Red:187400,Yellow:191800,Green:185300,Blue:194200,Purple:189700};
    var step=Math.max(0,s.session.currentRound-1)*13200;
    Object.keys(seed).forEach(function(k){seed[k]+=step;});
    s.players.forEach(function(p){seed[p.team]=(seed[p.team]||0)+(p.score||0);});
    return Object.keys(seed).map(function(k){return{team:k,score:seed[k]};}).sort(function(a,b){return b.score-a.score;});
  }
  function stats(s){
    var q=currentQ(s);
    if(!q)return null;
    var elapsed=s.session.questionStartedAt?Math.max(0,Date.now()-Date.parse(s.session.questionStartedAt)):0;
    var ratio=Math.min(.96,elapsed/Math.max(1,q.duration_seconds*1000));
    if(s.session.phase==="reveal"||s.session.reveal)ratio=.96;
    var total=Math.round((s.baseline+s.players.length)*ratio);
    var weights=[.14,.15,.13,.12],correct=.58;
    weights[q.correct_index]=correct;
    var rest=1-correct,others=[0,1,2,3].filter(function(i){return i!==q.correct_index;});
    var raw=[0,0,0,0];
    raw[q.correct_index]=Math.round(total*correct);
    var spread=[.42,.34,.24];
    others.forEach(function(i,idx){raw[i]=Math.round(total*rest*spread[idx]);});
    var sum=raw.reduce(function(a,b){return a+b;},0);
    if(sum!==total)raw[others[0]]+=total-sum;
    var actual=Object.values(s.answers).filter(function(a){return a.questionId===q.id;});
    actual.forEach(function(a){raw[a.answer]=(raw[a.answer]||0)+1;});
    return{total:total+actual.length,counts:raw,correct:raw[q.correct_index],fastest:{display_name:"Aanya",team:"Purple",response_ms:1760}};
  }
  function boards(s){return{players:seededBoard(s),teams:teamBoard(s),count:s.baseline+s.players.length};}
  function hostOk(body){return !body.pin||body.pin===HOST_PIN;}
  function resultState(s,reveal){
    var q=currentQ(s);
    return{
      ok:true,serverNow:new Date().toISOString(),
      session:s.session,
      round:rounds[s.session.currentRound]||null,
      question:publicQ(q,reveal),
      boards:boards(s),
      stats:stats(s)
    };
  }
  function answerPlayer(body,s){
    var p=s.players.find(function(x){return x.id===body.participantId&&x.player_token===body.token;});
    var q=findQ(body.questionId);
    if(!p||!q||s.session.phase!=="question"||s.session.currentQuestionId!==q.id)return{ok:false,error:"question_closed"};
    var key=p.id+":"+q.id;
    if(s.answers[key])return{ok:true,accepted:true,duplicate:true};
    var correct=Number(body.answer)===q.correct_index;
    var ms=Math.max(0,Math.min(Number(body.responseMs)||0,q.duration_seconds*1000));
    var points=0;
    if(correct){
      p.streak=(p.streak||0)+1;
      p.max_streak=Math.max(p.max_streak||0,p.streak);
      var speed=Math.floor(q.base_points*.45*Math.max(0,1-ms/(q.duration_seconds*1000)));
      points=q.base_points+speed+Math.min(p.streak*45,270);
    }else p.streak=0;
    p.last_score=points;p.score=(p.score||0)+points;
    s.answers[key]={questionId:q.id,answer:Number(body.answer),correct:correct,points:points};
    write(s);
    return{ok:true,accepted:true,duplicate:false};
  }
  function control(body,s){
    if(!hostOk(body))return{ok:false,error:"host_auth_failed"};
    var cmd=body.command,q=currentQ(s),round=s.session.currentRound||1;
    if(cmd==="start_game"){s.session.status="live";s.session.currentRound=1;s.session.phase="intro";s.session.currentQuestionId=null;s.session.questionStartedAt=null;s.session.reveal=false;}
    else if(cmd==="open_next"){
      var list=roundQs(round),next=0;
      if(q&&q.round_no===round)next=q.sequence;
      if(next>=list.length)return{ok:false,error:"round_complete"};
      var nq=list[next];
      s.session.status="live";s.session.phase="question";s.session.currentQuestionId=nq.id;s.session.questionStartedAt=new Date().toISOString();s.session.questionDuration=nq.duration_seconds;s.session.reveal=false;
    }
    else if(cmd==="reveal"){s.session.phase="reveal";s.session.reveal=true;}
    else if(cmd==="round_results"){s.session.phase="round_results";s.session.reveal=true;}
    else if(cmd==="leaderboard"){s.session.phase="leaderboard";}
    else if(cmd==="next_round"){
      if(s.session.currentRound>=9){s.session.status="finished";s.session.phase="finale";s.session.reveal=true;}
      else{s.session.currentRound=Math.max(1,s.session.currentRound+1);s.session.status="live";s.session.phase="intro";s.session.currentQuestionId=null;s.session.questionStartedAt=null;s.session.reveal=false;}
    }
    else if(cmd==="finish"){s.session.status="finished";s.session.phase="finale";s.session.reveal=true;}
    else if(cmd==="back_lobby"){s.session.status="lobby";s.session.phase="lobby";s.session.currentRound=0;s.session.currentQuestionId=null;s.session.questionStartedAt=null;s.session.reveal=false;}
    else if(cmd==="reset"){s=fresh();}
    else return{ok:false,error:"invalid_command"};
    write(s);return{ok:true,session:s.session};
  }
  function localApi(body){
    var s=read(),action=String(body.action||"");
    if(action==="join"){
      var name=String(body.name||"").trim().slice(0,32),team=String(body.team||"Red");
      if(name.length<2)return{ok:false,error:"name_required"};
      if(!TEAM_COLORS[team])return{ok:false,error:"invalid_team"};
      var p={id:crypto.randomUUID?crypto.randomUUID():"p_"+Date.now(),player_token:crypto.randomUUID?crypto.randomUUID():"t_"+Math.random(),display_name:name,team:team,score:0,streak:0,max_streak:0,last_score:0,joined_at:new Date().toISOString()};
      s.players.push(p);write(s);return{ok:true,participant:p};
    }
    if(action==="answer")return answerPlayer(body,s);
    if(action==="control")return control(body,s);
    if(action==="state"){
      var x=resultState(s,s.session.phase==="reveal"||s.session.reveal),p=s.players.find(function(v){return v.id===body.participantId&&v.player_token===body.token;})||null;
      x.player=p;return x;
    }
    if(action==="stage_state")return resultState(s,s.session.phase==="reveal"||s.session.reveal);
    if(action==="host_state"){
      if(!hostOk(body))return{ok:false,error:"host_auth_failed"};
      var h=resultState(s,true);h.questions=s.session.currentRound?roundQs(s.session.currentRound).map(function(v){return{id:v.id,sequence:v.sequence,kind:v.kind,category:v.category,prompt:v.prompt,duration_seconds:v.duration_seconds};}):[];return h;
    }
    return{ok:false,error:"unknown_action"};
  }
  function api(payload){
    return new Promise(function(resolve){setTimeout(function(){resolve(localApi(payload||{}));},60+Math.random()*80);});
  }
  function code(){var qv=new URLSearchParams(location.search).get("code");return(qv||localStorage.getItem("navrang_code")||"NAV26").toUpperCase();}
  function fmt(n){return Number(n||0).toLocaleString("en-IN");}
  function esc(s){return String(s==null?"":s).replace(/[&<>"']/g,function(c){return({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#39;"})[c];});}
  function teamColor(t){return TEAM_COLORS[t]||"#ff9f43";}
  function setAccent(c){document.documentElement.style.setProperty("--accent",c||"#ff9f43");}
  function remain(session,offset){if(!session||!session.questionStartedAt)return 0;var elapsed=(Date.now()+(offset||0))-Date.parse(session.questionStartedAt);return Math.max(0,(session.questionDuration*1000)-elapsed);}
  function toast(msg){var t=document.querySelector(".toast");if(!t){t=document.createElement("div");t.className="toast";document.body.appendChild(t);}t.textContent=msg;t.classList.add("show");clearTimeout(t._id);t._id=setTimeout(function(){t.classList.remove("show");},2300);}
  window.NAVRANG={api:api,code:code,fmt:fmt,esc:esc,teamColor:teamColor,setAccent:setAccent,remain:remain,toast:toast,STATIC_DEMO:true};
})();