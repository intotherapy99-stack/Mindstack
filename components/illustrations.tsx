import React from "react";

interface IllustrationProps {
  className?: string;
  width?: number;
  height?: number;
}

// ---------- 1. Therapist ----------
export const IllustrationTherapist: React.FC<IllustrationProps> = ({
  className,
  width = 200,
  height = 200,
}) => (
  <svg
    viewBox="0 0 200 200"
    width={width}
    height={height}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    {/* Background circle */}
    <circle cx="100" cy="100" r="90" fill="#E6F4F4" />

    {/* Plant pot */}
    <rect x="148" y="110" width="24" height="28" rx="4" fill="#E8E5E2" />
    <rect x="144" y="106" width="32" height="8" rx="4" fill="#E8E5E2" />
    {/* Plant leaves */}
    <ellipse cx="160" cy="94" rx="8" ry="14" fill="#00979A" transform="rotate(-15 160 94)" />
    <ellipse cx="155" cy="88" rx="7" ry="12" fill="#B2E0E1" transform="rotate(15 155 88)" />
    <ellipse cx="165" cy="86" rx="6" ry="11" fill="#00979A" opacity="0.7" transform="rotate(-30 165 86)" />
    {/* Small leaf detail */}
    <line x1="160" y1="106" x2="160" y2="82" stroke="#00979A" strokeWidth="1.5" strokeLinecap="round" />

    {/* Chair */}
    <rect x="50" y="120" width="50" height="40" rx="10" fill="#F7F5F3" />
    <rect x="46" y="112" width="14" height="50" rx="7" fill="#E8E5E2" />

    {/* Person - body */}
    <rect x="58" y="100" width="34" height="44" rx="12" fill="#00979A" />
    {/* Person - head */}
    <circle cx="75" cy="82" r="16" fill="#D4A574" />
    {/* Hair */}
    <path d="M60 78 Q60 66 75 64 Q90 66 90 78" fill="#2D2D2D" opacity="0.85" />
    {/* Eyes */}
    <circle cx="70" cy="82" r="1.5" fill="#333" />
    <circle cx="80" cy="82" r="1.5" fill="#333" />
    {/* Gentle smile */}
    <path d="M70 88 Q75 92 80 88" stroke="#333" strokeWidth="1.2" fill="none" strokeLinecap="round" />

    {/* Arms */}
    <rect x="50" y="108" width="12" height="6" rx="3" fill="#D4A574" />
    <rect x="86" y="108" width="12" height="6" rx="3" fill="#D4A574" />

    {/* Notepad */}
    <rect x="96" y="104" width="18" height="24" rx="3" fill="white" stroke="#B2E0E1" strokeWidth="1.5" />
    <line x1="100" y1="110" x2="110" y2="110" stroke="#B2E0E1" strokeWidth="1" strokeLinecap="round" />
    <line x1="100" y1="114" x2="108" y2="114" stroke="#B2E0E1" strokeWidth="1" strokeLinecap="round" />
    <line x1="100" y1="118" x2="110" y2="118" stroke="#B2E0E1" strokeWidth="1" strokeLinecap="round" />
    {/* Pencil on notepad */}
    <rect x="112" y="100" width="3" height="16" rx="1.5" fill="#FF5A42" transform="rotate(15 112 100)" />

    {/* Small decorative dots */}
    <circle cx="30" cy="60" r="2" fill="#B2E0E1" />
    <circle cx="170" cy="50" r="2.5" fill="#FFE8E4" />
    <circle cx="40" cy="150" r="1.5" fill="#EDE9FE" />
  </svg>
);

