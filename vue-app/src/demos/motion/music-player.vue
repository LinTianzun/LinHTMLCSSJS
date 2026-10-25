<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'

interface Track {
  title: string
  name: string
  source: string
}

const musicArr: Track[] = [
  { title: '被神明写的歌', name: 'K.D', source: '/demos/motion/music/被神明写的歌 - K.D.mp3' },
  { title: '江南烟雨色', name: '杨树人', source: '/demos/motion/music/江南烟雨色 - 杨树人.mp3' },
  { title: '泡沫', name: '杨树人', source: '/demos/motion/music/泡沫 (男声版) - 杨树人.mp3' },
]

const nowIndex = ref(0)
const isPlaying = ref(false)
const currentTime = ref(0)
const duration = ref(0)
const rotation = ref(0)

const audioEl = ref<HTMLAudioElement | null>(null)
let rotationInterval: number | undefined

const current = computed<Track>(() => {
  const t = musicArr[nowIndex.value]
  if (t) return t
  return musicArr[0]!
})
const coverStyle = computed(() => ({ transform: `rotate(${rotation.value}deg)` }))

function startRotation() {
  if (rotationInterval !== undefined) return
  rotationInterval = window.setInterval(() => {
    rotation.value += 1
  }, 50)
}

function stopRotation() {
  if (rotationInterval !== undefined) {
    window.clearInterval(rotationInterval)
    rotationInterval = undefined
  }
}

async function play() {
  const audio = audioEl.value
  if (!audio) return
  try {
    await audio.play()
    isPlaying.value = true
    startRotation()
  } catch {
    isPlaying.value = false
    stopRotation()
  }
}

function pause() {
  audioEl.value?.pause()
  isPlaying.value = false
  stopRotation()
}

function playPause() {
  if (isPlaying.value) pause()
  else play()
}

function loadTrack(index: number) {
  nowIndex.value = index
  currentTime.value = 0
  const track = musicArr[index]
  const audio = audioEl.value
  if (audio && track) {
    audio.src = track.source
    audio.load()
  }
}

function next() {
  const nextIndex = (nowIndex.value + 1) % musicArr.length
  loadTrack(nextIndex)
  play()
}

function prev() {
  const prevIndex = (nowIndex.value - 1 + musicArr.length) % musicArr.length
  loadTrack(prevIndex)
  play()
}

function onSeek(e: Event) {
  const audio = audioEl.value
  if (!audio) return
  const value = (e.target as HTMLInputElement).value
  audio.currentTime = Number(value)
  if (!isPlaying.value) play()
}

onMounted(() => {
  const audio = audioEl.value
  if (!audio) return
  audio.addEventListener('loadedmetadata', () => {
    duration.value = audio.duration || 0
    currentTime.value = audio.currentTime
  })
  audio.addEventListener('timeupdate', () => {
    if (!audio.paused) currentTime.value = audio.currentTime
  })
  audio.addEventListener('ended', () => {
    next()
  })
})

onUnmounted(() => {
  stopRotation()
  const audio = audioEl.value
  if (audio) {
    audio.pause()
    audio.removeEventListener('loadedmetadata', () => {})
    audio.removeEventListener('timeupdate', () => {})
    audio.removeEventListener('ended', () => {})
  }
  isPlaying.value = false
})
</script>

<template>
  <div class="demo">
    <div class="music-box">
      <!-- 光盘 -->
      <div class="cover-box">
        <img :style="coverStyle" src="/demos/motion/img/04dong.jpeg" alt="封面" />
        <span class="point"></span>
      </div>

      <h2>{{ current.title }}</h2>
      <p>{{ current.name }}</p>

      <!-- 音乐播放器 -->
      <audio ref="audioEl" :src="current.source"></audio>

      <!-- 进度条 -->
      <input
        type="range"
        class="progress"
        :value="currentTime"
        :max="duration || 100"
        step="0.1"
        @input="onSeek"
      />

      <!-- 控件 -->
      <div class="controls">
        <button class="backward" aria-label="上一首" @click="prev">
          ⏮
        </button>
        <button class="play-pause-btn" aria-label="播放/暂停" @click="playPause">
          {{ isPlaying ? '⏸' : '▶' }}
        </button>
        <button class="forward" aria-label="下一首" @click="next">
          ⏭
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.demo {
  min-height: 320px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #148da0;
  background: linear-gradient(to right, #148da0 0%, #fffbe6 50%, #ffd7a0 100%);
  border-radius: 8px;
}

.music-box {
  width: 80%;
  max-width: 500px;
  margin: 20px auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #fff;
  background: rgba(0, 0, 0, 0.3);
  border-radius: 10px;
  padding: 30px 20px;
}

.cover-box {
  position: relative;
}

.cover-box img {
  border-radius: 50%;
  border: 2px solid rgba(222, 215, 255, 0.9);
  width: 120px;
  height: 120px;
  object-fit: cover;
  transition: transform 0.5s ease-out;
  user-select: none;
}

.point {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 16px;
  height: 16px;
  background: rgba(17, 6, 58, 0.7);
  border-radius: 50%;
  z-index: 2;
}

.music-box h2 {
  font-size: 15px;
  font-weight: 500;
  margin: 16px 0 2px;
}

.music-box p {
  font-size: 11px;
  margin-bottom: 26px;
}

.progress {
  appearance: none;
  width: 80%;
  margin: 0 auto 16px;
  height: 6px;
  background-color: #ccffff;
  border-radius: 4px;
  cursor: pointer;
}

.progress::-webkit-slider-thumb {
  appearance: none;
  background: #ccffff;
  width: 20px;
  aspect-ratio: 1/1;
  border-radius: 50%;
  border: 4px solid rgb(255, 255, 255);
  box-shadow: 0 4px 10px rgba(255, 255, 255, 0.4);
}

.controls {
  display: flex;
  justify-content: center;
  align-items: center;
}

.controls button {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  margin: 20px;
  background: #54dede;
  border-radius: 50%;
  border: 0;
  outline: 0;
  color: #fff;
  font-size: 18px;
  cursor: pointer;
  transition: all 0.3s linear;
}

.controls button:nth-child(2) {
  transform: scale(1.3);
}
</style>
