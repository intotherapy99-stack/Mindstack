import React from "react";

interface IllustrationProps {
  className?: string;
  width?: number;
  height?: number;
}

// Inclusive skin tone palette — warm, diverse, muted
const SKIN = {
  light: "#FFE8D6",
  fair: "#F5D0B0",
  medium: "#D4A574",
  olive: "#C19A6B",
  brown: "#A0724A",
  deep: "#6B4226",
};

const HAIR = {
  black: "#2D2D2D",
  brown: "#5C3D2E",
  auburn: "#8B4513",
  blonde: "#D4A44C",
  gray: "#9E9E9E",
  purple: "#7C5CBF",
};

// ============================================
// DIVERSE FACE AVATARS — hand-drawn line-art style
// ============================================

/** Woman with curly hair */
export const FaceCurlyWoman: React.FC<IllustrationProps> = ({
  className, width = 80, height = 80,
}) => (
  <svg viewBox="0 0 80 80" width={width} height={height} fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <circle cx="40" cy="44" r="20" fill={SKIN.medium} />
    {/* Curly hair */}
    <circle cx="24" cy="32" r="8" fill={HAIR.black} />
    <circle cx="32" cy="24" r="9" fill={HAIR.black} />
    <circle cx="42" cy="22" r="8" fill={HAIR.black} />
    <circle cx="52" cy="24" r="8" fill={HAIR.black} />
    <circle cx="58" cy="32" r="7" fill={HAIR.black} />
    <circle cx="22" cy="42" r="6" fill={HAIR.black} />
    <circle cx="60" cy="40" r="5" fill={HAIR.black} />
    {/* Eyes */}
    <ellipse cx="34" cy="42" rx="2" ry="2.5" fill="#333" />
    <ellipse cx="48" cy="42" rx="2" ry="2.5" fill="#333" />
    <circle cx="35" cy="41" r="0.8" fill="white" />
    <circle cx="49" cy="41" r="0.8" fill="white" />
    {/* Nose */}
    <path d="M39 46 Q40 48 42 46" stroke="#8B6F5E" strokeWidth="1.2" fill="none" strokeLinecap="round" />
    {/* Warm smile */}
    <path d="M34 52 Q40 57 48 52" stroke="#333" strokeWidth="1.5" fill="none" strokeLinecap="round" />
    {/* Earrings */}
    <circle cx="20" cy="48" r="2" fill="#F4A896" />
    <circle cx="62" cy="46" r="2" fill="#F4A896" />
  </svg>
);

/** Man with beard */
export const FaceBeardMan: React.FC<IllustrationProps> = ({
  className, width = 80, height = 80,
}) => (
  <svg viewBox="0 0 80 80" width={width} height={height} fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <circle cx="40" cy="42" r="20" fill={SKIN.brown} />
    {/* Short hair */}
    <path d="M22 36 Q22 20 40 18 Q58 20 58 36" fill={HAIR.black} />
    {/* Beard */}
    <path d="M26 50 Q28 62 40 64 Q52 62 54 50" fill={HAIR.black} opacity="0.85" />
    {/* Eyes */}
    <ellipse cx="33" cy="40" rx="2.2" ry="2.5" fill="#333" />
    <ellipse cx="47" cy="40" rx="2.2" ry="2.5" fill="#333" />
    <circle cx="34" cy="39" r="0.7" fill="white" />
    <circle cx="48" cy="39" r="0.7" fill="white" />
    {/* Eyebrows */}
    <path d="M29 35 Q33 33 37 35" stroke="#333" strokeWidth="1.5" fill="none" strokeLinecap="round" />
    <path d="M43 35 Q47 33 51 35" stroke="#333" strokeWidth="1.5" fill="none" strokeLinecap="round" />
    {/* Nose */}
    <path d="M38 44 Q40 47 42 44" stroke="#7A5A3E" strokeWidth="1.2" fill="none" strokeLinecap="round" />
    {/* Gentle smile hidden in beard */}
    <path d="M36 52 Q40 54 44 52" stroke="#555" strokeWidth="1" fill="none" strokeLinecap="round" />
  </svg>
);