// ---------- 2. Meditation ----------
export const IllustrationMeditation: React.FC<IllustrationProps> = ({
  className,
  width = 200,
  height = 200,
}) => (
  <svg
    viewBox="0 0 200 200"
    width={width}
    height={height}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    {/* Aura circles */}
    <circle cx="100" cy="105" r="80" fill="#E6F4F4" opacity="0.4" />
    <circle cx="100" cy="105" r="60" fill="#E6F4F4" opacity="0.5" />
    <circle cx="100" cy="105" r="42" fill="#B2E0E1" opacity="0.3" />

    {/* Ground shadow */}
    <ellipse cx="100" cy="155" rx="40" ry="6" fill="#E8E5E2" opacity="0.5" />

    {/* Cross-legged body */}
    <path
      d="M80 130 Q80 115 85 108 L115 108 Q120 115 120 130 Q110 140 100 142 Q90 140 80 130Z"
      fill="#00979A"
    />
    {/* Legs crossed */}
    <ellipse cx="100" cy="142" rx="26" ry="8" fill="#00979A" />
    <ellipse cx="100" cy="142" rx="26" ry="8" fill="black" opacity="0.05" />

    {/* Head */}
    <circle cx="100" cy="88" r="18" fill="#C19A6B" />
    {/* Hair */}
    <path d="M83 84 Q83 70 100 68 Q117 70 117 84" fill="#2D2D2D" opacity="0.8" />
    {/* Closed eyes - peaceful */}
    <path d="M92 88 Q94 90 96 88" stroke="#333" strokeWidth="1.2" fill="none" strokeLinecap="round" />
    <path d="M104 88 Q106 90 108 88" stroke="#333" strokeWidth="1.2" fill="none" strokeLinecap="round" />
    {/* Serene smile */}
    <path d="M95 94 Q100 97 105 94" stroke="#333" strokeWidth="1" fill="none" strokeLinecap="round" />

    {/* Hands on knees */}
    <circle cx="78" cy="132" r="5" fill="#C19A6B" />
    <circle cx="122" cy="132" r="5" fill="#C19A6B" />

    {/* Floating sparkles / energy dots */}
    <circle cx="60" cy="70" r="2.5" fill="#FF5A42" opacity="0.6" />
    <circle cx="140" cy="68" r="2" fill="#FF5A42" opacity="0.5" />
    <circle cx="50" cy="110" r="1.5" fill="#8B5CF6" opacity="0.5" />
    <circle cx="150" cy="108" r="1.5" fill="#8B5CF6" opacity="0.5" />
    <circle cx="72" cy="52" r="1.5" fill="#B2E0E1" />
    <circle cx="130" cy="50" r="2" fill="#B2E0E1" />

    {/* Tiny stars */}
    <path d="M55 90 l2-2 2 2-2 2z" fill="#8B5CF6" opacity="0.4" />
    <path d="M145 85 l2-2 2 2-2 2z" fill="#8B5CF6" opacity="0.4" />
  </svg>
);

