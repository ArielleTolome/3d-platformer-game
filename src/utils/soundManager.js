class SoundManager {
  constructor() {
    this.sounds = {};
    this.backgroundMusic = null;
    this.isMuted = false;
    this.volume = 0.7;
  }

  preloadSound(name, url) {
    try {
      const audio = new Audio(url);
      audio.preload = 'auto';
      audio.volume = this.volume;
      
      audio.addEventListener('error', () => {
        console.log(`Sound file not found: ${url}`);
      });
      
      this.sounds[name] = audio;
    } catch (error) {
      console.log(`Failed to load sound: ${name}`, error);
    }
  }

  playSound(name, volume = 1) {
    if (this.isMuted || !this.sounds[name]) return;
    
    const sound = this.sounds[name].cloneNode();
    sound.volume = this.volume * volume;
    sound.play().catch(e => console.log('Sound play failed:', e));
  }

  playBackgroundMusic(name, loop = true) {
    if (this.isMuted || !this.sounds[name]) return;
    
    this.stopBackgroundMusic();
    this.backgroundMusic = this.sounds[name];
    this.backgroundMusic.loop = loop;
    this.backgroundMusic.volume = this.volume * 0.3;
    this.backgroundMusic.play().catch(e => console.log('Background music play failed:', e));
  }

  stopBackgroundMusic() {
    if (this.backgroundMusic) {
      this.backgroundMusic.pause();
      this.backgroundMusic.currentTime = 0;
    }
  }

  setVolume(volume) {
    this.volume = Math.max(0, Math.min(1, volume));
    Object.values(this.sounds).forEach(sound => {
      sound.volume = this.volume;
    });
    if (this.backgroundMusic) {
      this.backgroundMusic.volume = this.volume * 0.3;
    }
  }

  toggleMute() {
    this.isMuted = !this.isMuted;
    if (this.isMuted) {
      this.stopBackgroundMusic();
    } else {
      this.playBackgroundMusic('backgroundMusic');
    }
    return this.isMuted;
  }

  getMuteState() {
    return this.isMuted;
  }

  init() {
    this.preloadSound('jump', '/sounds/jump.mp3');
    this.preloadSound('move', '/sounds/move.mp3');
    this.preloadSound('coin', '/sounds/coin.mp3');
    this.preloadSound('gameOver', '/sounds/gameOver.mp3');
    this.preloadSound('backgroundMusic', '/sounds/backgroundMusic.mp3');
  }
}

const soundManager = new SoundManager();
export default soundManager;