/** Woman with bob hair */
export const FaceBobWoman: React.FC<IllustrationProps> = ({
  className, width = 80, height = 80,
}) => (
  <svg viewBox="0 0 80 80" width={width} height={height} fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <circle cx="40" cy="42" r="20" fill={SKIN.light} />
    {/* Bob hair */}
    <path d="M18 38 Q18 18 40 16 Q62 18 62 38 L62 52 Q60 54 58 52 L58 36 Q56 24 40 22 Q24 24 22 36 L22 52 Q20 54 18 52 Z" fill={HAIR.auburn} />
    {/* Bangs */}
    <path d="M24 32 Q32 26 40 28 Q48 26 56 32" fill={HAIR.auburn} />
    {/* Eyes */}
    <ellipse cx="34" cy="42" rx="2" ry="2.8" fill="#333" />
    <ellipse cx="46" cy="42" rx="2" ry="2.8" fill="#333" />
    <circle cx="35" cy="41" r="0.8" fill="white" />
    <circle cx="47" cy="41" r="0.8" fill="white" />
    {/* Eyelashes */}
    <path d="M30 40 L32 42" stroke="#333" strokeWidth="0.8" strokeLinecap="round" />
    <path d="M48 42 L50 40" stroke="#333" strokeWidth="0.8" strokeLinecap="round" />
    {/* Nose */}
    <path d="M39 46 Q40 48 41 46" stroke="#D4A089" strokeWidth="1" fill="none" strokeLinecap="round" />
    {/* Smile */}
    <path d="M35 52 Q40 56 45 52" stroke="#333" strokeWidth="1.3" fill="none" strokeLinecap="round" />
    {/* Blush */}
    <circle cx="28" cy="48" r="3" fill="#F4A896" opacity="0.3" />
    <circle cx="52" cy="48" r="3" fill="#F4A896" opacity="0.3" />
  </svg>
);

/** Elder with glasses */
export const FaceElderGlasses: React.FC<IllustrationProps> = ({
  className, width = 80, height = 80,
}) => (
  <svg viewBox="0 0 80 80" width={width} height={height} fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <circle cx="40" cy="42" r="20" fill={SKIN.fair} />
    {/* Thinning gray hair */}
    <path d="M24 34 Q24 20 40 18 Q56 20 56 34" fill={HAIR.gray} />
    {/* Glasses */}
    <circle cx="33" cy="42" r="7" stroke="#333" strokeWidth="1.5" fill="none" />
    <circle cx="49" cy="42" r="7" stroke="#333" strokeWidth="1.5" fill="none" />
    <line x1="40" y1="42" x2="42" y2="42" stroke="#333" strokeWidth="1.5" />
    <line x1="22" y1="40" x2="26" y2="42" stroke="#333" strokeWidth="1.2" />
    <line x1="56" y1="42" x2="60" y2="40" stroke="#333" strokeWidth="1.2" />
    {/* Eyes behind glasses */}
    <circle cx="33" cy="42" r="1.5" fill="#333" />
    <circle cx="49" cy="42" r="1.5" fill="#333" />
    {/* Wrinkle lines — warm and wise */}
    <path d="M26 36 Q28 35 30 36" stroke="#D4A089" strokeWidth="0.8" fill="none" strokeLinecap="round" />
    <path d="M50 36 Q52 35 54 36" stroke="#D4A089" strokeWidth="0.8" fill="none" strokeLinecap="round" />
    {/* Kind smile */}
    <path d="M34 52 Q40 56 46 52" stroke="#333" strokeWidth="1.3" fill="none" strokeLinecap="round" />
    {/* Mustache */}
    <path d="M34 48 Q40 50 46 48" fill={HAIR.gray} />
  </svg>
);

/** Young person with headband */
export const FaceHeadbandYouth: React.FC<IllustrationProps> = ({
  className, width = 80, height = 80,
}) => (
  <svg viewBox="0 0 80 80" width={width} height={height} fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <circle cx="40" cy="44" r="20" fill={SKIN.olive} />
    {/* Long wavy hair */}
    <path d="M18 40 Q18 18 40 16 Q62 18 62 40 L62 58 Q60 60 58 56 L58 36 Q56 22 40 20 Q24 22 22 36 L22 56 Q20 60 18 58 Z" fill={HAIR.brown} />
    {/* Headband */}
    <path d="M20 32 Q40 26 60 32" stroke="#5BAAAB" strokeWidth="3" fill="none" strokeLinecap="round" />
    {/* Butterfly/flower on headband */}
    <circle cx="52" cy="30" r="3" fill="#F4A896" />
    <circle cx="56" cy="28" r="2.5" fill="#B8A9C9" />
    {/* Eyes */}
    <ellipse cx="34" cy="44" rx="2" ry="2.5" fill="#333" />
    <ellipse cx="48" cy="44" rx="2" ry="2.5" fill="#333" />
    <circle cx="35" cy="43" r="0.7" fill="white" />
    <circle cx="49" cy="43" r="0.7" fill="white" />
    {/* Nose */}
    <path d="M39 48 Q40 50 42 48" stroke="#9E7E60" strokeWidth="1" fill="none" strokeLinecap="round" />
    {/* Smile */}
    <path d="M34 54 Q40 58 46 54" stroke="#333" strokeWidth="1.3" fill="none" strokeLinecap="round" />
  </svg>
);

