/**
 * Generates the full resume PDF (with phone number) and saves it to ~/Documents.
 * Run with: npx tsx scripts/generate-resume-full.tsx
 */
import React from 'react';
import { renderToFile } from '@react-pdf/renderer';
import path from 'path';
import os from 'os';
import { ResumeDocument } from '../src/lib/resumePdf';

const outPath = path.join(os.homedir(), 'Documents', 'Midhun Krishnakumar Resume 2026.pdf');

renderToFile(<ResumeDocument showPhone={true} />, outPath).then(() => {
  console.log(`Saved to: ${outPath}`);
});
