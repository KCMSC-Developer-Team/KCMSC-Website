"use client";

import { useEffect, useMemo, useState } from "react";
import type { Locale } from "@/i18n/config";
import {
  FiBookOpen,
  FiCheckCircle,
  FiChevronRight,
  FiRefreshCw,
  FiX,
} from "react-icons/fi";

type Question = {
  category: string;
  question: string;
  options: string[];
  answer: number;
  fact: string;
};

const bank: Question[] = [
  {
    category: "Science",
    question: "Which planet is known as the Red Planet?",
    options: ["Venus", "Mars", "Jupiter", "Mercury"],
    answer: 1,
    fact: "Iron-rich dust gives Mars its familiar reddish appearance.",
  },
  {
    category: "Science",
    question: "What is the chemical symbol for gold?",
    options: ["Ag", "Gd", "Au", "Go"],
    answer: 2,
    fact: "Au comes from the Latin word aurum.",
  },
  {
    category: "Science",
    question: "Which gas do plants absorb during photosynthesis?",
    options: ["Oxygen", "Nitrogen", "Carbon dioxide", "Hydrogen"],
    answer: 2,
    fact: "Plants use carbon dioxide, water and light to make sugars.",
  },
  {
    category: "Science",
    question: "What is the SI unit of electric current?",
    options: ["Volt", "Ampere", "Ohm", "Watt"],
    answer: 1,
    fact: "The ampere is named after physicist André-Marie Ampère.",
  },
  {
    category: "Science",
    question: "Which part of a cell contains most of its genetic material?",
    options: ["Nucleus", "Cell membrane", "Ribosome", "Cytoplasm"],
    answer: 0,
    fact: "In eukaryotic cells, most DNA is stored in the nucleus.",
  },
  {
    category: "Science",
    question: "At sea level, water boils at what temperature in Celsius?",
    options: ["90°C", "100°C", "110°C", "120°C"],
    answer: 1,
    fact: "Boiling point changes with atmospheric pressure.",
  },
  {
    category: "Science",
    question: "Which force keeps planets in orbit around the Sun?",
    options: ["Friction", "Magnetism", "Gravity", "Buoyancy"],
    answer: 2,
    fact: "Gravity continually changes a planet's direction as it moves.",
  },
  {
    category: "Science",
    question: "What is the largest organ of the human body?",
    options: ["Liver", "Brain", "Skin", "Lung"],
    answer: 2,
    fact: "Skin protects the body and helps regulate temperature.",
  },
  {
    category: "Science",
    question: "Which particle has a negative electric charge?",
    options: ["Proton", "Neutron", "Electron", "Photon"],
    answer: 2,
    fact: "Electrons carry negative charge; protons carry positive charge.",
  },
  {
    category: "Science",
    question: "What is the approximate speed of light in a vacuum?",
    options: ["300,000 km/s", "30,000 km/s", "3,000 km/s", "3 million km/s"],
    answer: 0,
    fact: "Light travels at about 299,792 kilometres per second in a vacuum.",
  },
  {
    category: "History",
    question: "In which year did Bangladesh become independent?",
    options: ["1947", "1952", "1971", "1975"],
    answer: 2,
    fact: "Bangladesh's Liberation War took place in 1971.",
  },
  {
    category: "History",
    question: "The ancient pyramids of Giza are in which country?",
    options: ["Greece", "Egypt", "Mexico", "Iraq"],
    answer: 1,
    fact: "The Giza pyramid complex stands near Cairo, Egypt.",
  },
  {
    category: "History",
    question: "Who was the first person to walk on the Moon?",
    options: ["Yuri Gagarin", "Buzz Aldrin", "Neil Armstrong", "John Glenn"],
    answer: 2,
    fact: "Neil Armstrong stepped onto the lunar surface in July 1969.",
  },
  {
    category: "History",
    question: "The Renaissance began in which part of Europe?",
    options: ["Scandinavia", "Italy", "Ireland", "Russia"],
    answer: 1,
    fact: "Italian city-states helped spark the Renaissance in Europe.",
  },
  {
    category: "History",
    question: "Which ancient civilisation developed cuneiform writing?",
    options: ["Sumerians", "Vikings", "Aztecs", "Romans"],
    answer: 0,
    fact: "Cuneiform emerged in ancient Mesopotamia.",
  },
  {
    category: "History",
    question:
      "The Language Movement in what year is commemorated on 21 February?",
    options: ["1948", "1952", "1966", "1971"],
    answer: 1,
    fact: "21 February is observed internationally as International Mother Language Day.",
  },
  {
    category: "Geography",
    question: "What is the largest ocean on Earth?",
    options: ["Atlantic", "Indian", "Arctic", "Pacific"],
    answer: 3,
    fact: "The Pacific covers more area than any other ocean.",
  },
  {
    category: "Geography",
    question: "Which is the longest river in Bangladesh?",
    options: ["Jamuna", "Meghna", "Padma", "Karnaphuli"],
    answer: 1,
    fact: "The Meghna is commonly identified as Bangladesh's longest river system within the country.",
  },
  {
    category: "Geography",
    question: "What is the capital city of Japan?",
    options: ["Kyoto", "Osaka", "Tokyo", "Sapporo"],
    answer: 2,
    fact: "Tokyo is Japan's capital and one of the world's largest urban areas.",
  },
  {
    category: "Geography",
    question:
      "Which imaginary line divides Earth into the Northern and Southern Hemispheres?",
    options: ["Prime Meridian", "Equator", "Tropic of Cancer", "Arctic Circle"],
    answer: 1,
    fact: "The Equator is at 0 degrees latitude.",
  },
  {
    category: "Mathematics",
    question: "What is the square root of 144?",
    options: ["10", "11", "12", "14"],
    answer: 2,
    fact: "12 × 12 = 144.",
  },
  {
    category: "Mathematics",
    question:
      "What is the sum of the interior angles of a triangle in Euclidean geometry?",
    options: ["90°", "180°", "270°", "360°"],
    answer: 1,
    fact: "The interior angles of a plane triangle add up to 180 degrees.",
  },
  {
    category: "Mathematics",
    question: "If 3x = 27, what is x?",
    options: ["6", "8", "9", "12"],
    answer: 2,
    fact: "Divide both sides by 3 to get x = 9.",
  },
  {
    category: "Mathematics",
    question: "Which of these numbers is prime?",
    options: ["21", "27", "29", "33"],
    answer: 2,
    fact: "29 has exactly two positive factors: 1 and 29.",
  },
  {
    category: "Technology",
    question: "What does CPU stand for?",
    options: [
      "Central Processing Unit",
      "Computer Power Utility",
      "Core Program Upload",
      "Central Print Unit",
    ],
    answer: 0,
    fact: "The CPU executes instructions and coordinates many computer operations.",
  },
  {
    category: "Technology",
    question:
      "Which language is primarily used to structure content on web pages?",
    options: ["HTML", "SQL", "Python", "C"],
    answer: 0,
    fact: "HTML describes page structure; CSS styles it and JavaScript adds behaviour.",
  },
  {
    category: "Technology",
    question: "What does URL stand for?",
    options: [
      "Universal Reading Link",
      "Uniform Resource Locator",
      "Unified Routing List",
      "User Reference Line",
    ],
    answer: 1,
    fact: "A URL identifies the location of a resource on the web.",
  },
  {
    category: "Literature",
    question: "Who wrote the play Romeo and Juliet?",
    options: [
      "Charles Dickens",
      "William Shakespeare",
      "Jane Austen",
      "George Orwell",
    ],
    answer: 1,
    fact: "Shakespeare wrote the tragedy in the late 16th century.",
  },
  {
    category: "Literature",
    question: "Who wrote the Bengali poem collection Gitanjali?",
    options: [
      "Kazi Nazrul Islam",
      "Jibanananda Das",
      "Rabindranath Tagore",
      "Begum Rokeya",
    ],
    answer: 2,
    fact: "Rabindranath Tagore received the Nobel Prize in Literature in 1913.",
  },
  {
    category: "Environment",
    question: "Which of these is a renewable energy source?",
    options: ["Coal", "Natural gas", "Solar power", "Petroleum"],
    answer: 2,
    fact: "Solar energy is replenished by sunlight and produces electricity without direct combustion.",
  },
];

