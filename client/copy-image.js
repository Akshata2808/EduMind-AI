import fs from 'fs';

const assets = [
  {
    src: 'C:/Users/Admin/.gemini/antigravity/brain/15c56c5d-cbd6-42be-a63d-9864943bd973/media__1779452121374.png',
    dest: './src/assets/student_study_ai.png',
    label: 'landing page image'
  },
  {
    src: 'C:/Users/Admin/.gemini/antigravity/brain/15c56c5d-cbd6-42be-a63d-9864943bd973/student_studying_cartoon_1779690148588.png',
    dest: './src/assets/login_illustration.png',
    label: 'login illustration'
  },
  {
    src: 'C:/Users/Admin/.gemini/antigravity/brain/15c56c5d-cbd6-42be-a63d-9864943bd973/chat_ai_mascot_1779693065169.png',
    dest: './src/assets/chat_ai_mascot.png',
    label: 'AI Chat mascot'
  },
  {
    src: 'C:/Users/Admin/.gemini/antigravity/brain/15c56c5d-cbd6-42be-a63d-9864943bd973/pdf_scan_mascot_1779693089034.png',
    dest: './src/assets/pdf_scan_mascot.png',
    label: 'PDF Summarizer mascot'
  },
  {
    src: 'C:/Users/Admin/.gemini/antigravity/brain/15c56c5d-cbd6-42be-a63d-9864943bd973/quiz_owl_mascot_1779693113136.png',
    dest: './src/assets/quiz_owl_mascot.png',
    label: 'Quiz smart owl mascot'
  },
  {
    src: 'C:/Users/Admin/.gemini/antigravity/brain/15c56c5d-cbd6-42be-a63d-9864943bd973/roadmap_track_mascot_1779693133932.png',
    dest: './src/assets/roadmap_track_mascot.png',
    label: 'Roadmap track illustration'
  },
  {
    src: 'C:/Users/Admin/.gemini/antigravity/brain/15c56c5d-cbd6-42be-a63d-9864943bd973/cropped_emerald_logo_1780211047145.png',
    dest: './src/assets/logo.png',
    label: 'EduMind AI logo'
  }
];

assets.forEach((asset) => {
  try {
    if (fs.existsSync(asset.src)) {
      fs.copyFileSync(asset.src, asset.dest);
      console.log(`Successfully copied ${asset.label} from artifacts to assets!`);
    } else {
      console.warn(`Artifact image for ${asset.label} not found at ${asset.src}, using existing asset.`);
    }
  } catch (err) {
    console.error(`Error copying ${asset.label}:`, err.message);
  }
});

