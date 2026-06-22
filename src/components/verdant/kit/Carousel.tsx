import React, { useState, useRef, useEffect } from 'react';

interface CarouselItem {
  id: string;
  content: React.ReactNode;
}

interface CarouselProps {
  items: CarouselItem[];
  autoplay?: boolean;
  autoplayInterval?: number;
}

export default function Carousel({
  items,
  autoplay = false,
  autoplayInterval = 5000
}: CarouselProps) {
  const [current, setCurrent] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);
  const autoplayRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (!autoplay) return;

    autoplayRef.current = setInterval(() => {
      setCurrent((prev) => (prev + 1) % items.length);
    }, autoplayInterval);

    return () => {
      if (autoplayRef.current) clearInterval(autoplayRef.current);
    };
  }, [autoplay, autoplayInterval, items.length]);

  const goToPrevious = () => {
    setCurrent((prev) => (prev - 1 + items.length) % items.length);
  };

  const goToNext = () => {
    setCurrent((prev) => (prev + 1) % items.length);
  };

  const goToSlide = (index: number) => {
    setCurrent(index);
  };

  return (
    <div className="v-carousel">
      <div className="v-carousel__viewport">
        <div
          className="v-carousel__track"
          style={{
            transform: `translateX(-${current * 100}%)`
          }}
        >
          {items.map((item) => (
            <div key={item.id} className="v-carousel__slide">
              {item.content}
            </div>
          ))}
        </div>
      </div>

      {items.length > 1 && (
        <>
          <button
            className="v-carousel__nav v-carousel__nav--prev"
            onClick={goToPrevious}
            aria-label="Previous slide"
          >
            ←
          </button>
          <button
            className="v-carousel__nav v-carousel__nav--next"
            onClick={goToNext}
            aria-label="Next slide"
          >
            →
          </button>

          <div className="v-carousel__dots">
            {items.map((_, index) => (
              <button
                key={index}
                className={`v-carousel__dot ${index === current ? 'active' : ''}`}
                onClick={() => goToSlide(index)}
                aria-label={`Go to slide ${index + 1}`}
                aria-current={index === current}
              />
            ))}
          </div>
        </>
      )}

      <style>{`
        .v-carousel {
          position: relative;
          width: 100%;
        }

        .v-carousel__viewport {
          overflow: hidden;
          border-radius: var(--radius);
        }

        .v-carousel__track {
          display: flex;
          transition: transform 400ms var(--ease);
        }

        .v-carousel__slide {
          flex: 0 0 100%;
          min-height: 300px;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 2rem;
        }

        .v-carousel__nav {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          width: 2.5rem;
          height: 2.5rem;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(255, 255, 255, 0.9);
          border: 1px solid var(--line);
          border-radius: var(--radius);
          cursor: pointer;
          font-size: 1.2rem;
          color: var(--fg);
          transition: all 200ms var(--ease-soft);
          z-index: 10;
        }

        .v-carousel__nav:hover {
          background: var(--cream);
          box-shadow: var(--sh-md);
        }

        .v-carousel__nav--prev {
          left: 1rem;
        }

        .v-carousel__nav--next {
          right: 1rem;
        }

        .v-carousel__dots {
          display: flex;
          gap: 0.5rem;
          justify-content: center;
          margin-top: 1.5rem;
        }

        .v-carousel__dot {
          width: 0.75rem;
          height: 0.75rem;
          border-radius: 50%;
          background: var(--line);
          border: none;
          cursor: pointer;
          transition: all 200ms var(--ease-soft);
        }

        .v-carousel__dot.active {
          background: var(--green);
          transform: scale(1.3);
        }

        .v-carousel__dot:hover {
          background: var(--moss);
        }

        @media (prefers-reduced-motion: reduce) {
          .v-carousel__track {
            transition: none;
          }
        }
      `}</style>
    </div>
  );
}
