"use client";

import { useRef, useState } from "react";
import type {
  CSSProperties,
  KeyboardEvent as ReactKeyboardEvent,
  MouseEvent as ReactMouseEvent,
  PointerEvent as ReactPointerEvent,
  WheelEvent as ReactWheelEvent,
} from "react";

const frontierModels = [
  { name: "Claude Opus 5", score: 61, href: "https://claude.com/" },
  { name: "GPT-5.6 Sol", score: 59, href: "https://chatgpt.com/" },
  { name: "Kimi K3", score: 57, href: "https://www.kimi.com/" },
  { name: "Grok 4.5", score: 54, href: "https://grok.com/" },
  { name: "GLM-5.2", score: 51, href: "https://chat.z.ai/" },
] as const;

const assetUrl = (path: string) =>
  `${import.meta.env.BASE_URL}${path.replace(/^\//, "")}`;

type PaperRipple = {
  id: number;
  x: number;
  y: number;
};

export default function Home() {
  const [screen, setScreen] = useState<0 | 1 | 2 | 3 | 4>(0);
  const [paperRipples, setPaperRipples] = useState<PaperRipple[]>([]);
  const entered = screen > 0;
  const menuOpen = screen === 1;
  const detailOpen = screen >= 2;
  const wheelLocked = useRef(false);
  const rippleId = useRef(0);
  const rippleMotionTimer = useRef<number | null>(null);

  const movePage = (event: ReactPointerEvent<HTMLElement>) => {
    const page = event.currentTarget;
    const rect = page.getBoundingClientRect();
    const px = (event.clientX - rect.left) / rect.width - 0.5;
    const py = (event.clientY - rect.top) / rect.height - 0.5;

    page.style.setProperty("--mouse-x", `${event.clientX}px`);
    page.style.setProperty("--mouse-y", `${event.clientY}px`);
    page.style.setProperty("--move-x", `${px * 16}px`);
    page.style.setProperty("--move-y", `${py * 12}px`);
    page.style.setProperty("--move-x-reverse", `${px * -26}px`);
    page.style.setProperty("--move-y-reverse", `${py * -20}px`);
    page.style.setProperty("--line-two-x", `${px * -20}px`);
    page.style.setProperty("--line-two-y", `${py * -14}px`);
    page.style.setProperty("--line-three-x", `${px * 10}px`);
    page.style.setProperty("--line-three-y", `${py * -8}px`);
    page.style.setProperty("--line-three-tilt", `${px * 0.7}deg`);
  };

  const resetPage = (event: ReactPointerEvent<HTMLElement>) => {
    const page = event.currentTarget;
    page.style.setProperty("--move-x", "0px");
    page.style.setProperty("--move-y", "0px");
    page.style.setProperty("--move-x-reverse", "0px");
    page.style.setProperty("--move-y-reverse", "0px");
    page.style.setProperty("--line-two-x", "0px");
    page.style.setProperty("--line-two-y", "0px");
    page.style.setProperty("--line-three-x", "0px");
    page.style.setProperty("--line-three-y", "0px");
    page.style.setProperty("--line-three-tilt", "0deg");
  };

  const enterNext = () => setScreen(1);

  const handleIntroKeyDown = (event: ReactKeyboardEvent<HTMLElement>) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      enterNext();
    }
  };

  const handleWheel = (event: ReactWheelEvent<HTMLElement>) => {
    if (wheelLocked.current || Math.abs(event.deltaY) < 20) return;

    const movingDown = event.deltaY > 0;
    let nextScreen: 0 | 1 | 2 | 3 | 4 = screen;

    if (movingDown && screen === 0) {
      nextScreen = 1;
    } else if (!movingDown && screen === 1) {
      nextScreen = 0;
    } else if (!movingDown && detailOpen) {
      nextScreen = 1;
    } else if (movingDown && screen === 1) {
      const entry = (event.target as HTMLElement).closest<HTMLElement>(
        "[data-target-screen]",
      );
      const target = Number(entry?.dataset.targetScreen);
      if (target === 2 || target === 3 || target === 4) nextScreen = target;
    }

    if (nextScreen === screen) return;

    event.preventDefault();
    wheelLocked.current = true;
    setScreen(nextScreen);
    window.setTimeout(() => {
      wheelLocked.current = false;
    }, 1250);
  };

  const createPaperRipple = (event: ReactMouseEvent<HTMLElement>) => {
    const target = event.target;
    if (
      target instanceof Element &&
      target.closest("a, button, [role='button']")
    ) {
      return;
    }

    const rect = event.currentTarget.getBoundingClientRect();
    const page = event.currentTarget;
    const id = ++rippleId.current;
    const ripple = {
      id,
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
    };

    setPaperRipples((current) => [...current.slice(-5), ripple]);

    page.querySelectorAll<HTMLElement>(".ink-wash").forEach((wash) => {
      const washRect = wash.getBoundingClientRect();
      const deltaX = event.clientX - (washRect.left + washRect.width / 2);
      const deltaY = event.clientY - (washRect.top + washRect.height / 2);
      const attractX = Math.max(-48, Math.min(48, deltaX * 0.085));
      const attractY = Math.max(-38, Math.min(38, deltaY * 0.085));

      wash.style.setProperty("--attract-x", `${attractX}px`);
      wash.style.setProperty("--attract-y", `${attractY}px`);
    });

    page.classList.remove("ripple-attracting");
    void page.offsetWidth;
    page.classList.add("ripple-attracting");

    if (rippleMotionTimer.current !== null) {
      window.clearTimeout(rippleMotionTimer.current);
    }
    rippleMotionTimer.current = window.setTimeout(() => {
      page.classList.remove("ripple-attracting");
      rippleMotionTimer.current = null;
    }, 1350);

    window.setTimeout(() => {
      setPaperRipples((current) =>
        current.filter((item) => item.id !== id),
      );
    }, 1800);
  };

  return (
    <main
      className={`page${entered ? " entered" : ""}${menuOpen ? " menu-open" : ""}${detailOpen ? " detail-open" : ""}`}
      onPointerMove={movePage}
      onPointerLeave={resetPage}
      onWheel={handleWheel}
      onClick={createPaperRipple}
    >
      <div className="mouse-light" aria-hidden="true" />
      <div className="paper-grain" aria-hidden="true" />
      <div className="paper-ripple-layer" aria-hidden="true">
        {paperRipples.map((ripple) => (
          <span
            className="paper-ripple"
            key={ripple.id}
            style={{ left: ripple.x, top: ripple.y }}
          />
        ))}
      </div>
      <div className="ink-wash wash-one" aria-hidden="true" />
      <div className="ink-wash wash-two" aria-hidden="true" />
      <div className="ink-wash wash-three" aria-hidden="true" />
      <div className="silk-glow" aria-hidden="true" />

      <section
        className="hero intro-screen"
        role="button"
        tabIndex={entered ? -1 : 0}
        aria-label="点击进入下一页"
        aria-hidden={entered}
        onClick={enterNext}
        onKeyDown={handleIntroKeyDown}
      >
        <div className="copy glass-stage">
          <p className="dedication-title" aria-label="祝汪思琪">
            <img src={assetUrl("zhu-wangsiqi.png?v=1")} alt="祝汪思琪" />
          </p>
          <h1 className="art-title" aria-label="前程似锦">
            <img
              src={assetUrl("qiancheng-calligraphy.png?v=2")}
              alt="前程似锦"
            />
          </h1>
        </div>
        <span className="down-arrow" aria-hidden="true">
          <img src={assetUrl("ink-arrow-up.png?v=1")} alt="" />
        </span>
      </section>

      <section className="next-screen" aria-hidden={!menuOpen}>
        <button
          className="back-button menu-back"
          type="button"
          aria-label="返回首页"
          tabIndex={menuOpen ? 0 : -1}
          onClick={() => setScreen(0)}
        >
          <img
            src={assetUrl("ink-arrow-up.png?v=1")}
            alt=""
            aria-hidden="true"
          />
        </button>
        <div className="next-content" aria-label="闲墨寄怀，求学问津，灵机初启">
          <div className="calligraphy-stack">
            <button
              className="line-motion line-one entry-button"
              type="button"
              aria-label="进入闲墨寄怀页面"
              data-target-screen="2"
              tabIndex={menuOpen ? 0 : -1}
              onClick={() => setScreen(2)}
            >
              <img
                className="calligraphy-line"
                src={assetUrl("xianmo-jihuai.png?v=3")}
                alt="闲墨寄怀"
              />
            </button>
            <button
              className="line-motion line-two entry-button"
              type="button"
              aria-label="进入求学问津页面"
              data-target-screen="3"
              tabIndex={menuOpen ? 0 : -1}
              onClick={() => setScreen(3)}
            >
              <img
                className="calligraphy-line"
                src={assetUrl("qiuxue-wenjin.png?v=1")}
                alt="求学问津"
              />
            </button>
            <button
              className="line-motion line-three entry-button"
              type="button"
              aria-label="进入灵机初启页面"
              data-target-screen="4"
              tabIndex={menuOpen ? 0 : -1}
              onClick={() => setScreen(4)}
            >
              <img
                className="calligraphy-line"
                src={assetUrl("lingji-chuqi.png?v=1")}
                alt="灵机初启"
              />
            </button>
          </div>
        </div>
      </section>

      <section
        className="detail-screen"
        aria-hidden={!detailOpen}
        data-detail-page={detailOpen ? screen - 1 : undefined}
      >
        <button
          className="back-button detail-back"
          type="button"
          aria-label="返回第二页"
          tabIndex={detailOpen ? 0 : -1}
          onClick={() => setScreen(1)}
        >
          <img
            src={assetUrl("ink-arrow-up.png?v=1")}
            alt=""
            aria-hidden="true"
          />
        </button>
        <div
          className={`detail-glass${screen === 2 ? " has-message" : ""}${screen === 3 ? " study-plan-glass" : ""}${screen === 4 ? " ai-learning-glass" : ""}`}
        >
          {screen === 2 && (
            <img
              className="handwritten-message"
              src={assetUrl("xianmo-message.png?v=1")}
              alt="恭喜顺利升学，开启人生新的篇章！一路走来，你的努力和坚持终于换来了今天这份喜悦，真的替你感到开心和骄傲。新的校园意味着新的起点，也会有更多精彩的经历和无限的可能。希望你在今后的学习和生活中，始终保持对世界的好奇和对梦想的热爱，勇敢去尝试自己想做的事情，认识志同道合的朋友，看更大的世界，也成为更好的自己。愿你既有努力向前的勇气，也有享受青春的从容；愿所有付出都有收获，所有期待都能如愿。祝你学业有成，前程似锦，一路繁花，未来闪闪发光！"
            />
          )}
          {screen === 3 && (
            <img
              className="study-plan-copy"
              src={assetUrl("qiuxue-plan.png?v=1")}
              alt="1. 第一优先：课程成绩。必修课不挂科，尽量提高专业排名，避免迟到、缺勤和考场违纪。2. 第二优先：一项有效成果。选择学校或学院认可的学科竞赛、创新项目，专注一两项。3. 第三优先：低负担长期积累。完成每学年的有效运动记录、志愿服务。4. 第四优先：能力证书。大一争取通过英语四级，有余力再准备六级或计算机等级考试。5. 第五优先：学生工作与文体活动。选择一个正式的学生工作；参加学院认可的文艺、体育、社会实践活动。"
            />
          )}
          {screen === 4 && (
            <div
              className="model-chart-page"
              aria-label="Learn AI, Build Your Future. Artificial Analysis Intelligence Index version 4.1. Higher is better."
            >
              <div className="model-chart-title" aria-hidden="true" />
              {frontierModels.map((model, index) => (
                <a
                  key={model.name}
                  className={`model-row model-row-${index + 1}`}
                  href={model.href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={`Open the official ${model.name} website. Intelligence Index score ${model.score}.`}
                  style={{
                    "--bar-width": `${25 + (model.score - 51) * 2.5}%`,
                    "--bar-delay": `${0.58 + index * 0.18}s`,
                    "--row-delay": `${0.34 + index * 0.18}s`,
                  } as CSSProperties}
                >
                  <span className="model-bar-fill" aria-hidden="true" />
                </a>
              ))}
              <div className="model-chart-footer" aria-hidden="true" />
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