// ---------- 3. Supervision ----------
export const IllustrationSupervision: React.FC<IllustrationProps> = ({
  className,
  width = 200,
  height = 200,
}) => (
  <svg
    viewBox="0 0 200 200"
    width={width}
    height={height}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    {/* Background */}
    <circle cx="100" cy="100" r="90" fill="#EDE9FE" opacity="0.4" />

    {/* Ground */}
    <ellipse cx="100" cy="158" rx="70" ry="8" fill="#E8E5E2" opacity="0.5" />

    {/* Left figure - mentor */}
    {/* Chair */}
    <rect x="28" y="122" width="40" height="32" rx="8" fill="#F7F5F3" />
    {/* Body */}
    <rect x="34" y="104" width="28" height="36" rx="10" fill="#8B5CF6" />
    {/* Head */}
    <circle cx="48" cy="86" r="14" fill="#A0724A" />
    {/* Hair */}
    <path d="M35 82 Q35 72 48 70 Q61 72 61 82" fill="#2D2D2D" opacity="0.85" />
    {/* Eyes */}
    <circle cx="44" cy="86" r="1.2" fill="#333" />
    <circle cx="52" cy="86" r="1.2" fill="#333" />
    {/* Smile */}
    <path d="M44 91 Q48 94 52 91" stroke="#333" strokeWidth="1" fill="none" strokeLinecap="round" />
    {/* Hand gesture */}
    <circle cx="66" cy="114" r="4" fill="#A0724A" />

    {/* Right figure - mentee */}
    {/* Chair */}
    <rect x="132" y="122" width="40" height="32" rx="8" fill="#F7F5F3" />
    {/* Body */}
    <rect x="138" y="104" width="28" height="36" rx="10" fill="#00979A" />
    {/* Head */}
    <circle cx="152" cy="86" r="14" fill="#F5D0B0" />
    {/* Hair */}
    <path d="M139 82 Q139 72 152 70 Q165 72 165 82" fill="#5C3D2E" opacity="0.85" />
    {/* Eyes */}
    <circle cx="148" cy="86" r="1.2" fill="#333" />
    <circle cx="156" cy="86" r="1.2" fill="#333" />
    {/* Smile */}
    <path d="M148 91 Q152 94 156 91" stroke="#333" strokeWidth="1" fill="none" strokeLinecap="round" />
    {/* Hand with notebook */}
    <rect x="122" y="110" width="14" height="18" rx="2" fill="white" stroke="#B2E0E1" strokeWidth="1" />
    <line x1="125" y1="115" x2="133" y2="115" stroke="#B2E0E1" strokeWidth="0.8" strokeLinecap="round" />
    <line x1="125" y1="119" x2="131" y2="119" stroke="#B2E0E1" strokeWidth="0.8" strokeLinecap="round" />

    {/* Conversation dots between them */}
    <circle cx="88" cy="90" r="2" fill="#8B5CF6" opacity="0.5" />
    <circle cx="100" cy="86" r="2.5" fill="#8B5CF6" opacity="0.4" />
    <circle cx="112" cy="90" r="2" fill="#8B5CF6" opacity="0.5" />

    {/* Decorative dots */}
    <circle cx="20" cy="50" r="2" fill="#B2E0E1" />
    <circle cx="180" cy="55" r="1.5" fill="#FFE8E4" />
    <circle cx="100" cy="40" r="2" fill="#EDE9FE" />
  </svg>
);

// ---------- 4. Calendar ----------
export const IllustrationCalendar: React.FC<IllustrationProps> = ({
  className,
  width = 200,
  height = 200,
}) => (
  <svg
    viewBox="0 0 200 200"
    width={width}
    height={height}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    {/* Background */}
    <circle cx="100" cy="100" r="88" fill="#E6F4F4" opacity="0.4" />

    {/* Calendar body */}
    <rect x="40" y="50" width="120" height="110" rx="14" fill="white" stroke="#B2E0E1" strokeWidth="2" />
    {/* Calendar header */}
    <rect x="40" y="50" width="120" height="30" rx="14" fill="#00979A" />
    <rect x="40" y="66" width="120" height="14" fill="#00979A" />

    {/* Binding rings */}
    <rect x="68" y="44" width="8" height="16" rx="4" fill="#E8E5E2" />
    <rect x="124" y="44" width="8" height="16" rx="4" fill="#E8E5E2" />

    {/* Month text placeholder */}
    <rect x="78" y="58" width="44" height="6" rx="3" fill="white" opacity="0.6" />

    {/* Day grid - simplified */}
    {[0, 1, 2, 3].map((row) =>
      [0, 1, 2, 3, 4].map((col) => (
        <rect
          key={`${row}-${col}`}
          x={52 + col * 22}
          y={90 + row * 16}
          width={14}
          height={10}
          rx={3}
          fill={row === 1 && col === 2 ? "#00979A" : "#F7F5F3"}
          opacity={row === 1 && col === 2 ? 1 : 0.7}
        />
      ))
    )}

    {/* Checkmark on highlighted day */}
    <path d="M75 96 l3 3 6-6" stroke="white" strokeWidth="1.8" fill="none" strokeLinecap="round" strokeLinejoin="round" />

    {/* Small clock */}
    <circle cx="152" cy="146" r="16" fill="white" stroke="#FF5A42" strokeWidth="2" />
    <circle cx="152" cy="146" r="12" fill="#FFE8E4" opacity="0.5" />
    <line x1="152" y1="146" x2="152" y2="138" stroke="#FF5A42" strokeWidth="1.5" strokeLinecap="round" />
    <line x1="152" y1="146" x2="158" y2="148" stroke="#FF5A42" strokeWidth="1.5" strokeLinecap="round" />
    <circle cx="152" cy="146" r="1.5" fill="#FF5A42" />

    {/* Decorative */}
    <circle cx="30" cy="70" r="2" fill="#FFE8E4" />
    <circle cx="175" cy="60" r="2" fill="#EDE9FE" />
  </svg>
);

