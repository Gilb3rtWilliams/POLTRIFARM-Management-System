import React, { useState, useEffect, useRef, useCallback } from 'react';
import '../css/Slideshow.css';
import slide1 from '../assets/slide1.jpg';
import slide2 from '../assets/slide2.jpg';
import slide3 from '../assets/slide3.jpg';
import slide4 from '../assets/slide4.jpg';
import slide5 from '../assets/slide5.jpg';
import slide6 from '../assets/slide6.jpg';
import slide7 from '../assets/slide7.jpg';
import slide8 from '../assets/slide8.jpg';
import slide9 from '../assets/slide9.jpg';
import slide10 from '../assets/slide10.jpg';

const SLIDES = [
  { image: slide1, label: 'Flock Management'    },
  { image: slide2, label: 'Production Analytics' },
  { image: slide3, label: 'Health & Biosecurity' },
  { image: slide4, label: 'Multi-Farm Control'   },
  { image: slide5, label: 'Real-Time Monitoring' },
  { image: slide6, label: 'Inventory Tracking'   },
  { image: slide7, label: 'Sales & Invoicing'    },
  { image: slide8, label: 'Financial Reporting'  },
  { image: slide9, label: 'Mobile Access'        },
  { image: slide10, label: 'Custom Integrations' },
];

const INTERVAL = 6000; // ms per slide

const Slideshow = () => {
  const [current, setCurrent]       = useState(0);
  const [previous, setPrevious]     = useState(null);
  const [direction, setDirection]   = useState('next'); // 'next' | 'prev'
  const [isPaused, setIsPaused]     = useState(false);
  const [progress, setProgress]     = useState(0);
  const timerRef   = useRef(null);
  const progressRef = useRef(null);
  const startTime  = useRef(null);

  /* ── Navigate with direction awareness ── */
  const goTo = useCallback((index, dir = 'next') => {
    setPrevious(current);
    setDirection(dir);
    setCurrent(index);
    setProgress(0);
    startTime.current = performance.now();
  }, [current]);

  const goNext = useCallback(() => {
    goTo(current === SLIDES.length - 1 ? 0 : current + 1, 'next');
  }, [current, goTo]);

  const goPrev = useCallback(() => {
    goTo(current === 0 ? SLIDES.length - 1 : current - 1, 'prev');
  }, [current, goTo]);

  /* ── Auto-advance ── */
  useEffect(() => {
    if (isPaused) return;
    timerRef.current = setTimeout(goNext, INTERVAL);
    return () => clearTimeout(timerRef.current);
  }, [current, isPaused, goNext]);

  /* ── Smooth progress bar ── */
  useEffect(() => {
    if (isPaused) return;
    startTime.current = performance.now();

    const tick = (now) => {
      const elapsed = now - startTime.current;
      setProgress(Math.min((elapsed / INTERVAL) * 100, 100));
      progressRef.current = requestAnimationFrame(tick);
    };
    progressRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(progressRef.current);
  }, [current, isPaused]);

  /* ── Keyboard navigation ── */
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'ArrowRight') goNext();
      if (e.key === 'ArrowLeft')  goPrev();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [goNext, goPrev]);

  /* ── Clear previous slide after transition ── */
  useEffect(() => {
    const t = setTimeout(() => setPrevious(null), 1200);
    return () => clearTimeout(t);
  }, [current]);

  return (
    <div
      className="slideshow"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      aria-label="Farm image slideshow"
      role="region"
    >
      {/* ── Slide layers ── */}
      {SLIDES.map((slide, i) => {
        const isActive   = i === current;
        const isPrevious = i === previous;
        return (
          <div
            key={i}
            className={[
              'slide',
              isActive   ? `slide--active slide--enter-${direction}` : '',
              isPrevious ? `slide--exit slide--exit-${direction}`    : '',
            ].join(' ').trim()}
            style={{ backgroundImage: `url(${slide.image})` }}
            aria-hidden={!isActive}
          >
            {/* Ken Burns zoom layer */}
            <div className={`slide-zoom ${isActive ? 'slide-zoom--active' : ''}`} />
          </div>
        );
      })}

      {/* ── Vignette overlay ── */}
      <div className="slideshow-vignette" aria-hidden="true" />

      {/* ── Gold progress bar ── */}
      <div className="slideshow-progress" aria-hidden="true">
        <div
          className="slideshow-progress-bar"
          style={{ width: `${progress}%`, transition: isPaused ? 'none' : 'none' }}
        />
      </div>

      {/* ── Slide counter top-right ── */}
      <div className="slide-counter" aria-live="polite" aria-atomic="true">
        <span className="slide-counter-current">
          {String(current + 1).padStart(2, '0')}
        </span>
        <span className="slide-counter-divider" aria-hidden="true" />
        <span className="slide-counter-total">
          {String(SLIDES.length).padStart(2, '0')}
        </span>
      </div>

      {/* ── Current slide label ── */}
      <div className="slide-label" key={current} aria-live="polite">
        <span className="slide-label-line" aria-hidden="true" />
        {SLIDES[current].label}
      </div>

      {/* ── Prev / Next arrows ── */}
      <button
        className="slide-arrow slide-arrow--prev"
        onClick={goPrev}
        aria-label="Previous slide"
      >
        <span className="arrow-inner">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </span>
      </button>

      <button
        className="slide-arrow slide-arrow--next"
        onClick={goNext}
        aria-label="Next slide"
      >
        <span className="arrow-inner">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M9 18l6-6-6-6" />
          </svg>
        </span>
      </button>

      {/* ── Dot indicators ── */}
      <div className="slide-indicators" role="tablist" aria-label="Slide navigation">
        {SLIDES.map((slide, i) => (
          <button
            key={i}
            role="tab"
            aria-selected={i === current}
            aria-label={`Go to slide ${i + 1}: ${slide.label}`}
            className={`indicator ${i === current ? 'indicator--active' : ''}`}
            onClick={() => goTo(i, i > current ? 'next' : 'prev')}
          >
            <span className="indicator-fill" />
          </button>
        ))}
      </div>

      {/* ── Pause indicator ── */}
      {isPaused && (
        <div className="slideshow-paused" aria-live="polite">Paused</div>
      )}
    </div>
  );
};

export default Slideshow;
