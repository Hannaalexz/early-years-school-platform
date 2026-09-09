import React from 'react';

export const SvgPencil: React.FC<{ className?: string }> = ({ className = 'w-16 h-16' }) => (
  <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    {/* Pencil Body */}
    <g transform="rotate(-35 50 50)">
      {/* Eraser */}
      <rect x="25" y="42" width="14" height="16" rx="4" fill="#F47767" />
      {/* Metal Ferrule */}
      <rect x="37" y="42" width="6" height="16" fill="#DDF1DE" />
      <line x1="39" y1="42" x2="39" y2="58" stroke="#83C98B" strokeWidth="1" />
      {/* Main Shaft */}
      <rect x="43" y="42" width="36" height="16" fill="#FFB58F" />
      <line x1="43" y1="47" x2="79" y2="47" stroke="#E85E50" strokeWidth="0.8" strokeDasharray="1 1" />
      <line x1="43" y1="53" x2="79" y2="53" stroke="#E85E50" strokeWidth="0.8" strokeDasharray="1 1" />
      {/* Wooden Tip */}
      <polygon points="79,42 93,50 79,58" fill="#F5E9D8" />
      {/* Lead Tip */}
      <polygon points="88,47 93,50 88,53" fill="#4B4039" />
    </g>
  </svg>
);