// ---------- 5. Empty Clients ----------
export const IllustrationEmptyClients: React.FC<IllustrationProps> = ({
  className,
  width = 200,
  height = 200,
}) => (
  <svg
    viewBox="0 0 200 200"
    width={width}
    height={height}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    {/* Background */}
    <circle cx="100" cy="100" r="88" fill="#E6F4F4" opacity="0.3" />

    {/* Welcoming figure */}
    {/* Body */}
    <rect x="55" y="104" width="34" height="44" rx="12" fill="#00979A" />
    {/* Head */}
    <circle cx="72" cy="86" r="16" fill="#D4A574" />
    {/* Hair */}
    <path d="M57 82 Q57 70 72 68 Q87 70 87 82" fill="#2D2D2D" opacity="0.85" />
    {/* Happy eyes */}
    <circle cx="67" cy="86" r="1.5" fill="#333" />
    <circle cx="77" cy="86" r="1.5" fill="#333" />
    {/* Big warm smile */}
    <path d="M66 92 Q72 97 78 92" stroke="#333" strokeWidth="1.2" fill="none" strokeLinecap="round" />

    {/* Open arms - welcoming */}
    <path d="M55 112 Q40 104 34 96" stroke="#D4A574" strokeWidth="8" strokeLinecap="round" />
    <path d="M89 112 Q104 104 110 96" stroke="#D4A574" strokeWidth="8" strokeLinecap="round" />
    {/* Hands */}
    <circle cx="34" cy="96" r="5" fill="#D4A574" />
    <circle cx="110" cy="96" r="5" fill="#D4A574" />

    {/* Legs */}
    <rect x="60" y="144" width="10" height="16" rx="5" fill="#D4A574" />
    <rect x="74" y="144" width="10" height="16" rx="5" fill="#D4A574" />

    {/* Dotted outline person - placeholder */}
    <circle cx="148" cy="88" r="14" stroke="#B2E0E1" strokeWidth="2" strokeDasharray="4 3" fill="none" />
    <rect x="134" y="108" width="28" height="38" rx="10" stroke="#B2E0E1" strokeWidth="2" strokeDasharray="4 3" fill="none" />
    {/* Plus icon inside dotted person */}
    <line x1="148" y1="120" x2="148" y2="132" stroke="#B2E0E1" strokeWidth="2" strokeLinecap="round" />
    <line x1="142" y1="126" x2="154" y2="126" stroke="#B2E0E1" strokeWidth="2" strokeLinecap="round" />

    {/* Small hearts / warmth */}
    <path d="M100 70 Q102 66 105 70 Q102 74 100 70Z" fill="#FF5A42" opacity="0.5" />
    <path d="M116 62 Q118 58 121 62 Q118 66 116 62Z" fill="#FF5A42" opacity="0.3" />

    {/* Dots */}
    <circle cx="24" cy="60" r="2" fill="#EDE9FE" />
    <circle cx="176" cy="60" r="2" fill="#B2E0E1" />
    <circle cx="40" cy="170" r="1.5" fill="#FFE8E4" />
  </svg>
);

