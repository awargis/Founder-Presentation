import React, { useEffect, useRef, useState } from 'react';

/**
 * AURA — Founder Presentation
 * One Identity. Infinite Opportunities.
 */

export default function App() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isNotesOpen, setIsNotesOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const totalSlides = 17;

  // Slide navigation handlers
  const goToSlide = (index: number) => {
    if (index >= 0 && index < totalSlides) {
      setCurrentIndex(index);
    }
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev < totalSlides - 1 ? prev + 1 : prev));
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : prev));
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen?.().catch(() => {});
    } else {
      document.exitFullscreen?.().catch(() => {});
    }
  };

  // Keyboard navigation
  useEffect(() => {
    let timeout: NodeJS.Timeout | null = null;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (timeout) return;

      switch (e.key) {
        case 'ArrowRight':
        case ' ':
        case 'PageDown':
          e.preventDefault();
          nextSlide();
          timeout = setTimeout(() => { timeout = null; }, 500);
          break;
        case 'ArrowLeft':
        case 'PageUp':
          e.preventDefault();
          prevSlide();
          timeout = setTimeout(() => { timeout = null; }, 500);
          break;
        case 'Home':
          e.preventDefault();
          goToSlide(0);
          timeout = setTimeout(() => { timeout = null; }, 500);
          break;
        case 'End':
          e.preventDefault();
          goToSlide(totalSlides - 1);
          timeout = setTimeout(() => { timeout = null; }, 500);
          break;
        case 'f':
        case 'F':
          toggleFullscreen();
          timeout = setTimeout(() => { timeout = null; }, 400);
          break;
        case 'n':
        case 'N':
          setIsNotesOpen((prev) => !prev);
          timeout = setTimeout(() => { timeout = null; }, 400);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Mouse wheel navigation
  useEffect(() => {
    let wheelTimeout: NodeJS.Timeout | null = null;

    const handleWheel = (e: WheelEvent) => {
      if (wheelTimeout) return;
      if (Math.abs(e.deltaY) < 20) return;

      if (e.deltaY > 0) {
        nextSlide();
      } else {
        prevSlide();
      }

      wheelTimeout = setTimeout(() => {
        wheelTimeout = null;
      }, 600);
    };

    window.addEventListener('wheel', handleWheel, { passive: true });
    return () => window.removeEventListener('wheel', handleWheel);
  }, []);

  // Touch navigation
  useEffect(() => {
    let touchStartY = 0;
    let touchStartX = 0;

    const handleTouchStart = (e: TouchEvent) => {
      touchStartY = e.touches[0].clientY;
      touchStartX = e.touches[0].clientX;
    };

    const handleTouchEnd = (e: TouchEvent) => {
      const dy = touchStartY - e.changedTouches[0].clientY;
      const dx = touchStartX - e.changedTouches[0].clientX;

      if (Math.abs(dy) > 50 && Math.abs(dy) > Math.abs(dx)) {
        if (dy > 0) nextSlide();
        else prevSlide();
      } else if (Math.abs(dx) > 50) {
        if (dx > 0) nextSlide();
        else prevSlide();
      }
    };

    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchend', handleTouchEnd, { passive: true });

    return () => {
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, []);

  // Initial loader
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  // Particle System
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const particleCount = window.innerWidth < 768 ? 25 : 45;
    const particles = Array.from({ length: particleCount }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      vx: (Math.random() - 0.5) * 0.12,
      vy: (Math.random() - 0.5) * 0.12,
      size: Math.random() * 1.4 + 0.4,
      opacity: Math.random() * 0.4 + 0.1,
      color: ['139,92,246', '34,211,238', '167,139,250'][Math.floor(Math.random() * 3)],
      pulse: Math.random() * Math.PI * 2,
    }));

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.pulse += 0.006;

        if (p.x < -10) p.x = canvas.width + 10;
        if (p.x > canvas.width + 10) p.x = -10;
        if (p.y < -10) p.y = canvas.height + 10;
        if (p.y > canvas.height + 10) p.y = -10;

        const currentOpacity = p.opacity * (0.7 + Math.sin(p.pulse) * 0.3);
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${p.color}, ${currentOpacity})`;
        ctx.fill();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  // Speaker notes content dictionary for director notes drawer
  const speakerNotesMap: Record<number, { title: string; content: React.ReactNode }> = {
    0: {
      title: 'AURA — Opening',
      content: (
        <>
          <p><span className="cue">Pause</span> Stand silent in darkness for 2 seconds as the frame opens. Let the atmosphere settle.</p>
          <p><span className="cue">Slow</span> "Talent is everywhere..."</p>
          <p><span className="cue">Pause</span> 3 seconds. The photograph of the student emerges.</p>
          <p><span className="cue">Emphasis</span> "...Opportunity isn't."</p>
          <p><span className="cue">Pause</span> 2 seconds.</p>
          <p><span className="cue">Slow</span> "AURA. One identity. Infinite opportunities."</p>
        </>
      ),
    },
    1: {
      title: 'The Premise — Split World',
      content: (
        <>
          <p><span className="cue">Pause</span> Watch the visual gap split the frame. Let the audience absorb the two worlds.</p>
          <p><span className="cue">Slow</span> "Talent exists..."</p>
          <p><span className="cue">Pause</span> 2 seconds.</p>
          <p><span className="cue">Slow</span> "...Opportunity doesn't reach everyone."</p>
          <p><span className="cue">Emphasis</span> "The world doesn't have a talent problem. It has a connection problem."</p>
        </>
      ),
    },
    2: {
      title: 'Fragmented Identity',
      content: (
        <>
          <p><span className="cue">Pause</span> Look at the center. One student profile.</p>
          <p><span className="cue">Slow</span> "You are twelve different people to twelve different systems."</p>
          <p><span className="cue">Emphasis</span> "Learning, Scholarships, Internships, Research... each system pulls a piece of her identity away."</p>
          <p><span className="cue">Pause</span> 3 seconds as the visual profile fragments.</p>
          <p><span className="cue">Slow</span> "One student. 12 disconnected journeys."</p>
          <p><span className="cue">Question</span> "What if they could become one?"</p>
        </>
      ),
    },
    3: {
      title: 'The Protagonist — Ananya',
      content: (
        <>
          <p><span className="cue">Pause</span> 2 seconds. Let the portrait emerge through the darkness.</p>
          <p><span className="cue">Slow</span> "This is Ananya. She is 17 years old."</p>
          <p><span className="cue">Emphasis</span> "Passionate about Artificial Intelligence, Research, and Technology."</p>
          <p><span className="cue">Slow</span> "She isn't helpless. She is exceptionally capable and ambitious — like millions of students."</p>
          <p><span className="cue">Pause</span> 2 seconds.</p>
          <p><span className="cue">Emphasis</span> "She doesn't need more information."</p>
          <p><span className="cue">Slow</span> "She needs direction."</p>
        </>
      ),
    },
    4: {
      title: 'Navigating The Noise',
      content: (
        <>
          <p><span className="cue">Slow</span> "Ananya opens her laptop. She types: 'How to become an AI researcher?'"</p>
          <p><span className="cue">Pause</span> 2 seconds as windows start popping up.</p>
          <p><span className="cue">Emphasis</span> "Ten thousand courses. Forty-eight specializations. Conflicting roadmaps. Missed deadlines. Zero responses to thirty mentor emails."</p>
          <p><span className="cue">Pause</span> 2 seconds as the screen becomes overwhelming.</p>
          <p><span className="cue">Slow</span> "She doesn't lack ambition. She is drowning in noise."</p>
          <p><span className="cue">Pause</span> 3 seconds.</p>
          <p><span className="cue">Emphasis</span> "Information is everywhere."</p>
          <p><span className="cue">Slow</span> "Direction is not."</p>
        </>
      ),
    },
    5: {
      title: 'The Turning Point',
      content: (
        <>
          <p><span className="cue">Pause</span> 3 seconds. Total silence in the room.</p>
          <p><span className="cue">Slow</span> "What if the right opportunity..."</p>
          <p><span className="cue">Pause</span> 1.5 seconds.</p>
          <p><span className="cue">Slow</span> "...found the right student..."</p>
          <p><span className="cue">Pause</span> 1.5 seconds.</p>
          <p><span className="cue">Slow</span> "...at the right moment?"</p>
          <p><span className="cue">Pause</span> 2 seconds as the central light pulses softly through the darkness.</p>
        </>
      ),
    },
    6: {
      title: 'The Vision — AURA',
      content: (
        <>
          <p><span className="cue">Pause</span> 2 seconds. Let the light emerge from darkness.</p>
          <p><span className="cue">Slow</span> "This is AURA."</p>
          <p><span className="cue">Pause</span> 1 second.</p>
          <p><span className="cue">Emphasis</span> "One Identity. Infinite Opportunities."</p>
          <p><span className="cue">Slow</span> "A global student growth ecosystem."</p>
          <p><span className="cue">Pause</span> 3 seconds. Let the room take in the moment.</p>
        </>
      ),
    },
    7: {
      title: 'AURA Identity Passport',
      content: (
        <>
          <p><span className="cue">Slow</span> "Look at this profile. This is Ananya's living AURA Passport."</p>
          <p><span className="cue">Pause</span> 2 seconds as the profile renders.</p>
          <p><span className="cue">Emphasis</span> "Skills, projects, research, mentorship, and open-source contributions — all verified in real time."</p>
          <p><span className="cue">Pause</span> 2 seconds as glowing connections branch out to opportunities and peers.</p>
          <p><span className="cue">Emphasis</span> "Your achievements should compound with you."</p>
          <p><span className="cue">Slow</span> "Not sit static on a PDF resume."</p>
        </>
      ),
    },
    8: {
      title: 'Identity to Opportunity Conversion',
      content: (
        <>
          <p><span className="cue">Slow</span> "Here is how AURA converts student identity into opportunities."</p>
          <p><span className="cue">Pause</span> 1.5 seconds.</p>
          <p><span className="cue">Emphasis</span> "Not through keyword spam or sponsored job ad placement."</p>
          <p><span className="cue">Slow</span> "Through a clear reasoning pipeline: Profile → Interests → Skills → Goals → Matched Opportunities."</p>
          <p><span className="cue">Pause</span> 2 seconds as the six matched opportunities materialize.</p>
          <p><span className="cue">Emphasis</span> "Not more opportunities. Better opportunities."</p>
        </>
      ),
    },
    9: {
      title: 'Student Knowledge Community',
      content: (
        <>
          <p><span className="cue">Slow</span> "AURA is not a social feed or distraction engine."</p>
          <p><span className="cue">Pause</span> 2 seconds as the global knowledge network lights up.</p>
          <p><span className="cue">Emphasis</span> "It is a trusted student knowledge community built for deep learning, mentorship, and research."</p>
          <p><span className="cue">Slow</span> "Connecting students reciprocally with peers, teachers, professors, researchers, mentors, and professionals across all 12 academic disciplines."</p>
          <p><span className="cue">Pause</span> 2.5 seconds.</p>
          <p><span className="cue">Emphasis</span> "Everyone learns. Everyone contributes. Everyone grows."</p>
        </>
      ),
    },
    10: {
      title: 'Global Opportunity Access',
      content: (
        <>
          <p><span className="cue">Slow</span> "Your geography should not determine the size of your future."</p>
          <p><span className="cue">Pause</span> 2 seconds as the world map slowly lights up across continents.</p>
          <p><span className="cue">Slow</span> "Opportunities materialize everywhere — universities, research labs, scholarships, competitions, internships, mentorship, jobs, and open research projects."</p>
          <p><span className="cue">Emphasis</span> "Watch as Ananya in India connects directly to a research lab 7,200 kilometers away in Zurich."</p>
          <p><span className="cue">Pause</span> 2.5 seconds.</p>
          <p><span className="cue">Emphasis</span> "No gatekeepers. No location penalty. Pure merit and intent."</p>
        </>
      ),
    },
    11: {
      title: 'Lifecycle Identity Engine',
      content: (
        <>
          <p><span className="cue">Slow</span> "AURA doesn't end when the course ends."</p>
          <p><span className="cue">Emphasis</span> "It grows with the student."</p>
          <p><span className="cue">Pause</span> 2 seconds as the horizontal timeline evolves seamlessly across stages.</p>
          <p><span className="cue">Slow</span> "School → Entrance Exam → University → Research → Internship → Projects → First Job → Career → Mentor → Contributor."</p>
          <p><span className="cue">Gesture</span> "This is one possible journey — a living, lifelong identity that continuously expands with every milestone."</p>
        </>
      ),
    },
    12: {
      title: 'Why PW?',
      content: (
        <>
          <p><span className="cue">Slow</span> "PW has already built the learning relationship."</p>
          <p><span className="cue">Emphasis</span> "AURA can extend it into the student's future."</p>
          <p><span className="cue">Pause</span> 2 seconds as the compounding ecosystem flywheel activates.</p>
          <p><span className="cue">Slow</span> "PW Learning builds Student Trust → powers the AURA Community → unlocks Opportunities → drives Achievements → deepens Lifelong Engagement → creates Mentors & Alumni → inspires New Students → back to PW Learning."</p>
          <p><span className="cue">Emphasis</span> "This is not just student retention. This is a self-reinforcing, compounding asset."</p>
        </>
      ),
    },
    13: {
      title: 'Network Density',
      content: (
        <>
          <p><span className="cue">Slow</span> "The product gets better as the community gets smarter."</p>
          <p><span className="cue">Emphasis</span> "This is not a forecast. It is the conceptual law of compounding density."</p>
          <p><span className="cue">Pause</span> 2 seconds as the living constellation density expands.</p>
          <p><span className="cue">Slow</span> "From 1 student... to 10... to 100... to 10,000... to 1,000,000."</p>
          <p><span className="cue">Gesture</span> "As the community grows — more knowledge, more mentors, more opportunities, more projects, more collaboration, and more outcomes."</p>
          <p><span className="cue">Emphasis</span> "The network becomes exponentially more valuable for every single member inside it."</p>
        </>
      ),
    },
    14: {
      title: 'Business Model Architecture',
      content: (
        <>
          <p><span className="cue">Slow</span> "Keep the community free. Monetise high-value outcomes."</p>
          <p><span className="cue">Emphasis</span> "We do not monetise student access or lock learning behind paywalls."</p>
          <p><span className="cue">Pause</span> 2 seconds as the layered business model unfolds.</p>
          <p><span className="cue">Slow</span> "The core ecosystem is 100% free — building deep trust and continuous engagement."</p>
          <p><span className="cue">Gesture</span> "When high-value outcomes occur — AI career services, university partnerships, talent discovery, mentorship, verified assessments, and opportunity partnerships — sustainable value flows naturally."</p>
          <p><span className="cue">Emphasis</span> "Protecting student trust is our ultimate competitive advantage."</p>
        </>
      ),
    },
    15: {
      title: 'The Human Flywheel',
      content: (
        <>
          <p><span className="cue">Slow</span> "One student's success can become another student's opportunity."</p>
          <p><span className="cue">Emphasis</span> "This is not just a digital network. It is a living human ecosystem."</p>
          <p><span className="cue">Pause</span> 2 seconds as the cycle turns.</p>
          <p><span className="cue">Slow</span> "A student learns... discovers... builds... achieves... contributes... mentors... and helps another student."</p>
          <p><span className="cue">Gesture</span> "Surrounding them — teachers, researchers, professors, working professionals, and global universities."</p>
          <p><span className="cue">Emphasis</span> "The cycle repeats endlessly — expanding human potential across the world."</p>
        </>
      ),
    },
    16: {
      title: 'Closing Vision',
      content: (
        <>
          <p><span className="cue">Slow</span> "Start with black... thousands of connected lights around the world."</p>
          <p><span className="cue">Pause</span> 2 seconds as nodes brighten.</p>
          <p><span className="cue">Slow</span> "Each bright light is a student whose potential found an opportunity."</p>
          <p><span className="cue">Pause</span> 2 seconds as nodes form the AURA symbol.</p>
          <p><span className="cue">Emphasis</span> "AURA — One Identity. Infinite Opportunities."</p>
          <p><span className="cue">Slow</span> "Talent is everywhere."</p>
          <p><span className="cue">Pause</span> 2 seconds.</p>
          <p><span className="cue">Emphasis</span> "Let's make opportunity universal."</p>
          <p><span className="cue">Pause</span> 4 seconds. Hold the final frame.</p>
          <p><span className="cue">Soft glow</span> "AURA."</p>
        </>
      ),
    },
  };

  const progressPct = ((currentIndex + 1) / totalSlides) * 100;

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-black text-[#E5E7EB] font-sans select-none">
      {/* LOADER */}
      <div
        id="loader"
        className={`fixed inset-0 z-[1000] bg-black flex flex-col items-center justify-center transition-all duration-1000 ${
          isLoading ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'
        }`}
      >
        <div className="loader-mark">
          <span>A</span>
          <span>U</span>
          <span>R</span>
          <span>A</span>
        </div>
        <div className="loader-line"></div>
        <div className="loader-text">Initializing Experience</div>
      </div>

      {/* AMBIENT AURORA BACKGROUND */}
      <div className="aurora-bg">
        <div className="aurora-blob v"></div>
        <div className="aurora-blob c"></div>
      </div>
      <canvas ref={canvasRef} id="particles" className="fixed inset-0 z-1 pointer-events-none" />
      <div className="vignette"></div>
      <div className="grain"></div>

      {/* TOP PROGRESS BAR */}
      <div
        className="progress-bar"
        style={{ width: `${progressPct}%` }}
      ></div>

      {/* NAVIGATION DOTS */}
      <div className="nav-dots" id="navDots">
        {Array.from({ length: totalSlides }).map((_, i) => (
          <div
            key={i}
            className={`nav-dot ${i === currentIndex ? 'active' : ''}`}
            onClick={() => goToSlide(i)}
            title={`Slide ${i + 1}`}
          />
        ))}
      </div>

      {/* BOTTOM SLIDE COUNTER */}
      <div className="counter">
        <span className="current" id="counterCurrent">
          {String(currentIndex + 1).padStart(2, '0')}
        </span>
        <span>/</span>
        <span className="total" id="counterTotal">
          {String(totalSlides).padStart(2, '0')}
        </span>
      </div>

      {/* BRANDING */}
      <div className="brand">
        <span className="dot"></span>
        <span>AURA · 2025</span>
      </div>

      {/* DIRECTOR NOTES TOGGLE */}
      <button
        className="notes-toggle"
        onClick={() => setIsNotesOpen(!isNotesOpen)}
      >
        <span className="dot"></span>
        <span>Director's Notes</span>
      </button>

      {/* CONTROLS */}
      <div className="controls">
        <button className="ctrl-btn" onClick={prevSlide} aria-label="Previous slide">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>
        <button className="ctrl-btn" onClick={toggleFullscreen} aria-label="Toggle fullscreen">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3" />
          </svg>
        </button>
        <button className="ctrl-btn" onClick={nextSlide} aria-label="Next slide">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </button>
      </div>

      {/* SPEAKER NOTES DRAWER */}
      <aside className={`notes-panel ${isNotesOpen ? 'open' : ''}`}>
        <button className="notes-close" onClick={() => setIsNotesOpen(false)}>
          ×
        </button>
        <div className="slide-num">
          SLIDE {String(currentIndex + 1).padStart(2, '0')} / {String(totalSlides).padStart(2, '0')}
        </div>
        <h4>Director's Notes</h4>
        <h5>{speakerNotesMap[currentIndex]?.title}</h5>
        <div className="notes-body">{speakerNotesMap[currentIndex]?.content}</div>
      </aside>

      {/* PRESENTATION CONTAINER */}
      <div id="presentation">
        {/* SLIDE 1: Cinematic Opening */}
        <section className={`slide s1-cinematic ${currentIndex === 0 ? 'active' : ''}`} data-index="1">
          {/* Black Screen Overlay for 0–2s */}
          <div className="s1-black-screen" />

          {/* Cinematic Photograph of Student Studying Alone at Night */}
          <div className="s1-photo-container">
            <img
              src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=1600&auto=format&fit=crop"
              alt="Young ambitious student studying at night"
              referrerPolicy="no-referrer"
              className="s1-photo-img"
            />
            <div className="s1-photo-overlay" />
          </div>

          {/* Subtle Ambient Violet/Cyan Reflected Light */}
          <div className="s1-ambient-glow" />

          {/* Main Cinematic Title Sequence Layout */}
          <div className="s1-content-layout">
            <div className="s1-eyebrow">
              <span className="sub-dot"></span>
              <span>AURA · Founder Presentation</span>
            </div>

            <div className="s1-title-group">
              <h1 className="s1-line-1">
                TALENT IS EVERYWHERE.
              </h1>
              <h1 className="s1-line-2">
                OPPORTUNITY <span className="accent-glow">ISN'T.</span>
              </h1>
            </div>

            <p className="s1-subtitle">
              <span className="sub-dot"></span>
              <span>One Identity. Infinite Opportunities.</span>
            </p>
          </div>
        </section>

        {/* SLIDE 2: Cinematic Split-World Connection Problem */}
        <section className={`slide s2-split-world ${currentIndex === 1 ? 'active' : ''}`} data-index="2">
          {/* Split-World Visual Stage */}
          <div className="s2-visual-stage">
            {/* LEFT WORLD: Talented student in ordinary learning environment */}
            <div className="s2-panel s2-panel-left">
              <img
                src="https://images.unsplash.com/photo-1434030216411-0b793f4b4173?q=80&w=1200&auto=format&fit=crop"
                alt="Talented student in an ordinary learning environment"
                referrerPolicy="no-referrer"
                className="s2-panel-img"
              />
              <div className="s2-panel-overlay s2-overlay-left" />
              <div className="s2-panel-badge s2-badge-left">
                <span className="badge-dot cyan-dot" />
                <span>ORDINARY ENVIRONMENT</span>
              </div>
            </div>

            {/* THE GAP: Missing Guidance, Access & Connections */}
            <div className="s2-gap-container">
              <div className="s2-gap-abyss" />
              <div className="s2-gap-glow-line" />
              <div className="s2-gap-nodes">
                <div className="s2-gap-node top" />
                <div className="s2-gap-node mid" />
                <div className="s2-gap-node bot" />
              </div>
              <div className="s2-gap-label">
                <span>THE DISCONNECT</span>
              </div>
            </div>

            {/* RIGHT WORLD: Prestigious university / research lab / global opportunity */}
            <div className="s2-panel s2-panel-right">
              <img
                src="https://images.unsplash.com/photo-1541829070764-84a7d30dd3f3?q=80&w=1200&auto=format&fit=crop"
                alt="Prestigious research and global opportunity environment"
                referrerPolicy="no-referrer"
                className="s2-panel-img"
              />
              <div className="s2-panel-overlay s2-overlay-right" />
              <div className="s2-panel-badge s2-badge-right">
                <span className="badge-dot violet-dot" />
                <span>GLOBAL OPPORTUNITY</span>
              </div>
            </div>
          </div>

          {/* SECTION TAG */}
          <div className="section-tag s2-tag relative z-20">
            <span className="num">01</span>
            <span className="line"></span>
            <span>The Connection Problem</span>
          </div>

          {/* SEQUENCED TYPOGRAPHY */}
          <div className="s2-typography-container relative z-20">
            {/* Step 1: "TALENT EXISTS." */}
            <div className="s2-phrase s2-phrase-left">
              <span className="s2-mono-tag">
                <span className="badge-dot cyan-dot" />
                <span>TALENT EXISTS.</span>
              </span>
            </div>

            {/* Step 2: "OPPORTUNITY DOESN'T REACH EVERYONE." */}
            <div className="s2-phrase s2-phrase-right">
              <span className="s2-mono-tag">
                <span className="badge-dot violet-dot" />
                <span>OPPORTUNITY DOESN'T REACH EVERYONE.</span>
              </span>
            </div>

            {/* Step 3: Dominant Hero Statement */}
            <div className="s2-hero-group">
              <h2 className="s2-hero-sub">
                THE WORLD DOESN'T HAVE A <span className="s2-highlight-dim">TALENT PROBLEM.</span>
              </h2>
              <h1 className="s2-hero-main">
                IT HAS A <span className="accent-glow">CONNECTION PROBLEM.</span>
              </h1>
            </div>
          </div>
        </section>

        {/* SLIDE 3: Psychological Visualization of Fragmented Identity */}
        <section className={`slide s3-fragmented ${currentIndex === 2 ? 'active' : ''}`} data-index="3">
          {/* SECTION TAG */}
          <div className="section-tag s3-tag relative z-20">
            <span className="num">01</span>
            <span className="line"></span>
            <span>Fragmented Identity</span>
          </div>

          {/* PSYCHOLOGICAL VISUALIZATION STAGE */}
          <div className="s3-stage relative z-10">
            {/* Ambient Energy Glow */}
            <div className="s3-energy-field" />

            {/* SVG CONNECTING TETHER LINES (12 RAYS) */}
            <svg className="s3-tethers-svg" viewBox="0 0 1000 600" preserveAspectRatio="none">
              <defs>
                <linearGradient id="tetherGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="rgba(167, 139, 250, 0.7)" />
                  <stop offset="50%" stopColor="rgba(34, 211, 238, 0.5)" />
                  <stop offset="100%" stopColor="rgba(239, 68, 68, 0.6)" />
                </linearGradient>
              </defs>
              <line className="s3-tether t1" x1="500" y1="300" x2="200" y2="70" />
              <line className="s3-tether t2" x1="500" y1="300" x2="500" y2="30" />
              <line className="s3-tether t3" x1="500" y1="300" x2="800" y2="70" />
              <line className="s3-tether t4" x1="500" y1="300" x2="930" y2="190" />
              <line className="s3-tether t5" x1="500" y1="300" x2="930" y2="360" />
              <line className="s3-tether t6" x1="500" y1="300" x2="800" y2="530" />
              <line className="s3-tether t7" x1="500" y1="300" x2="500" y2="570" />
              <line className="s3-tether t8" x1="500" y1="300" x2="200" y2="530" />
              <line className="s3-tether t9" x1="500" y1="300" x2="70" y2="360" />
              <line className="s3-tether t10" x1="500" y1="300" x2="70" y2="190" />
              <line className="s3-tether t11" x1="500" y1="300" x2="320" y2="200" />
              <line className="s3-tether t12" x1="500" y1="300" x2="680" y2="200" />
            </svg>

            {/* CENTRAL STUDENT PROFILE */}
            <div className="s3-center-identity">
              <div className="s3-avatar-ring" />
              <div className="s3-avatar-core">
                <img 
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=400&auto=format&fit=crop" 
                  alt="Student Identity" 
                  className="s3-avatar-img"
                  referrerPolicy="no-referrer"
                />
                <div className="s3-fragment-overlay" />
              </div>
              <div className="s3-student-badge">
                <span className="badge-dot cyan-dot" />
                <span>STUDENT IDENTITY</span>
              </div>
            </div>

            {/* 12 FLOATING DESTINATION SYSTEM NODES */}
            <div className="s3-nodes-orbit">
              <div className="s3-node n1"><span>Learning</span></div>
              <div className="s3-node n2"><span>Scholarships</span></div>
              <div className="s3-node n3"><span>Internships</span></div>
              <div className="s3-node n4"><span>Research</span></div>
              <div className="s3-node n5"><span>Mentorship</span></div>
              <div className="s3-node n6"><span>Projects</span></div>
              <div className="s3-node n7"><span>Competitions</span></div>
              <div className="s3-node n8"><span>University Applications</span></div>
              <div className="s3-node n9"><span>Jobs</span></div>
              <div className="s3-node n10"><span>Community</span></div>
              <div className="s3-node n11"><span>Achievements</span></div>
              <div className="s3-node n12"><span>Professional Identity</span></div>
            </div>
          </div>

          {/* HEADLINES & STATEMENT OVERLAY */}
          <div className="s3-content-overlay relative z-20">
            <div className="s3-eyebrow">
              <span className="badge-dot violet-dot" />
              <span>YOU ARE 12 DIFFERENT PEOPLE TO 12 DIFFERENT SYSTEMS</span>
            </div>

            <div className="s3-statement-group">
              <h1 className="s3-statement-main">
                One student. <br />
                <span className="accent-glow">12 disconnected journeys.</span>
              </h1>
              <p className="s3-curiosity-question">
                <span>What if they could become one?</span>
              </p>
            </div>
          </div>
        </section>

        {/* SLIDE 4: Meet Ananya — The Protagonist */}
        <section className={`slide s4-protagonist ${currentIndex === 3 ? 'active' : ''}`} data-index="4">
          {/* SECTION TAG */}
          <div className="section-tag s4-tag relative z-20">
            <span className="num">01</span>
            <span className="line"></span>
            <span>Human Reality</span>
          </div>

          {/* CINEMATIC CONTAINER */}
          <div className="s4-container relative z-10">
            {/* PORTRAIT FRAME */}
            <div className="s4-portrait-wrap">
              <div className="s4-portrait-glow" />
              <div className="s4-portrait-frame">
                <img
                  src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=1200&auto=format&fit=crop"
                  alt="Ananya — 17 year old student"
                  referrerPolicy="no-referrer"
                  className="s4-portrait-img"
                />
                <div className="s4-portrait-overlay" />
              </div>
            </div>

            {/* MINIMAL CONTENT SIDE */}
            <div className="s4-details-wrap">
              <div className="s4-badge">
                <span className="badge-dot cyan-dot" />
                <span>THE PROTAGONIST</span>
              </div>

              {/* NAME & MINIMAL INFO */}
              <div className="s4-profile-info">
                <h1 className="s4-name">ANANYA</h1>
                <div className="s4-meta-pills">
                  <span className="s4-pill">AGE 17</span>
                  <span className="s4-pill-sep">•</span>
                  <span className="s4-pill">AI / RESEARCH / TECHNOLOGY</span>
                </div>
              </div>

              {/* CORE REVEAL SENTENCE */}
              <div className="s4-statement">
                <p className="s4-line-sub">
                  She doesn't need more information.
                </p>
                <h2 className="s4-line-main">
                  She needs <span className="accent-glow">direction.</span>
                </h2>
              </div>
            </div>
          </div>
        </section>

        {/* SLIDE 5: Navigating The Future — Visual Journey */}
        <section className={`slide s5-navigation ${currentIndex === 4 ? 'active' : ''}`} data-index="5">
          {/* SECTION TAG */}
          <div className="section-tag s5-tag relative z-20">
            <span className="num">01</span>
            <span className="line"></span>
            <span>Navigating The Future</span>
          </div>

          {/* NOISE STAGE CONTAINER */}
          <div className="s5-stage relative z-10">
            {/* AMBIENT NOISE GLOW */}
            <div className="s5-noise-bg" />

            {/* CENTRAL ANANYA FOCAL AVATAR */}
            <div className="s5-center-ananya">
              <div className="s5-ananya-ring" />
              <div className="s5-ananya-core">
                <img
                  src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=400&auto=format&fit=crop"
                  alt="Ananya Navigating"
                  className="s5-ananya-img"
                  referrerPolicy="no-referrer"
                />
                <div className="s5-ananya-vignette" />
              </div>
              <div className="s5-ananya-label">
                <span className="badge-dot cyan-dot" />
                <span>ANANYA • SEARCHING</span>
              </div>
            </div>

            {/* 7 FLOATING CINEMATIC WINDOW / OPPORTUNITY FRAGMENTS */}
            <div className="s5-fragments-cloud">
              {/* FRAGMENT 1: QUESTION */}
              <div className="s5-window frag-1">
                <div className="s5-win-header">
                  <span className="s5-dot red" /><span className="s5-dot yellow" /><span className="s5-dot green" />
                  <span className="s5-win-title">query.search</span>
                </div>
                <div className="s5-win-body">
                  <span className="s5-tag-mini violet">QUESTION</span>
                  <p className="s5-win-text">"Which AI research path should I choose?"</p>
                </div>
              </div>

              {/* FRAGMENT 2: SEARCH */}
              <div className="s5-window frag-2">
                <div className="s5-win-header">
                  <span className="s5-dot red" /><span className="s5-dot yellow" /><span className="s5-dot green" />
                  <span className="s5-win-title">search.results</span>
                </div>
                <div className="s5-win-body">
                  <span className="s5-tag-mini cyan">SEARCH</span>
                  <p className="s5-win-text">10,000+ courses, roadmaps & degrees...</p>
                </div>
              </div>

              {/* FRAGMENT 3: TOO MANY OPTIONS */}
              <div className="s5-window frag-3">
                <div className="s5-win-header">
                  <span className="s5-dot red" /><span className="s5-dot yellow" /><span className="s5-dot green" />
                  <span className="s5-win-title">catalog.overflow</span>
                </div>
                <div className="s5-win-body">
                  <span className="s5-tag-mini yellow">TOO MANY OPTIONS</span>
                  <p className="s5-win-text">48 Specializations • 120 Bootcamps • 3,400 Certs</p>
                </div>
              </div>

              {/* FRAGMENT 4: CONFLICTING INFORMATION */}
              <div className="s5-window frag-4">
                <div className="s5-win-header">
                  <span className="s5-dot red" /><span className="s5-dot yellow" /><span className="s5-dot green" />
                  <span className="s5-win-title">forum.thread</span>
                </div>
                <div className="s5-win-body">
                  <span className="s5-tag-mini orange">CONFLICTING INFO</span>
                  <p className="s5-win-text">"Must have PhD" vs "Degrees are dead, just build"</p>
                </div>
              </div>

              {/* FRAGMENT 5: MISSED DEADLINE */}
              <div className="s5-window frag-5">
                <div className="s5-win-header">
                  <span className="s5-dot red" /><span className="s5-dot yellow" /><span className="s5-dot green" />
                  <span className="s5-win-title">grant.portal</span>
                </div>
                <div className="s5-win-body">
                  <span className="s5-tag-mini red">MISSED DEADLINE</span>
                  <p className="s5-win-text highlight-red">AI Research Fellowship — Closed 2h ago</p>
                </div>
              </div>

              {/* FRAGMENT 6: NO MENTOR */}
              <div className="s5-window frag-6">
                <div className="s5-win-header">
                  <span className="s5-dot red" /><span className="s5-dot yellow" /><span className="s5-dot green" />
                  <span className="s5-win-title">outreach.inbox</span>
                </div>
                <div className="s5-win-body">
                  <span className="s5-tag-mini purple">NO MENTOR</span>
                  <p className="s5-win-text">30 cold emails sent • 0 responses received</p>
                </div>
              </div>

              {/* FRAGMENT 7: UNCLEAR NEXT STEP */}
              <div className="s5-window frag-7">
                <div className="s5-win-header">
                  <span className="s5-dot red" /><span className="s5-dot yellow" /><span className="s5-dot green" />
                  <span className="s5-win-title">planner.state</span>
                </div>
                <div className="s5-win-body">
                  <span className="s5-tag-mini dark">UNCLEAR NEXT STEP</span>
                  <p className="s5-win-text font-mono">Where do I actually begin tomorrow?</p>
                </div>
              </div>
            </div>
          </div>

          {/* FINAL STATEMENT OVERLAY */}
          <div className="s5-statement-overlay relative z-20">
            <h2 className="s5-statement-title">
              <span className="s5-line-dim">Information is everywhere.</span><br />
              <span className="accent-glow">Direction is not.</span>
            </h2>
          </div>
        </section>

        {/* SLIDE 6: Minimalist Cinematic Transition — The Turning Point */}
        <section className={`slide s6-transition ${currentIndex === 5 ? 'active' : ''}`} data-index="6">
          {/* SECTION TAG */}
          <div className="section-tag s6-tag relative z-20">
            <span className="num">01</span>
            <span className="line"></span>
            <span>The Turning Point</span>
          </div>

          {/* CINEMATIC STAGE */}
          <div className="s6-stage relative z-10">
            {/* SUBTLE PARTICLE FIELD CONVERGING TO CENTER */}
            <div className="s6-particle-field">
              <div className="s6-particle p1" />
              <div className="s6-particle p2" />
              <div className="s6-particle p3" />
              <div className="s6-particle p4" />
              <div className="s6-particle p5" />
              <div className="s6-particle p6" />
              <div className="s6-particle p7" />
              <div className="s6-particle p8" />
              <div className="s6-particle p9" />
              <div className="s6-particle p10" />
              <div className="s6-particle p11" />
              <div className="s6-particle p12" />
            </div>

            {/* CENTRAL CONVERGENCE LIGHT PULSE POINT */}
            <div className="s6-center-singularity">
              <div className="s6-light-core" />
              <div className="s6-light-pulse-ring" />
            </div>

            {/* LINE BY LINE CENTERED QUESTION */}
            <div className="s6-question-wrap">
              <p className="s6-q-line line-1">
                What if the right opportunity
              </p>
              <p className="s6-q-line line-2">
                found the right student
              </p>
              <p className="s6-q-line line-3">
                at the right <span className="s6-accent-glow">moment?</span>
              </p>
            </div>
          </div>
        </section>

        {/* SLIDE 7: The AURA Reveal (Apple-style Product Reveal) */}
        <section className={`slide s7-reveal ${currentIndex === 6 ? 'active' : ''}`} data-index="7">
          {/* SECTION TAG */}
          <div className="section-tag s7-tag relative z-20">
            <span className="num">02</span>
            <span className="line"></span>
            <span>The Identity Layer</span>
          </div>

          {/* CINEMATIC STAGE */}
          <div className="s7-stage relative z-10">
            {/* SUBTLE AURORA BACKDROP */}
            <div className="s7-aurora-bg" />

            {/* SINGLE GLOWING POINT THAT EXPANDS INTO NETWORK */}
            <div className="s7-core-singularity">
              <div className="s7-glow-dot" />
              <div className="s7-pulse-ring" />
            </div>

            {/* EXPANDING NETWORK MESH */}
            <div className="s7-network-mesh">
              <svg className="s7-network-svg" viewBox="0 0 800 600" fill="none">
                {/* Connection lines from center outwards */}
                <line x1="400" y1="300" x2="250" y2="180" className="s7-net-line l1" />
                <line x1="400" y1="300" x2="550" y2="180" className="s7-net-line l2" />
                <line x1="400" y1="300" x2="620" y2="320" className="s7-net-line l3" />
                <line x1="400" y1="300" x2="520" y2="440" className="s7-net-line l4" />
                <line x1="400" y1="300" x2="280" y2="440" className="s7-net-line l5" />
                <line x1="400" y1="300" x2="180" y2="310" className="s7-net-line l6" />
                {/* Outer interconnects */}
                <line x1="250" y1="180" x2="550" y2="180" className="s7-net-line l7" />
                <line x1="550" y1="180" x2="620" y2="320" className="s7-net-line l8" />
                <line x1="620" y1="320" x2="520" y2="440" className="s7-net-line l9" />
                <line x1="520" y1="440" x2="280" y2="440" className="s7-net-line l10" />
                <line x1="280" y1="440" x2="180" y2="310" className="s7-net-line l11" />
                <line x1="180" y1="310" x2="250" y2="180" className="s7-net-line l12" />
                {/* Nodes */}
                <circle cx="250" cy="180" r="4" className="s7-node n1" />
                <circle cx="550" cy="180" r="4" className="s7-node n2" />
                <circle cx="620" cy="320" r="4" className="s7-node n3" />
                <circle cx="520" cy="440" r="4" className="s7-node n4" />
                <circle cx="280" cy="440" r="4" className="s7-node n5" />
                <circle cx="180" cy="310" r="4" className="s7-node n6" />
              </svg>
            </div>

            {/* REVEAL CONTENT */}
            <div className="s7-reveal-content">
              {/* PRIMARY LOGO */}
              <h1 className="s7-aura-logo">AURA</h1>

              {/* SECONDARY PHRASE */}
              <div className="s7-secondary-text">
                <p className="s7-sec-line p1">One Identity.</p>
                <p className="s7-sec-line p2 s7-accent">Infinite Opportunities.</p>
              </div>

              {/* TERTIARY STATEMENT */}
              <p className="s7-tagline">
                A global student growth ecosystem.
              </p>
            </div>
          </div>
        </section>

        {/* SLIDE 8: Living AURA Passport Identity Concept */}
        <section className={`slide s8-passport ${currentIndex === 7 ? 'active' : ''}`} data-index="8">
          {/* SECTION TAG */}
          <div className="section-tag s8-tag relative z-20">
            <span className="num">02</span>
            <span className="line"></span>
            <span>AURA Passport</span>
          </div>

          {/* MAIN CONTAINER */}
          <div className="s8-stage relative z-10">
            {/* AMBIENT GLOW BACKDROP */}
            <div className="s8-ambient-glow" />

            {/* AURA PASSPORT CARD */}
            <div className="s8-card">
              {/* PASSPORT HEADER */}
              <div className="s8-card-header">
                <div className="s8-profile-meta">
                  <div className="s8-avatar-wrap">
                    <img
                      src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=300&auto=format&fit=crop"
                      alt="Ananya Sharma"
                      className="s8-avatar"
                      referrerPolicy="no-referrer"
                    />
                    <div className="s8-avatar-glow" />
                  </div>
                  <div className="s8-info">
                    <div className="s8-name-row">
                      <h3 className="s8-name">Ananya Sharma</h3>
                      <span className="s8-verified-badge">
                        <span className="s8-v-dot" /> VERIFIED CORE
                      </span>
                    </div>
                    <p className="s8-institution">IIT Madras • B.Tech Computer Science & AI (Year 3)</p>
                    <p className="s8-aura-id">AURA IDENTITY: <span className="s8-mono">aura.id/ananya-sharma</span></p>
                  </div>
                </div>

                <div className="s8-passport-badge">
                  <span className="s8-badge-title">AURA PASSPORT</span>
                  <span className="s8-badge-sub">LIVING IDENTITY</span>
                </div>
              </div>

              {/* PASSPORT MODULES GRID (8 BELIEVABLE ATTRIBUTES) */}
              <div className="s8-grid">
                {/* 1. SKILLS */}
                <div className="s8-module mod-skills">
                  <div className="s8-mod-head">
                    <span className="s8-icon">⚡</span>
                    <span className="s8-mod-title">Verified Skills</span>
                  </div>
                  <div className="s8-chips">
                    <span className="s8-chip cyan">PyTorch</span>
                    <span className="s8-chip cyan">Transformer Arch</span>
                    <span className="s8-chip cyan">Computer Vision</span>
                    <span className="s8-chip cyan">Multi-Agent Systems</span>
                  </div>
                </div>

                {/* 2. PROJECTS */}
                <div className="s8-module mod-projects">
                  <div className="s8-mod-head">
                    <span className="s8-icon">🚀</span>
                    <span className="s8-mod-title">Featured Projects</span>
                  </div>
                  <div className="s8-item-list">
                    <div className="s8-item">
                      <span className="s8-item-bold">MedVision AI</span> — Early Pathology Detection using Edge CNNs
                    </div>
                    <div className="s8-item">
                      <span className="s8-item-bold">Autonomous Flight</span> — Drone Swarm Navigation Protocol
                    </div>
                  </div>
                </div>

                {/* 3. RESEARCH */}
                <div className="s8-module mod-research">
                  <div className="s8-mod-head">
                    <span className="s8-icon">🔬</span>
                    <span className="s8-mod-title">Research & Publications</span>
                  </div>
                  <div className="s8-item-list">
                    <div className="s8-item">
                      <span className="s8-item-bold">Co-Author:</span> Sparse Attention Mechanisms for On-Device Edge Inference
                    </div>
                  </div>
                </div>

                {/* 4. ACHIEVEMENTS */}
                <div className="s8-module mod-achievements">
                  <div className="s8-mod-head">
                    <span className="s8-icon">🏆</span>
                    <span className="s8-mod-title">Verified Achievements</span>
                  </div>
                  <div className="s8-item-list">
                    <div className="s8-item">
                      <span className="s8-badge-gold">1st Place</span> National AI Student Innovation Hackathon 2025
                    </div>
                    <div className="s8-item">
                      <span className="s8-badge-purple">Grant Recipient</span> DST Undergraduate Research Fellowship
                    </div>
                  </div>
                </div>

                {/* 5. MENTORSHIP */}
                <div className="s8-module mod-mentorship">
                  <div className="s8-mod-head">
                    <span className="s8-icon">🌱</span>
                    <span className="s8-mod-title">Mentorship</span>
                  </div>
                  <div className="s8-item-list">
                    <div className="s8-item">
                      <span className="s8-item-bold">Peer Mentor:</span> Guided 12 High School STEM Scholars in Python & ML
                    </div>
                  </div>
                </div>

                {/* 6. COMMUNITY */}
                <div className="s8-module mod-community">
                  <div className="s8-mod-head">
                    <span className="s8-icon">🌐</span>
                    <span className="s8-mod-title">Community & Open Source</span>
                  </div>
                  <div className="s8-item-list">
                    <div className="s8-item">
                      <span className="s8-item-bold">Contributor:</span> Hugging Face Transformers Repository
                    </div>
                    <div className="s8-item">
                      <span className="s8-item-bold">Lead:</span> IIT Madras AI Student Society
                    </div>
                  </div>
                </div>

                {/* 7. INTERESTS */}
                <div className="s8-module mod-interests">
                  <div className="s8-mod-head">
                    <span className="s8-icon">💡</span>
                    <span className="s8-mod-title">Academic Interests</span>
                  </div>
                  <div className="s8-chips">
                    <span className="s8-chip violet">Neuro-Symbolic AI</span>
                    <span className="s8-chip violet">Quantum ML</span>
                    <span className="s8-chip violet">Bio-Computing</span>
                  </div>
                </div>

                {/* 8. GOALS */}
                <div className="s8-module mod-goals">
                  <div className="s8-mod-head">
                    <span className="s8-icon">🎯</span>
                    <span className="s8-mod-title">Active Goals</span>
                  </div>
                  <div className="s8-item-list">
                    <div className="s8-item">
                      NeurIPS Workshop Submission • Building Low-Cost AI Medical Diagnostics
                    </div>
                  </div>
                </div>
              </div>

              {/* DYNAMIC CONNECTED NODES / FLOATING OPPORTUNITIES & NETWORK */}
              <div className="s8-connections-overlay">
                <div className="s8-node-item opp-1">
                  <span className="s8-node-tag cyan">MATCHED OPPORTUNITY</span>
                  <span className="s8-node-title">AI Research Fellow @ IISc Labs</span>
                </div>
                <div className="s8-node-item opp-2">
                  <span className="s8-node-tag cyan">MATCHED OPPORTUNITY</span>
                  <span className="s8-node-title">Computer Vision Intern @ Robotics Hub</span>
                </div>
                <div className="s8-node-item person-1">
                  <span className="s8-node-tag purple">VERIFIED ENDORSEMENT</span>
                  <span className="s8-node-title">Prof. R. Menon (Advisor)</span>
                </div>
                <div className="s8-node-item person-2">
                  <span className="s8-node-tag purple">CONNECTED NETWORK</span>
                  <span className="s8-node-title">12 Mentees • 4 Co-Authors</span>
                </div>
              </div>
            </div>

            {/* PROMINENT FINAL LINE */}
            <div className="s8-final-line-wrap">
              <h2 className="s8-final-statement">
                "Your achievements should <span className="s8-accent-glow">compound with you.</span>"
              </h2>
            </div>
          </div>
        </section>

        {/* SLIDE 9: Identity to Opportunity Conversion Architecture */}
        <section className={`slide s9-conversion ${currentIndex === 8 ? 'active' : ''}`} data-index="9">
          {/* SECTION TAG */}
          <div className="section-tag s9-tag relative z-20">
            <span className="num">02</span>
            <span className="line"></span>
            <span>Opportunity Conversion</span>
          </div>

          {/* MAIN CONTAINER */}
          <div className="s9-stage relative z-10">
            {/* HERO MESSAGE */}
            <div className="s9-hero-wrap">
              <h2 className="s9-hero-title">
                Not more opportunities. <span className="s9-hero-accent">Better opportunities.</span>
              </h2>
            </div>

            {/* CONVERSION PIPELINE FLOW */}
            <div className="s9-pipeline-container">
              {/* REASONING STEPS FLOW BAR */}
              <div className="s9-reasoning-flow">
                {/* INPUT: ANANYA'S PROFILE */}
                <div className="s9-node profile-node">
                  <div className="s9-profile-badge">
                    <img
                      src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=150&auto=format&fit=crop"
                      alt="Ananya Sharma"
                      className="s9-avatar"
                      referrerPolicy="no-referrer"
                    />
                    <div className="s9-node-info">
                      <span className="s9-node-label">INPUT</span>
                      <span className="s9-node-val">ANANYA'S PROFILE</span>
                    </div>
                  </div>
                </div>

                <div className="s9-arrow">↓</div>

                {/* STEP 1: INTERESTS */}
                <div className="s9-node step-node s9-step-1">
                  <span className="s9-step-num">01</span>
                  <span className="s9-step-title">INTERESTS</span>
                  <span className="s9-step-desc">Neuro-Symbolic AI & Edge Medical Vision</span>
                </div>

                <div className="s9-arrow">↓</div>

                {/* STEP 2: SKILLS */}
                <div className="s9-node step-node s9-step-2">
                  <span className="s9-step-num">02</span>
                  <span className="s9-step-title">SKILLS</span>
                  <span className="s9-step-desc">PyTorch, Transformer Arch, Edge CNNs</span>
                </div>

                <div className="s9-arrow">↓</div>

                {/* STEP 3: GOALS */}
                <div className="s9-node step-node s9-step-3">
                  <span className="s9-step-num">03</span>
                  <span className="s9-step-title">GOALS</span>
                  <span className="s9-step-desc">NeurIPS Workshop • Low-Cost Medical AI</span>
                </div>

                <div className="s9-arrow">↓</div>

                {/* STEP 4: OPPORTUNITIES */}
                <div className="s9-node step-node s9-step-4">
                  <span className="s9-step-num">04</span>
                  <span className="s9-step-title">OPPORTUNITIES</span>
                  <span className="s9-step-desc">Capability & Vision Vector Match</span>
                </div>
              </div>

              {/* GENERATED 6 MATCHED OPPORTUNITIES GRID */}
              <div className="s9-opportunities-grid">
                {/* 1. AI Research Internship */}
                <div className="s9-opp-card opp-1">
                  <div className="s9-opp-header">
                    <span className="s9-opp-type">AI RESEARCH INTERNSHIP</span>
                    <span className="s9-match-badge">MATCHED REASONING</span>
                  </div>
                  <h4 className="s9-opp-title">Edge AI Research Intern</h4>
                  <p className="s9-opp-org">IISc Autonomous Systems Lab</p>
                  <p className="s9-opp-reason">Based on: PyTorch + Edge CNN skills & Pathological Vision goal</p>
                </div>

                {/* 2. Scholarship */}
                <div className="s9-opp-card opp-2">
                  <div className="s9-opp-header">
                    <span className="s9-opp-type">SCHOLARSHIP</span>
                    <span className="s9-match-badge">MATCHED REASONING</span>
                  </div>
                  <h4 className="s9-opp-title">DST Young Researcher Grant</h4>
                  <p className="s9-opp-org">Govt. Science & Technology Fellowship</p>
                  <p className="s9-opp-reason">Based on: Undergraduate AI Innovation & MedVision research</p>
                </div>

                {/* 3. AI Competition */}
                <div className="s9-opp-card opp-3">
                  <div className="s9-opp-header">
                    <span className="s9-opp-type">AI COMPETITION</span>
                    <span className="s9-match-badge">MATCHED REASONING</span>
                  </div>
                  <h4 className="s9-opp-title">Global Medical Vision Challenge</h4>
                  <p className="s9-opp-org">OpenAI & Healthcare AI Alliance</p>
                  <p className="s9-opp-reason">Based on: Early Pathology Detection project & Hackathon wins</p>
                </div>

                {/* 4. Professor / Mentor */}
                <div className="s9-opp-card opp-4">
                  <div className="s9-opp-header">
                    <span className="s9-opp-type">PROFESSOR / MENTOR</span>
                    <span className="s9-match-badge">MATCHED REASONING</span>
                  </div>
                  <h4 className="s9-opp-title">Prof. R. Menon</h4>
                  <p className="s9-opp-org">Chair of Edge Computing @ IIT Madras</p>
                  <p className="s9-opp-reason">Based on: Shared interest in Sparse Attention & Edge Inference</p>
                </div>

                {/* 5. University Program */}
                <div className="s9-opp-card opp-5">
                  <div className="s9-opp-header">
                    <span className="s9-opp-type">UNIVERSITY PROGRAM</span>
                    <span className="s9-match-badge">MATCHED REASONING</span>
                  </div>
                  <h4 className="s9-opp-title">ETH Zurich AI Exchange</h4>
                  <p className="s9-opp-org">Neuro-Symbolic Systems Summer Lab</p>
                  <p className="s9-opp-reason">Based on: Neuro-Symbolic AI academic interest & verified core</p>
                </div>

                {/* 6. Research Project */}
                <div className="s9-opp-card opp-6">
                  <div className="s9-opp-header">
                    <span className="s9-opp-type">RESEARCH PROJECT</span>
                    <span className="s9-match-badge">MATCHED REASONING</span>
                  </div>
                  <h4 className="s9-opp-title">Open-Source Pathology AI</h4>
                  <p className="s9-opp-org">Hugging Face Medical AI Group</p>
                  <p className="s9-opp-reason">Based on: Open source contributions & Hugging Face repo commits</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SLIDE 10: Student Knowledge Community */}
        <section className={`slide s10-community ${currentIndex === 9 ? 'active' : ''}`} data-index="10">
          {/* SECTION TAG */}
          <div className="section-tag s10-tag relative z-20">
            <span className="num">02</span>
            <span className="line"></span>
            <span>Knowledge Community</span>
          </div>

          <div className="s10-stage relative z-10">
            {/* AMBIENT BACKGROUND GLOW */}
            <div className="s10-ambient-glow"></div>

            {/* HERO EMOTIONAL STATEMENT */}
            <div className="s10-hero-wrap">
              <span className="s10-hero-eyebrow">TRUSTED STUDENT NETWORK</span>
              <h2 className="s10-hero-title">
                Everyone learns. <span className="s10-accent-glow">Everyone contributes.</span> Everyone grows.
              </h2>
              <p className="s10-hero-sub">
                A knowledge-first global ecosystem built for reciprocal learning, academic research, and career mentorship.
              </p>
            </div>

            {/* SUBTLE WORLD MAP & RECIPROCAL CONNECTIONS CANVAS */}
            <div className="s10-network-canvas">
              {/* SUBTLE SVG WORLD MAP & GLOBAL ARCS */}
              <svg className="s10-world-svg" viewBox="0 0 1000 420" preserveAspectRatio="xMidYMid meet">
                <defs>
                  <linearGradient id="s10ArcGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="rgba(34, 211, 238, 0.4)" />
                    <stop offset="50%" stopColor="rgba(167, 139, 250, 0.6)" />
                    <stop offset="100%" stopColor="rgba(34, 211, 238, 0.4)" />
                  </linearGradient>
                </defs>

                {/* SUBTLE WORLD MAP CONTINENT DOT PATTERN / OUTLINES */}
                <g className="s10-world-continents" opacity="0.25">
                  {/* North America */}
                  <path d="M 180 110 Q 220 90, 280 120 T 260 180 T 170 170 Z" fill="none" stroke="#22D3EE" strokeWidth="1" strokeDasharray="2 3" />
                  {/* South America */}
                  <path d="M 280 230 Q 320 250, 310 320 T 270 340 Z" fill="none" stroke="#22D3EE" strokeWidth="1" strokeDasharray="2 3" />
                  {/* Europe & Africa */}
                  <path d="M 470 100 Q 520 80, 560 120 T 520 180 Z" fill="none" stroke="#A78BFA" strokeWidth="1" strokeDasharray="2 3" />
                  <path d="M 480 190 Q 550 210, 530 310 T 470 260 Z" fill="none" stroke="#A78BFA" strokeWidth="1" strokeDasharray="2 3" />
                  {/* Asia & India */}
                  <path d="M 600 110 Q 750 80, 820 160 T 680 230 T 630 180 Z" fill="none" stroke="#22D3EE" strokeWidth="1" strokeDasharray="2 3" />
                  {/* Australia */}
                  <path d="M 780 280 Q 850 270, 840 330 T 770 330 Z" fill="none" stroke="#A78BFA" strokeWidth="1" strokeDasharray="2 3" />
                </g>

                {/* GLOBAL INTERCONNECTION ARCS */}
                <path d="M 230 140 Q 380 40, 510 130" fill="none" stroke="url(#s10ArcGrad)" strokeWidth="1.5" strokeDasharray="4 4" className="s10-animated-arc" />
                <path d="M 510 130 Q 620 60, 720 140" fill="none" stroke="url(#s10ArcGrad)" strokeWidth="1.5" strokeDasharray="4 4" className="s10-animated-arc" />
                <path d="M 290 280 Q 480 380, 790 300" fill="none" stroke="url(#s10ArcGrad)" strokeWidth="1.5" strokeDasharray="4 4" className="s10-animated-arc" />
                <path d="M 230 140 Q 510 320, 720 140" fill="none" stroke="url(#s10ArcGrad)" strokeWidth="1" strokeDasharray="2 4" opacity="0.4" />

                {/* MAJOR GLOBAL HUB NODES */}
                <g className="s10-hub-nodes">
                  <circle cx="230" cy="140" r="5" fill="#22D3EE" />
                  <circle cx="230" cy="140" r="12" fill="none" stroke="#22D3EE" strokeWidth="1" opacity="0.5" className="s10-pulse-ring" />

                  <circle cx="510" cy="130" r="5" fill="#A78BFA" />
                  <circle cx="510" cy="130" r="12" fill="none" stroke="#A78BFA" strokeWidth="1" opacity="0.5" className="s10-pulse-ring" />

                  <circle cx="720" cy="140" r="5" fill="#22D3EE" />
                  <circle cx="720" cy="140" r="12" fill="none" stroke="#22D3EE" strokeWidth="1" opacity="0.5" className="s10-pulse-ring" />

                  <circle cx="680" cy="200" r="4" fill="#A78BFA" />
                  <circle cx="290" cy="280" r="4" fill="#22D3EE" />
                  <circle cx="790" cy="300" r="4" fill="#A78BFA" />
                </g>
              </svg>

              {/* 6 RECIPROCAL RELATIONSHIPS CARDS */}
              <div className="s10-relationships-grid">
                {/* 1. Student ↔ Student */}
                <div className="s10-rel-card rel-1">
                  <div className="s10-rel-nodes">
                    <span className="s10-node-pill student">STUDENT</span>
                    <span className="s10-arrow-icon">↔</span>
                    <span className="s10-node-pill student">STUDENT</span>
                  </div>
                  <p className="s10-rel-desc">Peer Study Networks • Collaborative Research</p>
                </div>

                {/* 2. Student ↔ Teacher */}
                <div className="s10-rel-card rel-2">
                  <div className="s10-rel-nodes">
                    <span className="s10-node-pill student">STUDENT</span>
                    <span className="s10-arrow-icon">↔</span>
                    <span className="s10-node-pill teacher">TEACHER</span>
                  </div>
                  <p className="s10-rel-desc">Foundational Mastery • Classroom Feedback</p>
                </div>

                {/* 3. Student ↔ Professor */}
                <div className="s10-rel-card rel-3">
                  <div className="s10-rel-nodes">
                    <span className="s10-node-pill student">STUDENT</span>
                    <span className="s10-arrow-icon">↔</span>
                    <span className="s10-node-pill professor">PROFESSOR</span>
                  </div>
                  <p className="s10-rel-desc">Academic Labs • Thesis Advisory & Grants</p>
                </div>

                {/* 4. Student ↔ Researcher */}
                <div className="s10-rel-card rel-4">
                  <div className="s10-rel-nodes">
                    <span className="s10-node-pill student">STUDENT</span>
                    <span className="s10-arrow-icon">↔</span>
                    <span className="s10-node-pill researcher">RESEARCHER</span>
                  </div>
                  <p className="s10-rel-desc">Frontier Innovation • Paper Co-Authorship</p>
                </div>

                {/* 5. Student ↔ Mentor */}
                <div className="s10-rel-card rel-5">
                  <div className="s10-rel-nodes">
                    <span className="s10-node-pill student">STUDENT</span>
                    <span className="s10-arrow-icon">↔</span>
                    <span className="s10-node-pill mentor">MENTOR</span>
                  </div>
                  <p className="s10-rel-desc">Personal Direction • Career Navigation</p>
                </div>

                {/* 6. Student ↔ Professional */}
                <div className="s10-rel-card rel-6">
                  <div className="s10-rel-nodes">
                    <span className="s10-node-pill student">STUDENT</span>
                    <span className="s10-arrow-icon">↔</span>
                    <span className="s10-node-pill professional">PROFESSIONAL</span>
                  </div>
                  <p className="s10-rel-desc">Real-World Projects • Industry Context</p>
                </div>
              </div>
            </div>

            {/* 12 ACADEMIC DOMAINS CHIPS ROW / GRID */}
            <div className="s10-domains-section">
              <span className="s10-domains-label">BRIDGING ALL ACADEMIC DISCIPLINES</span>
              <div className="s10-domains-grid">
                <span className="s10-domain-pill">Engineering</span>
                <span className="s10-domain-pill">Medicine</span>
                <span className="s10-domain-pill">Law</span>
                <span className="s10-domain-pill">Management</span>
                <span className="s10-domain-pill">Science</span>
                <span className="s10-domain-pill">Economics</span>
                <span className="s10-domain-pill">Humanities</span>
                <span className="s10-domain-pill">Design</span>
                <span className="s10-domain-pill">Technology</span>
                <span className="s10-domain-pill">Research</span>
                <span className="s10-domain-pill">Arts</span>
                <span className="s10-domain-pill">Social Sciences</span>
              </div>
            </div>
          </div>
        </section>

        {/* SLIDE 11: Cinematic Global Opportunity Map */}
        <section className={`slide s11-global ${currentIndex === 10 ? 'active' : ''}`} data-index="11">
          {/* SECTION TAG */}
          <div className="section-tag s11-tag relative z-20">
            <span className="num">02</span>
            <span className="line"></span>
            <span>Global Opportunity Access</span>
          </div>

          <div className="s11-stage relative z-10">
            {/* HERO STATEMENT */}
            <div className="s11-hero-wrap">
              <span className="s11-hero-eyebrow">AURA GLOBAL NETWORK</span>
              <h2 className="s11-hero-title">
                Your geography should not determine <span className="s11-hero-accent">the size of your future.</span>
              </h2>
            </div>

            {/* CINEMATIC WORLD MAP CONTAINER */}
            <div className="s11-map-container">
              <div className="s11-ambient-map-glow"></div>

              {/* WORLD MAP SVG */}
              <svg className="s11-world-map-svg" viewBox="0 0 1000 480" preserveAspectRatio="xMidYMid meet">
                <defs>
                  {/* Arc Gradient */}
                  <linearGradient id="s11AnanyaArcGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#22D3EE" />
                    <stop offset="50%" stopColor="#A78BFA" />
                    <stop offset="100%" stopColor="#67E8F9" />
                  </linearGradient>

                  {/* Radial Glow for Nodes */}
                  <radialGradient id="nodeGlowCyan" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#22D3EE" stopOpacity="0.8" />
                    <stop offset="100%" stopColor="#22D3EE" stopOpacity="0" />
                  </radialGradient>
                  <radialGradient id="nodeGlowPurple" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#A78BFA" stopOpacity="0.8" />
                    <stop offset="100%" stopColor="#A78BFA" stopOpacity="0" />
                  </radialGradient>
                </defs>

                {/* ELEGANT LATITUDE & LONGITUDE GRID LINES */}
                <g className="s11-geo-grid" opacity="0.12">
                  <line x1="0" y1="120" x2="1000" y2="120" stroke="#FFFFFF" strokeWidth="0.5" strokeDasharray="3 6" />
                  <line x1="0" y1="240" x2="1000" y2="240" stroke="#FFFFFF" strokeWidth="0.5" strokeDasharray="3 6" />
                  <line x1="0" y1="360" x2="1000" y2="360" stroke="#FFFFFF" strokeWidth="0.5" strokeDasharray="3 6" />

                  <line x1="200" y1="0" x2="200" y2="480" stroke="#FFFFFF" strokeWidth="0.5" strokeDasharray="3 6" />
                  <line x1="400" y1="0" x2="400" y2="480" stroke="#FFFFFF" strokeWidth="0.5" strokeDasharray="3 6" />
                  <line x1="600" y1="0" x2="600" y2="480" stroke="#FFFFFF" strokeWidth="0.5" strokeDasharray="3 6" />
                  <line x1="800" y1="0" x2="800" y2="480" stroke="#FFFFFF" strokeWidth="0.5" strokeDasharray="3 6" />
                </g>

                {/* MINIMALIST CINEMATIC CONTINENT OUTLINES */}
                <g className="s11-continents" opacity="0.35">
                  {/* North America */}
                  <path d="M 150 100 C 180 80, 260 70, 310 110 C 290 180, 240 210, 180 190 Z" fill="none" stroke="#22D3EE" strokeWidth="1" strokeDasharray="2 4" />
                  {/* South America */}
                  <path d="M 280 230 C 330 250, 320 360, 270 380 C 240 330, 250 260, 280 230 Z" fill="none" stroke="#22D3EE" strokeWidth="1" strokeDasharray="2 4" />
                  {/* Europe & UK */}
                  <path d="M 460 90 C 510 70, 560 80, 570 140 C 520 160, 480 150, 460 90 Z" fill="none" stroke="#A78BFA" strokeWidth="1" strokeDasharray="2 4" />
                  {/* Africa */}
                  <path d="M 470 170 C 560 180, 570 310, 510 350 C 460 300, 450 220, 470 170 Z" fill="none" stroke="#A78BFA" strokeWidth="1" strokeDasharray="2 4" />
                  {/* Asia & India */}
                  <path d="M 580 90 C 760 60, 850 120, 820 220 C 730 240, 640 200, 580 90 Z" fill="none" stroke="#22D3EE" strokeWidth="1" strokeDasharray="2 4" />
                  {/* India Subcontinent */}
                  <path d="M 700 180 C 730 190, 750 260, 710 270 C 690 240, 680 210, 700 180 Z" fill="none" stroke="#22D3EE" strokeWidth="1.2" strokeDasharray="2 2" />
                  {/* Australia */}
                  <path d="M 780 290 C 860 280, 870 360, 800 370 C 760 340, 760 310, 780 290 Z" fill="none" stroke="#A78BFA" strokeWidth="1" strokeDasharray="2 4" />
                </g>

                {/* THOUSANDS OF KM CONNECTING ARC: ANANYA (BENGALURU ~710, 230) -> ETH ZURICH / CAMBRIDGE (~510, 110) */}
                <g className="s11-long-connection">
                  {/* Outer glow arc */}
                  <path d="M 710 230 Q 610 50, 510 110" fill="none" stroke="#22D3EE" strokeWidth="3" opacity="0.2" className="s11-arc-glow" />
                  {/* Animated beam arc */}
                  <path d="M 710 230 Q 610 50, 510 110" fill="none" stroke="url(#s11AnanyaArcGrad)" strokeWidth="2" strokeDasharray="6 6" className="s11-beam-arc" />
                </g>

                {/* NODES WITH GLOW RINGS ON MAP */}
                <g className="s11-nodes-layer">
                  {/* 1. Universities Node (Cambridge/Zurich: 510, 110) */}
                  <circle cx="510" cy="110" r="16" fill="url(#nodeGlowCyan)" />
                  <circle cx="510" cy="110" r="6" fill="#22D3EE" className="s11-node-dot" />
                  <circle cx="510" cy="110" r="12" fill="none" stroke="#22D3EE" strokeWidth="1" className="s11-pulse" />

                  {/* 2. Research Labs Node (Boston / MIT: 250, 120) */}
                  <circle cx="250" cy="120" r="12" fill="url(#nodeGlowPurple)" />
                  <circle cx="250" cy="120" r="5" fill="#A78BFA" className="s11-node-dot" />

                  {/* 3. Scholarships Node (Oxford: 480, 100) */}
                  <circle cx="480" cy="100" r="12" fill="url(#nodeGlowCyan)" />
                  <circle cx="480" cy="100" r="4" fill="#67E8F9" className="s11-node-dot" />

                  {/* 4. Competitions Node (Tokyo / Asia: 810, 160) */}
                  <circle cx="810" cy="160" r="12" fill="url(#nodeGlowPurple)" />
                  <circle cx="810" cy="160" r="4" fill="#A78BFA" className="s11-node-dot" />

                  {/* 5. Internships Node (CERN / Geneva: 520, 135) */}
                  <circle cx="520" cy="135" r="12" fill="url(#nodeGlowCyan)" />
                  <circle cx="520" cy="135" r="4" fill="#22D3EE" className="s11-node-dot" />

                  {/* 6. Mentorship Node (Stanford / SF: 180, 140) */}
                  <circle cx="180" cy="140" r="12" fill="url(#nodeGlowPurple)" />
                  <circle cx="180" cy="140" r="4" fill="#C4B5FD" className="s11-node-dot" />

                  {/* 7. Jobs Node (Singapore: 760, 240) */}
                  <circle cx="760" cy="240" r="12" fill="url(#nodeGlowCyan)" />
                  <circle cx="760" cy="240" r="4" fill="#22D3EE" className="s11-node-dot" />

                  {/* 8. Projects Node (Sydney / Australia: 810, 330) */}
                  <circle cx="810" cy="330" r="12" fill="url(#nodeGlowPurple)" />
                  <circle cx="810" cy="330" r="4" fill="#A78BFA" className="s11-node-dot" />

                  {/* ANANYA'S ORIGIN NODE (Bengaluru: 710, 230) */}
                  <circle cx="710" cy="230" r="20" fill="url(#nodeGlowCyan)" />
                  <circle cx="710" cy="230" r="7" fill="#22D3EE" />
                  <circle cx="710" cy="230" r="14" fill="none" stroke="#22D3EE" strokeWidth="1.5" className="s11-pulse" />
                </g>
              </svg>

              {/* OVERLAY BADGES ON MAP FOR THE 8 OPPORTUNITY TYPES */}
              <div className="s11-map-overlay">
                {/* ANANYA ORIGIN CALLOUT */}
                <div className="s11-callout ananya-callout">
                  <div className="s11-callout-avatar-wrap">
                    <img
                      src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=150&auto=format&fit=crop"
                      alt="Ananya"
                      className="s11-callout-avatar"
                      referrerPolicy="no-referrer"
                    />
                    <span className="s11-live-dot"></span>
                  </div>
                  <div className="s11-callout-info">
                    <span className="s11-callout-tag">STUDENT INPUT</span>
                    <span className="s11-callout-title">Ananya Sharma</span>
                    <span className="s11-callout-sub">Bengaluru, India</span>
                  </div>
                </div>

                {/* CONNECTED OPPORTUNITY CALLOUT (THOUSANDS OF KM AWAY) */}
                <div className="s11-callout destination-callout">
                  <div className="s11-callout-info">
                    <span className="s11-callout-tag cyan">7,200 KM MATCH</span>
                    <span className="s11-callout-title">AI Research Lab</span>
                    <span className="s11-callout-sub">ETH Zurich, Switzerland</span>
                  </div>
                </div>

                {/* THE 8 OPPORTUNITY TYPE BADGES SCATTERED CLUSTERED */}
                <div className="s11-opp-badge b-uni">
                  <span className="s11-badge-dot"></span>
                  <span>UNIVERSITIES</span>
                </div>
                <div className="s11-opp-badge b-labs">
                  <span className="s11-badge-dot purple"></span>
                  <span>RESEARCH LABS</span>
                </div>
                <div className="s11-opp-badge b-schol">
                  <span className="s11-badge-dot"></span>
                  <span>SCHOLARSHIPS</span>
                </div>
                <div className="s11-opp-badge b-comp">
                  <span className="s11-badge-dot purple"></span>
                  <span>COMPETITIONS</span>
                </div>
                <div className="s11-opp-badge b-intern">
                  <span className="s11-badge-dot"></span>
                  <span>INTERNSHIPS</span>
                </div>
                <div className="s11-opp-badge b-mentor">
                  <span className="s11-badge-dot purple"></span>
                  <span>MENTORSHIP</span>
                </div>
                <div className="s11-opp-badge b-jobs">
                  <span className="s11-badge-dot"></span>
                  <span>JOBS</span>
                </div>
                <div className="s11-opp-badge b-proj">
                  <span className="s11-badge-dot purple"></span>
                  <span>PROJECTS</span>
                </div>
              </div>
            </div>

            {/* BOTTOM BAR: 8 CATEGORIES PILL HIGHLIGHT */}
            <div className="s11-categories-bar">
              <span className="s11-cat-pill">Universities</span>
              <span className="s11-cat-pill">Research Labs</span>
              <span className="s11-cat-pill">Scholarships</span>
              <span className="s11-cat-pill">Competitions</span>
              <span className="s11-cat-pill">Internships</span>
              <span className="s11-cat-pill">Mentorship</span>
              <span className="s11-cat-pill">Jobs</span>
              <span className="s11-cat-pill">Projects</span>
            </div>
          </div>
        </section>

        {/* SLIDE 12: Lifelong AURA Growth Timeline */}
        <section className={`slide s12-growth ${currentIndex === 11 ? 'active' : ''}`} data-index="12">
          {/* SECTION TAG */}
          <div className="section-tag s12-tag relative z-20">
            <span className="num">02</span>
            <span className="line"></span>
            <span>Lifelong Growth Engine</span>
          </div>

          <div className="s12-stage relative z-10">
            {/* HERO STATEMENTS */}
            <div className="s12-hero-wrap">
              <span className="s12-eyebrow">LIFECYCLE IDENTITY LAYER</span>
              <h2 className="s12-title">
                AURA doesn't end <span className="s12-accent">when the course ends.</span>
              </h2>
              <p className="s12-sub">
                It grows with the student.
              </p>
              <div className="s12-badge-wrap">
                <span className="s12-journey-pill">
                  <span className="s12-pill-dot"></span>
                  ONE POSSIBLE JOURNEY
                </span>
              </div>
            </div>

            {/* CINEMATIC HORIZONTAL TIMELINE TRACKER */}
            <div className="s12-timeline-container">
              {/* CONNECTING GLOW BEAM LINE */}
              <div className="s12-connecting-line">
                <div className="s12-laser-pulse"></div>
              </div>

              {/* 10 HORIZONTAL STAGES */}
              <div className="s12-stages-grid">
                {/* 1. School */}
                <div className="s12-stage-node stage-1">
                  <div className="s12-node-header">
                    <span className="s12-node-num">01</span>
                    <span className="s12-node-icon">🏫</span>
                  </div>
                  <div className="s12-node-dot-wrap">
                    <div className="s12-node-dot"></div>
                  </div>
                  <div className="s12-node-body">
                    <span className="s12-node-title">School</span>
                    <span className="s12-node-sub">Early Curiosity</span>
                  </div>
                </div>

                {/* 2. Entrance Exam */}
                <div className="s12-stage-node stage-2">
                  <div className="s12-node-header">
                    <span className="s12-node-num">02</span>
                    <span className="s12-node-icon">🎯</span>
                  </div>
                  <div className="s12-node-dot-wrap">
                    <div className="s12-node-dot"></div>
                  </div>
                  <div className="s12-node-body">
                    <span className="s12-node-title">Entrance Exam</span>
                    <span className="s12-node-sub">Aptitude & Skill</span>
                  </div>
                </div>

                {/* 3. University */}
                <div className="s12-stage-node stage-3">
                  <div className="s12-node-header">
                    <span className="s12-node-num">03</span>
                    <span className="s12-node-icon">🎓</span>
                  </div>
                  <div className="s12-node-dot-wrap">
                    <div className="s12-node-dot"></div>
                  </div>
                  <div className="s12-node-body">
                    <span className="s12-node-title">University</span>
                    <span className="s12-node-sub">Academic Depth</span>
                  </div>
                </div>

                {/* 4. Research */}
                <div className="s12-stage-node stage-4">
                  <div className="s12-node-header">
                    <span className="s12-node-num">04</span>
                    <span className="s12-node-icon">🔬</span>
                  </div>
                  <div className="s12-node-dot-wrap">
                    <div className="s12-node-dot"></div>
                  </div>
                  <div className="s12-node-body">
                    <span className="s12-node-title">Research</span>
                    <span className="s12-node-sub">Discovery Papers</span>
                  </div>
                </div>

                {/* 5. Internship */}
                <div className="s12-stage-node stage-5">
                  <div className="s12-node-header">
                    <span className="s12-node-num">05</span>
                    <span className="s12-node-icon">💼</span>
                  </div>
                  <div className="s12-node-dot-wrap">
                    <div className="s12-node-dot"></div>
                  </div>
                  <div className="s12-node-body">
                    <span className="s12-node-title">Internship</span>
                    <span className="s12-node-sub">Industry Practice</span>
                  </div>
                </div>

                {/* 6. Projects */}
                <div className="s12-stage-node stage-6">
                  <div className="s12-node-header">
                    <span className="s12-node-num">06</span>
                    <span className="s12-node-icon">🚀</span>
                  </div>
                  <div className="s12-node-dot-wrap">
                    <div className="s12-node-dot"></div>
                  </div>
                  <div className="s12-node-body">
                    <span className="s12-node-title">Projects</span>
                    <span className="s12-node-sub">Shipped Products</span>
                  </div>
                </div>

                {/* 7. First Job */}
                <div className="s12-stage-node stage-7">
                  <div className="s12-node-header">
                    <span className="s12-node-num">07</span>
                    <span className="s12-node-icon">✨</span>
                  </div>
                  <div className="s12-node-dot-wrap">
                    <div className="s12-node-dot"></div>
                  </div>
                  <div className="s12-node-body">
                    <span className="s12-node-title">First Job</span>
                    <span className="s12-node-sub">Verified Roles</span>
                  </div>
                </div>

                {/* 8. Career */}
                <div className="s12-stage-node stage-8">
                  <div className="s12-node-header">
                    <span className="s12-node-num">08</span>
                    <span className="s12-node-icon">📈</span>
                  </div>
                  <div className="s12-node-dot-wrap">
                    <div className="s12-node-dot"></div>
                  </div>
                  <div className="s12-node-body">
                    <span className="s12-node-title">Career</span>
                    <span className="s12-node-sub">Domain Leadership</span>
                  </div>
                </div>

                {/* 9. Mentor */}
                <div className="s12-stage-node stage-9">
                  <div className="s12-node-header">
                    <span className="s12-node-num">09</span>
                    <span className="s12-node-icon">🤝</span>
                  </div>
                  <div className="s12-node-dot-wrap">
                    <div className="s12-node-dot"></div>
                  </div>
                  <div className="s12-node-body">
                    <span className="s12-node-title">Mentor</span>
                    <span className="s12-node-sub">Guiding Youth</span>
                  </div>
                </div>

                {/* 10. Contributor */}
                <div className="s12-stage-node stage-10">
                  <div className="s12-node-header">
                    <span className="s12-node-num">10</span>
                    <span className="s12-node-icon">🌐</span>
                  </div>
                  <div className="s12-node-dot-wrap">
                    <div className="s12-node-dot"></div>
                  </div>
                  <div className="s12-node-body">
                    <span className="s12-node-title">Contributor</span>
                    <span className="s12-node-sub">Ecosystem Anchor</span>
                  </div>
                </div>
              </div>
            </div>

            {/* TRANSFORMING AURA IDENTITY CORE CARD */}
            <div className="s12-aura-evolution-card">
              <div className="s12-evo-left">
                <div className="s12-core-orb">
                  <div className="s12-orb-ring ring-1"></div>
                  <div className="s12-orb-ring ring-2"></div>
                  <div className="s12-orb-ring ring-3"></div>
                  <div className="s12-orb-center">AURA</div>
                </div>
              </div>
              <div className="s12-evo-right">
                <div className="s12-evo-tag">CUMULATIVE VERIFIED DATASET</div>
                <div className="s12-evo-title">Continuous Identity Accumulation</div>
                <div className="s12-evo-desc">
                  Degrees expire. Resumes get stale. <strong>AURA evolves endlessly</strong> — preserving every verified project, paper, role, and endorsement as a permanent asset for life.
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SLIDE 13: Why PW? - Compounding Ecosystem Flywheel */}
        <section className={`slide s13-whypw ${currentIndex === 12 ? 'active' : ''}`} data-index="13">
          {/* SECTION TAG */}
          <div className="section-tag s13-tag relative z-20">
            <span className="num">03</span>
            <span className="line"></span>
            <span>Strategic Flywheel</span>
          </div>

          <div className="s13-stage relative z-10">
            {/* HERO STRATEGIC STATEMENT */}
            <div className="s13-hero-wrap">
              <span className="s13-eyebrow">FOUNDER STRATEGY</span>
              <h2 className="s13-title">
                Why <span className="s13-accent">Physics Wallah?</span>
              </h2>
              <div className="s13-hero-quote">
                <p className="s13-quote-primary">
                  "PW has already built the learning relationship."
                </p>
                <p className="s13-quote-secondary">
                  AURA can extend it into the student's future.
                </p>
              </div>
            </div>

            {/* COMPOUNDING ECOSYSTEM FLYWHEEL */}
            <div className="s13-flywheel-container">
              {/* SVG ANIMATED ORBITAL PATHS & CONNECTIONS */}
              <svg className="s13-flywheel-svg" viewBox="0 0 700 480" preserveAspectRatio="xMidYMid meet">
                <defs>
                  <linearGradient id="s13RingGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#22D3EE" stopOpacity="0.8" />
                    <stop offset="50%" stopColor="#A78BFA" stopOpacity="0.6" />
                    <stop offset="100%" stopColor="#34D399" stopOpacity="0.8" />
                  </linearGradient>

                  <radialGradient id="s13CoreGlow" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#22D3EE" stopOpacity="0.25" />
                    <stop offset="60%" stopColor="#A78BFA" stopOpacity="0.1" />
                    <stop offset="100%" stopColor="transparent" stopOpacity="0" />
                  </radialGradient>
                </defs>

                {/* Outer Ambient Orbital Ring */}
                <circle cx="350" cy="240" r="185" fill="none" stroke="rgba(255, 255, 255, 0.08)" strokeWidth="1" strokeDasharray="4 8" />

                {/* Animated Flow Ring */}
                <circle
                  cx="350"
                  cy="240"
                  r="185"
                  fill="none"
                  stroke="url(#s13RingGrad)"
                  strokeWidth="2.5"
                  strokeDasharray="10 18"
                  className="s13-flow-ring"
                />

                {/* Center Core Hub Glow */}
                <circle cx="350" cy="240" r="95" fill="url(#s13CoreGlow)" />
                <circle cx="350" cy="240" r="65" fill="rgba(10, 12, 24, 0.95)" stroke="rgba(34, 211, 238, 0.4)" strokeWidth="1.5" />
              </svg>

              {/* CENTER CORE TEXT */}
              <div className="s13-center-hub">
                <div className="s13-hub-icon">⚙️</div>
                <div className="s13-hub-title">COMPOUNDING</div>
                <div className="s13-hub-sub">ECOSYSTEM</div>
                <div className="s13-hub-tag">Value Reinforces Value</div>
              </div>

              {/* 8 CIRCULAR FLYWHEEL NODES */}
              <div className="s13-nodes-wrap">
                {/* 1. PW Learning (Top - Anchor) */}
                <div className="s13-fw-node node-1 anchor-pw">
                  <div className="s13-fw-num">01</div>
                  <div className="s13-fw-label">
                    <span className="s13-node-badge pw">ANCHOR</span>
                    <span className="s13-node-name">PW Learning</span>
                  </div>
                </div>

                {/* 2. Student Trust */}
                <div className="s13-fw-node node-2">
                  <div className="s13-fw-num">02</div>
                  <div className="s13-fw-label">
                    <span className="s13-node-name">Student Trust</span>
                  </div>
                </div>

                {/* 3. AURA Community */}
                <div className="s13-fw-node node-3">
                  <div className="s13-fw-num">03</div>
                  <div className="s13-fw-label">
                    <span className="s13-node-badge cyan">CORE</span>
                    <span className="s13-node-name">AURA Community</span>
                  </div>
                </div>

                {/* 4. Opportunities */}
                <div className="s13-fw-node node-4">
                  <div className="s13-fw-num">04</div>
                  <div className="s13-fw-label">
                    <span className="s13-node-name">Opportunities</span>
                  </div>
                </div>

                {/* 5. Achievements */}
                <div className="s13-fw-node node-5">
                  <div className="s13-fw-num">05</div>
                  <div className="s13-fw-label">
                    <span className="s13-node-name">Achievements</span>
                  </div>
                </div>

                {/* 6. Lifelong Engagement */}
                <div className="s13-fw-node node-6">
                  <div className="s13-fw-num">06</div>
                  <div className="s13-fw-label">
                    <span className="s13-node-name">Lifelong Engagement</span>
                  </div>
                </div>

                {/* 7. Mentors / Alumni */}
                <div className="s13-fw-node node-7">
                  <div className="s13-fw-num">07</div>
                  <div className="s13-fw-label">
                    <span className="s13-node-name">Mentors / Alumni</span>
                  </div>
                </div>

                {/* 8. New Students */}
                <div className="s13-fw-node node-8">
                  <div className="s13-fw-num">08</div>
                  <div className="s13-fw-label">
                    <span className="s13-node-name">New Students</span>
                  </div>
                </div>
              </div>
            </div>

            {/* STRATEGIC FOOTER PILLARS */}
            <div className="s13-pillars-bar">
              <div className="s13-pillar-card">
                <span className="s13-card-tag">FOUNDATION</span>
                <span className="s13-card-title">Deep Learning Bond</span>
                <span className="s13-card-desc">Daily engagement, high trust during formative prep, and proven pedagogy.</span>
              </div>
              <div className="s13-pillar-arrow">➔</div>
              <div className="s13-pillar-card cyan">
                <span className="s13-card-tag cyan">LIFELONG ASSET</span>
                <span className="s13-card-title">Permanent Identity Layer</span>
                <span className="s13-card-desc">Extending student relevance into careers, research, and alumni mentorship.</span>
              </div>
            </div>
          </div>
        </section>

        {/* SLIDE 14: Living Constellation - Network Density */}
        <section className={`slide s14-constellation ${currentIndex === 13 ? 'active' : ''}`} data-index="14">
          {/* SECTION TAG */}
          <div className="section-tag s14-tag relative z-20">
            <span className="num">03</span>
            <span className="line"></span>
            <span>Network Density</span>
          </div>

          <div className="s14-stage relative z-10">
            {/* HERO STATEMENT */}
            <div className="s14-hero-wrap">
              <span className="s14-eyebrow">COMPOUNDING COMMUNITY VALUE</span>
              <h2 className="s14-title">
                "The product gets better <span className="s14-accent">as the community gets smarter."</span>
              </h2>
              <p className="s14-sub">
                A conceptual model of network density — value accelerates non-linearly at scale.
              </p>
            </div>

            {/* LIVING CONSTELLATION SCALE DISPLAY */}
            <div className="s14-constellation-container">
              {/* STAGE TIER INDICATORS (1 -> 10 -> 100 -> 10,000 -> 1,000,000) */}
              <div className="s14-scale-track">
                <div className="s14-scale-step step-1">
                  <div className="s14-scale-num">1</div>
                  <div className="s14-scale-label">STUDENT</div>
                  <div className="s14-scale-detail">Single Identity Core</div>
                </div>
                <div className="s14-scale-arrow">→</div>
                <div className="s14-scale-step step-2">
                  <div className="s14-scale-num">10</div>
                  <div className="s14-scale-label">STUDENTS</div>
                  <div className="s14-scale-detail">Peer Verification</div>
                </div>
                <div className="s14-scale-arrow">→</div>
                <div className="s14-scale-step step-3">
                  <div className="s14-scale-num">100</div>
                  <div className="s14-scale-label">STUDENTS</div>
                  <div className="s14-scale-detail">Active Project Hubs</div>
                </div>
                <div className="s14-scale-arrow">→</div>
                <div className="s14-scale-step step-4">
                  <div className="s14-scale-num">10,000</div>
                  <div className="s14-scale-label">STUDENTS</div>
                  <div className="s14-scale-detail">Mentors & Opportunities</div>
                </div>
                <div className="s14-scale-arrow">→</div>
                <div className="s14-scale-step step-5 glow">
                  <div className="s14-scale-num">1,000,000</div>
                  <div className="s14-scale-label">STUDENTS</div>
                  <div className="s14-scale-detail">Ecosystem Engine</div>
                </div>
              </div>

              {/* LIVING CONSTELLATION GRAPH / NEBULA CANVAS */}
              <div className="s14-constellation-map">
                {/* SVG CONSTELLATION NODES & ORBITAL BEAMS */}
                <svg className="s14-map-svg" viewBox="0 0 900 210" preserveAspectRatio="xMidYMid meet">
                  <defs>
                    <radialGradient id="nebulaGlow" cx="50%" cy="50%" r="50%">
                      <stop offset="0%" stopColor="#22D3EE" stopOpacity="0.22" />
                      <stop offset="60%" stopColor="#A78BFA" stopOpacity="0.08" />
                      <stop offset="100%" stopColor="transparent" stopOpacity="0" />
                    </radialGradient>
                    <linearGradient id="beamLine" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#22D3EE" stopOpacity="0.2" />
                      <stop offset="50%" stopColor="#A78BFA" stopOpacity="0.6" />
                      <stop offset="100%" stopColor="#34D399" stopOpacity="0.8" />
                    </linearGradient>
                  </defs>

                  {/* Background Nebula Field */}
                  <ellipse cx="450" cy="105" rx="420" ry="85" fill="url(#nebulaGlow)" />

                  {/* Constellation Beams (Connecting Nodes) */}
                  <path d="M 60 105 Q 200 35 380 105 T 700 105 T 840 105" fill="none" stroke="url(#beamLine)" strokeWidth="1.5" strokeDasharray="4 6" className="s14-beam-anim" />
                  <path d="M 60 105 Q 250 175 500 105 T 840 105" fill="none" stroke="url(#beamLine)" strokeWidth="1" opacity="0.5" />

                  {/* Stellar Node Clusters */}
                  {/* Tier 1 Node */}
                  <circle cx="60" cy="105" r="6" fill="#22D3EE" className="s14-star-pulse" />
                  <circle cx="60" cy="105" r="14" fill="none" stroke="#22D3EE" strokeWidth="1" opacity="0.6" />

                  {/* Tier 2 Nodes */}
                  <g className="s14-cluster-2">
                    <circle cx="210" cy="75" r="4" fill="#A78BFA" />
                    <circle cx="230" cy="125" r="5" fill="#22D3EE" />
                    <line x1="210" y1="75" x2="230" y2="125" stroke="rgba(167, 139, 250, 0.4)" strokeWidth="1" />
                  </g>

                  {/* Tier 3 Nodes */}
                  <g className="s14-cluster-3">
                    <circle cx="380" cy="55" r="4" fill="#34D399" />
                    <circle cx="410" cy="105" r="6" fill="#A78BFA" />
                    <circle cx="390" cy="145" r="4" fill="#22D3EE" />
                    <line x1="380" y1="55" x2="410" y2="105" stroke="rgba(52, 211, 153, 0.4)" strokeWidth="1" />
                    <line x1="410" y1="105" x2="390" y2="145" stroke="rgba(34, 211, 238, 0.4)" strokeWidth="1" />
                  </g>

                  {/* Tier 4 Nodes */}
                  <g className="s14-cluster-4">
                    <circle cx="580" cy="45" r="5" fill="#22D3EE" />
                    <circle cx="620" cy="85" r="7" fill="#F59E0B" />
                    <circle cx="590" cy="135" r="5" fill="#A78BFA" />
                    <circle cx="630" cy="160" r="4" fill="#34D399" />
                    <line x1="580" y1="45" x2="620" y2="85" stroke="rgba(245, 158, 11, 0.4)" strokeWidth="1" />
                    <line x1="620" y1="85" x2="590" y2="135" stroke="rgba(167, 139, 250, 0.4)" strokeWidth="1" />
                    <line x1="590" y1="135" x2="630" y2="160" stroke="rgba(52, 211, 153, 0.4)" strokeWidth="1" />
                  </g>

                  {/* Tier 5 Dense Constellation Hub */}
                  <g className="s14-cluster-5">
                    <circle cx="840" cy="105" r="22" fill="none" stroke="#22D3EE" strokeWidth="1.5" strokeDasharray="3 3" className="s14-hub-ring" />
                    <circle cx="840" cy="105" r="10" fill="#22D3EE" className="s14-star-pulse" />
                    <circle cx="820" cy="65" r="4" fill="#A78BFA" />
                    <circle cx="870" cy="75" r="5" fill="#34D399" />
                    <circle cx="810" cy="135" r="5" fill="#F59E0B" />
                    <circle cx="865" cy="145" r="4" fill="#22D3EE" />
                  </g>
                </svg>

                {/* OVERLAYING VALUE DRIVER PILLS */}
                <div className="s14-value-drivers">
                  <div className="s14-v-chip chip-1">
                    <span className="s14-chip-dot"></span>
                    <span>More Knowledge</span>
                  </div>
                  <div className="s14-v-chip chip-2">
                    <span className="s14-chip-dot"></span>
                    <span>More Mentors</span>
                  </div>
                  <div className="s14-v-chip chip-3">
                    <span className="s14-chip-dot"></span>
                    <span>More Opportunities</span>
                  </div>
                  <div className="s14-v-chip chip-4">
                    <span className="s14-chip-dot"></span>
                    <span>More Projects</span>
                  </div>
                  <div className="s14-v-chip chip-5">
                    <span className="s14-chip-dot"></span>
                    <span>More Collaboration</span>
                  </div>
                  <div className="s14-v-chip chip-6">
                    <span className="s14-chip-dot"></span>
                    <span>More Outcomes</span>
                  </div>
                </div>
              </div>
            </div>

            {/* BOTTOM SUMMARY CARD */}
            <div className="s14-bottom-card">
              <div className="s14-card-icon">🌌</div>
              <div className="s14-card-content">
                <span className="s14-card-tag">EXPONENTIAL IMPACT</span>
                <p className="s14-card-text">
                  As the network grows, every new member brings knowledge, unlocks opportunities, and elevates mentors. The network becomes exponentially more valuable for everyone inside it.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* SLIDE 15: Premium Business Model / Sustainable Value Architecture */}
        <section className={`slide s15-bizmodel ${currentIndex === 14 ? 'active' : ''}`} data-index="15">
          {/* SECTION TAG */}
          <div className="section-tag s15-tag relative z-20">
            <span className="num">03</span>
            <span className="line"></span>
            <span>Value Architecture</span>
          </div>

          <div className="s15-stage relative z-10">
            {/* HERO TITLE SECTION */}
            <div className="s15-hero-wrap">
              <span className="s15-eyebrow">SUSTAINABLE BUSINESS MODEL</span>
              <h2 className="s15-title">
                "Keep the community free. <span className="s15-accent">Monetise high-value outcomes."</span>
              </h2>
              <p className="s15-sub">
                A trust-first model where foundational access remains open, aligning business growth with student success.
              </p>
            </div>

            {/* LAYERED BUSINESS ARCHITECTURE CONTAINER */}
            <div className="s15-model-container">
              {/* LAYER 1: FOUNDATIONAL FREE CORE */}
              <div className="s15-free-layer">
                <div className="s15-layer-header">
                  <div className="s15-layer-badge free">LAYER 01 · FOUNDATION</div>
                  <div className="s15-layer-title-wrap">
                    <h3 className="s15-layer-title">FREE CORE ECOSYSTEM</h3>
                    <span className="s15-free-pill">100% Free for Students</span>
                  </div>
                </div>
                <p className="s15-layer-desc">
                  Sovereign Identity · Peer Verification · Open Knowledge Hubs · Portfolio Showcases · Community Collaboration
                </p>
              </div>

              {/* FLOW CONNECTOR BEAM */}
              <div className="s15-flow-connector">
                <div className="s15-flow-line">
                  <div className="s15-flow-pulse"></div>
                </div>
                <div className="s15-flow-badge">
                  <span className="s15-flow-dot"></span>
                  BUILDS DEEP TRUST & DAILY ENGAGEMENT
                  <span className="s15-flow-arrow">↓</span>
                </div>
              </div>

              {/* LAYER 2: VALUE-ADDED REVENUE STREAMS GRID */}
              <div className="s15-revenue-layer">
                <div className="s15-layer-header-sm">
                  <div className="s15-layer-badge rev">LAYER 02 · HIGH-VALUE OUTCOMES</div>
                  <span className="s15-rev-subtitle">Multiple Sustainable Revenue Streams</span>
                </div>

                <div className="s15-streams-grid">
                  {/* Stream 1 */}
                  <div className="s15-stream-card">
                    <div className="s15-card-top">
                      <span className="s15-card-icon">⚡</span>
                      <span className="s15-card-num">01</span>
                    </div>
                    <h4 className="s15-stream-title">Premium AI Career Services</h4>
                    <p className="s15-stream-desc">
                      AI portfolio curation, mock interview feedback, and bespoke career trajectory planning.
                    </p>
                  </div>

                  {/* Stream 2 */}
                  <div className="s15-stream-card">
                    <div className="s15-card-top">
                      <span className="s15-card-icon">🎓</span>
                      <span className="s15-card-num">02</span>
                    </div>
                    <h4 className="s15-stream-title">University Partnerships</h4>
                    <p className="s15-stream-desc">
                      Institutional verification suites, academic research hubs, and student outcome analytics.
                    </p>
                  </div>

                  {/* Stream 3 */}
                  <div className="s15-stream-card">
                    <div className="s15-card-top">
                      <span className="s15-card-icon">🎯</span>
                      <span className="s15-card-num">03</span>
                    </div>
                    <h4 className="s15-stream-title">Employer / Talent Discovery</h4>
                    <p className="s15-stream-desc">
                      Verified capability search, skill-matched recruitment pipelines, and direct project hiring.
                    </p>
                  </div>

                  {/* Stream 4 */}
                  <div className="s15-stream-card">
                    <div className="s15-card-top">
                      <span className="s15-card-icon">🤝</span>
                      <span className="s15-card-num">04</span>
                    </div>
                    <h4 className="s15-stream-title">Mentorship Services</h4>
                    <p className="s15-stream-desc">
                      1-on-1 expert coaching, specialized cohort masterclasses, and executive peer matching.
                    </p>
                  </div>

                  {/* Stream 5 */}
                  <div className="s15-stream-card">
                    <div className="s15-card-top">
                      <span className="s15-card-icon">🛡️</span>
                      <span className="s15-card-num">05</span>
                    </div>
                    <h4 className="s15-stream-title">Verified Assessments / Credentials</h4>
                    <p className="s15-stream-desc">
                      Cryptographic skill badging, standardized benchmark testing, and audited project proof.
                    </p>
                  </div>

                  {/* Stream 6 */}
                  <div className="s15-stream-card">
                    <div className="s15-card-top">
                      <span className="s15-card-icon">🚀</span>
                      <span className="s15-card-num">06</span>
                    </div>
                    <h4 className="s15-stream-title">Opportunity Partnerships</h4>
                    <p className="s15-stream-desc">
                      Corporate hackathons, research grants, industry fellowships, and sponsored challenges.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* BOTTOM STRATEGIC TRUST BAR */}
            <div className="s15-trust-bar">
              <div className="s15-trust-shield">🛡️</div>
              <div className="s15-trust-content">
                <span className="s15-trust-title">FOUNDER STRATEGIC PRINCIPLE</span>
                <p className="s15-trust-text">
                  Zero paywalls on core learning or networking. By protecting student trust at the foundation, value creation compounds into sustainable, high-margin outcome streams.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* SLIDE 16: The Human Flywheel - Emotional Climax */}
        <section className={`slide s16-flywheel ${currentIndex === 15 ? 'active' : ''}`} data-index="16">
          {/* World-scale Cinematic Glowing Atmosphere */}
          <div className="s16-world-bg absolute inset-0 z-0 pointer-events-none">
            <div className="s16-globe-ring ring-1"></div>
            <div className="s16-globe-ring ring-2"></div>
            <div className="s16-globe-ring ring-3"></div>
            <div className="s16-aurora-glow"></div>
          </div>

          {/* SECTION TAG */}
          <div className="section-tag s16-tag relative z-20">
            <span className="num">03</span>
            <span className="line"></span>
            <span>The Human Flywheel</span>
          </div>

          <div className="s16-stage relative z-10">
            {/* HERO STATEMENT */}
            <div className="s16-hero-wrap">
              <span className="s16-eyebrow">HUMANITY AT SCALE</span>
              <h2 className="s16-title">
                "One student's success <span className="s16-accent">can become another student's opportunity."</span>
              </h2>
              <p className="s16-sub">
                An infinite generative cycle of capability, mentorship, and opportunity across a global community.
              </p>
            </div>

            {/* MAIN FLYWHEEL & SURROUNDING NETWORK CONTAINER */}
            <div className="s16-ecosystem-container">
              {/* SURROUNDING GLOBAL ENTITIES (Students, Teachers, Researchers, Professors, Professionals, Universities) */}
              <div className="s16-satellites-row">
                <div className="s16-sat-chip sat-1">
                  <span className="s16-sat-icon">🎓</span>
                  <span className="s16-sat-label">Students</span>
                </div>
                <div className="s16-sat-chip sat-2">
                  <span className="s16-sat-icon">👩‍🏫</span>
                  <span className="s16-sat-label">Teachers</span>
                </div>
                <div className="s16-sat-chip sat-3">
                  <span className="s16-sat-icon">🔬</span>
                  <span className="s16-sat-label">Researchers</span>
                </div>
                <div className="s16-sat-chip sat-4">
                  <span className="s16-sat-icon">🏛️</span>
                  <span className="s16-sat-label">Professors</span>
                </div>
                <div className="s16-sat-chip sat-5">
                  <span className="s16-sat-icon">💼</span>
                  <span className="s16-sat-label">Professionals</span>
                </div>
                <div className="s16-sat-chip sat-6">
                  <span className="s16-sat-icon">🌐</span>
                  <span className="s16-sat-label">Universities</span>
                </div>
              </div>

              {/* THE GENERATIVE CYCLE STEPS */}
              <div className="s16-cycle-track">
                <div className="s16-cycle-nodes">
                  <div className="s16-node-step step-1">
                    <div className="s16-node-badge">01</div>
                    <div className="s16-node-title">Student</div>
                    <div className="s16-node-dot"></div>
                  </div>
                  <div className="s16-node-arrow">→</div>

                  <div className="s16-node-step step-2">
                    <div className="s16-node-badge">02</div>
                    <div className="s16-node-title">Learns</div>
                    <div className="s16-node-dot"></div>
                  </div>
                  <div className="s16-node-arrow">→</div>

                  <div className="s16-node-step step-3">
                    <div className="s16-node-badge">03</div>
                    <div className="s16-node-title">Discovers</div>
                    <div className="s16-node-dot"></div>
                  </div>
                  <div className="s16-node-arrow">→</div>

                  <div className="s16-node-step step-4">
                    <div className="s16-node-badge">04</div>
                    <div className="s16-node-title">Builds</div>
                    <div className="s16-node-dot"></div>
                  </div>
                  <div className="s16-node-arrow">→</div>

                  <div className="s16-node-step step-5">
                    <div className="s16-node-badge">05</div>
                    <div className="s16-node-title">Achieves</div>
                    <div className="s16-node-dot"></div>
                  </div>
                  <div className="s16-node-arrow">→</div>

                  <div className="s16-node-step step-6">
                    <div className="s16-node-badge">06</div>
                    <div className="s16-node-title">Contributes</div>
                    <div className="s16-node-dot"></div>
                  </div>
                  <div className="s16-node-arrow">→</div>

                  <div className="s16-node-step step-7">
                    <div className="s16-node-badge">07</div>
                    <div className="s16-node-title">Mentors</div>
                    <div className="s16-node-dot"></div>
                  </div>
                  <div className="s16-node-arrow">→</div>

                  <div className="s16-node-step step-8 glow-gold">
                    <div className="s16-node-badge highlight">08</div>
                    <div className="s16-node-title highlight">Helps Another Student</div>
                    <div className="s16-node-dot gold"></div>
                  </div>
                </div>

                {/* CYCLE REPEAT INDICATOR */}
                <div className="s16-repeat-banner">
                  <span className="s16-loop-icon">↻</span>
                  <span>THE CYCLE REPEATS ENDLESSLY — EXPANDING GLOBAL HUMAN POTENTIAL</span>
                  <span className="s16-loop-icon">↻</span>
                </div>
              </div>
            </div>

            {/* EMOTIONAL CLOSING CARD */}
            <div className="s16-emotional-card">
              <div className="s16-card-glow"></div>
              <div className="s16-card-body">
                <span className="s16-card-tag">A CONTINUOUS GENERATIVE HUMAN LOOP</span>
                <p className="s16-card-quote">
                  When a student ascends, they don't leave the platform — they become the beacon for the next learner. Technology provides the framework, but humanity powers the motion.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* SLIDE 17: Final Cinematic Scene - The AURA Vision */}
        <section className={`slide s17-cinematic ${currentIndex === 16 ? 'active' : ''}`} data-index="17">
          {/* DEEP BLACK COSMIC CONTAINER WITH THOUSANDS OF CONNECTED LIGHTS */}
          <div className="s17-canvas-wrap absolute inset-0 z-0 overflow-hidden">
            <svg className="s17-starfield-svg w-full h-full" viewBox="0 0 1200 800" preserveAspectRatio="xMidYMid slice">
              <defs>
                <radialGradient id="auraCenterGlow" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#22D3EE" stopOpacity="0.4" />
                  <stop offset="50%" stopColor="#A78BFA" stopOpacity="0.18" />
                  <stop offset="100%" stopColor="transparent" stopOpacity="0" />
                </radialGradient>
                <radialGradient id="goldBrightGlow" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#F59E0B" stopOpacity="0.95" />
                  <stop offset="40%" stopColor="#22D3EE" stopOpacity="0.45" />
                  <stop offset="100%" stopColor="transparent" stopOpacity="0" />
                </radialGradient>
              </defs>

              {/* Ambient Center Nebula */}
              <ellipse cx="600" cy="400" rx="580" ry="360" fill="url(#auraCenterGlow)" className="s17-center-nebula" />

              {/* Network Constellation Beams */}
              <g className="s17-light-nodes">
                <path d="M 150 200 L 280 320 L 420 220 L 600 380 L 780 220 L 920 320 L 1050 200" fill="none" stroke="rgba(34,211,238,0.25)" strokeWidth="1" className="s17-line-net" />
                <path d="M 180 550 L 320 420 L 450 580 L 600 420 L 750 580 L 880 420 L 1020 550" fill="none" stroke="rgba(167,139,250,0.2)" strokeWidth="1" className="s17-line-net" />
                <path d="M 300 150 L 450 300 L 600 180 L 750 300 L 900 150" fill="none" stroke="rgba(52,211,153,0.2)" strokeWidth="1" className="s17-line-net" />
                <path d="M 220 650 L 380 500 L 600 620 L 820 500 L 980 650" fill="none" stroke="rgba(245,158,11,0.25)" strokeWidth="1" className="s17-line-net" />

                {/* Ambient Student Node Matrix (Thousands represented via distributed constellation stars) */}
                <g className="s17-node-matrix">
                  <circle cx="150" cy="200" r="2.5" fill="#22D3EE" className="s17-star" />
                  <circle cx="280" cy="320" r="3" fill="#A78BFA" className="s17-star" />
                  <circle cx="420" cy="220" r="2" fill="#34D399" className="s17-star" />
                  <circle cx="180" cy="550" r="3" fill="#22D3EE" className="s17-star" />
                  <circle cx="320" cy="420" r="2.5" fill="#F59E0B" className="s17-star" />
                  <circle cx="450" cy="580" r="2" fill="#A78BFA" className="s17-star" />
                  <circle cx="750" cy="580" r="2.5" fill="#34D399" className="s17-star" />
                  <circle cx="880" cy="420" r="3" fill="#22D3EE" className="s17-star" />
                  <circle cx="1020" cy="550" r="2" fill="#A78BFA" className="s17-star" />
                  <circle cx="780" cy="220" r="2.5" fill="#F59E0B" className="s17-star" />
                  <circle cx="920" cy="320" r="3" fill="#34D399" className="s17-star" />
                  <circle cx="1050" cy="200" r="2" fill="#22D3EE" className="s17-star" />
                  <circle cx="510" cy="240" r="2.5" fill="#22D3EE" className="s17-star" />
                  <circle cx="690" cy="240" r="2.5" fill="#34D399" className="s17-star" />
                  <circle cx="510" cy="540" r="2.5" fill="#A78BFA" className="s17-star" />
                  <circle cx="690" cy="540" r="2.5" fill="#F59E0B" className="s17-star" />
                </g>

                {/* Bright Light Flares: Students whose potential found opportunity */}
                <g className="s17-bright-beacons">
                  <g transform="translate(600, 380)">
                    <circle cx="0" cy="0" r="40" fill="url(#goldBrightGlow)" />
                    <circle cx="0" cy="0" r="7" fill="#FFF" className="s17-beacon-pulse" />
                  </g>
                  <g transform="translate(320, 420)">
                    <circle cx="0" cy="0" r="28" fill="url(#goldBrightGlow)" />
                    <circle cx="0" cy="0" r="5" fill="#FFF" className="s17-beacon-pulse" />
                  </g>
                  <g transform="translate(880, 420)">
                    <circle cx="0" cy="0" r="28" fill="url(#goldBrightGlow)" />
                    <circle cx="0" cy="0" r="5" fill="#FFF" className="s17-beacon-pulse" />
                  </g>
                  <g transform="translate(450, 300)">
                    <circle cx="0" cy="0" r="22" fill="url(#auraCenterGlow)" />
                    <circle cx="0" cy="0" r="4.5" fill="#22D3EE" className="s17-beacon-pulse" />
                  </g>
                  <g transform="translate(750, 300)">
                    <circle cx="0" cy="0" r="22" fill="url(#auraCenterGlow)" />
                    <circle cx="0" cy="0" r="4.5" fill="#34D399" className="s17-beacon-pulse" />
                  </g>
                </g>

                {/* AURA Symbol Emblem Ring Formation */}
                <g className="s17-aura-emblem">
                  <circle cx="600" cy="400" r="150" fill="none" stroke="rgba(34,211,238,0.4)" strokeWidth="1.5" strokeDasharray="6 8" className="s17-emblem-ring-1" />
                  <circle cx="600" cy="400" r="190" fill="none" stroke="rgba(167,139,250,0.3)" strokeWidth="1" strokeDasharray="3 12" className="s17-emblem-ring-2" />
                </g>
              </g>
            </svg>
          </div>

          {/* MAIN STAGE CONTENT */}
          <div className="s17-stage relative z-10 flex flex-col items-center text-center justify-center">
            {/* BRAND HERO */}
            <div className="s17-brand-wrap">
              <h1 className="s17-brand-title">AURA</h1>
              <p className="s17-brand-tagline">One Identity. Infinite Opportunities.</p>
            </div>

            {/* STAGGERED CORE STATEMENTS */}
            <div className="s17-statements-wrap">
              <p className="s17-stmt stmt-1">
                "Talent is everywhere."
              </p>
              <p className="s17-stmt stmt-2">
                "Let's make opportunity universal."
              </p>
            </div>

            {/* FINAL HELD BRAND EMBLEM */}
            <div className="s17-final-frame">
              <div className="s17-final-aura">AURA</div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
