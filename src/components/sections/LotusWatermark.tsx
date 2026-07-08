'use client';

import { forwardRef } from 'react';

const PETAL_ANGLES = [0, 45, 90, 135, 180, 225, 270, 315];

const LotusWatermark = forwardRef<SVGSVGElement, { className?: string }>(
  function LotusWatermark({ className }, ref) {
    return (
      <svg
        ref={ref}
        className={className}
        viewBox="0 0 200 200"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <circle
          data-core
          cx="100"
          cy="100"
          r="14"
          fill="rgba(138, 115, 88, 0.35)"
        />
        {PETAL_ANGLES.map((angle) => (
          <g key={angle} data-petal data-angle={angle} transform={`rotate(${angle} 100 100)`}>
            <path
              d="M100 100 C96 78, 88 58, 100 38 C112 58, 104 78, 100 100 Z"
              fill="rgba(138, 115, 88, 0.22)"
              stroke="rgba(138, 115, 88, 0.38)"
              strokeWidth="0.6"
            />
          </g>
        ))}
        <circle
          cx="100"
          cy="100"
          r="92"
          stroke="rgba(138, 115, 88, 0.12)"
          strokeWidth="0.5"
        />
      </svg>
    );
  }
);

export default LotusWatermark;