// ---------- 6. Empty Notes ----------
export const IllustrationEmptyNotes: React.FC<IllustrationProps> = ({
  className,
  width = 200,
  height = 200,
}) => (
  <svg
    viewBox="0 0 200 200"
    width={width}
    height={height}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    {/* Background */}
    <circle cx="100" cy="100" r="88" fill="#E6F4F4" opacity="0.3" />

    {/* Notepad shadow */}
    <rect x="52" y="44" width="100" height="126" rx="10" fill="#E8E5E2" />
    {/* Notepad */}
    <rect x="48" y="40" width="100" height="126" rx="10" fill="white" stroke="#B2E0E1" strokeWidth="2" />

    {/* Notepad binding */}
    <line x1="68" y1="40" x2="68" y2="166" stroke="#E6F4F4" strokeWidth="2" />

    {/* Lines on notepad */}
    <line x1="78" y1="64" x2="132" y2="64" stroke="#E8E5E2" strokeWidth="1.5" strokeLinecap="round" />
    <line x1="78" y1="80" x2="126" y2="80" stroke="#E8E5E2" strokeWidth="1.5" strokeLinecap="round" />
    <line x1="78" y1="96" x2="130" y2="96" stroke="#E8E5E2" strokeWidth="1.5" strokeLinecap="round" />
    <line x1="78" y1="112" x2="118" y2="112" stroke="#E8E5E2" strokeWidth="1.5" strokeLinecap="round" />
    <line x1="78" y1="128" x2="124" y2="128" stroke="#E8E5E2" strokeWidth="1.5" strokeLinecap="round" />
    <line x1="78" y1="144" x2="110" y2="144" stroke="#E8E5E2" strokeWidth="1.5" strokeLinecap="round" />

    {/* Pencil */}
    <g transform="translate(130, 70) rotate(30)">
      <rect x="0" y="0" width="8" height="55" rx="2" fill="#FF5A42" />
      <rect x="0" y="0" width="8" height="10" rx="2" fill="#FFE8E4" />
      <polygon points="0,55 8,55 4,64" fill="#FFE8E4" />
      <polygon points="2,60 6,60 4,64" fill="#333" />
    </g>

    {/* Sparkles */}
    <g>
      {/* Star 1 */}
      <path d="M40 50 l2-5 2 5-5-2 5 0z" fill="#8B5CF6" opacity="0.5" />
      {/* Star 2 */}
      <path d="M155 38 l1.5-4 1.5 4-4-1.5 4 0z" fill="#FF5A42" opacity="0.5" />
      {/* Star 3 */}
      <path d="M160 160 l1.5-4 1.5 4-4-1.5 4 0z" fill="#00979A" opacity="0.5" />
    </g>

    {/* Small sparkle dots */}
    <circle cx="35" cy="70" r="2" fill="#B2E0E1" />
    <circle cx="165" cy="55" r="1.5" fill="#EDE9FE" />
    <circle cx="30" cy="140" r="2" fill="#FFE8E4" />
    <circle cx="170" cy="130" r="1.5" fill="#B2E0E1" />
  </svg>
);

