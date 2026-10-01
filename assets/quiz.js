(function(){
  "use strict";

  const QUESTIONS = [
    {c:"NAVRATRI CULTURE",q:"Garba is most strongly associated with which Indian state?",o:["Rajasthan","Gujarat","Maharashtra","Punjab"],a:1},
    {c:"NAVRATRI CULTURE",q:"What do dancers traditionally hold while playing Dandiya Raas?",o:["Scarves","Hand fans","Pairs of sticks","Small bells"],a:2},
    {c:"NAVRATRI STYLE",q:"Which outfit is most commonly associated with women's Garba attire?",o:["Chaniya choli","Mekhela chador","Kasavu saree","Phiran"],a:0},
    {c:"NAVRATRI STYLE",q:"Which traditional garment is commonly worn by men for Garba in Gujarat?",o:["Kediyu","Mundu","Pheran","Angavastram"],a:0},
    {c:"NAVRATRI CULTURE",q:"Garba is commonly danced in which formation?",o:["Straight rows","Circular formations","Seated pairs","Single-file lines"],a:1},

    {c:"BOLLYWOOD BEATS",q:"“Dholi Taro Dhol Baaje” is from which film?",o:["Devdas","Hum Dil De Chuke Sanam","Lagaan","Veer-Zaara"],a:1},
    {c:"BOLLYWOOD BEATS",q:"“Nagada Sang Dhol” appears in which film?",o:["Bajirao Mastani","Goliyon Ki Raasleela Ram-Leela","Padmaavat","Kalank"],a:1},
    {c:"BOLLYWOOD BEATS",q:"The song “Chogada” is from which film?",o:["Loveyatri","Raees","Kai Po Che!","ABCD 2"],a:0},
    {c:"BOLLYWOOD BEATS",q:"“Shubhaarambh” is a song from which film?",o:["Kai Po Che!","2 States","Rock On!!","Dil Dhadakne Do"],a:0},
    {c:"BOLLYWOOD BEATS",q:"“Udi Udi Jaye” features in which Shah Rukh Khan film?",o:["Chennai Express","Raees","Happy New Year","Fan"],a:1},

    {c:"BOLLYWOOD BEATS",q:"“Ghoomar” is from which film?",o:["Padmaavat","Bajirao Mastani","Jodhaa Akbar","Manikarnika"],a:0},
    {c:"BOLLYWOOD BEATS",q:"“London Thumakda” is from which film?",o:["Queen","Tanu Weds Manu","Shaandaar","English Vinglish"],a:0},
    {c:"BOLLYWOOD BEATS",q:"“Gallan Goodiyaan” appears in which film?",o:["Zindagi Na Milegi Dobara","Dil Dhadakne Do","Kapoor & Sons","Rocky Aur Rani Kii Prem Kahaani"],a:1},
    {c:"BOLLYWOOD BEATS",q:"“Badtameez Dil” is from which film?",o:["Yeh Jawaani Hai Deewani","Student of the Year","Ae Dil Hai Mushkil","Cocktail"],a:0},
    {c:"BOLLYWOOD BEATS",q:"“Kala Chashma” is from which film?",o:["Baar Baar Dekho","Kapoor & Sons","A Gentleman","Dhadak"],a:0},

    {c:"BOLLYWOOD BEATS",q:"“Kar Gayi Chull” appears in which film?",o:["Kapoor & Sons","Humpty Sharma Ki Dulhania","Badrinath Ki Dulhania","Student of the Year"],a:0},
    {c:"BOLLYWOOD BEATS",q:"The modern Bollywood version of “Aankh Marey” appears in which film?",o:["Simmba","Sooryavanshi","Golmaal Again","Judwaa 2"],a:0},
    {c:"BOLLYWOOD BEATS",q:"“Apna Time Aayega” is from which film?",o:["Gully Boy","Rockstar","Tamasha","Street Dancer 3D"],a:0},
    {c:"BOLLYWOOD BEATS",q:"“Kesariya” is from which film?",o:["Brahmāstra: Part One – Shiva","Ae Dil Hai Mushkil","Tu Jhoothi Main Makkaar","Rocky Aur Rani Kii Prem Kahaani"],a:0},
    {c:"BOLLYWOOD BEATS",q:"“Senorita” is from which road-trip film?",o:["Dil Chahta Hai","Zindagi Na Milegi Dobara","Tamasha","Karwaan"],a:1},

    {c:"BOLLYWOOD",q:"Who played Raj and Simran in Dilwale Dulhania Le Jayenge?",o:["Aamir Khan & Juhi Chawla","Shah Rukh Khan & Kajol","Salman Khan & Madhuri Dixit","Saif Ali Khan & Preity Zinta"],a:1},
    {c:"BOLLYWOOD",q:"Who plays Rani, the lead character in the film Queen?",o:["Deepika Padukone","Kangana Ranaut","Vidya Balan","Priyanka Chopra Jonas"],a:1},
    {c:"BOLLYWOOD",q:"Who directed Zindagi Na Milegi Dobara?",o:["Farhan Akhtar","Zoya Akhtar","Imtiaz Ali","Ayan Mukerji"],a:1},
    {c:"BOLLYWOOD",q:"Who directed 3 Idiots?",o:["Rajkumar Hirani","Rohit Shetty","Karan Johar","Anurag Basu"],a:0},
    {c:"BOLLYWOOD",q:"Bunny and Naina are the central characters of which film?",o:["Tamasha","Yeh Jawaani Hai Deewani","Wake Up Sid","Jaane Tu... Ya Jaane Na"],a:1}
  ];

  const QUESTION_MS = 7000;
  const MAX_PER_QUESTION = 1000;
  const MIN_CORRECT_SCORE = 500;
  const CIRC = 326.73;

  const startScreen = document.getElementById("startScreen");
  const quizScreen = document.getElementById("quizScreen");
  const resultScreen = document.getElementById("resultScreen");
  const startForm = document.getElementById("startForm");
  const emailInput = document.getElementById("email");
  const startError = document.getElementById("startError");
  const questionNumber = document.getElementById("questionNumber");
  const scoreEl = document.getElementById("score");
  const progressBar = document.getElementById("progressBar");
  const timerEl = document.getElementById("timer");
  const timerRing = document.getElementById("timerRing");
  const categoryEl = document.getElementById("category");
  const questionText = document.getElementById("questionText");
  const answersEl = document.getElementById("answers");
  const feedback = document.getElementById("feedback");
  const playerEmail = document.getElementById("playerEmail");
  const fullscreenGuard = document.getElementById("fullscreenGuard");
  const resumeFullscreen = document.getElementById("resumeFullscreen");

  let email = "";
  let index = 0;
  let score = 0;
  let correct = 0;
  let active = false;
  let finished = false;
  let locked = false;
  let remainingMs = QUESTION_MS;
  let deadline = 0;
  let frame = 0;
  let paused = false;
  let responseTimes = [];
  let fastest = Infinity;

  function validEmail(value){
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  }

  startForm.addEventListener("submit", async function(e){
    e.preventDefault();
    const value = emailInput.value.trim();
    if(!validEmail(value)){
      startError.textContent = "Enter a valid email ID to continue.";
      emailInput.focus();
      return;
    }
    startError.textContent = "";
    email = value;

    try{
      if(document.documentElement.requestFullscreen){
        await document.documentElement.requestFullscreen();
      }else{
        startError.textContent = "Full-screen mode is required on this browser.";
        return;
      }
    }catch(err){
      startError.textContent = "Allow full-screen mode to start the quiz.";
      return;
    }

    beginQuiz();
  });

  function beginQuiz(){
    index = 0;
    score = 0;
    correct = 0;
    responseTimes = [];
    fastest = Infinity;
    active = true;
    finished = false;
    paused = false;
    startScreen.hidden = true;
    resultScreen.hidden = true;
    quizScreen.hidden = false;
    playerEmail.textContent = email;
    scoreEl.textContent = "0";
    history.pushState({quiz:true},"",location.href);
    showQuestion();
  }

  function showQuestion(){
    cancelAnimationFrame(frame);
    locked = false;
    remainingMs = QUESTION_MS;
    deadline = performance.now() + remainingMs;
    feedback.innerHTML = "";

    const item = QUESTIONS[index];
    questionNumber.textContent = (index + 1) + " / " + QUESTIONS.length;
    progressBar.style.width = (((index + 1) / QUESTIONS.length) * 100) + "%";
    categoryEl.textContent = item.c;
    questionText.textContent = item.q;
    answersEl.innerHTML = "";

    item.o.forEach(function(option, optionIndex){
      const button = document.createElement("button");
      button.className = "answer";
      button.type = "button";
      button.dataset.index = optionIndex;
      button.innerHTML = "<b>" + String.fromCharCode(65 + optionIndex) + "</b><span></span>";
      button.querySelector("span").textContent = option;
      button.addEventListener("click", function(){ chooseAnswer(optionIndex); });
      answersEl.appendChild(button);
    });

    updateTimerVisual(QUESTION_MS);
    frame = requestAnimationFrame(tick);
  }

  function tick(now){
    if(!active || finished || paused || locked) return;
    remainingMs = Math.max(0, deadline - now);
    updateTimerVisual(remainingMs);

    if(remainingMs <= 0){
      timeUp();
      return;
    }
    frame = requestAnimationFrame(tick);
  }

  function updateTimerVisual(ms){
    const seconds = Math.ceil(ms / 1000);
    timerEl.textContent = seconds;
    const ratio = Math.max(0, Math.min(1, ms / QUESTION_MS));
    timerRing.style.strokeDashoffset = String(CIRC * (1 - ratio));
    timerRing.style.stroke = seconds <= 2 ? "var(--red)" : seconds <= 4 ? "var(--orange)" : "var(--peacock-soft)";
  }

  function chooseAnswer(choice){
    if(locked || paused || !active) return;
    locked = true;
    cancelAnimationFrame(frame);

    const item = QUESTIONS[index];
    const elapsed = QUESTION_MS - remainingMs;
    responseTimes.push(elapsed);
    fastest = Math.min(fastest, elapsed);

    const buttons = Array.from(answersEl.querySelectorAll(".answer"));
    buttons.forEach(function(btn){ btn.disabled = true; });

    if(choice === item.a){
      correct++;
      const speedRatio = remainingMs / QUESTION_MS;
      const earned = Math.round(MIN_CORRECT_SCORE + (MAX_PER_QUESTION - MIN_CORRECT_SCORE) * speedRatio);
      score += earned;
      scoreEl.textContent = score.toLocaleString("en-IN");
      buttons[choice].classList.add("correct");
      buttons.forEach(function(btn,i){ if(i !== choice) btn.classList.add("dim"); });
      feedback.innerHTML = '<strong>Correct <span class="points">+' + earned.toLocaleString("en-IN") + '</span></strong>' +
        '<span>Answered in ' + (elapsed/1000).toFixed(2) + ' seconds.</span>';
    }else{
      buttons[choice].classList.add("wrong");
      buttons[item.a].classList.add("correct");
      buttons.forEach(function(btn,i){ if(i !== choice && i !== item.a) btn.classList.add("dim"); });
      feedback.innerHTML = '<strong>Not this one</strong><span>Fast is good. Accurate is better.</span>';
    }

    setTimeout(nextQuestion, 1350);
  }

  function timeUp(){
    if(locked) return;
    locked = true;
    cancelAnimationFrame(frame);
    remainingMs = 0;
    updateTimerVisual(0);

    const item = QUESTIONS[index];
    const buttons = Array.from(answersEl.querySelectorAll(".answer"));
    buttons.forEach(function(btn,i){
      btn.disabled = true;
      if(i === item.a) btn.classList.add("correct");
      else btn.classList.add("dim");
    });
    feedback.innerHTML = '<strong>Time!</strong><span>7 seconds are up.</span>';
    setTimeout(nextQuestion, 1350);
  }

  function nextQuestion(){
    if(!active) return;
    index++;
    if(index >= QUESTIONS.length){
      finishQuiz();
      return;
    }
    showQuestion();
  }

  function finishQuiz(){
    active = false;
    finished = true;
    cancelAnimationFrame(frame);
    quizScreen.hidden = true;
    resultScreen.hidden = false;

    document.getElementById("finalScore").textContent = score.toLocaleString("en-IN");
    document.getElementById("correctCount").textContent = correct + " / " + QUESTIONS.length;

    const avg = responseTimes.length ? responseTimes.reduce(function(a,b){return a+b;},0) / responseTimes.length : 0;
    document.getElementById("avgTime").textContent = (avg/1000).toFixed(2) + "s";
    document.getElementById("fastestTime").textContent = isFinite(fastest) ? (fastest/1000).toFixed(2) + "s" : "—";
    document.getElementById("resultEmail").textContent = email;
  }

  function pauseForFullscreen(){
    if(!active || finished || paused) return;
    paused = true;
    remainingMs = Math.max(0, deadline - performance.now());
    cancelAnimationFrame(frame);
    fullscreenGuard.hidden = false;
  }

  function resumeQuiz(){
    if(!active || finished) return;
    fullscreenGuard.hidden = true;
    paused = false;
    deadline = performance.now() + remainingMs;
    frame = requestAnimationFrame(tick);
  }

  resumeFullscreen.addEventListener("click", async function(){
    try{
      if(!document.fullscreenElement && document.documentElement.requestFullscreen){
        await document.documentElement.requestFullscreen();
      }
      if(document.fullscreenElement) resumeQuiz();
    }catch(err){}
  });

  document.addEventListener("fullscreenchange", function(){
    if(!active || finished) return;
    if(!document.fullscreenElement) pauseForFullscreen();
    else if(paused) resumeQuiz();
  });

  document.addEventListener("visibilitychange", function(){
    if(active && !finished && document.hidden) pauseForFullscreen();
  });

  window.addEventListener("beforeunload", function(e){
    if(active && !finished){
      e.preventDefault();
      e.returnValue = "";
    }
  });

  window.addEventListener("popstate", function(){
    if(active && !finished){
      history.pushState({quiz:true},"",location.href);
      pauseForFullscreen();
    }
  });

  document.getElementById("restartButton").addEventListener("click", async function(){
    resultScreen.hidden = true;
    startScreen.hidden = false;
    emailInput.value = email;
    try{
      if(document.fullscreenElement) await document.exitFullscreen();
    }catch(err){}
  });
})();