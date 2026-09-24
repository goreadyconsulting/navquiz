(function(){
  var BASE="https://agcmyvzfjersvwoqwkkc.supabase.co/functions/v1/navquiz-api";
  function api(payload){
    return fetch(BASE,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(payload)})
      .then(function(r){return r.json().then(function(j){if(!r.ok&&!j.error)j.error="request_failed";return j;});});
  }
  function code(){
    var q=new URLSearchParams(location.search).get("code");
    return (q||localStorage.getItem("navrang_code")||"NAV26").toUpperCase();
  }
  function fmt(n){return Number(n||0).toLocaleString("en-IN");}
  function esc(s){return String(s==null?"":s).replace(/[&<>"']/g,function(c){return({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#39;"})[c];});}
  function teamColor(t){return({Red:"#ff5b54",Yellow:"#fee440",Green:"#37d67a",Blue:"#00bbf9",Purple:"#9b5de5"})[t]||"#ff9f43";}
  function setAccent(c){document.documentElement.style.setProperty("--accent",c||"#ff9f43");}
  function remain(session,offset){
    if(!session||!session.questionStartedAt)return 0;
    var elapsed=(Date.now()+(offset||0))-Date.parse(session.questionStartedAt);
    return Math.max(0,(session.questionDuration*1000)-elapsed);
  }
  function toast(msg){
    var t=document.querySelector(".toast");
    if(!t){t=document.createElement("div");t.className="toast";document.body.appendChild(t);}
    t.textContent=msg;t.classList.add("show");clearTimeout(t._id);t._id=setTimeout(function(){t.classList.remove("show");},2300);
  }
  window.NAVRANG={api:api,code:code,fmt:fmt,esc:esc,teamColor:teamColor,setAccent:setAccent,remain:remain,toast:toast};
})();