// ---------- 7. Payments ----------
export const IllustrationPayments: React.FC<IllustrationProps> = ({
  className,
  width = 200,
  height = 200,
}) => (
  <svg
    viewBox="0 0 200 200"
    width={width}
    height={height}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    {/* Background */}
    <circle cx="100" cy="100" r="88" fill="#E6F4F4" opacity="0.3" />

    {/* Wallet body - shadow */}
    <rect x="42" y="68" width="100" height="70" rx="14" fill="#E8E5E2" />
    {/* Wallet body */}
    <rect x="38" y="64" width="100" height="70" rx="14" fill="#00979A" />
    {/* Wallet flap */}
    <path d="M38 78 Q38 64 52 64 L124 64 Q138 64 138 78 L138 88 Q130 96 88 96 Q46 96 38 88Z" fill="#00979A" />
    <path d="M38 78 Q38 64 52 64 L124 64 Q138 64 138 78 L138 88 Q130 96 88 96 Q46 96 38 88Z" fill="white" opacity="0.15" />

    {/* Wallet clasp */}
    <rect x="110" y="86" width="24" height="20" rx="8" fill="white" opacity="0.3" />
    <circle cx="122" cy="96" r="5" fill="white" opacity="0.4" />

    {/* Rupee symbol on wallet */}
    <g transform="translate(70, 78)">
      <text
        x="0"
        y="20"
        fontSize="24"
        fontWeight="bold"
        fill="white"
        opacity="0.8"
        fontFamily="system-ui, sans-serif"
      >
        ₹
      </text>
    </g>

    {/* Coins */}
    {/* Coin 1 */}
    <circle cx="140" cy="145" r="18" fill="#FF5A42" />
    <circle cx="140" cy="145" r="13" fill="#FF5A42" stroke="#FFE8E4" strokeWidth="1.5" />
    <text x="134" y="150" fontSize="14" fontWeight="bold" fill="white" fontFamily="system-ui, sans-serif">₹</text>

    {/* Coin 2 - behind */}
    <circle cx="158" cy="138" r="16" fill="#8B5CF6" />
    <circle cx="158" cy="138" r="11" fill="#8B5CF6" stroke="#EDE9FE" strokeWidth="1.5" />
    <text x="153" y="143" fontSize="12" fontWeight="bold" fill="white" fontFamily="system-ui, sans-serif">₹</text>

    {/* Coin 3 - small */}
    <circle cx="122" cy="152" r="12" fill="#00979A" />
    <circle cx="122" cy="152" r="8" fill="#00979A" stroke="#B2E0E1" strokeWidth="1.5" />

    {/* Small floating elements */}
    <circle cx="50" cy="48" r="3" fill="#FFE8E4" />
    <circle cx="150" cy="46" r="2" fill="#EDE9FE" />
    <circle cx="30" cy="130" r="2" fill="#B2E0E1" />

    {/* Sparkle near coins */}
    <path d="M168 118 l2-4 2 4-4-2 4 0z" fill="#FF5A42" opacity="0.4" />
  </svg>
);

