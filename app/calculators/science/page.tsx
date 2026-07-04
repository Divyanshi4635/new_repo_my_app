"use client";

import { useState } from "react";
import { PageShell } from "@/components/PageShell";
import { MascotBubble } from "@/components/Mascot";
import { CalcScreen } from "@/components/calc/CalcScreen";
import { CalcKey } from "@/components/calc/CalcKey";
import { getTheme } from "@/lib/theme";
import { useSound } from "@/components/SoundProvider";
import { playTap, playSuccess, playOops } from "@/lib/sound";
import { fireConfetti } from "@/lib/confetti";

const theme = getTheme("science");

const REACTIONS = [
  "Eureka! Science says yes! 🧪",
  "Bubbling with correctness! 🫧",
  "That's a lab-approved result! 🥽",
  "Reaction complete! 💥",
];

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
    case "xʸ":
      return Math.pow(a, b);
    default:
      return b;
  }
}

export default function ScienceLab() {
  const { enabled } = useSound();
  const [display, setDisplay] = useState("0");
  const [prev, setPrev] = useState<number | null>(null);
  const [operator, setOperator] = useState<string | null>(null);
  const [waiting, setWaiting] = useState(false);
  const [expression, setExpression] = useState("");
  const [memory, setMemory] = useState(0);
  const [isDeg, setIsDeg] = useState(true);
  const [mascotMsg, setMascotMsg] = useState(
    "Let's mix some numbers in the lab! Toggle DEG/RAD anytime. 🔬"
  );
  const [mood, setMood] = useState<"happy" | "excited" | "thinking">("happy");

  const beep = () => enabled && playTap();
  const toRad = (v: number) => (isDeg ? (v * Math.PI) / 180 : v);

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
    setMascotMsg("Beakers rinsed! Ready for a new experiment. ✨");
  }

  function backspace() {
    beep();
    setDisplay((d) => (d.length > 1 ? d.slice(0, -1) : "0"));
  }

  function applyUnary(fn: (n: number) => number, label: string) {
    beep();
    const value = parseFloat(display);
    const result = fn(value);
    if (Number.isNaN(result) || !Number.isFinite(result)) {
      if (enabled) playOops();
      setDisplay("Oops!");
      setMascotMsg("That reaction went unstable! Try a different number. 💥");
      setWaiting(true);
      return;
    }
    setExpression(`${label}(${value})`);
    setDisplay(String(Math.round(result * 1e10) / 1e10));
    setWaiting(true);
    setMood("thinking");
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
      setMascotMsg("Careful — dividing by zero causes a lab explosion! 🧨");
      setExpression(finalExpression);
      setPrev(null);
      setOperator(null);
      setWaiting(true);
      return;
    }

    setDisplay(String(Math.round(result * 1e10) / 1e10));
    setExpression(finalExpression);
    setPrev(null);
    setOperator(null);
    setWaiting(true);
    setMood("excited");
    if (enabled) playSuccess();
    fireConfetti(["#34d399", "#2dd4bf", "#22d3ee"]);
    setMascotMsg(REACTIONS[Math.floor(Math.random() * REACTIONS.length)]);
  }

  return (
    <PageShell theme={theme}>
      <div className="mx-auto max-w-lg">
        <div className="mb-6">
          <MascotBubble text={mascotMsg} mood={mood} />
        </div>

        <div className="rounded-3xl bg-white/70 p-4 shadow-xl backdrop-blur">
          <div className="mb-3 flex items-center justify-between">
            <button
              type="button"
              onClick={() => setIsDeg((d) => !d)}
              className={`rounded-full px-4 py-1.5 text-sm font-bold text-white shadow bg-gradient-to-r ${theme.gradient}`}
            >
              {isDeg ? "DEG" : "RAD"}
            </button>
            <span className="text-sm text-slate-500">
              M: {Math.round(memory * 1000) / 1000}
            </span>
          </div>

          <CalcScreen expression={expression} value={display} />

          <div className="mt-4 grid grid-cols-5 gap-2">
            <CalcKey
              label="sin"
              variant="action"
              onClick={() => applyUnary((v) => Math.sin(toRad(v)), "sin")}
            />
            <CalcKey
              label="cos"
              variant="action"
              onClick={() => applyUnary((v) => Math.cos(toRad(v)), "cos")}
            />
            <CalcKey
              label="tan"
              variant="action"
              onClick={() => applyUnary((v) => Math.tan(toRad(v)), "tan")}
            />
            <CalcKey
              label="√x"
              variant="action"
              onClick={() => applyUnary((v) => Math.sqrt(v), "√")}
            />
            <CalcKey label="AC" variant="action" onClick={clearAll} />

            <CalcKey
              label="log"
              variant="action"
              onClick={() => applyUnary((v) => Math.log10(v), "log")}
            />
            <CalcKey
              label="ln"
              variant="action"
              onClick={() => applyUnary((v) => Math.log(v), "ln")}
            />
            <CalcKey
              label="x²"
              variant="action"
              onClick={() => applyUnary((v) => v * v, "sq")}
            />
            <CalcKey
              label="xʸ"
              variant="op"
              className={theme.text}
              onClick={() => chooseOperator("xʸ")}
            />
            <CalcKey label="⌫" variant="action" onClick={backspace} />

            <CalcKey
              label="π"
              variant="action"
              onClick={() => {
                beep();
                setDisplay(String(Math.PI));
                setWaiting(true);
              }}
            />
            <CalcKey label="7" onClick={() => inputDigit("7")} />
            <CalcKey label="8" onClick={() => inputDigit("8")} />
            <CalcKey label="9" onClick={() => inputDigit("9")} />
            <CalcKey
              label="÷"
              variant="op"
              className={theme.text}
              onClick={() => chooseOperator("÷")}
            />

            <CalcKey
              label="M+"
              variant="action"
              onClick={() => {
                beep();
                setMemory((m) => m + parseFloat(display));
              }}
            />
            <CalcKey label="4" onClick={() => inputDigit("4")} />
            <CalcKey label="5" onClick={() => inputDigit("5")} />
            <CalcKey label="6" onClick={() => inputDigit("6")} />
            <CalcKey
              label="×"
              variant="op"
              className={theme.text}
              onClick={() => chooseOperator("×")}
            />

            <CalcKey
              label="MR"
              variant="action"
              onClick={() => {
                beep();
                setDisplay(String(memory));
                setWaiting(true);
              }}
            />
            <CalcKey label="1" onClick={() => inputDigit("1")} />
            <CalcKey label="2" onClick={() => inputDigit("2")} />
            <CalcKey label="3" onClick={() => inputDigit("3")} />
            <CalcKey
              label="−"
              variant="op"
              className={theme.text}
              onClick={() => chooseOperator("−")}
            />

            <CalcKey
              label="MC"
              variant="action"
              onClick={() => {
                beep();
                setMemory(0);
              }}
            />
            <CalcKey label="0" onClick={() => inputDigit("0")} />
            <CalcKey label="." onClick={inputDecimal} />
            <CalcKey
              label="+"
              variant="op"
              className={theme.text}
              onClick={() => chooseOperator("+")}
            />
            <CalcKey
              label="="
              variant="equals"
              equalsClassName={`bg-gradient-to-br ${theme.gradient}`}
              onClick={handleEquals}
            />
          </div>
        </div>
      </div>
    </PageShell>
  );
}
