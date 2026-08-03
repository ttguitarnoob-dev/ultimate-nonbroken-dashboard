"use client";

import { useCallback, useEffect, useRef, useState } from "react";

type TimeUnit = "seconds" | "minutes";

type WorkoutPhase = "set" | "rest";

type WorkoutSet = {
  id: string;
  name: string;
  duration: number;
  unit: TimeUnit;
  reps: number;
};

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

const createSet = (): WorkoutSet => ({
  id: crypto.randomUUID(),
  name: "",
  duration: 10,
  unit: "seconds",
  reps: 1,
});

export default function WorkoutTimer() {
  /*
   * ------------------------------------------------------------
   * Workout configuration
   * ------------------------------------------------------------
   */

  const [sets, setSets] = useState<WorkoutSet[]>([
    {
      id: crypto.randomUUID(),
      name: "Set 1",
      duration: 10,
      unit: "seconds",
      reps: 1,
    },
  ]);

  const [restValue, setRestValue] = useState(50);
  const [restUnit, setRestUnit] =
    useState<TimeUnit>("seconds");

  /*
   * ------------------------------------------------------------
   * Workout state
   * ------------------------------------------------------------
   */

  const [isRunning, setIsRunning] = useState(false);

  const [phase, setPhase] =
    useState<WorkoutPhase>("set");

  const [currentSetIndex, setCurrentSetIndex] =
    useState(0);

  const [currentRep, setCurrentRep] =
    useState(1);

  const [phaseRemaining, setPhaseRemaining] =
    useState(10);

  const [totalElapsed, setTotalElapsed] =
    useState(0);

  /*
   * ------------------------------------------------------------
   * Timer refs
   * ------------------------------------------------------------
   */

  const intervalRef =
    useRef<NodeJS.Timeout | null>(null);

  const phaseStartRef =
    useRef<number>(0);

  const workoutStartRef =
    useRef<number>(0);

  const phaseDurationRef =
    useRef<number>(10);

  /*
   * Tracks which countdown number has already
   * been announced.
   */
  const lastCountdownRef =
    useRef<number | null>(null);

  /*
   * ------------------------------------------------------------
   * Audio
   * ------------------------------------------------------------
   */

  const speak = useCallback((message: string) => {
    if (typeof window === "undefined") return;

    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();

      const utterance =
        new SpeechSynthesisUtterance(message);

      utterance.rate = 1;
      utterance.pitch = 1;
      utterance.volume = 1;

      window.speechSynthesis.speak(
        utterance
      );
    }
  }, []);

  const beep = useCallback(
    (frequency = 880) => {
      if (typeof window === "undefined")
        return;

      try {
        const AudioContextClass =
          window.AudioContext ||
          (window as typeof window & {
            webkitAudioContext?: typeof AudioContext;
          }).webkitAudioContext;

        if (!AudioContextClass) return;

        const context =
          new AudioContextClass();

        const oscillator =
          context.createOscillator();

        const gain =
          context.createGain();

        oscillator.frequency.value =
          frequency;

        oscillator.type = "sine";

        gain.gain.setValueAtTime(
          0.3,
          context.currentTime
        );

        gain.gain.exponentialRampToValueAtTime(
          0.001,
          context.currentTime + 0.25
        );

        oscillator.connect(gain);
        gain.connect(
          context.destination
        );

        oscillator.start();

        oscillator.stop(
          context.currentTime + 0.25
        );
      } catch {
        // Audio isn't available. That's okay.
      }
    },
    []
  );

  /*
   * ------------------------------------------------------------
   * Set helpers
   * ------------------------------------------------------------
   */

  const addSet = () => {
    setSets((current) => [
      ...current,
      {
        ...createSet(),
        name: `Set ${current.length + 1}`,
      },
    ]);
  };

  const removeSet = (id: string) => {
    setSets((current) => {
      if (current.length <= 1) {
        return current;
      }

      return current.filter(
        (set) => set.id !== id
      );
    });
  };

  const updateSet = (
    id: string,
    updates: Partial<WorkoutSet>
  ) => {
    setSets((current) =>
      current.map((set) =>
        set.id === id
          ? {
              ...set,
              ...updates,
            }
          : set
      )
    );
  };

  /*
   * ------------------------------------------------------------
   * Start workout
   * ------------------------------------------------------------
   */

  const startWorkout = useCallback(() => {
    if (sets.length === 0) return;

    const firstSet = sets[0];

    const firstDuration =
      toSeconds(
        firstSet.duration,
        firstSet.unit
      );

    const now = Date.now();

    workoutStartRef.current = now;

    phaseStartRef.current = now;

    phaseDurationRef.current =
      firstDuration;

    lastCountdownRef.current = null;

    setCurrentSetIndex(0);

    setCurrentRep(1);

    setPhase("set");

    setPhaseRemaining(
      firstDuration
    );

    setTotalElapsed(0);

    setIsRunning(true);

    /*
     * Immediate start announcement.
     */

    beep();

    setTimeout(() => {
      speak(
        `${firstSet.name}, rep 1`
      );
    }, 150);
  }, [sets, beep, speak]);

  /*
   * ------------------------------------------------------------
   * Stop workout
   * ------------------------------------------------------------
   */

  const stopWorkout = useCallback(() => {
    setIsRunning(false);

    if (intervalRef.current) {
      clearInterval(
        intervalRef.current
      );

      intervalRef.current = null;
    }

    if (
      typeof window !== "undefined"
    ) {
      window.speechSynthesis?.cancel();
    }

    lastCountdownRef.current = null;
  }, []);

  /*
   * ------------------------------------------------------------
   * Reset workout
   * ------------------------------------------------------------
   */

  const resetWorkout = useCallback(() => {
    stopWorkout();

    const firstSet = sets[0];

    if (!firstSet) return;

    const firstDuration =
      toSeconds(
        firstSet.duration,
        firstSet.unit
      );

    setCurrentSetIndex(0);

    setCurrentRep(1);

    setPhase("set");

    setPhaseRemaining(
      firstDuration
    );

    setTotalElapsed(0);
  }, [sets, stopWorkout]);

  /*
   * ------------------------------------------------------------
   * Main timer
   * ------------------------------------------------------------
   */

  useEffect(() => {
    if (!isRunning) return;

    intervalRef.current =
      setInterval(() => {
        const now = Date.now();

        const elapsed =
          Math.floor(
            (now -
              workoutStartRef.current) /
              1000
          );

        const phaseElapsed =
          Math.floor(
            (now -
              phaseStartRef.current) /
              1000
          );

        const remaining =
          Math.max(
            0,
            phaseDurationRef.current -
              phaseElapsed
          );

        setTotalElapsed(elapsed);

        setPhaseRemaining(
          remaining
        );

        /*
         * --------------------------------------------------------
         * Five-second countdown
         *
         * Always just:
         *
         * 5
         * 4
         * 3
         * 2
         * 1
         * --------------------------------------------------------
         */

        if (
          remaining <= 5 &&
          remaining > 0 &&
          lastCountdownRef.current !==
            remaining
        ) {
          lastCountdownRef.current =
            remaining;

          beep(
            remaining === 1
              ? 1100
              : 700
          );

          setTimeout(() => {
            speak(
              remaining.toString()
            );
          }, 50);
        }

        /*
         * --------------------------------------------------------
         * Phase transition
         * --------------------------------------------------------
         */

        if (
          phaseElapsed >=
          phaseDurationRef.current
        ) {
          lastCountdownRef.current =
            null;

          /*
           * ======================================================
           * SET -> REST
           * ======================================================
           *
           * Every rep gets its own rest period.
           */

          if (phase === "set") {
            const currentSet =
              sets[currentSetIndex];

            if (!currentSet) return;

            const restSeconds =
              toSeconds(
                restValue,
                restUnit
              );

            phaseStartRef.current =
              now;

            phaseDurationRef.current =
              restSeconds;

            setPhase("rest");

            setPhaseRemaining(
              restSeconds
            );

            beep(500);

            setTimeout(() => {
              speak("Rest");
            }, 100);

            return;
          }

          /*
           * ======================================================
           * REST -> NEXT REP OR NEXT SET
           * ======================================================
           */

          const currentSet =
            sets[currentSetIndex];

          if (!currentSet) return;

          /*
           * ------------------------------------------------------
           * More reps in the current set
           * ------------------------------------------------------
           */

          if (
            currentRep <
            currentSet.reps
          ) {
            const nextRep =
              currentRep + 1;

            const nextDuration =
              toSeconds(
                currentSet.duration,
                currentSet.unit
              );

            phaseStartRef.current =
              now;

            phaseDurationRef.current =
              nextDuration;

            setCurrentRep(
              nextRep
            );

            setPhase("set");

            setPhaseRemaining(
              nextDuration
            );

            beep(1000);

            setTimeout(() => {
              speak(
                `${currentSet.name}, rep ${nextRep}`
              );
            }, 100);

            return;
          }

          /*
           * ------------------------------------------------------
           * Current set is complete.
           *
           * Move to the next set.
           * ------------------------------------------------------
           */

          const nextSetIndex =
            currentSetIndex + 1;

          /*
           * No more sets.
           *
           * Workout is complete.
           */

          if (
            nextSetIndex >=
            sets.length
          ) {
            stopWorkout();

            setPhaseRemaining(0);

            beep(1200);

            setTimeout(() => {
              speak(
                "Workout complete"
              );
            }, 100);

            return;
          }

          /*
           * ------------------------------------------------------
           * Start next set, rep 1
           * ------------------------------------------------------
           */

          const nextSet =
            sets[nextSetIndex];

          const nextDuration =
            toSeconds(
              nextSet.duration,
              nextSet.unit
            );

          phaseStartRef.current =
            now;

          phaseDurationRef.current =
            nextDuration;

          setCurrentSetIndex(
            nextSetIndex
          );

          setCurrentRep(1);

          setPhase("set");

          setPhaseRemaining(
            nextDuration
          );

          beep(1000);

          setTimeout(() => {
            speak(
              `${nextSet.name}, rep 1`
            );
          }, 100);
        }
      }, 100);

    return () => {
      if (intervalRef.current) {
        clearInterval(
          intervalRef.current
        );

        intervalRef.current = null;
      }
    };
  }, [
    isRunning,
    phase,
    currentSetIndex,
    currentRep,
    sets,
    restValue,
    restUnit,
    speak,
    beep,
    stopWorkout,
  ]);

  /*
   * ------------------------------------------------------------
   * Derived values
   * ------------------------------------------------------------
   */

  const currentSet =
    sets[currentSetIndex];

  const currentSetSeconds =
    currentSet
      ? toSeconds(
          currentSet.duration,
          currentSet.unit
        )
      : 0;

  const restSeconds =
    toSeconds(
      restValue,
      restUnit
    );

  const progress =
    phaseDurationRef.current > 0
      ? ((phaseDurationRef.current -
          phaseRemaining) /
          phaseDurationRef.current) *
        100
      : 0;

  /*
   * ============================================================
   * ACTIVE WORKOUT
   * ============================================================
   */

  if (isRunning) {
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
              {formatTime(
                totalElapsed
              )}
            </div>
          </div>

          {/* Current set */}

          <div className="mt-8 text-center">
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-zinc-600">
              Set {currentSetIndex + 1}{" "}
              of {sets.length}
            </p>

            <h2 className="mt-2 text-2xl font-bold">
              {phase === "set"
                ? currentSet?.name
                : "Rest"}
            </h2>

            {phase === "set" &&
              currentSet && (
                <p className="mt-2 text-sm text-zinc-500">
                  Rep {currentRep} of{" "}
                  {currentSet.reps}
                </p>
              )}
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
              {formatTime(
                phaseRemaining
              )}
            </div>

            <p className="mt-6 text-center text-lg text-zinc-500">
              {phase === "set"
                ? "Hang on"
                : "Rest"}
            </p>

            {/* Progress */}

            <div className="mt-10 w-full max-w-md">
              <div className="h-2 overflow-hidden rounded-full bg-zinc-800">
                <div
                  className="h-full rounded-full bg-white transition-[width] duration-100"
                  style={{
                    width: `${progress}%`,
                  }}
                />
              </div>
            </div>
          </div>

          {/* Upcoming */}

          <div className="mb-4 rounded-2xl bg-zinc-900 p-4 text-center">
            <p className="text-xs uppercase tracking-wider text-zinc-500">
              Up next
            </p>

            <p className="mt-1 font-medium">
              {phase === "set"
                ? "Rest"
                : currentSet &&
                    currentRep <
                      currentSet.reps
                  ? `${currentSet.name} • Rep ${
                      currentRep + 1
                    }`
                  : currentSetIndex + 1 <
                      sets.length
                    ? sets[
                        currentSetIndex + 1
                      ].name
                    : "Workout complete"}
            </p>
          </div>

          {/* Footer */}

          <div className="grid grid-cols-2 gap-3 pb-4">

            <div className="rounded-2xl bg-zinc-900 p-4 text-center">
              <p className="text-xs uppercase tracking-wider text-zinc-500">
                Current
              </p>

              <p className="mt-1 font-mono text-xl tabular-nums">
                {formatTime(
                  phase === "set"
                    ? currentSetSeconds
                    : restSeconds
                )}
              </p>
            </div>

            <div className="rounded-2xl bg-zinc-900 p-4 text-center">
              <p className="text-xs uppercase tracking-wider text-zinc-500">
                Remaining
              </p>

              <p className="mt-1 font-mono text-xl tabular-nums">
                {formatTime(
                  phaseRemaining
                )}
              </p>
            </div>

          </div>
        </div>
      </main>
    );
  }

  /*
   * ============================================================
   * WORKOUT SETUP
   * ============================================================
   */

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
            Build your workout, then let the
            timer handle the transitions.
          </p>
        </div>

        {/* Sets */}

        <div className="mt-10">

          <div className="mb-4 flex items-end justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">
                Workout
              </p>

              <h2 className="mt-1 text-xl font-semibold">
                Sets
              </h2>
            </div>

            <span className="text-sm text-zinc-600">
              {sets.length}{" "}
              {sets.length === 1
                ? "set"
                : "sets"}
            </span>
          </div>

          <div className="space-y-3">

            {sets.map(
              (set, index) => (
                <section
                  key={set.id}
                  className="rounded-3xl border border-zinc-800 bg-zinc-900 p-5"
                >

                  <div className="mb-4 flex items-center justify-between">
                    <span className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">
                      Set {index + 1}
                    </span>

                    {sets.length > 1 && (
                      <button
                        onClick={() =>
                          removeSet(
                            set.id
                          )
                        }
                        className="rounded-full px-3 py-1 text-xs font-medium text-zinc-500 transition hover:bg-zinc-800 hover:text-red-400"
                      >
                        Remove
                      </button>
                    )}
                  </div>

                  {/* Name */}

                  <input
                    type="text"
                    value={set.name}
                    placeholder="Set name"
                    onChange={(e) =>
                      updateSet(
                        set.id,
                        {
                          name: e.target
                            .value,
                        }
                      )
                    }
                    className="w-full rounded-2xl border border-zinc-700 bg-zinc-950 px-5 py-4 text-xl font-semibold outline-none transition placeholder:text-zinc-700 focus:border-zinc-400"
                  />

                  {/* Duration + Reps */}

                  <div className="mt-3 grid grid-cols-2 gap-3">

                    {/* Duration */}

                    <div>
                      <label className="mb-2 block text-xs font-medium uppercase tracking-wider text-zinc-600">
                        Hang
                      </label>

                      <div className="grid grid-cols-[1fr_auto] gap-2">

                        <input
                          type="number"
                          min={1}
                          value={
                            set.duration
                          }
                          onChange={(e) =>
                            updateSet(
                              set.id,
                              {
                                duration:
                                  Math.max(
                                    1,
                                    Number(
                                      e
                                        .target
                                        .value
                                    )
                                  ),
                              }
                            )
                          }
                          className="min-w-0 w-full rounded-2xl border border-zinc-700 bg-zinc-950 px-4 py-4 text-2xl font-semibold outline-none transition focus:border-zinc-400"
                        />

                        <select
                          value={
                            set.unit
                          }
                          onChange={(e) =>
                            updateSet(
                              set.id,
                              {
                                unit: e
                                  .target
                                  .value as TimeUnit,
                              }
                            )
                          }
                          className="rounded-2xl border border-zinc-700 bg-zinc-950 px-3 text-sm font-medium outline-none focus:border-zinc-400"
                        >
                          <option value="seconds">
                            Sec
                          </option>

                          <option value="minutes">
                            Min
                          </option>
                        </select>

                      </div>
                    </div>

                    {/* Reps */}

                    <div>
                      <label className="mb-2 block text-xs font-medium uppercase tracking-wider text-zinc-600">
                        Reps
                      </label>

                      <input
                        type="number"
                        min={1}
                        value={set.reps}
                        onChange={(e) =>
                          updateSet(
                            set.id,
                            {
                              reps: Math.max(
                                1,
                                Number(
                                  e
                                    .target
                                    .value
                                )
                              ),
                            }
                          )
                        }
                        className="w-full rounded-2xl border border-zinc-700 bg-zinc-950 px-4 py-4 text-2xl font-semibold outline-none transition focus:border-zinc-400"
                      />
                    </div>
                  </div>

                  {/* Set summary */}

                  <div className="mt-4 flex items-center justify-between border-t border-zinc-800 pt-3 text-sm">
                    <span className="text-zinc-600">
                      Work
                    </span>

                    <span className="font-mono text-zinc-400 tabular-nums">
                      {formatTime(
                        toSeconds(
                          set.duration,
                          set.unit
                        ) *
                          set.reps
                      )}
                    </span>
                  </div>

                </section>
              )
            )}

          </div>

          {/* Add set */}

          <button
            onClick={addSet}
            className="mt-3 w-full rounded-2xl border border-dashed border-zinc-700 px-5 py-4 text-sm font-semibold text-zinc-400 transition hover:border-zinc-500 hover:bg-zinc-900 hover:text-white active:scale-[0.99]"
          >
            + Add Set
          </button>
        </div>

        {/* Rest */}

        <section className="mt-5 rounded-3xl border border-zinc-800 bg-zinc-900 p-5 sm:p-6">

          <div className="mb-5">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">
              Recovery
            </p>

            <h2 className="mt-1 text-xl font-semibold">
              Rest after every rep
            </h2>

            <p className="mt-1 text-sm text-zinc-600">
              Applies between every hang, including
              between reps of the same set.
            </p>
          </div>

          <div className="grid grid-cols-[1fr_auto] gap-3">

            <input
              type="number"
              min={1}
              value={restValue}
              onChange={(e) =>
                setRestValue(
                  Math.max(
                    1,
                    Number(
                      e.target.value
                    )
                  )
                )
              }
              className="w-full rounded-2xl border border-zinc-700 bg-zinc-950 px-5 py-4 text-3xl font-semibold outline-none transition focus:border-zinc-400"
            />

            <select
              value={restUnit}
              onChange={(e) =>
                setRestUnit(
                  e.target
                    .value as TimeUnit
                )
              }
              className="rounded-2xl border border-zinc-700 bg-zinc-950 px-4 text-base font-medium outline-none focus:border-zinc-400"
            >
              <option value="seconds">
                Seconds
              </option>

              <option value="minutes">
                Minutes
              </option>
            </select>

          </div>
        </section>

        {/* Workout summary */}

        <div className="mt-5 rounded-2xl bg-zinc-900 p-4">

          <div className="flex items-center justify-between">
            <span className="text-sm text-zinc-500">
              Work
            </span>

            <span className="font-mono text-sm tabular-nums">
              {formatTime(
                sets.reduce(
                  (total, set) =>
                    total +
                    toSeconds(
                      set.duration,
                      set.unit
                    ) *
                      set.reps,
                  0
                )
              )}
            </span>
          </div>

          <div className="mt-2 flex items-center justify-between">
            <span className="text-sm text-zinc-500">
              Rest
            </span>

            <span className="font-mono text-sm tabular-nums">
              {formatTime(
                restSeconds *
                  sets.reduce(
                    (total, set) =>
                      total +
                      set.reps,
                    0
                  )
              )}
            </span>
          </div>

          <div className="mt-2 flex items-center justify-between border-t border-zinc-800 pt-2">
            <span className="font-medium">
              Total
            </span>

            <span className="font-mono font-medium tabular-nums">
              {formatTime(
                sets.reduce(
                  (total, set) =>
                    total +
                    toSeconds(
                      set.duration,
                      set.unit
                    ) *
                      set.reps,
                  0
                ) +
                  restSeconds *
                    sets.reduce(
                      (total, set) =>
                        total +
                        set.reps,
                      0
                    )
              )}
            </span>
          </div>

        </div>

        {/* Start */}

        <button
          onClick={startWorkout}
          disabled={
            sets.length === 0 ||
            sets.some(
              (set) =>
                !set.name.trim() ||
                set.duration <= 0 ||
                set.reps <= 0
            )
          }
          className="mt-5 w-full rounded-3xl bg-white px-6 py-5 text-xl font-bold text-zinc-950 shadow-lg transition hover:bg-zinc-200 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-30"
        >
          Start Workout
        </button>

        <p className="mt-4 pb-6 text-center text-xs text-zinc-600">
          Audio cues will announce sets, reps,
          and transitions
        </p>

      </div>
    </main>
  );
}