// ---------- 8. Success ----------
export const IllustrationSuccess: React.FC<IllustrationProps> = ({
  className,
  width = 200,
  height = 200,
}) => (
  <svg
    viewBox="0 0 200 200"
    width={width}
    height={height}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    {/* Background */}
    <circle cx="100" cy="100" r="88" fill="#E6F4F4" opacity="0.3" />

    {/* Ground */}
    <ellipse cx="100" cy="170" rx="50" ry="6" fill="#E8E5E2" opacity="0.5" />

    {/* Person body */}
    <rect x="80" y="110" width="40" height="50" rx="14" fill="#00979A" />
    {/* Legs */}
    <rect x="85" y="155" width="12" height="18" rx="6" fill="#6B4226" />
    <rect x="103" y="155" width="12" height="18" rx="6" fill="#6B4226" />

    {/* Head */}
    <circle cx="100" cy="92" r="18" fill="#6B4226" />
    {/* Hair */}
    <path d="M83 88 Q83 74 100 72 Q117 74 117 88" fill="#2D2D2D" opacity="0.85" />
    {/* Happy eyes - wide */}
    <circle cx="94" cy="90" r="2" fill="#333" />
    <circle cx="106" cy="90" r="2" fill="#333" />
    {/* Eye sparkles */}
    <circle cx="95" cy="89" r="0.7" fill="white" />
    <circle cx="107" cy="89" r="0.7" fill="white" />
    {/* Big happy smile */}
    <path d="M92 97 Q100 104 108 97" stroke="#333" strokeWidth="1.5" fill="none" strokeLinecap="round" />

    {/* Arms up - celebrating */}
    <path d="M80 118 Q64 108 56 82" stroke="#6B4226" strokeWidth="9" strokeLinecap="round" />
    <path d="M120 118 Q136 108 144 82" stroke="#6B4226" strokeWidth="9" strokeLinecap="round" />
    {/* Hands */}
    <circle cx="56" cy="80" r="6" fill="#6B4226" />
    <circle cx="144" cy="80" r="6" fill="#6B4226" />

    {/* Confetti dots */}
    <circle cx="40" cy="50" r="4" fill="#FF5A42" opacity="0.7" />
    <circle cx="60" cy="36" r="3" fill="#8B5CF6" opacity="0.6" />
    <circle cx="85" cy="44" r="3.5" fill="#00979A" opacity="0.5" />
    <circle cx="115" cy="40" r="3" fill="#FF5A42" opacity="0.5" />
    <circle cx="140" cy="36" r="4" fill="#8B5CF6" opacity="0.6" />
    <circle cx="160" cy="50" r="3.5" fill="#00979A" opacity="0.5" />
    <circle cx="50" cy="65" r="2.5" fill="#FFE8E4" />
    <circle cx="150" cy="62" r="2.5" fill="#FFE8E4" />

    {/* Confetti rectangles */}
    <rect x="70" y="30" width="6" height="3" rx="1.5" fill="#FF5A42" opacity="0.6" transform="rotate(-20 73 31)" />
    <rect x="125" y="28" width="6" height="3" rx="1.5" fill="#8B5CF6" opacity="0.6" transform="rotate(25 128 29)" />
    <rect x="45" cy="70" width="5" height="3" rx="1.5" fill="#00979A" opacity="0.5" transform="rotate(-10 47 71)" />
    <rect x="152" y="40" width="5" height="3" rx="1.5" fill="#FF5A42" opacity="0.5" transform="rotate(15 154 41)" />
  </svg>
);

// ---------- 9. Onboarding ----------
export const IllustrationOnboarding: React.FC<IllustrationProps> = ({
  className,
  width = 200,
  height = 200,
}) => (
  <svg
    viewBox="0 0 200 200"
    width={width}
    height={height}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    {/* Background */}
    <circle cx="100" cy="100" r="88" fill="#E6F4F4" opacity="0.3" />

    {/* Path / road */}
    <path
      d="M30 160 Q60 140 80 120 Q100 100 120 80 Q140 60 170 45"
      stroke="#B2E0E1"
      strokeWidth="16"
      strokeLinecap="round"
      fill="none"
    />
    {/* Path dashed center line */}
    <path
      d="M30 160 Q60 140 80 120 Q100 100 120 80 Q140 60 170 45"
      stroke="white"
      strokeWidth="2"
      strokeLinecap="round"
      strokeDasharray="6 8"
      fill="none"
    />

    {/* Milestone 1 - completed */}
    <circle cx="46" cy="150" r="12" fill="#00979A" />
    <path d="M40 150 l4 4 8-8" stroke="white" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />

    {/* Milestone 2 - completed */}
    <circle cx="88" cy="114" r="12" fill="#00979A" />
    <path d="M82 114 l4 4 8-8" stroke="white" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />

    {/* Milestone 3 - current / active */}
    <circle cx="126" cy="76" r="14" fill="#FF5A42" />
    <circle cx="126" cy="76" r="18" fill="none" stroke="#FF5A42" strokeWidth="2" opacity="0.3" />
    {/* Person icon inside */}
    <circle cx="126" cy="72" r="4" fill="white" />
    <path d="M120 82 Q120 78 126 76 Q132 78 132 82" fill="white" />

    {/* Milestone 4 - future */}
    <circle cx="162" cy="48" r="12" fill="#E8E5E2" stroke="#B2E0E1" strokeWidth="2" strokeDasharray="3 3" />
    {/* Star inside */}
    <path d="M162 42 l1.5 3 3 0.5-2 2.5 0.5 3-3-1.5-3 1.5 0.5-3-2-2.5 3-0.5z" fill="#B2E0E1" />

    {/* Small flag at end */}
    <line x1="170" y1="35" x2="170" y2="22" stroke="#8B5CF6" strokeWidth="2" strokeLinecap="round" />
    <path d="M170 22 l14 5-14 5z" fill="#8B5CF6" opacity="0.6" />

    {/* Decorative elements */}
    {/* Small tree/plant near path */}
    <circle cx="60" cy="130" r="8" fill="#00979A" opacity="0.3" />
    <circle cx="56" cy="126" r="6" fill="#00979A" opacity="0.4" />
    <line x1="58" y1="134" x2="58" y2="142" stroke="#00979A" strokeWidth="2" strokeLinecap="round" opacity="0.3" />

    {/* Dots */}
    <circle cx="20" cy="100" r="2" fill="#FFE8E4" />
    <circle cx="180" cy="100" r="2" fill="#EDE9FE" />
    <circle cx="140" cy="170" r="1.5" fill="#B2E0E1" />
  </svg>
);

