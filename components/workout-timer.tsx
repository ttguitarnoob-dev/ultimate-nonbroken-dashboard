"use client";

import { useCallback, useEffect, useRef, useState } from "react";

type TimeUnit = "seconds" | "minutes";

type WorkoutPhase = "set" | "rest";

const formatTime = (totalSeconds: number) => {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  return `${minutes.toString().padStart(2, "0")}:${seconds
    .toString()
    .padStart(2, "0")}`;
};

const toSeconds = (value: number, unit: TimeUnit) => {
  return unit === "minutes" ? value * 60 : value;
};

export default function WorkoutTimer() {
  const [setValue, setSetValue] = useState(1);
  const [setUnit, setSetUnit] = useState<TimeUnit>("minutes");

  const [restValue, setRestValue] = useState(30);
  const [restUnit, setRestUnit] = useState<TimeUnit>("seconds");

  const [isRunning, setIsRunning] = useState(false);
  const [phase, setPhase] = useState<WorkoutPhase>("set");
  const [phaseRemaining, setPhaseRemaining] = useState(60);
  const [totalElapsed, setTotalElapsed] = useState(0);

  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const phaseStartRef = useRef<number>(0);
  const workoutStartRef = useRef<number>(0);
  const phaseDurationRef = useRef<number>(60);

  const speak = useCallback((message: string) => {
    if (typeof window === "undefined") return;

    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(message);
      utterance.rate = 1;
      utterance.pitch = 1;
      utterance.volume = 1;

      window.speechSynthesis.speak(utterance);
    }
  }, []);

  const beep = useCallback(() => {
    if (typeof window === "undefined") return;

    try {
      const AudioContextClass =
        window.AudioContext ||
        (window as typeof window & {
          webkitAudioContext?: typeof AudioContext;
        }).webkitAudioContext;

      if (!AudioContextClass) return;

      const context = new AudioContextClass();
      const oscillator = context.createOscillator();
      const gain = context.createGain();

      oscillator.frequency.value = 880;
      oscillator.type = "sine";

      gain.gain.setValueAtTime(0.3, context.currentTime);
      gain.gain.exponentialRampToValueAtTime(
        0.001,
        context.currentTime + 0.4
      );

      oscillator.connect(gain);
      gain.connect(context.destination);

      oscillator.start();
      oscillator.stop(context.currentTime + 0.4);
    } catch {
      // Audio isn't available. That's okay.
    }
  }, []);

  const announcePhase = useCallback(
    (nextPhase: WorkoutPhase) => {
      beep();

      setTimeout(() => {
        speak(nextPhase === "set" ? "Set" : "Rest");
      }, 150);
    },
    [beep, speak]
  );

  const startWorkout = useCallback(() => {
    const setSeconds = toSeconds(setValue, setUnit);
    const restSeconds = toSeconds(restValue, restUnit);

    const now = Date.now();

    workoutStartRef.current = now;
    phaseStartRef.current = now;
    phaseDurationRef.current = setSeconds;

    setPhase("set");
    setPhaseRemaining(setSeconds);
    setTotalElapsed(0);
    setIsRunning(true);

    speak("Set");
  }, [setValue, setUnit, restValue, restUnit, speak]);

  const stopWorkout = useCallback(() => {
    setIsRunning(false);

    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    window.speechSynthesis?.cancel();
  }, []);

  const resetWorkout = useCallback(() => {
    stopWorkout();

    const setSeconds = toSeconds(setValue, setUnit);

    setPhase("set");
    setPhaseRemaining(setSeconds);
    setTotalElapsed(0);
  }, [setValue, setUnit, stopWorkout]);

  useEffect(() => {
    if (!isRunning) return;

    intervalRef.current = setInterval(() => {
      const now = Date.now();

      const elapsed = Math.floor(
        (now - workoutStartRef.current) / 1000
      );

      const phaseElapsed = Math.floor(
        (now - phaseStartRef.current) / 1000
      );

      const remaining = Math.max(
        0,
        phaseDurationRef.current - phaseElapsed
      );

      setTotalElapsed(elapsed);
      setPhaseRemaining(remaining);

      if (phaseElapsed >= phaseDurationRef.current) {
        const nextPhase = phase === "set" ? "rest" : "set";

        const nextDuration =
          nextPhase === "set"
            ? toSeconds(setValue, setUnit)
            : toSeconds(restValue, restUnit);

        phaseStartRef.current = now;
        phaseDurationRef.current = nextDuration;

        setPhase(nextPhase);
        setPhaseRemaining(nextDuration);

        announcePhase(nextPhase);
      }
    }, 100);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [
    isRunning,
    phase,
    setValue,
    setUnit,
    restValue,
    restUnit,
    announcePhase,
  ]);

  const setSeconds = toSeconds(setValue, setUnit);
  const restSeconds = toSeconds(restValue, restUnit);

  if (isRunning) {
    const progress =
      phaseDurationRef.current > 0
        ? ((phaseDurationRef.current - phaseRemaining) /
            phaseDurationRef.current) *
          100
        : 0;

    return (
      <main className="min-h-screen bg-zinc-950 px-4 py-6 text-white">
        <div className="mx-auto flex min-h-[calc(100vh-3rem)] max-w-2xl flex-col">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium uppercase tracking-[0.2em] text-zinc-500">
                Workout
              </p>
              <h1 className="mt-1 text-xl font-semibold">
                Interval Timer
              </h1>
            </div>

            <button
              onClick={stopWorkout}
              className="rounded-full bg-zinc-800 px-4 py-2 text-sm font-medium text-zinc-300 transition hover:bg-zinc-700 active:scale-95"
            >
              Stop
            </button>
          </div>

          {/* Total elapsed */}
          <div className="mt-10 text-center">
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-zinc-500">
              Total elapsed
            </p>

            <div className="mt-2 font-mono text-4xl font-medium tracking-tight tabular-nums text-zinc-300 sm:text-5xl">
              {formatTime(totalElapsed)}
            </div>
          </div>

          {/* Main timer */}
          <div className="flex flex-1 flex-col items-center justify-center">
            <div
              className={`mb-5 rounded-full px-5 py-2 text-sm font-bold uppercase tracking-[0.25em] ${
                phase === "set"
                  ? "bg-white text-zinc-950"
                  : "bg-zinc-800 text-zinc-300"
              }`}
            >
              {phase}
            </div>

            <div className="font-mono text-[clamp(5rem,25vw,12rem)] font-semibold leading-none tracking-tighter tabular-nums">
              {formatTime(phaseRemaining)}
            </div>

            <p className="mt-6 text-center text-lg text-zinc-500">
              {phase === "set"
                ? "Keep going"
                : "Take a breather"}
            </p>

            {/* Progress */}
            <div className="mt-10 w-full max-w-md">
              <div className="h-2 overflow-hidden rounded-full bg-zinc-800">
                <div
                  className="h-full rounded-full bg-white transition-[width] duration-100"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="grid grid-cols-2 gap-3 pb-4">
            <div className="rounded-2xl bg-zinc-900 p-4 text-center">
              <p className="text-xs uppercase tracking-wider text-zinc-500">
                Set
              </p>
              <p className="mt-1 font-mono text-xl tabular-nums">
                {formatTime(setSeconds)}
              </p>
            </div>

            <div className="rounded-2xl bg-zinc-900 p-4 text-center">
              <p className="text-xs uppercase tracking-wider text-zinc-500">
                Rest
              </p>
              <p className="mt-1 font-mono text-xl tabular-nums">
                {formatTime(restSeconds)}
              </p>
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-zinc-950 px-4 py-6 text-white">
      <div className="mx-auto max-w-2xl">
        {/* Header */}
        <div className="pt-4">
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-zinc-500">
            Workout
          </p>

          <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
            Interval Timer
          </h1>

          <p className="mt-2 max-w-md text-zinc-500">
            Set your work and recovery times, then get moving.
          </p>
        </div>

        {/* Settings */}
        <div className="mt-10 space-y-4">
          {/* Set */}
          <section className="rounded-3xl border border-zinc-800 bg-zinc-900 p-5 sm:p-6">
            <div className="mb-5">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">
                Work interval
              </p>

              <h2 className="mt-1 text-xl font-semibold">
                Set time
              </h2>
            </div>

            <div className="grid grid-cols-[1fr_auto] gap-3">
              <input
                type="number"
                min={1}
                value={setValue}
                onChange={(e) =>
                  setSetValue(Math.max(1, Number(e.target.value)))
                }
                className="w-full rounded-2xl border border-zinc-700 bg-zinc-950 px-5 py-4 text-3xl font-semibold outline-none transition focus:border-zinc-400"
              />

              <select
                value={setUnit}
                onChange={(e) =>
                  setSetUnit(e.target.value as TimeUnit)
                }
                className="rounded-2xl border border-zinc-700 bg-zinc-950 px-4 text-base font-medium outline-none focus:border-zinc-400"
              >
                <option value="seconds">Seconds</option>
                <option value="minutes">Minutes</option>
              </select>
            </div>
          </section>

          {/* Rest */}
          <section className="rounded-3xl border border-zinc-800 bg-zinc-900 p-5 sm:p-6">
            <div className="mb-5">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">
                Recovery interval
              </p>

              <h2 className="mt-1 text-xl font-semibold">
                Rest time
              </h2>
            </div>

            <div className="grid grid-cols-[1fr_auto] gap-3">
              <input
                type="number"
                min={1}
                value={restValue}
                onChange={(e) =>
                  setRestValue(Math.max(1, Number(e.target.value)))
                }
                className="w-full rounded-2xl border border-zinc-700 bg-zinc-950 px-5 py-4 text-3xl font-semibold outline-none transition focus:border-zinc-400"
              />

              <select
                value={restUnit}
                onChange={(e) =>
                  setRestUnit(e.target.value as TimeUnit)
                }
                className="rounded-2xl border border-zinc-700 bg-zinc-950 px-4 text-base font-medium outline-none focus:border-zinc-400"
              >
                <option value="seconds">Seconds</option>
                <option value="minutes">Minutes</option>
              </select>
            </div>
          </section>
        </div>

        {/* Preview */}
        <div className="mt-5 grid grid-cols-2 gap-3">
          <div className="rounded-2xl bg-zinc-900 p-4 text-center">
            <p className="text-xs uppercase tracking-wider text-zinc-500">
              Set
            </p>

            <p className="mt-1 font-mono text-2xl tabular-nums">
              {formatTime(setSeconds)}
            </p>
          </div>

          <div className="rounded-2xl bg-zinc-900 p-4 text-center">
            <p className="text-xs uppercase tracking-wider text-zinc-500">
              Rest
            </p>

            <p className="mt-1 font-mono text-2xl tabular-nums">
              {formatTime(restSeconds)}
            </p>
          </div>
        </div>

        {/* Start */}
        <button
          onClick={startWorkout}
          className="mt-5 w-full rounded-3xl bg-white px-6 py-5 text-xl font-bold text-zinc-950 shadow-lg transition hover:bg-zinc-200 active:scale-[0.98]"
        >
          Start Workout
        </button>

        <p className="mt-4 text-center text-xs text-zinc-600">
          Audio cues will announce each interval
        </p>
      </div>
    </main>
  );
}