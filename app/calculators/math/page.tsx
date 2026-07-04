"use client";

import { useState } from "react";
import { PageShell } from "@/components/PageShell";
import { MascotBubble } from "@/components/Mascot";
import { CalcScreen } from "@/components/calc/CalcScreen";
import { CalcKey } from "@/components/calc/CalcKey";
import { getTheme } from "@/lib/theme";
import { useSound } from "@/components/SoundProvider";
import { useStreak } from "@/components/StreakProvider";
import { playTap, playSuccess, playOops } from "@/lib/sound";
import { fireConfetti } from "@/lib/confetti";
import { logCalculation } from "@/lib/db/actions";
import { HistoryPanel } from "@/components/calc/HistoryPanel";

const theme = getTheme("math");

const CHEERS = [
  "Boom! You crunched it! 🚀",
  "Whoa, nice math muscles! 💪",
  "You're on fire today! 🔥",
  "Correctamundo! ✅",
  "Number ninja skills, activated! 🥷",
];

const FUN_FACTS: Record<string, string> = {
  "7": "Fun fact: 7 is the world's favorite number! 🍀",
  "42": "42 is 'the answer to life, the universe & everything'! 🌌",
  "100": "A perfect 100! Straight-A energy! 🎓",
  "0": "Zero: the number that means nothing... and everything! ⭕",
  "3.14": "Ooh, that's Pi-flavored! 🥧",
};

function operate(a: number, b: number, op: string): number {
  switch (op) {
    case "+":
      return a + b;
    case "−":
      return a - b;
    case "×":
      return a * b;
    case "÷":
      return b === 0 ? NaN : a / b;
    default:
      return b;
  }
}

export default function MathBlaster() {
  const { enabled } = useSound();
  const { bump } = useStreak();
  const [display, setDisplay] = useState("0");
  const [prev, setPrev] = useState<number | null>(null);
  const [operator, setOperator] = useState<string | null>(null);
  const [waiting, setWaiting] = useState(false);
  const [expression, setExpression] = useState("");
  const [mascotMsg, setMascotMsg] = useState("Type a sum and I'll cheer you on! 🎉");
  const [mood, setMood] = useState<"happy" | "excited" | "thinking">("happy");
  const [historyTick, setHistoryTick] = useState(0);

  const beep = () => enabled && playTap();

  function inputDigit(digit: string) {
    beep();
    if (waiting) {
      setDisplay(digit);
      setWaiting(false);
      return;
    }
    setDisplay(display === "0" ? digit : display + digit);
  }

  function inputDecimal() {
    beep();
    if (waiting) {
      setDisplay("0.");
      setWaiting(false);
      return;
    }
    if (!display.includes(".")) setDisplay(display + ".");
  }

  function clearAll() {
    beep();
    setDisplay("0");
    setPrev(null);
    setOperator(null);
    setWaiting(false);
    setExpression("");
    setMood("happy");
    setMascotMsg("Fresh start! What shall we calculate? ✨");
  }

  function backspace() {
    beep();
    setDisplay((d) => (d.length > 1 ? d.slice(0, -1) : "0"));
  }

  function toggleSign() {
    beep();
    setDisplay((d) => (d.startsWith("-") ? d.slice(1) : d === "0" ? d : "-" + d));
  }

  function percent() {
    beep();
    setDisplay((d) => String(parseFloat(d) / 100));
  }

  function chooseOperator(nextOp: string) {
    beep();
    const inputValue = parseFloat(display);
    if (prev !== null && operator && !waiting) {
      const result = operate(prev, inputValue, operator);
      setDisplay(String(result));
      setPrev(result);
      setExpression(`${result} ${nextOp}`);
    } else {
      setPrev(inputValue);
      setExpression(`${inputValue} ${nextOp}`);
    }
    setOperator(nextOp);
    setWaiting(true);
    setMood("thinking");
  }

  function handleEquals() {
    if (operator === null || prev === null) return;
    const inputValue = parseFloat(display);
    const result = operate(prev, inputValue, operator);
    const finalExpression = `${prev} ${operator} ${inputValue} =`;

    if (Number.isNaN(result) || !Number.isFinite(result)) {
      if (enabled) playOops();
      setDisplay("Oops!");
      setMood("thinking");
      setMascotMsg("Uh-oh, dividing by zero opens a black hole! Try again. 🕳️");
      setExpression(finalExpression);
      setPrev(null);
      setOperator(null);
      setWaiting(true);
      return;
    }

    const resultStr = String(Math.round(result * 1e10) / 1e10);
    setDisplay(resultStr);
    setExpression(finalExpression);
    setPrev(null);
    setOperator(null);
    setWaiting(true);
    setMood("excited");

    if (enabled) playSuccess();
    fireConfetti();

    const fact = FUN_FACTS[resultStr];
    setMascotMsg(fact ?? CHEERS[Math.floor(Math.random() * CHEERS.length)]);

    bump();
    logCalculation("math", finalExpression.replace(/ =$/, ""), resultStr).then(() =>
      setHistoryTick((t) => t + 1)
    );
  }

  return (
    <PageShell theme={theme}>
      <div className="mx-auto max-w-md">
        <div className="mb-6">
          <MascotBubble text={mascotMsg} mood={mood} />
        </div>

        <div className="rounded-3xl bg-white/70 p-4 shadow-xl backdrop-blur">
          <CalcScreen expression={expression} value={display} />

          <div className="mt-4 grid grid-cols-4 gap-3">
            <CalcKey label="AC" variant="action" onClick={clearAll} />
            <CalcKey label="±" variant="action" onClick={toggleSign} />
            <CalcKey label="%" variant="action" onClick={percent} />
            <CalcKey
              label="÷"
              variant="op"
              onClick={() => chooseOperator("÷")}
              className={theme.text}
            />

            <CalcKey label="7" onClick={() => inputDigit("7")} />
            <CalcKey label="8" onClick={() => inputDigit("8")} />
            <CalcKey label="9" onClick={() => inputDigit("9")} />
            <CalcKey
              label="×"
              variant="op"
              onClick={() => chooseOperator("×")}
              className={theme.text}
            />

            <CalcKey label="4" onClick={() => inputDigit("4")} />
            <CalcKey label="5" onClick={() => inputDigit("5")} />
            <CalcKey label="6" onClick={() => inputDigit("6")} />
            <CalcKey
              label="−"
              variant="op"
              onClick={() => chooseOperator("−")}
              className={theme.text}
            />

            <CalcKey label="1" onClick={() => inputDigit("1")} />
            <CalcKey label="2" onClick={() => inputDigit("2")} />
            <CalcKey label="3" onClick={() => inputDigit("3")} />
            <CalcKey
              label="+"
              variant="op"
              onClick={() => chooseOperator("+")}
              className={theme.text}
            />

            <CalcKey label="⌫" variant="action" onClick={backspace} />
            <CalcKey label="0" onClick={() => inputDigit("0")} />
            <CalcKey label="." onClick={inputDecimal} />
            <CalcKey
              label="="
              variant="equals"
              equalsClassName={`bg-gradient-to-br ${theme.gradient}`}
              onClick={handleEquals}
            />
          </div>
        </div>

        <HistoryPanel calculator="math" refreshKey={historyTick} theme={theme} />
      </div>
    </PageShell>
  );
}
