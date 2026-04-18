/**
 * Deepfake Detection Training Dataset
 * Patterns and indicators of AI-generated and manipulated media
 * Based on GAN artifacts, face synthesis, video manipulation techniques
 */

export type DeepfakeIndicator = {
  artifact: string;
  description: string;
  confidence: number; // 0-100
  commonSources: string[];
};

export type DeepfakeDetectionModel = {
  indicators: DeepfakeIndicator[];
};

export const deepfakeTrainingData: DeepfakeDetectionModel = {
  indicators: [
    // FACIAL ARTIFACTS
    {
      artifact: 'Eye blinking inconsistency',
      description: 'Unnatural eye blinking patterns or missing blinks in sequences',
      confidence: 75,
      commonSources: ['Face2Face', 'First-order models', 'StyleGAN faces']
    },
    {
      artifact: 'Teeth anomalies',
      description: 'Teeth appear blurry, distorted, or unnaturally textured',
      confidence: 70,
      commonSources: ['Most GAN-based deepfakes', 'Video synthesis']
    },
    {
      artifact: 'Facial hair discontinuity',
      description: 'Beard/mustache flickers or appears differently in consecutive frames',
      confidence: 72,
      commonSources: ['Real-time face synthesis', 'StyleGAN']
    },
    {
      artifact: 'Skin texture irregularity',
      description: 'Skin appears overly smooth, plastic, or has unnatural patterns',
      confidence: 65,
      commonSources: ['Face synthesis models', 'Gaussian blur artifacts']
    },
    {
      artifact: 'Ear morphology errors',
      description: 'Ears appear distorted, asymmetrical, or incorrectly positioned',
      confidence: 68,
      commonSources: ['StyleGAN faces', 'Face2Face', 'DeepfaceLab']
    },
    {
      artifact: 'Eye socket artifacts',
      description: 'Area around eyes shows seams, shadows, or inconsistent lighting',
      confidence: 73,
      commonSources: ['Face morphing', 'Poor quality deepfakes']
    },
    {
      artifact: 'Eyebrow movement lag',
      description: 'Eyebrows move independently or with delay from face movements',
      confidence: 71,
      commonSources: ['Real-time synthesis', 'Frame-by-frame models']
    },
    {
      artifact: 'Lip sync errors',
      description: 'Mouth movements dont match audio or appear unnatural',
      confidence: 78,
      commonSources: ['Audio-driven synthesis', 'Voice cloning videos']
    },
    {
      artifact: 'Jaw line distortion',
      description: 'Chin/jaw appears warped or changes shape across frames',
      confidence: 69,
      commonSources: ['First-order motion model', 'Face morphing']
    },
    {
      artifact: 'Nose asymmetry',
      description: 'Nose tip or nostrils appear asymmetrical or misaligned',
      confidence: 66,
      commonSources: ['Face synthesis', 'GAN-based generation']
    },

    // BACKGROUND & EDGE ARTIFACTS
    {
      artifact: 'Background bleeding',
      description: 'Background pixels appear in foreground at face edges',
      confidence: 72,
      commonSources: ['Poor face extraction', 'Video compression artifacts']
    },
    {
      artifact: 'Inconsistent background',
      description: 'Background changes or appears doubled/distorted around face',
      confidence: 74,
      commonSources: ['Face replacement', 'Stitching errors']
    },
    {
      artifact: 'Hair boundary glitches',
      description: 'Hair edges show artifacts, ghosting, or color fringing',
      confidence: 70,
      commonSources: ['Most deepfake methods', 'Video synthesis']
    },
    {
      artifact: 'Shadow inconsistency',
      description: 'Shadows on face dont match light source direction or environment',
      confidence: 68,
      commonSources: ['StyleGAN', 'FaceForensics deepfakes']
    },
    {
      artifact: 'Neck connection errors',
      description: 'Neck shows seams, color mismatch, or unnatural transitions',
      confidence: 75,
      commonSources: ['Face swapping', 'Video synthesis']
    },

    // LIGHTING & COLOR ANOMALIES
    {
      artifact: 'Unnatural eye gloss',
      description: 'Eyes have unrealistic specularity or reflection patterns',
      confidence: 67,
      commonSources: ['StyleGAN', 'GAN-based faces']
    },
    {
      artifact: 'Skin tone discontinuity',
      description: 'Face skin color differs significantly from neck/body',
      confidence: 73,
      commonSources: ['Face swapping', 'Poor color matching']
    },
    {
      artifact: 'Over-exposed highlights',
      description: 'Face highlights appear overblown or unrealistically bright',
      confidence: 65,
      commonSources: ['Compression artifacts', 'Synthesis errors']
    },
    {
      artifact: 'Color fringing',
      description: 'RGB channels misaligned creating color halos',
      confidence: 69,
      commonSources: ['Video compression', 'Synthesis artifacts']
    },
    {
      artifact: 'Subsurface scattering absence',
      description: 'Ears/nose lack natural light transmission effects',
      confidence: 64,
      commonSources: ['StyleGAN', 'Real-time synthesis']
    },

    // MOTION & TEMPORAL ARTIFACTS
    {
      artifact: 'Unnatural head movement',
      description: 'Head rotations appear jittery or physically impossible',
      confidence: 70,
      commonSources: ['First-order motion model', 'Optical flow errors']
    },
    {
      artifact: 'Frame-to-frame flicker',
      description: 'Face flickers, wobbles, or appears unstable between frames',
      confidence: 76,
      commonSources: ['Real-time synthesis', 'Optical flow models']
    },
    {
      artifact: 'Facial feature lag',
      description: 'Facial features move with delay relative to head movement',
      confidence: 68,
      commonSources: ['Motion-based models', 'Interpolation errors']
    },
    {
      artifact: 'Unnatural blinking sequence',
      description: 'Multiple rapid blinks or zero blinks in extended duration',
      confidence: 72,
      commonSources: ['Face animation models', 'Synthesis']
    },
    {
      artifact: 'Lip movement artifacts',
      description: 'Lips appear to stretch, tear, or distort during speech',
      confidence: 74,
      commonSources: ['Audio-driven synthesis', 'Voice cloning']
    },

    // TEXTURE & NOISE PATTERNS
    {
      artifact: 'Unnatural texture patterns',
      description: 'Skin shows repetitive or AI-generated texture patterns',
      confidence: 66,
      commonSources: ['StyleGAN faces', 'Procedural generation']
    },
    {
      artifact: 'JPEG/compression block artifacts',
      description: 'Visible 8x8 pixel blocks or compression gridding',
      confidence: 61,
      commonSources: ['Heavily compressed deepfakes', 'Social media']
    },
    {
      artifact: 'Noise grain inconsistency',
      description: 'Noise level differs between face and background',
      confidence: 65,
      commonSources: ['Face replacement', 'Noise mismatch']
    },
    {
      artifact: 'Detail loss in high frequencies',
      description: 'Face appears overly smooth while background has details',
      confidence: 67,
      commonSources: ['Gaussian blur synthesis', 'Face smoothing']
    },

    // ANATOMICAL IMPOSSIBILITIES
    {
      artifact: 'Asymmetrical facial features',
      description: 'Face has unusual asymmetry compared to natural variation',
      confidence: 70,
      commonSources: ['GAN generation', 'StyleGAN faces']
    },
    {
      artifact: 'Impossible facial expressions',
      description: 'Facial movements violate anatomical constraints',
      confidence: 72,
      commonSources: ['Animation models', 'Motion synthesis']
    },
    {
      artifact: 'Tooth/mouth inconsistencies',
      description: 'Tooth count, shape, or spacing appears unrealistic',
      confidence: 68,
      commonSources: ['Mouth animation', 'Face synthesis']
    },
    {
      artifact: 'Pupil size error',
      description: 'Pupil dilation inconsistent with lighting or emotion',
      confidence: 69,
      commonSources: ['Face synthesis', 'Real-time models']
    },

    // MULTI-FRAME ANALYSIS
    {
      artifact: 'Inconsistent pose tracking',
      description: 'Face pose/angle appears unrealistic across frames',
      confidence: 71,
      commonSources: ['Optical flow errors', 'Motion estimation']
    },
    {
      artifact: 'Unnatural acceleration patterns',
      description: 'Face movements have non-linear or jerky acceleration',
      confidence: 70,
      commonSources: ['Motion synthesis', 'Interpolation']
    },
    {
      artifact: 'Floating head effect',
      description: 'Face appears to move without matching body movement',
      confidence: 73,
      commonSources: ['Face replacement', 'Video morphing']
    },
    {
      artifact: 'Expression keyframe visibility',
      description: 'Distinct interpolation between expression keyframes visible',
      confidence: 68,
      commonSources: ['Animation-based deepfakes']
    },

    // FREQUENCY DOMAIN ARTIFACTS
    {
      artifact: 'High-frequency artifacts',
      description: 'Unusual patterns in high-frequency spectrum',
      confidence: 64,
      commonSources: ['FFT analysis', 'GAN artifacts']
    },
    {
      artifact: 'Spectral anomalies',
      description: 'Frequency spectrum shows AI generation patterns',
      confidence: 63,
      commonSources: ['Advanced detection', 'ML models']
    },

    // SOCIAL MEDIA SPECIFIC
    {
      artifact: 'Watermark presence mismatch',
      description: 'Watermark appears in face area or inconsistently',
      confidence: 65,
      commonSources: ['Manipulated media', 'Watermark removal']
    },
    {
      artifact: 'Platform compression artifacts',
      description: 'Compression patterns specific to platform re-upload',
      confidence: 60,
      commonSources: ['YouTube', 'TikTok', 'Instagram']
    },
  ]
};

// Simplified detection indicators for real-time analysis
export const deepfakeQuickDetectionRules = [
  {
    rule: 'Eye blink rate',
    description: 'Check for abnormal blink frequency (should be 15-20 per minute)',
    threshold: 30,
  },
  {
    rule: 'Face stability',
    description: 'Measure pixel deviation of face center across frames',
    threshold: 2.5,
  },
  {
    rule: 'Color consistency',
    description: 'Check skin tone color space consistency',
    threshold: 15,
  },
  {
    rule: 'Facial symmetry',
    description: 'Measure asymmetry index of facial features',
    threshold: 0.15,
  },
  {
    rule: 'Lip sync accuracy',
    description: 'Correlate mouth shape with audio phonemes',
    threshold: 0.7,
  },
  {
    rule: 'Micro-expressions',
    description: 'Detect unnatural micro-expression sequences',
    threshold: 0.6,
  },
];
