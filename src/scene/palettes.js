// Günün saatine göre renk paletleri. Pozlama parlaklığı bu paletin ÜZERİNE
// çarpan olarak bindiği için gece doğru pozlandığında bile "gece" görünür.
export const PALETTES = {
  sunny: {
    sky: ['#6ec1ff', '#d4efff'], far: '#93a6cc', farSnow: '#ffffff', mid: '#7cbf62', near: '#64ad4b',
    ground: ['#86d36b', '#5aa944'], tree: '#4f9e3a', treeDark: '#3d8530', trunk: '#8a5a2b',
    water: ['#58b4f0', '#2f8fd6'], sand: '#f3d79a', cloud: '#ffffff', light: 'sun',
    wall: '#f4e3c3', roof: '#d9534f', tint: null, night: false,
  },
  cloudy: {
    sky: ['#a7b6cc', '#d3dbe6'], far: '#8e9bb5', farSnow: '#eef2f8', mid: '#6eaa5a', near: '#5e9c4b',
    ground: ['#72b85c', '#4f9b3d'], tree: '#4a8f38', treeDark: '#3a7a2e', trunk: '#7d5530',
    water: ['#7aa6c4', '#55849f'], sand: '#e2cfa6', cloud: '#eef2f6', light: 'sun-dim',
    wall: '#e8dcc6', roof: '#b9554f', tint: 'rgba(150,162,180,0.12)', night: false,
  },
  sunset: {
    sky: ['#ff8f57', '#ffdcaa'], far: '#b08aa3', farSnow: '#ffd9c9', mid: '#7e9a52', near: '#6a8a45',
    ground: ['#6f9e54', '#4d7a3a'], tree: '#3f7e30', treeDark: '#2f6626', trunk: '#6b4422',
    water: ['#f0a070', '#8a6b96'], sand: '#f0c08a', cloud: '#ffd2bd', light: 'sunset',
    wall: '#f1caa0', roof: '#a8473f', tint: 'rgba(255,120,40,0.14)', night: false,
  },
  night: {
    sky: ['#0b1430', '#243c69'], far: '#28385a', farSnow: '#9fb0d0', mid: '#1f3d2e', near: '#1a3527',
    ground: ['#214e2f', '#123220'], tree: '#1d5226', treeDark: '#153f1c', trunk: '#3d2a1c',
    water: ['#1c2f57', '#0d1a36'], sand: '#5e5640', cloud: null, light: 'moon',
    wall: '#4a4a63', roof: '#3a2c3e', tint: 'rgba(10,18,45,0.42)', night: true,
  },
  shade: {
    sky: ['#8fb7cf', '#c8dfe8'], far: '#6f8f86', farSnow: '#e6eef0', mid: '#4f8a52', near: '#447d47',
    ground: ['#5e9b52', '#3f7a39'], tree: '#3f7d3b', treeDark: '#2c5f2c', trunk: '#6b4a2e',
    water: ['#6aa3b8', '#3e7a8f'], sand: '#d8c9a2', cloud: null, light: 'none',
    wall: '#e8dcc6', roof: '#b9554f', tint: null, night: false,
  },
  indoor: {
    sky: ['#26304d', '#3a4670'], far: '#e9e2d4', farSnow: '#ffffff', mid: '#d8cdb8', near: '#c9bba2',
    ground: ['#b9a88c', '#a08f73'], tree: '#5f9a55', treeDark: '#4a7f43', trunk: '#7a5232',
    water: ['#6aa3b8', '#3e7a8f'], sand: '#d8c9a2', cloud: null, light: 'none',
    wall: '#ece6da', roof: '#b9554f', tint: null, night: false,
  },
}
export const paletteFor = (time) => PALETTES[time] ?? PALETTES.sunny