// ---------- 10. Secure ----------
export const IllustrationSecure: React.FC<IllustrationProps> = ({
  className,
  width = 200,
  height = 200,
}) => (
  <svg
    viewBox="0 0 200 200"
    width={width}
    height={height}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    {/* Background */}
    <circle cx="100" cy="100" r="88" fill="#E6F4F4" opacity="0.3" />

    {/* Shield shadow */}
    <path
      d="M104 40 L152 60 Q156 100 140 134 Q124 158 104 168 Q84 158 68 134 Q52 100 56 60Z"
      fill="#E8E5E2"
    />
    {/* Shield */}
    <path
      d="M100 36 L148 56 Q152 96 136 130 Q120 154 100 164 Q80 154 64 130 Q48 96 52 56Z"
      fill="#00979A"
    />
    {/* Shield inner */}
    <path
      d="M100 48 L138 64 Q142 98 128 126 Q116 144 100 152 Q84 144 72 126 Q58 98 62 64Z"
      fill="#00979A"
    />
    <path
      d="M100 48 L138 64 Q142 98 128 126 Q116 144 100 152 Q84 144 72 126 Q58 98 62 64Z"
      fill="white"
      opacity="0.12"
    />

    {/* Heart inside shield */}
    <path
      d="M100 82 Q100 72 88 72 Q76 72 76 86 Q76 100 100 116 Q124 100 124 86 Q124 72 112 72 Q100 72 100 82Z"
      fill="#FF5A42"
      opacity="0.85"
    />
    {/* Heart shine */}
    <ellipse cx="88" cy="82" rx="4" ry="5" fill="white" opacity="0.25" />

    {/* Lock icon - bottom right */}
    <g transform="translate(140, 130)">
      {/* Lock body */}
      <rect x="0" y="10" width="24" height="20" rx="4" fill="#8B5CF6" />
      {/* Lock shackle */}
      <path d="M5 10 Q5 0 12 0 Q19 0 19 10" stroke="#8B5CF6" strokeWidth="3" fill="none" strokeLinecap="round" />
      {/* Keyhole */}
      <circle cx="12" cy="20" r="3" fill="white" opacity="0.6" />
      <rect x="11" y="20" width="2" height="5" rx="1" fill="white" opacity="0.6" />
    </g>

    {/* Decorative dots */}
    <circle cx="30" cy="60" r="2.5" fill="#B2E0E1" />
    <circle cx="170" cy="50" r="2" fill="#EDE9FE" />
    <circle cx="26" cy="140" r="2" fill="#FFE8E4" />
    <circle cx="174" cy="110" r="1.5" fill="#B2E0E1" />

    {/* Sparkles around shield */}
    <path d="M40 80 l2-4 2 4-4-2 4 0z" fill="#8B5CF6" opacity="0.4" />
    <path d="M160 70 l1.5-3 1.5 3-3-1.5 3 0z" fill="#FF5A42" opacity="0.4" />
  </svg>
);