/** Person with hijab */
export const FaceHijabWoman: React.FC<IllustrationProps> = ({
  className, width = 80, height = 80,
}) => (
  <svg viewBox="0 0 80 80" width={width} height={height} fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <circle cx="40" cy="44" r="20" fill={SKIN.olive} />
    {/* Hijab */}
    <path d="M16 44 Q16 14 40 12 Q64 14 64 44 Q64 56 56 62 L24 62 Q16 56 16 44Z" fill="#5BAAAB" />
    {/* Inner hijab edge */}
    <path d="M24 38 Q24 22 40 20 Q56 22 56 38" fill="none" stroke="#4A9999" strokeWidth="1" />
    {/* Face opening */}
    <ellipse cx="40" cy="44" rx="16" ry="18" fill={SKIN.olive} />
    {/* Eyes */}
    <ellipse cx="35" cy="42" rx="2" ry="2.5" fill="#333" />
    <ellipse cx="47" cy="42" rx="2" ry="2.5" fill="#333" />
    <circle cx="36" cy="41" r="0.7" fill="white" />
    <circle cx="48" cy="41" r="0.7" fill="white" />
    {/* Eyebrows */}
    <path d="M31 37 Q35 35 38 37" stroke="#333" strokeWidth="1" fill="none" strokeLinecap="round" />
    <path d="M44 37 Q47 35 51 37" stroke="#333" strokeWidth="1" fill="none" strokeLinecap="round" />
    {/* Nose */}
    <path d="M39 46 Q40 48 42 46" stroke="#9E7E60" strokeWidth="1" fill="none" strokeLinecap="round" />
    {/* Warm smile */}
    <path d="M35 52 Q40 56 46 52" stroke="#333" strokeWidth="1.3" fill="none" strokeLinecap="round" />
  </svg>
);

