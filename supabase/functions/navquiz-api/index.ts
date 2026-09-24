import { createClient } from "npm:@supabase/supabase-js@2.95.0";

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Cache-Control": "no-store"
};

const url = Deno.env.get("SUPABASE_URL")!;
const key = Deno.env.get("SUPABASE_SECRET_KEY") || Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const db = createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });

const ok = (data: unknown, status = 200) =>
  new Response(JSON.stringify(data), { status, headers: { ...cors, "Content-Type": "application/json" } });

const clean = (v: unknown, max = 40) => String(v ?? "").trim().replace(/[<>]/g, "").slice(0, max);
const teams = ["Red", "Yellow", "Green", "Blue", "Purple"];

async function getSession(code: string) {
  const { data, error } = await db.from("nav_sessions").select("*").eq("code", code.toUpperCase()).maybeSingle();
  if (error) throw error;
  return data;
}

async function roundInfo(roundNo: number) {
  if (!roundNo) return null;
  const { data } = await db.from("nav_rounds").select("*").eq("round_no", roundNo).maybeSingle();
  return data;
}

async function questionPublic(id: string | null, reveal = false) {
  if (!id) return null;
  const fields = reveal
    ? "id,round_no,sequence,kind,category,prompt,options,correct_index,explanation,base_points,duration_seconds,media"
    : "id,round_no,sequence,kind,category,prompt,options,base_points,duration_seconds,media";
  const { data, error } = await db.from("nav_questions").select(fields).eq("id", id).maybeSingle();
  if (error) throw error;
  return data;
}

async function leaderboards(sessionId: string) {
  const { data: players, error } = await db
    .from("nav_participants")
    .select("id,display_name,team,score,streak,max_streak,last_score,joined_at")
    .eq("session_id", sessionId)
    .order("score", { ascending: false })
    .limit(20);
  if (error) throw error;

  const { data: all } = await db
    .from("nav_participants")
    .select("team,score")
    .eq("session_id", sessionId);

  const sums = new Map<string, number>();
  for (const p of all ?? []) sums.set(p.team, (sums.get(p.team) ?? 0) + p.score);
  const teamBoard = [...sums.entries()]
    .map(([team, score]) => ({ team, score }))
    .sort((a, b) => b.score - a.score);

  return { players: players ?? [], teams: teamBoard, count: (all ?? []).length };
}

async function currentStats(session: any) {
  if (!session.current_question_id) return null;
  const { data: answers } = await db
    .from("nav_answers")
    .select("answer_index,is_correct,response_ms,points_awarded,participant_id")
    .eq("question_id", session.current_question_id);
  const counts = [0, 0, 0, 0];
  let fastest: any = null;
  for (const a of answers ?? []) {
    counts[a.answer_index] = (counts[a.answer_index] || 0) + 1;
    if (a.is_correct && (!fastest || a.response_ms < fastest.response_ms)) fastest = a;
  }
  let fastestPlayer = null;
  if (fastest) {
    const { data } = await db.from("nav_participants").select("display_name,team").eq("id", fastest.participant_id).maybeSingle();
    if (data) fastestPlayer = { ...data, response_ms: fastest.response_ms };
  }
  return { total: (answers ?? []).length, counts, correct: (answers ?? []).filter((a) => a.is_correct).length, fastest: fastestPlayer };
}

async function playerState(body: any) {
  const session = await getSession(clean(body.code, 10));
  if (!session) return ok({ ok: false, error: "session_not_found" }, 404);
  const round = await roundInfo(session.current_round);
  const reveal = session.phase === "reveal" || session.reveal_answer;
  const question = await questionPublic(session.current_question_id, reveal);

  let player = null;
  if (body.participantId && body.token) {
    const { data } = await db
      .from("nav_participants")
      .select("id,display_name,team,score,streak,max_streak,last_score")
      .eq("id", body.participantId)
      .eq("player_token", body.token)
      .eq("session_id", session.id)
      .maybeSingle();
    player = data;
  }

  return ok({
    ok: true,
    serverNow: new Date().toISOString(),
    session: {
      code: session.code,
      title: session.title,
      status: session.status,
      phase: session.phase,
      currentRound: session.current_round,
      questionStartedAt: session.question_started_at,
      questionDuration: session.question_duration,
      reveal: session.reveal_answer
    },
    round,
    question,
    player
  });
}

async function stageState(body: any) {
  const session = await getSession(clean(body.code, 10));
  if (!session) return ok({ ok: false, error: "session_not_found" }, 404);
  const [round, question, boards, stats] = await Promise.all([
    roundInfo(session.current_round),
    questionPublic(session.current_question_id, session.phase === "reveal" || session.reveal_answer),
    leaderboards(session.id),
    currentStats(session)
  ]);
  return ok({
    ok: true,
    serverNow: new Date().toISOString(),
    session: {
      code: session.code, title: session.title, status: session.status, phase: session.phase,
      currentRound: session.current_round, questionStartedAt: session.question_started_at,
      questionDuration: session.question_duration, reveal: session.reveal_answer
    },
    round, question, boards, stats
  });
}

async function hostSession(body: any) {
  const code = clean(body.code, 10).toUpperCase();
  const pin = clean(body.pin, 30);
  const session = await getSession(code);
  if (!session || session.host_pin !== pin) return null;
  return session;
}