export const SvgBubble: React.FC<{ size?: number; color?: string; className?: string }> = ({
  size = 60,
  color = '#42D3C9',
  className = '',
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 100 100"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <defs>
      <radialGradient id={`bubbleGrad-${size}`} cx="38%" cy="32%" r="65%">
        <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.75" />
        <stop offset="45%" stopColor={color} stopOpacity="0.45" />
        <stop offset="85%" stopColor={color} stopOpacity="0.85" />
        <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0.6" />
      </radialGradient>
      <linearGradient id={`ringGrad-${size}`} x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.9" />
        <stop offset="100%" stopColor={color} stopOpacity="0.4" />
      </linearGradient>
    </defs>
    {/* Outer circle with gradient glow */}
    <circle cx="50" cy="50" r="46" fill={`url(#bubbleGrad-${size})`} stroke={`url(#ringGrad-${size})`} strokeWidth="2.5" />
    {/* Main Highlight Glint */}
    <ellipse cx="36" cy="32" rx="14" ry="8" transform="rotate(-30 36 32)" fill="#FFFFFF" fillOpacity="0.75" />
    {/* Small Sparkle Dot */}
    <circle cx="68" cy="66" r="4.5" fill="#FFFFFF" fillOpacity="0.55" />
    <circle cx="28" cy="46" r="3" fill="#FFFFFF" fillOpacity="0.45" />
  </svg>
);

export const SvgStar: React.FC<{ className?: string; color?: string }> = ({
  className = 'w-10 h-10',
  color = '#FFB58F',
}) => (
  <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path
      d="M50 8L61 36L92 38L67 58L75 88L50 71L25 88L33 58L8 38L39 36L50 8Z"
      fill={color}
      stroke="#FFFFFF"
      strokeWidth="3.5"
      strokeLinejoin="round"
    />
    <circle cx="50" cy="46" r="5" fill="#FFFFFF" fillOpacity="0.7" />
  </svg>
);

export const SvgCloud: React.FC<{ className?: string }> = ({ className = 'w-24 h-16' }) => (
  <svg viewBox="0 0 120 70" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path
      d="M25 55H95C106 55 115 46 115 35C115 25 107 17 97 17C95 10 88 5 80 5C70 5 62 11 60 19C56 16 51 14 45 14C32 14 22 24 22 36C12 37 5 45 5 55C5 65 14 55 25 55Z"
      fill="#FFFFFF"
      fillOpacity="0.9"
      stroke="#BDF3EE"
      strokeWidth="2.5"
    />
  </svg>
);

export const SvgRainbow: React.FC<{ className?: string }> = ({ className = 'w-28 h-20' }) => (
  <svg viewBox="0 0 120 70" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    {/* Red / Coral */}
    <path d="M10 65 A50 50 0 0 1 110 65" stroke="#F47767" strokeWidth="8" strokeLinecap="round" />
    {/* Peach */}
    <path d="M19 65 A41 41 0 0 1 101 65" stroke="#FFB58F" strokeWidth="8" strokeLinecap="round" />
    {/* Turquoise */}
    <path d="M28 65 A32 32 0 0 1 92 65" stroke="#42D3C9" strokeWidth="8" strokeLinecap="round" />
    {/* Purple */}
    <path d="M37 65 A23 23 0 0 1 83 65" stroke="#9C82D8" strokeWidth="8" strokeLinecap="round" />
  </svg>
);

export const SvgButterfly: React.FC<{ className?: string }> = ({ className = 'w-14 h-14' }) => (
  <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    {/* Antennae */}
    <path d="M48 30 Q44 20 38 18 M52 30 Q56 20 62 18" stroke="#4B4039" strokeWidth="2" strokeLinecap="round" />
    {/* Wings Left */}
    <path d="M48 45 C30 20 5 35 15 55 C20 65 38 60 48 52 Z" fill="#FFB58F" stroke="#FFFFFF" strokeWidth="2" />
    <path d="M48 55 C32 65 18 78 28 88 C38 95 48 75 50 62 Z" fill="#F47767" stroke="#FFFFFF" strokeWidth="1.5" />
    {/* Wings Right */}
    <path d="M52 45 C70 20 95 35 85 55 C80 65 62 60 52 52 Z" fill="#FFB58F" stroke="#FFFFFF" strokeWidth="2" />
    <path d="M52 55 C68 65 82 78 72 88 C62 95 52 75 50 62 Z" fill="#F47767" stroke="#FFFFFF" strokeWidth="1.5" />
    {/* Body */}
    <ellipse cx="50" cy="52" rx="4" ry="16" fill="#4B4039" />
    {/* Wing Pattern Dots */}
    <circle cx="28" cy="46" r="3.5" fill="#FFFFFF" />
    <circle cx="72" cy="46" r="3.5" fill="#FFFFFF" />
  </svg>
);

export const SvgPaperPlane: React.FC<{ className?: string }> = ({ className = 'w-16 h-16' }) => (
  <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    {/* Dotted flight trail */}
    <path d="M10 80 Q25 85 40 70 T70 45" stroke="#FFFFFF" strokeWidth="2" strokeDasharray="3 3" strokeOpacity="0.7" />
    {/* Plane Body */}
    <g transform="rotate(20 65 40)">
      <polygon points="65,15 40,65 62,55" fill="#FFFFFF" />
      <polygon points="65,15 62,55 88,65" fill="#BDF3EE" />
      <polygon points="62,55 65,70 68,55" fill="#21B8AF" />
    </g>
  </svg>
);

export const SvgSun: React.FC<{ className?: string }> = ({ className = 'w-18 h-18' }) => (
  <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    {/* Sun Rays */}
    <g stroke="#FFB58F" strokeWidth="4" strokeLinecap="round">
      <line x1="50" y1="10" x2="50" y2="20" />
      <line x1="50" y1="80" x2="50" y2="90" />
      <line x1="10" y1="50" x2="20" y2="50" />
      <line x1="80" y1="50" x2="90" y2="50" />
      <line x1="22" y1="22" x2="29" y2="29" />
      <line x1="71" y1="71" x2="78" y2="78" />
      <line x1="22" y1="78" x2="29" y2="71" />
      <line x1="71" y1="29" x2="78" y2="22" />
    </g>
    {/* Sun Face */}
    <circle cx="50" cy="50" r="24" fill="#FFB58F" stroke="#FFFFFF" strokeWidth="3" />
    {/* Happy Eyes and Smile */}
    <circle cx="43" cy="46" r="2.5" fill="#4B4039" />
    <circle cx="57" cy="46" r="2.5" fill="#4B4039" />
    <path d="M43 54 Q50 61 57 54" stroke="#4B4039" strokeWidth="2.5" strokeLinecap="round" />
    {/* Rosy Cheeks */}
    <circle cx="39" cy="53" r="2.5" fill="#F47767" fillOpacity="0.6" />
    <circle cx="61" cy="53" r="2.5" fill="#F47767" fillOpacity="0.6" />
  </svg>
);

export const SvgFlower: React.FC<{ className?: string; color?: string }> = ({
  className = 'w-12 h-12',
  color = '#9C82D8',
}) => (
  <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    {/* Stem & Leaf */}
    <path d="M50 50 Q48 75 42 92" stroke="#83C98B" strokeWidth="3.5" strokeLinecap="round" />
    <path d="M46 72 Q30 65 34 56 Q44 65 46 72" fill="#83C98B" />
    {/* 5 Petals */}
    <circle cx="50" cy="30" r="14" fill={color} opacity="0.9" />
    <circle cx="69" cy="44" r="14" fill={color} opacity="0.9" />
    <circle cx="62" cy="67" r="14" fill={color} opacity="0.9" />
    <circle cx="38" cy="67" r="14" fill={color} opacity="0.9" />
    <circle cx="31" cy="44" r="14" fill={color} opacity="0.9" />
    {/* Flower Center */}
    <circle cx="50" cy="50" r="12" fill="#FFB58F" stroke="#FFFFFF" strokeWidth="2.5" />
  </svg>
);

export const SvgOpenBook: React.FC<{ className?: string }> = ({ className = 'w-16 h-16' }) => (
  <svg viewBox="0 0 100 80" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    {/* Spine shadow */}
    <path d="M50 20 L50 72" stroke="#4B4039" strokeWidth="3" strokeLinecap="round" opacity="0.4" />
    {/* Left cover backing */}
    <path d="M50 70 Q30 66 8 72 L8 24 Q30 18 50 22 Z" fill="#9C82D8" />
    {/* Right cover backing */}
    <path d="M50 70 Q70 66 92 72 L92 24 Q70 18 50 22 Z" fill="#F47767" />
    {/* Left Page (stacked effect) */}
    <path d="M50 67 Q30 63 11 68 L11 21 Q30 16 50 20 Z" fill="#FFF7EC" stroke="#F5E9D8" strokeWidth="1" />
    <path d="M50 64 Q30 60 14 65 L14 18 Q30 13 50 17 Z" fill="#FFFFFF" />
    {/* Left Page text lines */}
    <line x1="20" y1="26" x2="43" y2="24" stroke="#BDF3EE" strokeWidth="2" strokeLinecap="round" />
    <line x1="20" y1="33" x2="43" y2="31" stroke="#BDF3EE" strokeWidth="2" strokeLinecap="round" />
    <line x1="20" y1="40" x2="38" y2="38" stroke="#BDF3EE" strokeWidth="2" strokeLinecap="round" />
    {/* Right Page */}
    <path d="M50 67 Q70 63 89 68 L89 21 Q70 16 50 20 Z" fill="#FFF7EC" stroke="#F5E9D8" strokeWidth="1" />
    <path d="M50 64 Q70 60 86 65 L86 18 Q70 13 50 17 Z" fill="#FFFFFF" />
    {/* Right Page illustration: tiny sun & mountain */}
    <circle cx="70" cy="27" r="4" fill="#FFB58F" />
    <path d="M60 48 L68 38 L76 48 Z" fill="#83C98B" />
    <path d="M72 48 L78 41 L84 48 Z" fill="#21B8AF" />
    {/* Bookmark ribbon */}
    <path d="M50 20 Q54 40 58 55 L54 53 L50 56 Z" fill="#FFB58F" />
  </svg>
);

export const SvgAlphabetBlocks: React.FC<{ className?: string }> = ({ className = 'w-16 h-16' }) => (
  <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    {/* Bottom Left Block 'B' (Turquoise) */}
    <g transform="translate(10, 42)">
      <rect x="0" y="0" width="38" height="38" rx="8" fill="#42D3C9" stroke="#FFFFFF" strokeWidth="2.5" />
      <rect x="4" y="4" width="30" height="30" rx="5" fill="#21B8AF" />
      <text x="19" y="27" textAnchor="middle" fill="#FFFFFF" fontFamily="Baloo 2" fontWeight="800" fontSize="22">
        B
      </text>
    </g>
    {/* Bottom Right Block 'C' (Peach) */}
    <g transform="translate(52, 45)">
      <rect x="0" y="0" width="38" height="38" rx="8" fill="#FFB58F" stroke="#FFFFFF" strokeWidth="2.5" />
      <rect x="4" y="4" width="30" height="30" rx="5" fill="#FFA575" />
      <text x="19" y="27" textAnchor="middle" fill="#FFFFFF" fontFamily="Baloo 2" fontWeight="800" fontSize="22">
        C
      </text>
    </g>
    {/* Top Stacked Block 'A' (Coral) */}
    <g transform="translate(31, 8)">
      <rect x="0" y="0" width="38" height="38" rx="8" fill="#F47767" stroke="#FFFFFF" strokeWidth="2.5" />
      <rect x="4" y="4" width="30" height="30" rx="5" fill="#E85E50" />
      <text x="19" y="27" textAnchor="middle" fill="#FFFFFF" fontFamily="Baloo 2" fontWeight="800" fontSize="22">
        A
      </text>
    </g>
  </svg>
);

export const SvgHandDrawnLine: React.FC<{ className?: string; color?: string }> = ({
  className = 'w-36 h-6',
  color = '#F47767',
}) => (
  <svg viewBox="0 0 160 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path
      d="M4 14 Q30 4 60 14 T120 12 T156 16"
      stroke={color}
      strokeWidth="4"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const SvgChildrenScribble: React.FC<{ className?: string; color?: string }> = ({
  className = 'w-20 h-20',
  color = '#42D3C9',
}) => (
  <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path
      d="M20 50 C10 30 35 15 50 25 C65 35 60 65 35 60 C15 55 20 20 55 35 C70 42 65 70 45 68"
      stroke={color}
      strokeWidth="3.5"
      strokeLinecap="round"
      strokeDasharray="4 2"
    />
  </svg>
);

export const SvgLeafBranch: React.FC<{ className?: string; color?: string }> = ({
  className = 'w-16 h-16',
  color = '#38B2AC',
}) => (
  <svg viewBox="0 0 80 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    {/* Main Stem */}
    <path d="M40 95 Q38 50 45 10" stroke={color} strokeWidth="3" strokeLinecap="round" />
    {/* Leaves Left */}
    <path d="M40 75 C25 70 20 55 38 62" fill={color} fillOpacity="0.25" stroke={color} strokeWidth="2" strokeLinejoin="round" />
    <path d="M41 50 C24 45 22 30 39 38" fill={color} fillOpacity="0.25" stroke={color} strokeWidth="2" strokeLinejoin="round" />
    <path d="M43 25 C30 20 28 8 42 16" fill={color} fillOpacity="0.25" stroke={color} strokeWidth="2" strokeLinejoin="round" />
    {/* Leaves Right */}
    <path d="M40 65 C55 60 62 45 42 53" fill={color} fillOpacity="0.25" stroke={color} strokeWidth="2" strokeLinejoin="round" />
    <path d="M42 40 C58 35 64 20 44 28" fill={color} fillOpacity="0.25" stroke={color} strokeWidth="2" strokeLinejoin="round" />
    {/* Top Sprout */}
    <circle cx="45" cy="10" r="4" fill={color} />
  </svg>
);

export const SvgHeartDoodle: React.FC<{ className?: string; color?: string }> = ({
  className = 'w-8 h-8',
  color = '#FFFFFF',
}) => (
  <svg viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path
      d="M30 48 C15 38 8 26 8 18 C8 11 14 7 21 7 C26 7 29 11 30 13 C31 11 34 7 39 7 C46 7 52 11 52 18 C52 26 45 38 30 48 Z"
      stroke={color}
      strokeWidth="3.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    />
  </svg>
);

export const SvgLoopFlightTrail: React.FC<{ className?: string }> = ({
  className = 'w-full h-16',
}) => (
  <svg viewBox="0 0 800 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} preserveAspectRatio="none">
    {/* Looped sinusoidal flight trail */}
    <path
      d="M10 60 C80 60 120 20 180 50 C240 80 270 20 330 50 C380 75 420 10 470 50 C520 90 560 20 610 50 C660 80 710 30 790 40"
      stroke="#FFFFFF"
      strokeWidth="2.5"
      strokeDasharray="6 6"
      strokeOpacity="0.6"
      strokeLinecap="round"
    />
    {/* Tiny flight loop */}
    <path
      d="M470 50 C490 20 460 10 450 30 C440 50 480 60 510 50"
      stroke="#FFFFFF"
      strokeWidth="2"
      strokeDasharray="4 4"
      strokeOpacity="0.5"
      strokeLinecap="round"
    />
  </svg>
);

export const SvgSunCompass: React.FC<{ className?: string; color?: string }> = ({
  className = 'w-14 h-14',
  color = '#FFFFFF',
}) => (
  <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <circle cx="40" cy="40" r="22" stroke={color} strokeWidth="2.5" strokeDasharray="3 3" strokeOpacity="0.8" />
    <circle cx="40" cy="40" r="12" stroke={color} strokeWidth="2.5" strokeOpacity="0.9" />
    <circle cx="40" cy="40" r="4" fill={color} />
    {/* 8 radiating rays */}
    <line x1="40" y1="8" x2="40" y2="15" stroke={color} strokeWidth="3" strokeLinecap="round" />
    <line x1="40" y1="65" x2="40" y2="72" stroke={color} strokeWidth="3" strokeLinecap="round" />
    <line x1="8" y1="40" x2="15" y2="40" stroke={color} strokeWidth="3" strokeLinecap="round" />
    <line x1="65" y1="40" x2="72" y2="40" stroke={color} strokeWidth="3" strokeLinecap="round" />
    <line x1="17" y1="17" x2="23" y2="23" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
    <line x1="57" y1="57" x2="63" y2="63" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
    <line x1="17" y1="63" x2="23" y2="57" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
    <line x1="57" y1="23" x2="63" y2="17" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
  </svg>
);

export const PillarIconBook: React.FC<{ className?: string; color?: string }> = ({
  className = 'w-10 h-10',
  color = '#EF4444',
}) => (
  <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path
      d="M10 46 C20 42 28 42 32 45 C36 42 44 42 54 46 L54 18 C44 14 36 14 32 17 C28 14 20 14 10 18 Z"
      fill={color}
      fillOpacity="0.1"
    />
    <path
      d="M32 17 C27 13.5 18 13.5 10 18 L10 47 C18 42.5 27 42.5 32 46 C37 42.5 46 42.5 54 47 L54 18 C46 13.5 37 13.5 32 17 Z"
      stroke={color}
      strokeWidth="3.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path d="M32 17 L32 46" stroke={color} strokeWidth="3.5" strokeLinecap="round" />
    <path d="M16 26 C21 23 26 23 29 25" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeOpacity="0.75" />
    <path d="M16 34 C21 31 26 31 29 33" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeOpacity="0.75" />
    <path d="M35 25 C38 23 43 23 48 26" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeOpacity="0.75" />
    <path d="M35 33 C38 31 43 31 48 34" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeOpacity="0.75" />
    <path d="M32 20 L32 30 L35 27 L38 30 L38 20" fill={color} fillOpacity="0.3" stroke={color} strokeWidth="2" strokeLinejoin="round" />
  </svg>
);

export const PillarIconPuzzle: React.FC<{ className?: string; color?: string }> = ({
  className = 'w-10 h-10',
  color = '#10B981',
}) => (
  <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path
      d="M16 16 H26 C26 12 30 10 32 10 C34 10 38 12 38 16 H48 V26 C52 26 54 30 54 32 C54 34 52 38 48 38 V48 H38 C38 44 34 42 32 42 C30 42 26 44 26 48 H16 V38 C20 38 22 34 22 32 C22 30 20 26 16 26 Z"
      fill={color}
      fillOpacity="0.12"
    />
    <path
      d="M16 16 H26 C26.2 12.2 29.5 9.5 32 9.5 C34.5 9.5 37.8 12.2 38 16 H48 V26 C51.8 26.2 54.5 29.5 54.5 32 C54.5 34.5 51.8 37.8 48 38 V48 H38 C37.8 44.2 34.5 41.5 32 41.5 C29.5 41.5 26.2 44.2 26 48 H16 V38 C19.8 37.8 22.5 34.5 22.5 32 C22.5 29.5 19.8 26.2 16 26 Z"
      stroke={color}
      strokeWidth="3.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <circle cx="24" cy="24" r="2.5" fill={color} fillOpacity="0.8" />
  </svg>
);

export const PillarIconTeacher: React.FC<{ className?: string; color?: string }> = ({
  className = 'w-10 h-10',
  color = '#F97316',
}) => (
  <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <circle cx="32" cy="20" r="10" fill={color} fillOpacity="0.1" />
    <path d="M14 54 C14 42 22 38 32 38 C42 38 50 42 50 54" fill={color} fillOpacity="0.08" />
    <circle cx="32" cy="20" r="10" stroke={color} strokeWidth="3.5" strokeLinecap="round" />
    <path d="M25 18 C27 14 37 14 39 18" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
    <path
      d="M14 54 C14 42 22 37 32 37 C42 37 50 42 50 54"
      stroke={color}
      strokeWidth="3.5"
      strokeLinecap="round"
    />
    <path d="M26 37 L32 46 L38 37" stroke={color} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
    <circle cx="32" cy="49" r="2" fill={color} />
  </svg>
);

export const PillarIconHeartHealth: React.FC<{ className?: string; color?: string }> = ({
  className = 'w-10 h-10',
  color = '#10B981',
}) => (
  <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path
      d="M32 52 C20 42 12 33 12 23 C12 16 17 11 24 11 C28 11 31 13 32 16 C33 13 36 11 40 11 C47 11 52 16 52 23 C52 33 44 42 32 52 Z"
      fill={color}
      fillOpacity="0.12"
    />
    <path
      d="M32 52 C20 42 12 33 12 23 C12 16 17 11 24 11 C28 11 31 13 32 16 C33 13 36 11 40 11 C47 11 52 16 52 23 C52 33 44 42 32 52 Z"
      stroke={color}
      strokeWidth="3.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path d="M32 43 C32 33 32 23 38 20" stroke={color} strokeWidth="3" strokeLinecap="round" />
    <path
      d="M32 34 C27 33 25 27 30 28 C32 28.5 32 31 32 34 Z"
      fill={color}
      fillOpacity="0.4"
      stroke={color}
      strokeWidth="2"
      strokeLinejoin="round"
    />
    <path
      d="M34 26 C39 24 43 28 38 30 C36 30.5 34.5 28.5 34 26 Z"
      fill={color}
      fillOpacity="0.4"
      stroke={color}
      strokeWidth="2"
      strokeLinejoin="round"
    />
  </svg>
);

export const AnimatedButterfly: React.FC<{ className?: string; color?: string; wingColor?: string }> = ({
  className = 'w-12 h-12',
  color = '#21B8AF',
  wingColor = '#FF9F80',
}) => (
  <div className={`animate-butterfly-flight inline-block ${className}`}>
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full overflow-visible">
      {/* Left Wing with Flutter */}
      <g className="animate-wing-left origin-[32px_32px]">
        <path
          d="M30 30 C22 14 6 18 10 32 C12 38 24 38 30 34 Z"
          fill={wingColor}
          fillOpacity="0.85"
          stroke="#4B4039"
          strokeWidth="2"
        />
        <path
          d="M30 34 C20 36 12 46 18 52 C24 56 30 44 30 36 Z"
          fill={color}
          fillOpacity="0.75"
          stroke="#4B4039"
          strokeWidth="2"
        />
        <circle cx="20" cy="28" r="3" fill="#FFFFFF" fillOpacity="0.9" />
        <circle cx="22" cy="44" r="2" fill="#FFFFFF" fillOpacity="0.9" />
      </g>

      {/* Right Wing with Flutter */}
      <g className="animate-wing-right origin-[32px_32px]">
        <path
          d="M34 30 C42 14 58 18 54 32 C52 38 40 38 34 34 Z"
          fill={wingColor}
          fillOpacity="0.85"
          stroke="#4B4039"
          strokeWidth="2"
        />
        <path
          d="M34 34 C44 36 52 46 46 52 C40 56 34 44 34 36 Z"
          fill={color}
          fillOpacity="0.75"
          stroke="#4B4039"
          strokeWidth="2"
        />
        <circle cx="44" cy="28" r="3" fill="#FFFFFF" fillOpacity="0.9" />
        <circle cx="42" cy="44" r="2" fill="#FFFFFF" fillOpacity="0.9" />
      </g>

      {/* Center Butterfly Body */}
      <ellipse cx="32" cy="36" rx="3" ry="12" fill="#4B4039" />
      <circle cx="32" cy="22" r="4" fill="#4B4039" />
      {/* Antennae */}
      <path d="M30 20 C26 14 22 14 20 16" stroke="#4B4039" strokeWidth="2" strokeLinecap="round" />
      <circle cx="19" cy="17" r="1.5" fill="#F47767" />
      <path d="M34 20 C38 14 42 14 44 16" stroke="#4B4039" strokeWidth="2" strokeLinecap="round" />
      <circle cx="45" cy="17" r="1.5" fill="#F47767" />
    </svg>
  </div>
);

export const AnimatedBee: React.FC<{ className?: string }> = ({
  className = 'w-14 h-14',
}) => (
  <div className={`animate-bee-buzz inline-block ${className}`}>
    <svg viewBox="0 0 72 72" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full overflow-visible">
      {/* Flight Trail Loop */}
      <path
        d="M6 56 C14 62 26 58 24 46 C22 36 12 40 18 50 C22 56 34 48 38 42"
        stroke="#21B8AF"
        strokeWidth="2"
        strokeDasharray="3 3"
        strokeLinecap="round"
        fill="none"
        opacity="0.7"
      />
      {/* Wings */}
      <ellipse cx="44" cy="26" rx="7" ry="12" fill="#BDF3EE" fillOpacity="0.8" stroke="#168F89" strokeWidth="1.5" transform="rotate(-25 44 26)" />
      <ellipse cx="52" cy="28" rx="6" ry="10" fill="#BDF3EE" fillOpacity="0.7" stroke="#168F89" strokeWidth="1.5" transform="rotate(15 52 28)" />
      {/* Body */}
      <ellipse cx="48" cy="40" rx="14" ry="10" fill="#FFC93E" stroke="#4B4039" strokeWidth="2.5" />
      {/* Black Stripes */}
      <path d="M44 31 C46 37 46 43 44 49" stroke="#4B4039" strokeWidth="3.5" strokeLinecap="round" />
      <path d="M51 31 C53 37 53 43 51 49" stroke="#4B4039" strokeWidth="3.5" strokeLinecap="round" />
      {/* Face & Stinger */}
      <circle cx="58" cy="38" r="1.5" fill="#4B4039" />
      <path d="M57 42 C59 44 61 43 62 41" stroke="#4B4039" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M34 40 L30 40" stroke="#4B4039" strokeWidth="2" strokeLinecap="round" />
      {/* Cute Antennae */}
      <path d="M56 32 C58 26 62 26 63 28" stroke="#4B4039" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="63" cy="28" r="1" fill="#F47767" />
    </svg>
  </div>
);

export const AnimatedCuteBunny: React.FC<{ className?: string }> = ({
  className = 'w-16 h-16',
}) => (
  <div className={`animate-animal-peek inline-block ${className}`}>
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      {/* Ears */}
      <ellipse cx="25" cy="18" rx="5" ry="14" fill="#FFFFFF" stroke="#4B4039" strokeWidth="2.5" transform="rotate(-10 25 18)" />
      <ellipse cx="25" cy="18" rx="2.5" ry="10" fill="#FFD1DC" transform="rotate(-10 25 18)" />
      <ellipse cx="39" cy="18" rx="5" ry="14" fill="#FFFFFF" stroke="#4B4039" strokeWidth="2.5" transform="rotate(10 39 18)" />
      <ellipse cx="39" cy="18" rx="2.5" ry="10" fill="#FFD1DC" transform="rotate(10 39 18)" />
      {/* Head */}
      <circle cx="32" cy="40" r="16" fill="#FFFFFF" stroke="#4B4039" strokeWidth="2.5" />
      {/* Eyes */}
      <circle cx="26" cy="38" r="2.5" fill="#4B4039" />
      <circle cx="27" cy="37" r="1" fill="#FFFFFF" />
      <circle cx="38" cy="38" r="2.5" fill="#4B4039" />
      <circle cx="39" cy="37" r="1" fill="#FFFFFF" />
      {/* Nose & Mouth */}
      <polygon points="32,43 30,41 34,41" fill="#F47767" />
      <path d="M30 45 C31 46.5 32 46.5 32 45 C32 46.5 33 46.5 34 45" stroke="#4B4039" strokeWidth="1.5" strokeLinecap="round" />
      {/* Cheeks */}
      <circle cx="22" cy="42" r="2.5" fill="#FFB58F" fillOpacity="0.6" />
      <circle cx="42" cy="42" r="2.5" fill="#FFB58F" fillOpacity="0.6" />
      {/* Whiskers */}
      <path d="M18 39 L12 38" stroke="#4B4039" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M18 42 L13 43" stroke="#4B4039" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M46 39 L52 38" stroke="#4B4039" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M46 42 L51 43" stroke="#4B4039" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  </div>
);

export const AnimatedCuteLion: React.FC<{ className?: string }> = ({
  className = 'w-16 h-16',
}) => (
  <div className={`animate-animal-peek inline-block ${className}`}>
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      {/* Mane Petals */}
      <circle cx="32" cy="32" r="20" fill="#FDBA74" stroke="#EA580C" strokeWidth="2" strokeDasharray="6 2" />
      <circle cx="32" cy="32" r="15" fill="#FEEBC8" stroke="#C05621" strokeWidth="2.5" />
      {/* Ears */}
      <circle cx="21" cy="21" r="4.5" fill="#FDBA74" stroke="#C05621" strokeWidth="2" />
      <circle cx="21" cy="21" r="2" fill="#FEEBC8" />
      <circle cx="43" cy="21" r="4.5" fill="#FDBA74" stroke="#C05621" strokeWidth="2" />
      <circle cx="43" cy="21" r="2" fill="#FEEBC8" />
      {/* Eyes */}
      <circle cx="27" cy="30" r="2" fill="#4B4039" />
      <circle cx="37" cy="30" r="2" fill="#4B4039" />
      {/* Snout */}
      <ellipse cx="32" cy="35" rx="4.5" ry="3" fill="#FFFFFF" />
      <polygon points="32,34 30.5,32 33.5,32" fill="#C05621" />
      <path d="M32 34 L32 37" stroke="#4B4039" strokeWidth="1.5" strokeLinecap="round" />
      {/* Cheeks */}
      <circle cx="24" cy="34" r="2" fill="#F47767" fillOpacity="0.5" />
      <circle cx="40" cy="34" r="2" fill="#F47767" fillOpacity="0.5" />
    </svg>
  </div>
);

export const AnimatedCuteGiraffe: React.FC<{ className?: string }> = ({
  className = 'w-16 h-20',
}) => (
  <div className={`animate-animal-peek inline-block ${className}`}>
    <svg viewBox="0 0 64 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      {/* Neck */}
      <path d="M26 44 L26 80 L38 80 L38 44 Z" fill="#FCD34D" stroke="#4B4039" strokeWidth="2" />
      <circle cx="32" cy="58" r="3.5" fill="#B45309" fillOpacity="0.75" />
      <circle cx="34" cy="72" r="3" fill="#B45309" fillOpacity="0.75" />
      {/* Horns / Ossicones */}
      <path d="M26 18 L26 12" stroke="#4B4039" strokeWidth="2.5" strokeLinecap="round" />
      <circle cx="26" cy="11" r="2.5" fill="#B45309" />
      <path d="M38 18 L38 12" stroke="#4B4039" strokeWidth="2.5" strokeLinecap="round" />
      <circle cx="38" cy="11" r="2.5" fill="#B45309" />
      {/* Ears */}
      <ellipse cx="19" cy="22" rx="4" ry="2.5" fill="#FCD34D" stroke="#4B4039" strokeWidth="1.5" transform="rotate(-20 19 22)" />
      <ellipse cx="45" cy="22" rx="4" ry="2.5" fill="#FCD34D" stroke="#4B4039" strokeWidth="1.5" transform="rotate(20 45 22)" />
      {/* Head */}
      <ellipse cx="32" cy="26" rx="11" ry="13" fill="#FCD34D" stroke="#4B4039" strokeWidth="2" />
      {/* Snout */}
      <ellipse cx="32" cy="35" rx="8" ry="6" fill="#FDE68A" stroke="#4B4039" strokeWidth="1.5" />
      <circle cx="29" cy="34" r="1" fill="#4B4039" />
      <circle cx="35" cy="34" r="1" fill="#4B4039" />
      {/* Eyes with Long Lashes */}
      <circle cx="27" cy="24" r="2" fill="#4B4039" />
      <circle cx="37" cy="24" r="2" fill="#4B4039" />
      {/* Cheeks */}
      <circle cx="24" cy="29" r="2" fill="#F47767" fillOpacity="0.5" />
      <circle cx="40" cy="29" r="2" fill="#F47767" fillOpacity="0.5" />
    </svg>
  </div>
);

export const AnimatedFloatingBalloon: React.FC<{ className?: string; color?: string }> = ({
  className = 'w-12 h-18',
  color = '#F47767',
}) => (
  <div className={`animate-balloon-drift inline-block ${className}`}>
    <svg viewBox="0 0 48 72" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <ellipse cx="24" cy="26" rx="18" ry="22" fill={color} stroke="#4B4039" strokeWidth="2" />
      {/* Highlight reflection */}
      <ellipse cx="18" cy="18" rx="4" ry="7" fill="#FFFFFF" fillOpacity="0.45" transform="rotate(-25 18 18)" />
      {/* Balloon Knot */}
      <polygon points="24,47 21,51 27,51" fill={color} stroke="#4B4039" strokeWidth="1.5" />
      {/* Balloon String */}
      <path d="M24 51 C22 57 26 62 24 68 C23 70 25 72 24 72" stroke="#4B4039" strokeWidth="1.5" strokeLinecap="round" fill="none" />
    </svg>
  </div>
);