/** Man with spiky hair */
export const FaceSpikyMan: React.FC<IllustrationProps> = ({
  className, width = 80, height = 80,
}) => (
  <svg viewBox="0 0 80 80" width={width} height={height} fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <circle cx="40" cy="44" r="20" fill={SKIN.deep} />
    {/* Spiky/textured hair */}
    <path d="M28 30 L24 18 L30 26 L32 16 L36 24 L40 14 L44 24 L48 16 L50 26 L56 18 L52 30" fill={HAIR.black} />
    <path d="M24 36 Q24 24 40 22 Q56 24 56 36" fill={HAIR.black} />
    {/* Eyes */}
    <ellipse cx="34" cy="42" rx="2.2" ry="2.5" fill="white" />
    <circle cx="34" cy="42.5" r="1.5" fill="#333" />
    <ellipse cx="48" cy="42" rx="2.2" ry="2.5" fill="white" />
    <circle cx="48" cy="42.5" r="1.5" fill="#333" />
    {/* Nose */}
    <path d="M38 47 Q40 50 43 47" stroke="#5C3D2E" strokeWidth="1.2" fill="none" strokeLinecap="round" />
    {/* Big warm smile */}
    <path d="M32 53 Q40 60 48 53" stroke="#333" strokeWidth="1.5" fill="none" strokeLinecap="round" />
    {/* Teeth showing in smile */}
    <path d="M36 54 L44 54" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

/** Woman with bun and glasses */
export const FaceBunWoman: React.FC<IllustrationProps> = ({
  className, width = 80, height = 80,
}) => (
  <svg viewBox="0 0 80 80" width={width} height={height} fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <circle cx="40" cy="44" r="20" fill={SKIN.fair} />
    {/* Hair with bun on top */}
    <path d="M24 38 Q24 22 40 20 Q56 22 56 38" fill={HAIR.blonde} />
    <circle cx="40" cy="16" r="10" fill={HAIR.blonde} />
    {/* Glasses */}
    <rect x="27" y="38" width="11" height="9" rx="4" stroke="#B8A9C9" strokeWidth="1.5" fill="none" />
    <rect x="43" y="38" width="11" height="9" rx="4" stroke="#B8A9C9" strokeWidth="1.5" fill="none" />
    <line x1="38" y1="42" x2="43" y2="42" stroke="#B8A9C9" strokeWidth="1.5" />
    {/* Eyes */}
    <circle cx="32.5" cy="42" r="1.5" fill="#333" />
    <circle cx="48.5" cy="42" r="1.5" fill="#333" />
    {/* Nose */}
    <path d="M39 48 Q40 50 41 48" stroke="#D4A089" strokeWidth="1" fill="none" strokeLinecap="round" />
    {/* Smile */}
    <path d="M35 53 Q40 56 45 53" stroke="#333" strokeWidth="1.3" fill="none" strokeLinecap="round" />
    {/* Earrings */}
    <line x1="20" y1="44" x2="20" y2="48" stroke="#5BAAAB" strokeWidth="1.5" strokeLinecap="round" />
    <line x1="60" y1="44" x2="60" y2="48" stroke="#5BAAAB" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

// ============================================
// DIVERSE FACES ROW — a strip of diverse faces for social proof
// ============================================

export const DiverseFacesRow: React.FC<IllustrationProps & { count?: number }> = ({
  className, width = 320, height = 60,
}) => (
  <div className={`flex items-center -space-x-2 ${className || ""}`} style={{ width, height }}>
    <FaceCurlyWoman width={48} height={48} />
    <FaceBeardMan width={48} height={48} />
    <FaceBobWoman width={48} height={48} />
    <FaceHijabWoman width={48} height={48} />
    <FaceSpikyMan width={48} height={48} />
    <FaceElderGlasses width={48} height={48} />
  </div>
);

// ============================================
// ORGANIC BLOB SHAPES — decorative backgrounds
// ============================================

export const BlobDecoration1: React.FC<IllustrationProps> = ({
  className, width = 200, height = 200,
}) => (
  <svg viewBox="0 0 200 200" width={width} height={height} xmlns="http://www.w3.org/2000/svg" className={className}>
    <path
      d="M40 100 Q10 60 50 30 Q90 0 130 20 Q170 40 180 80 Q190 120 160 150 Q130 180 90 170 Q50 160 40 100Z"
      fill="url(#blob1-grad)"
      opacity="0.08"
    />
    <defs>
      <linearGradient id="blob1-grad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#5BAAAB" />
        <stop offset="100%" stopColor="#B8A9C9" />
      </linearGradient>
    </defs>
  </svg>
);

export const BlobDecoration2: React.FC<IllustrationProps> = ({
  className, width = 200, height = 200,
}) => (
  <svg viewBox="0 0 200 200" width={width} height={height} xmlns="http://www.w3.org/2000/svg" className={className}>
    <path
      d="M50 80 Q20 40 60 20 Q100 0 140 30 Q180 60 170 100 Q160 140 120 160 Q80 180 50 140 Q30 110 50 80Z"
      fill="url(#blob2-grad)"
      opacity="0.06"
    />
    <defs>
      <linearGradient id="blob2-grad" x1="0%" y1="100%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#F4A896" />
        <stop offset="100%" stopColor="#8FBC8F" />
      </linearGradient>
    </defs>
  </svg>
);

// ============================================
// COMMUNITY ILLUSTRATION — diverse group together
// ============================================

export const IllustrationDiverseGroup: React.FC<IllustrationProps> = ({
  className, width = 280, height = 200,
}) => (
  <svg viewBox="0 0 280 200" width={width} height={height} fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    {/* Background warm blob */}
    <ellipse cx="140" cy="110" rx="120" ry="70" fill="#E6F4F4" opacity="0.5" />

    {/* Person 1 — curly hair woman */}
    <g transform="translate(30, 40)">
      <rect x="10" y="50" width="30" height="38" rx="10" fill="#5BAAAB" />
      <circle cx="25" cy="36" r="16" fill={SKIN.medium} />
      <circle cx="12" cy="26" r="6" fill={HAIR.black} />
      <circle cx="20" cy="20" r="7" fill={HAIR.black} />
      <circle cx="30" cy="20" r="7" fill={HAIR.black} />
      <circle cx="38" cy="26" r="6" fill={HAIR.black} />
      <circle cx="21" cy="36" r="1.5" fill="#333" />
      <circle cx="29" cy="36" r="1.5" fill="#333" />
      <path d="M21 42 Q25 45 29 42" stroke="#333" strokeWidth="1.2" fill="none" strokeLinecap="round" />
    </g>

    {/* Person 2 — man with beard */}
    <g transform="translate(80, 30)">
      <rect x="10" y="55" width="32" height="42" rx="10" fill="#B8A9C9" />
      <circle cx="26" cy="38" r="18" fill={SKIN.brown} />
      <path d="M10 32 Q10 16 26 14 Q42 16 42 32" fill={HAIR.black} />
      <path d="M14 46 Q16 56 26 58 Q36 56 38 46" fill={HAIR.black} opacity="0.7" />
      <circle cx="21" cy="36" r="1.8" fill="#333" />
      <circle cx="31" cy="36" r="1.8" fill="#333" />
      <path d="M22 46 Q26 48 30 46" stroke="#555" strokeWidth="1" fill="none" strokeLinecap="round" />
    </g>

    {/* Person 3 — hijab woman */}
    <g transform="translate(140, 35)">
      <rect x="8" y="52" width="30" height="38" rx="10" fill="#F4A896" />
      <path d="M4 38 Q4 12 23 10 Q42 12 42 38 Q42 50 36 54 L10 54 Q4 50 4 38Z" fill="#5BAAAB" />
      <ellipse cx="23" cy="38" rx="14" ry="16" fill={SKIN.olive} />
      <circle cx="18" cy="36" r="1.5" fill="#333" />
      <circle cx="28" cy="36" r="1.5" fill="#333" />
      <path d="M19 43 Q23 46 27 43" stroke="#333" strokeWidth="1.2" fill="none" strokeLinecap="round" />
    </g>

    {/* Person 4 — elder with glasses */}
    <g transform="translate(200, 40)">
      <rect x="8" y="50" width="30" height="38" rx="10" fill="#8FBC8F" />
      <circle cx="23" cy="36" r="16" fill={SKIN.fair} />
      <path d="M10 30 Q10 18 23 16 Q36 18 36 30" fill={HAIR.gray} />
      <circle cx="18" cy="36" r="5" stroke="#333" strokeWidth="1" fill="none" />
      <circle cx="30" cy="36" r="5" stroke="#333" strokeWidth="1" fill="none" />
      <line x1="23" y1="36" x2="25" y2="36" stroke="#333" strokeWidth="1" />
      <circle cx="18" cy="36" r="1.2" fill="#333" />
      <circle cx="30" cy="36" r="1.2" fill="#333" />
      <path d="M19 44 Q23 47 27 44" stroke="#333" strokeWidth="1.2" fill="none" strokeLinecap="round" />
    </g>

    {/* Connection lines between people — symbolizing community */}
    <path d="M60 100 Q90 85 110 100" stroke="#5BAAAB" strokeWidth="1" strokeDasharray="3 3" opacity="0.4" />
    <path d="M115 95 Q140 82 160 95" stroke="#B8A9C9" strokeWidth="1" strokeDasharray="3 3" opacity="0.4" />
    <path d="M170 100 Q195 88 215 100" stroke="#F4A896" strokeWidth="1" strokeDasharray="3 3" opacity="0.4" />

    {/* Decorative hearts/sparkles */}
    <circle cx="95" cy="75" r="2" fill="#F4A896" opacity="0.6" />
    <circle cx="180" cy="70" r="2" fill="#B8A9C9" opacity="0.6" />
    <circle cx="50" cy="140" r="1.5" fill="#5BAAAB" opacity="0.5" />
    <circle cx="230" cy="135" r="1.5" fill="#8FBC8F" opacity="0.5" />
    {/* Tiny heart */}
    <path d="M135 65 Q137 62 139 65 Q141 62 143 65 Q143 69 139 72 Q135 69 135 65Z" fill="#F4A896" opacity="0.5" />
  </svg>
);

// ============================================
// WAVE SECTION DIVIDER
// ============================================

export const WaveDivider: React.FC<{ className?: string; color?: string }> = ({
  className, color = "#E6F4F4",
}) => (
  <svg viewBox="0 0 1200 60" preserveAspectRatio="none" className={`w-full ${className || ""}`} style={{ display: "block" }}>
    <path d="M0 30 Q150 0 300 30 T600 30 T900 30 T1200 30 V60 H0Z" fill={color} />
  </svg>
);

// ============================================
// NATURE SPOT ILLUSTRATIONS — botanical elements
// ============================================

export const LeafDecoration: React.FC<IllustrationProps> = ({
  className, width = 40, height = 40,
}) => (
  <svg viewBox="0 0 40 40" width={width} height={height} fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M20 36 Q10 28 8 18 Q6 8 16 4 Q22 2 28 6 Q34 10 34 20 Q34 30 20 36Z" fill="#8FBC8F" opacity="0.6" />
    <path d="M20 36 Q22 24 26 14" stroke="#5BAAAB" strokeWidth="1" fill="none" strokeLinecap="round" />
    <path d="M16 24 Q20 22 24 20" stroke="#5BAAAB" strokeWidth="0.8" fill="none" strokeLinecap="round" />
  </svg>
);
