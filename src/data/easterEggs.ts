export interface EasterEgg {
  id: string;
  index: number;   // 0 | 1 | 2 — used for progress ordering
  title: string;
  clue: string;    // cryptic hint shown in progress modal (undiscovered)
  lore: string;    // revealed text shown after discovery
}

export const EASTER_EGGS: EasterEgg[] = [
  {
    id: 'architects-trace',
    index: 0,
    title: "The Deep Reader",
    clue: "Some stories only reveal themselves near the end.",
    lore: "You stayed longer than most. The deeper layer was never meant for quick scrolling.",
  },
  {
    id: 'through-my-lens',
    index: 1,
    title: "Frozen Horizon",
    clue: "A quiet detail rests within the mountains.",
    lore: "Inside a captured moment, you noticed something quietly waiting to be seen.",
  },
  {
    id: 'spatial-memory',
    index: 2,
    title: "Spatial Memory",
    clue: "Step into the 3D world and look around. Not everything reveals itself at first glance.",
    lore: "Inside a crafted world, curiosity revealed what most visitors never notice.",
  },
];

export const TOTAL_EGGS = EASTER_EGGS.length;