const quotes = [
  "The beautiful thing about learning is that nobody can take it away from you. — B.B. King",
  "Education is the most powerful weapon which you can use to change the world. — Nelson Mandela",
  "Live as if you were to die tomorrow. Learn as if you were to live forever. — often attributed to Mahatma Gandhi",
  "The more that you read, the more things you will know. The more that you learn, the more places you'll go. — Dr. Seuss",
  "Curiosity is the wick in the candle of learning. — William Arthur Ward",
];

function shuffle<T>(items: T[]): T[] {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const temporary = result[i]!;
    result[i] = result[j]!;
    result[j] = temporary;
  }
  return result;
}

export function KnowledgeQuiz({ locale }: { locale: Locale }) {
  const bn = locale === "bn";
  const [open, setOpen] = useState(false);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const [quote, setQuote] = useState<string>(
    quotes[0] ?? "Keep learning, one question at a time.",
  );
  const current = questions[index];
  const progress = useMemo(
    () =>
      questions.length
        ? ((index + (selected !== null ? 1 : 0)) / questions.length) * 100
        : 0,
    [index, selected, questions.length],
  );

  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  function startQuiz() {
    setQuestions(shuffle(bank).slice(0, 5));
    setIndex(0);
    setSelected(null);
    setScore(0);
    setFinished(false);
    setQuote(
      quotes[Math.floor(Math.random() * quotes.length)] ??
        quotes[0] ??
        "Keep learning, one question at a time.",
    );
    setOpen(true);
  }

  function nextQuestion() {
    if (selected === null) return;
    if (index + 1 >= questions.length) setFinished(true);
    else {
      setIndex(index + 1);
      setSelected(null);
    }
  }

  const labels = bn
    ? {
        prompt: "একটু জ্ঞান ঝালাই করবেন?",
        sub: "এলোমেলো প্রশ্ন • ২ মিনিট • মজার শেখা",
        button: "কুইজ খেলুন",
        title: "জ্ঞান যাচাই",
        intro: "বিজ্ঞান, ইতিহাস, গণিতসহ নানা বিষয়ে ৫টি এলোমেলো প্রশ্ন।",
        start: "শুরু করি",
        question: "প্রশ্ন",
        of: "এর",
        next: "পরের প্রশ্ন",
        result: "আপনার ফলাফল",
        correct: "সঠিক উত্তর",
        retry: "আবার খেলুন",
        close: "বন্ধ করুন",
        learn: "জানুন",
        excellent: "দারুণ কাজ! আপনার কৌতূহল ধরে রাখুন।",
        good: "ভালো করেছেন! প্রতিটি প্রশ্নই শেখার সুযোগ।",
        keep: "চেষ্টা চালিয়ে যান। শেখা মানেই এগিয়ে যাওয়া।",
        quote: "আজকের অনুপ্রেরণা",
        answered: "উত্তর দিন",
        explanation: "জেনে রাখুন",
      }
    : {
        prompt: "Test Your Knowledge",
        sub: "Explore science, history, mathematics and more.",
        button: "Start Quiz",
        title: "The Knowledge Break",
        intro: "Five random questions across science, history, maths and more.",
        start: "Start quiz",
        question: "Question",
        of: "of",
        next: "Next question",
        result: "Your result",
        correct: "correct answers",
        retry: "Play again",
        close: "Close",
        learn: "Learn",
        excellent: "Brilliant work! Keep that curiosity alive.",
        good: "Nicely done! Every question is a chance to learn.",
        keep: "Keep going. Every new fact is progress.",
        quote: "A thought to take with you",
        answered: "Choose an answer",
        explanation: "Did you know?",
      };

  return (
    <>
      <button
        type="button"
        onClick={startQuiz}
        className="kq-teaser"
        aria-haspopup="dialog"
      >
        <span className="kq-teaser-icon">
          <FiBookOpen aria-hidden="true" />
        </span>
        <span className="kq-teaser-copy">
          <strong>{labels.prompt}</strong>
          <small>{labels.sub}</small>
        </span>
        <span className="kq-teaser-cta">
          {labels.button}
          <FiChevronRight aria-hidden="true" />
        </span>
      </button>
      {open && (
        <div
          className="kq-overlay"
          role="presentation"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setOpen(false);
          }}
        >
          <section
            className="kq-dialog"
            role="dialog"
            aria-modal="true"
            aria-labelledby="kq-title"
          >
            <button
              className="kq-close"
              onClick={() => setOpen(false)}
              type="button"
              aria-label={labels.close}
            >
              <FiX />
            </button>
            <div className="kq-brand">
              <span>
                <FiBookOpen />
              </span>
              <span>
                {bn ? "কেসিএমএসসি জ্ঞান বিরতি" : "KCMSC · THE KNOWLEDGE BREAK"}
              </span>
            </div>
            {!questions.length ? (
              <div className="kq-welcome">
                <div className="kq-illustration">
                  <FiBookOpen />
                </div>
                <p className="kq-eyebrow">
                  {bn ? "কৌতূহল থেকেই শেখা" : "CURIOSITY STARTS HERE"}
                </p>
                <h2 id="kq-title">{labels.title}</h2>
                <p>{labels.intro}</p>
                <div className="kq-meta">
                  <span>✦ {bn ? "৫টি প্রশ্ন" : "5 questions"}</span>
                  <span>◷ {bn ? "প্রায় ২ মিনিট" : "About 2 minutes"}</span>
                  <span>◎ {bn ? "কোনো চাপ নেই" : "No pressure"}</span>
                </div>
                <button
                  className="kq-primary"
                  onClick={() => {
                    setQuestions(shuffle(bank).slice(0, 5));
                    setIndex(0);
                    setSelected(null);
                    setScore(0);
                    setFinished(false);
                    setQuote(
                      quotes[Math.floor(Math.random() * quotes.length)] ??
                        quotes[0] ??
                        "Keep learning, one question at a time.",
                    );
                  }}
                >
                  {labels.start}
                  <FiChevronRight />
                </button>
              </div>
            ) : finished ? (
              <div className="kq-result">
                <div className="kq-result-icon">
                  <FiCheckCircle />
                </div>
                <p className="kq-eyebrow">{labels.result}</p>
                <h2 id="kq-title">
                  {score === 5
                    ? bn
                      ? "অসাধারণ!"
                      : "Outstanding!"
                    : score >= 3
                      ? bn
                        ? "চমৎকার চেষ্টা!"
                        : "Well done!"
                      : bn
                        ? "শিখতে থাকুন!"
                        : "Keep exploring!"}
                </h2>
                <div className="kq-score">
                  <strong>{score}</strong>
                  <span>/ {questions.length}</span>
                </div>
                <p>
                  {score >= 4
                    ? labels.excellent
                    : score >= 2
                      ? labels.good
                      : labels.keep}
                </p>
                <div className="kq-quote">
                  <span>{labels.quote}</span>
                  <blockquote>“{quote}”</blockquote>
                </div>
                <div className="kq-result-actions">
                  <button
                    className="kq-secondary"
                    onClick={() => setOpen(false)}
                  >
                    {labels.close}
                  </button>
                  <button className="kq-primary" onClick={startQuiz}>
                    <FiRefreshCw /> {labels.retry}
                  </button>
                </div>
              </div>
            ) : (
              current && (
                <div className="kq-question-view">
                  <div className="kq-progress-label">
                    <span>
                      {labels.question} {index + 1} {labels.of}{" "}
                      {questions.length}
                    </span>
                    <span>{current.category}</span>
                  </div>
                  <div className="kq-progress">
                    <span style={{ width: `${progress}%` }} />
                  </div>
                  <h2 id="kq-title">{current.question}</h2>
                  <div className="kq-options">
                    {current.options.map((option, optionIndex) => {
                      const isChosen = selected === optionIndex;
                      const isCorrect =
                        selected !== null && optionIndex === current.answer;
                      const isWrong =
                        isChosen && optionIndex !== current.answer;
                      return (
                        <button
                          type="button"
                          key={option}
                          disabled={selected !== null}
                          onClick={() => {
                            setSelected(optionIndex);
                            if (optionIndex === current.answer)
                              setScore((value) => value + 1);
                          }}
                          className={`kq-option${isCorrect ? " is-correct" : ""}${isWrong ? " is-wrong" : ""}`}
                        >
                          <span className="kq-option-letter">
                            {String.fromCharCode(65 + optionIndex)}
                          </span>
                          <span>{option}</span>
                          {isCorrect && (
                            <FiCheckCircle className="kq-option-check" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                  {selected !== null && (
                    <div className="kq-feedback">
                      <strong>
                        {selected === current.answer
                          ? bn
                            ? "সঠিক উত্তর!"
                            : "Correct!"
                          : bn
                            ? "ভালো চেষ্টা!"
                            : "Good try!"}
                      </strong>
                      <p>{current.fact}</p>
                      <small>{labels.explanation}</small>
                    </div>
                  )}
                  <button
                    className="kq-primary kq-next"
                    disabled={selected === null}
                    onClick={nextQuestion}
                  >
                    {index + 1 === questions.length
                      ? labels.result
                      : labels.next}
                    <FiChevronRight />
                  </button>
                </div>
              )
            )}
          </section>
        </div>
      )}
      <style jsx global>{`
        .kq-teaser {
          position: fixed;
          z-index: 45;
          bottom: 14px;
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          align-items: center;
          gap: 10px;
          width: min(460px, calc(100vw - 28px));
          padding: 9px 12px;
          border: 1px solid rgba(181, 154, 74, 0.4);
          border-radius: 12px;
          background: rgba(255, 253, 248, 0.97);
          color: #242824;
          box-shadow: 0 5px 22px rgba(22, 43, 31, 0.12);
          text-align: left;
          backdrop-filter: blur(12px);
          transition: box-shadow 0.2s;
        }
        .kq-teaser:hover {
          box-shadow: 0 8px 26px rgba(22, 43, 31, 0.17);
        }
        .kq-teaser-icon {
          display: grid;
          place-items: center;
          flex: 0 0 34px;
          height: 34px;
          border-radius: 9px;
          background: #176b45;
          color: white;
          font-size: 17px;
        }
        .kq-teaser-copy {
          display: flex;
          flex: 1;
          min-width: 0;
          flex-direction: column;
          gap: 3px;
        }
        .kq-teaser-copy strong {
          font-size: 12px;
          line-height: 1.3;
          font-weight: 700;
        }
        .kq-teaser-copy small {
          font-size: 10px;
          color: #69716b;
          line-height: 1.35;
        }
        .kq-teaser-cta {
          display: flex;
          align-items: center;
          gap: 4px;
          color: #176b45;
          font-size: 11px;
          font-weight: 700;
          white-space: nowrap;
        }
        @media (max-width: 640px) {
          .kq-teaser {
            bottom: max(10px, env(safe-area-inset-bottom));
            width: min(390px, calc(100vw - 24px));
            gap: 9px;
            padding: 9px 10px;
            border-radius: 15px;
          }
          .kq-teaser-icon { flex-basis: 32px; height: 32px; }
          .kq-teaser-copy strong { font-size: 11px; }
          .kq-teaser-copy small { font-size: 10px; }
          .kq-teaser-cta { font-size: 10px; }
        }
        @media (max-width: 370px) {
          .kq-teaser { width: calc(100vw - 20px); gap: 7px; }
          .kq-teaser-copy small { display: none; }
          .kq-teaser-cta { font-size: 9px; }
        }
        .kq-overlay {
          position: fixed;
          inset: 0;
          z-index: 1000;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 8px;
          background: rgba(13, 28, 20, 0.66);
          backdrop-filter: blur(7px);
          overflow-y: auto;
        }
        .kq-dialog {
          position: relative;
          width: min(100%, 570px);
          max-height: calc(100dvh - 16px);
          overflow-y: auto;
          scrollbar-width: none;
          -ms-overflow-style: none;
          overscroll-behavior: contain;
          background: #fffdf8;
          border: 1px solid rgba(181, 154, 74, 0.35);
          border-radius: 24px;
          box-shadow: 0 30px 100px rgba(0, 0, 0, 0.3);
          padding: 26px;
          color: #242824;
        }
        .kq-dialog::-webkit-scrollbar {
          display: none;
          width: 0;
          height: 0;
        }
        .kq-close {
          position: absolute;
          right: 18px;
          top: 18px;
          width: 38px;
          height: 38px;
          border: 1px solid #d9d8cf;
          border-radius: 50%;
          display: grid;
          place-items: center;
          background: transparent;
          color: #242824;
          font-size: 19px;
        }
        .kq-close:hover {
          background: #efeee7;
        }
        .kq-brand {
          display: flex;
          align-items: center;
          gap: 9px;
          color: #176b45;
          font-size: 10px;
          letter-spacing: 0.12em;
          font-weight: 800;
          padding-right: 42px;
        }
        .kq-brand > span:first-child {
          display: grid;
          place-items: center;
          width: 32px;
          height: 32px;
          border-radius: 10px;
          background: #e8efe8;
          font-size: 17px;
        }
        .kq-welcome,
        .kq-result {
          text-align: center;
          padding: 22px 4px 4px;
        }
        .kq-illustration,
        .kq-result-icon {
          display: grid;
          place-items: center;
          width: 70px;
          height: 70px;
          margin: 0 auto 18px;
          border-radius: 22px;
          background: #e8efe8;
          color: #176b45;
          font-size: 31px;
        }
        .kq-eyebrow {
          color: #176b45;
          font-size: 10px;
          font-weight: 800;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          margin: 0 0 10px;
        }
        .kq-welcome h2,
        .kq-result h2 {
          font-family: var(--font-heading, Georgia, serif);
          font-size: clamp(28px, 5vw, 38px);
          font-weight: 500;
          line-height: 1.12;
          letter-spacing: -0.035em;
          margin: 0 0 12px;
        }
        .kq-welcome > p:not(.kq-eyebrow),
        .kq-result > p {
          color: #69716b;
          font-size: 14px;
          line-height: 1.7;
          max-width: 380px;
          margin: 0 auto;
        }
        .kq-meta {
          display: flex;
          justify-content: center;
          flex-wrap: wrap;
          gap: 8px;
          margin: 22px 0 24px;
        }
        .kq-meta span {
          padding: 8px 10px;
          border: 1px solid #d9d8cf;
          border-radius: 999px;
          font-size: 11px;
          color: #505850;
        }
        .kq-primary,
        .kq-secondary {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 9px;
          min-height: 46px;
          padding: 12px 19px;
          border-radius: 10px;
          font-size: 13px;
          font-weight: 700;
          transition:
            background 0.2s,
            transform 0.2s;
        }
        .kq-primary {
          background: #176b45;
          color: white;
          border: 1px solid #176b45;
        }
        .kq-primary:hover:not(:disabled) {
          background: #124c36;
          transform: translateY(-1px);
        }
        .kq-primary:disabled {
          opacity: 0.45;
          cursor: not-allowed;
        }
        .kq-secondary {
          border: 1px solid #d9d8cf;
          color: #242824;
          background: transparent;
        }
        .kq-secondary:hover {
          background: #efeee7;
        }
        .kq-question-view {
          padding-top: 28px;
        }
        .kq-progress-label {
          display: flex;
          justify-content: space-between;
          gap: 12px;
          color: #69716b;
          font-size: 11px;
          font-weight: 700;
        }
        .kq-progress-label span:last-child {
          color: #176b45;
        }
        .kq-progress {
          height: 5px;
          border-radius: 20px;
          background: #e8e7df;
          margin: 12px 0 25px;
          overflow: hidden;
        }
        .kq-progress span {
          display: block;
          height: 100%;
          border-radius: 20px;
          background: #176b45;
          transition: width 0.2s;
        }
        .kq-question-view h2 {
          font-family: var(--font-heading, Georgia, serif);
          font-weight: 500;
          font-size: clamp(23px, 4vw, 30px);
          line-height: 1.3;
          letter-spacing: -0.025em;
          margin: 0 0 22px;
        }
        .kq-options {
          display: grid;
          gap: 10px;
        }
        .kq-option {
          display: flex;
          align-items: center;
          gap: 12px;
          width: 100%;
          padding: 12px;
          border: 1px solid #d9d8cf;
          border-radius: 12px;
          background: #fff;
          color: #242824;
          text-align: left;
          font-size: 13px;
          line-height: 1.45;
          transition:
            border 0.15s,
            background 0.15s;
        }
        .kq-option:not(:disabled):hover {
          border-color: #176b45;
          background: #f5f8f3;
        }
        .kq-option:disabled {
          cursor: default;
        }
        .kq-option-letter {
          display: grid;
          place-items: center;
          flex: 0 0 30px;
          height: 30px;
          border: 1px solid #d9d8cf;
          border-radius: 8px;
          color: #69716b;
          font-size: 11px;
          font-weight: 700;
        }
        .kq-option.is-correct {
          border-color: #176b45;
          background: #eaf3eb;
        }
        .kq-option.is-correct .kq-option-letter {
          background: #176b45;
          border-color: #176b45;
          color: white;
        }
        .kq-option.is-wrong {
          border-color: #bd5a4e;
          background: #fff0ed;
        }
        .kq-option.is-wrong .kq-option-letter {
          border-color: #bd5a4e;
          color: #a33f34;
        }
        .kq-option-check {
          margin-left: auto;
          color: #176b45;
          flex-shrink: 0;
        }
        .kq-feedback {
          margin-top: 14px;
          padding: 13px 15px;
          border-radius: 12px;
          background: #f0f0e8;
          border-left: 3px solid #b59a4a;
        }
        .kq-feedback strong {
          font-size: 12px;
          color: #176b45;
        }
        .kq-feedback p {
          font-size: 12px;
          line-height: 1.55;
          color: #505850;
          margin: 5px 0;
        }
        .kq-feedback small {
          font-size: 9px;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          color: #69716b;
        }
        .kq-next {
          width: 100%;
          margin-top: 18px;
        }
        .kq-result {
          padding-top: 25px;
        }
        .kq-result-icon {
          border-radius: 50%;
          font-size: 33px;
        }
        .kq-score {
          display: flex;
          align-items: baseline;
          justify-content: center;
          gap: 5px;
          margin: 18px 0 10px;
          color: #176b45;
        }
        .kq-score strong {
          font-family: var(--font-heading, Georgia, serif);
          font-size: 66px;
          line-height: 1;
          font-weight: 500;
          letter-spacing: -0.06em;
        }
        .kq-score span {
          font-size: 19px;
          color: #69716b;
        }
        .kq-quote {
          margin: 24px 0 22px;
          padding: 17px 20px;
          border-radius: 14px;
          background: #f0f0e8;
        }
        .kq-quote > span {
          font-size: 9px;
          font-weight: 800;
          letter-spacing: 0.13em;
          text-transform: uppercase;
          color: #176b45;
        }
        .kq-quote blockquote {
          font-family: var(--font-heading, Georgia, serif);
          font-size: 17px;
          line-height: 1.5;
          font-style: italic;
          margin: 9px 0 0;
        }
        .kq-result-actions {
          display: flex;
          justify-content: center;
          gap: 10px;
          flex-wrap: wrap;
        }
        .font-bangla .kq-dialog,
        .font-bangla .kq-teaser {
          font-family: var(--font-bangla), sans-serif;
        }
        .font-bangla .kq-welcome h2,
        .font-bangla .kq-result h2,
        .font-bangla .kq-question-view h2,
        .font-bangla .kq-quote blockquote {
          font-family: var(--font-bangla-heading), serif;
        }
        .font-bangla .kq-teaser-copy strong {
          font-size: 14px;
        }
        .font-bangla .kq-teaser-copy small {
          font-size: 11px;
        }
        @media (max-width: 520px) {
          .kq-teaser {
            bottom: 10px;
            padding: 8px 10px;
            gap: 8px;
            border-radius: 12px;
            width: calc(100vw - 20px);
          }
          .kq-teaser-icon {
            flex-basis: 30px;
            height: 30px;
            font-size: 15px;
          }
          .kq-teaser-copy strong {
            font-size: 11px;
          }
          .kq-teaser-copy small {
            font-size: 9px;
          }
          .kq-teaser-cta {
            font-size: 10px;
            gap: 2px;
          }
          .kq-dialog {
            padding: 20px 18px;
            border-radius: 19px;
            max-height: calc(100dvh - 16px);
          }
          .kq-overlay {
            padding: 8px;
          }
          .kq-brand {
            font-size: 9px;
          }
          .kq-welcome,
          .kq-result {
            padding-top: 20px;
          }
          .kq-meta {
            gap: 5px;
          }
          .kq-meta span {
            font-size: 9px;
            padding: 7px 8px;
          }
          .kq-option {
            padding: 10px;
            gap: 9px;
            font-size: 12px;
          }
          .kq-question-view {
            padding-top: 22px;
          }
        }
        @media (max-height: 700px) {
          .kq-dialog {
            padding-top: 18px;
            padding-bottom: 18px;
          }
          .kq-question-view {
            padding-top: 18px;
          }
          .kq-progress {
            margin: 9px 0 18px;
          }
          .kq-question-view h2 {
            margin-bottom: 16px;
          }
          .kq-options {
            gap: 8px;
          }
          .kq-option {
            padding: 9px 11px;
          }
          .kq-option-letter {
            flex-basis: 27px;
            height: 27px;
          }
          .kq-next {
            margin-top: 12px;
          }
          .kq-brand > span:first-child {
            width: 29px;
            height: 29px;
          }
          .kq-welcome,
          .kq-result {
            padding-top: 16px;
          }
          .kq-illustration,
          .kq-result-icon {
            width: 58px;
            height: 58px;
            margin-bottom: 12px;
          }
          .kq-meta {
            margin: 16px 0 18px;
          }
          .kq-quote {
            margin: 18px 0;
            padding: 14px 16px;
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .kq-teaser,
          .kq-primary,
          .kq-progress span,
          .kq-option {
            transition: none;
          }
        }
      `}</style>
    </>
  );
}