async function join(body: any) {
  const session = await getSession(clean(body.code, 10));
  if (!session) return ok({ ok: false, error: "session_not_found" }, 404);
  if (session.status === "finished") return ok({ ok: false, error: "event_finished" }, 409);

  const name = clean(body.name, 32);
  const team = clean(body.team, 12);
  if (name.length < 2) return ok({ ok: false, error: "name_required" }, 400);
  if (!teams.includes(team)) return ok({ ok: false, error: "invalid_team" }, 400);

  const { data, error } = await db
    .from("nav_participants")
    .insert({ session_id: session.id, display_name: name, team })
    .select("id,player_token,display_name,team,score,streak")
    .single();
  if (error) throw error;
  return ok({ ok: true, participant: data });
}

async function answer(body: any) {
  const session = await getSession(clean(body.code, 10));
  if (!session) return ok({ ok: false, error: "session_not_found" }, 404);
  const ans = Number(body.answer);
  const ms = Math.max(0, Math.round(Number(body.responseMs) || 0));
  if (!Number.isInteger(ans) || ans < 0 || ans > 3) return ok({ ok: false, error: "invalid_answer" }, 400);

  const { data, error } = await db.rpc("nav_submit_answer", {
    p_session: session.id,
    p_participant: body.participantId,
    p_token: body.token,
    p_question: body.questionId,
    p_answer: ans,
    p_response_ms: ms
  });
  if (error) throw error;
  if (!data?.ok) return ok(data, data?.error === "too_late" || data?.error === "question_closed" ? 409 : 400);
  return ok({ ok: true, accepted: true, duplicate: !!data.duplicate });
}

async function hostState(body: any) {
  const session = await hostSession(body);
  if (!session) return ok({ ok: false, error: "host_auth_failed" }, 403);
  const [round, question, boards, stats, questions] = await Promise.all([
    roundInfo(session.current_round),
    questionPublic(session.current_question_id, true),
    leaderboards(session.id),
    currentStats(session),
    session.current_round
      ? db.from("nav_questions").select("id,sequence,kind,category,prompt,duration_seconds").eq("round_no", session.current_round).order("sequence")
      : Promise.resolve({ data: [] })
  ]);
  return ok({
    ok: true,
    serverNow: new Date().toISOString(),
    session: {
      code: session.code, title: session.title, status: session.status, phase: session.phase,
      currentRound: session.current_round, currentQuestionId: session.current_question_id,
      questionStartedAt: session.question_started_at, questionDuration: session.question_duration,
      reveal: session.reveal_answer
    },
    round, question, boards, stats, questions: (questions as any).data ?? []
  });
}

async function control(body: any) {
  const session = await hostSession(body);
  if (!session) return ok({ ok: false, error: "host_auth_failed" }, 403);
  const command = clean(body.command, 30);
  let patch: any = { updated_at: new Date().toISOString() };

  if (command === "start_game") {
    patch = { ...patch, status: "live", current_round: 1, phase: "intro", current_question_id: null, question_started_at: null, reveal_answer: false };
  } else if (command === "open_next") {
    const roundNo = session.current_round || 1;
    let nextSequence = 1;
    if (session.current_question_id) {
      const { data: cur } = await db.from("nav_questions").select("round_no,sequence").eq("id", session.current_question_id).maybeSingle();
      if (cur && cur.round_no === roundNo) nextSequence = cur.sequence + 1;
    }
    const { data: q } = await db
      .from("nav_questions")
      .select("id,duration_seconds")
      .eq("round_no", roundNo)
      .eq("sequence", nextSequence)
      .maybeSingle();
    if (!q) return ok({ ok: false, error: "round_complete" }, 409);
    patch = {
      ...patch, status: "live", phase: "question", current_round: roundNo,
      current_question_id: q.id, question_started_at: new Date().toISOString(),
      question_duration: q.duration_seconds, reveal_answer: false
    };
  } else if (command === "reveal") {
    patch = { ...patch, phase: "reveal", reveal_answer: true };
  } else if (command === "round_results") {
    patch = { ...patch, phase: "round_results", reveal_answer: true };
  } else if (command === "leaderboard") {
    patch = { ...patch, phase: "leaderboard" };
  } else if (command === "next_round") {
    if (session.current_round >= 9) {
      patch = { ...patch, status: "finished", phase: "finale", reveal_answer: true };
    } else {
      patch = {
        ...patch, status: "live", current_round: Math.max(1, session.current_round + 1),
        phase: "intro", current_question_id: null, question_started_at: null, reveal_answer: false
      };
    }
  } else if (command === "finish") {
    patch = { ...patch, status: "finished", phase: "finale", reveal_answer: true };
  } else if (command === "back_lobby") {
    patch = { ...patch, status: "lobby", current_round: 0, phase: "lobby", current_question_id: null, question_started_at: null, reveal_answer: false };
  } else if (command === "reset") {
    await db.from("nav_answers").delete().eq("session_id", session.id);
    await db.from("nav_participants").delete().eq("session_id", session.id);
    patch = { ...patch, status: "lobby", current_round: 0, phase: "lobby", current_question_id: null, question_started_at: null, reveal_answer: false };
  } else {
    return ok({ ok: false, error: "invalid_command" }, 400);
  }

  const { data, error } = await db.from("nav_sessions").update(patch).eq("id", session.id).select().single();
  if (error) throw error;
  return ok({ ok: true, session: data });
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: cors });
  if (req.method !== "POST") return ok({ ok: false, error: "post_only" }, 405);

  try {
    const body = await req.json();
    const action = clean(body.action, 30);
    if (action === "state") return await playerState(body);
    if (action === "stage_state") return await stageState(body);
    if (action === "join") return await join(body);
    if (action === "answer") return await answer(body);
    if (action === "host_state") return await hostState(body);
    if (action === "control") return await control(body);
    return ok({ ok: false, error: "unknown_action" }, 400);
  } catch (e) {
    console.error(e);
    return ok({ ok: false, error: "server_error" }, 500);
  }
});