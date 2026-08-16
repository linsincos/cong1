"use client";

import { useState } from "react";

const wishes = [
  ["01", "心有所向", "愿你始终保有好奇与热望，在新的天地里，遇见更辽阔的自己。"],
  ["02", "行有所成", "愿每一次伏案都有回响，每一程奔赴都更靠近心中所愿。"],
  ["03", "未来可期", "愿山水有相逢，前路有花开，抬头所见皆是明亮风景。"],
];

const confetti = Array.from({ length: 28 }, (_, index) => ({
  id: index,
  left: `${(index * 37) % 100}%`,
  delay: `${(index % 9) * 0.08}s`,
  duration: `${1.8 + (index % 5) * 0.22}s`,
  rotate: `${(index * 47) % 180}deg`,
}));

export default function Home() {
  const [opened, setOpened] = useState(false);

  return (
    <main className="site-shell">
      <div className="ambient ambient-one" aria-hidden="true" />
      <div className="ambient ambient-two" aria-hidden="true" />

      <header className="topbar">
        <a className="brand" href="#home" aria-label="回到祝福首页">
          <span className="brand-mark">锦</span>
          <span>升学志喜</span>
        </a>
        <span className="date">新程 · 此刻启航</span>
      </header>

      <section className="hero" id="home">
        <p className="eyebrow"><span />致即将奔赴新校园的你<span /></p>
        <h1>
          <span>祝你</span>
          前程似锦
        </h1>
        <p className="hero-copy">
          山高有行路，水深有渡舟。<br />
          愿你带着今日的欢喜，走向更大的世界。
        </p>

        <button className="open-wish" type="button" onClick={() => setOpened(true)}>
          <span>启封祝福</span>
          <span className="button-arrow" aria-hidden="true">↗</span>
        </button>

        <div className="scroll-cue" aria-hidden="true">
          <span>向下阅览</span><i />
        </div>

        <div className="orbital" aria-hidden="true">
          <span className="orbit-text">鹏程万里 · 金榜新章 ·</span>
          <span className="sun">新</span>
        </div>
      </section>

      <section className="wish-section" aria-labelledby="wish-heading">
        <div className="section-intro">
          <p className="section-kicker">A BRIGHT NEW CHAPTER</p>
          <h2 id="wish-heading">此去，愿你</h2>
        </div>
        <div className="wish-grid">
          {wishes.map(([number, title, body]) => (
            <article className="wish-card" key={number}>
              <span className="card-number">{number}</span>
              <div>
                <h3>{title}</h3>
                <p>{body}</p>
              </div>
              <span className="card-flower" aria-hidden="true">✦</span>
            </article>
          ))}
        </div>
      </section>

      <section className="closing">
        <p>愿你跃入人海，也永远闪闪发光</p>
        <h2>长风破浪，未来可期。</h2>
        <div className="signature">
          <span />
          <p>为你的新旅程，献上最真挚的祝福</p>
          <span />
        </div>
      </section>

      <footer>
        <span>TO A WONDERFUL FUTURE</span>
        <span>前程似锦 · 万事胜意</span>
      </footer>

      {opened && (
        <div className="modal" role="dialog" aria-modal="true" aria-labelledby="letter-title">
          <div className="confetti" aria-hidden="true">
            {confetti.map((piece) => (
              <i
                key={piece.id}
                style={{
                  left: piece.left,
                  animationDelay: piece.delay,
                  animationDuration: piece.duration,
                  transform: `rotate(${piece.rotate})`,
                }}
              />
            ))}
          </div>
          <div className="letter">
            <button className="close" type="button" onClick={() => setOpened(false)} aria-label="关闭祝福信">×</button>
            <span className="letter-seal">锦</span>
            <p className="letter-kicker">A LETTER FOR YOU</p>
            <h2 id="letter-title">亲爱的同学：</h2>
            <p>
              恭喜你翻开人生崭新的一页。愿新的校园里，有喜欢的课、投缘的人，也有一步步靠近梦想的笃定。
            </p>
            <p>
              愿你不惧山高路远，始终明朗热烈；愿所有努力都有回音，所有期待都如约而至。
            </p>
            <strong>祝升学快乐，前程似锦！</strong>
            <span className="letter-sign">—— 最诚挚的祝福</span>
          </div>
        </div>
      )}
    </main>
  );
}
