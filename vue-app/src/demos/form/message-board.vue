<script setup lang="ts">
import { ref } from 'vue'

interface Message {
  id: number
  username: string
  content: string
  time: string
}

const username = ref('')
const message = ref('')
const messages = ref<Message[]>([
  {
    id: 1,
    username: '林知雨',
    content: '你好',
    time: '2023/11/16 16:34:00',
  },
])

let nextId = 2

/** 格式化当前时间，与原生 getCurrentTime 保持一致 */
function getCurrentTime(): string {
  const now = new Date()
  const pad = (n: number): string => ('0' + n).slice(-2)
  return (
    `${now.getFullYear()}/${pad(now.getMonth() + 1)}/${pad(now.getDate())} ` +
    `${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`
  )
}

function submit(): void {
  const content = message.value.trim()
  if (!content) return

  const name = username.value.trim() || '匿名'
  messages.value.unshift({
    id: nextId++,
    username: name,
    content,
    time: getCurrentTime(),
  })

  username.value = ''
  message.value = ''
}
</script>

<template>
  <div class="demo">
    <div class="messages">
      <h1>留言板</h1>
      <div class="form">
        <input
          v-model="username"
          type="text"
          placeholder="用户名"
        />
        <textarea
          v-model="message"
          placeholder="浏览内容"
        ></textarea>
        <button id="submitBtn" @click="submit">留言</button>
      </div>
      <div class="message-board">
        <div v-for="msg in messages" :key="msg.id" class="message">
          <div class="message-info">
            <div class="info">
              <span class="avatar"></span>
              <strong>{{ msg.username }}</strong>
            </div>
            <span class="time">发布于: {{ msg.time }}</span>
          </div>
          <div class="content">{{ msg.content }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.demo {
  width: 100%;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  background-image: linear-gradient(90deg, #e0c3fc 0%, #8ec5fc 100%);
  padding: 40px 0;
}

.messages {
  width: min(1000px, 90%);
  max-width: 100%;
  padding: 50px clamp(20px, 8vw, 100px);
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  background-color: rgba(255, 255, 255, 0.43);
  border-radius: 20px;
  box-shadow: 0 10px 30px #00000020;
}

.form {
  display: flex;
  justify-content: center;
  position: relative;
  flex-direction: column;
  width: 100%;
  padding-bottom: 70px;
}

input,
textarea {
  border: none;
  color: #000;
  margin-bottom: 40px;
  font: 900 40px sans-serif;
  border-radius: 10px;
  padding: 30px;
  outline: none;
}

input {
  height: 90px;
}

textarea {
  height: 200px;
  resize: vertical;
}

.messages h1 {
  width: 100%;
  text-align: left;
  margin-bottom: 70px;
  font-size: clamp(48px, 12vw, 140px);
  background-image: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  letter-spacing: 10px;
  line-height: 1;
}

#submitBtn {
  position: absolute;
  right: 0;
  bottom: 0;
  background-image: linear-gradient(90deg, #e0c3fc 0%, #8ec5fc 100%);
  border: none;
  font-size: 30px;
  width: min(200px, 100%);
  height: 70px;
  border-radius: 50px;
  cursor: pointer;
  color: #fff;
}

.message-board {
  width: 100%;
  text-align: left;
}

@keyframes messageFadeIn {
  to {
    opacity: 1;
  }
}

.message {
  width: 100%;
  margin: 70px 0;
  padding: 10px;
  opacity: 0;
  animation: messageFadeIn 0.5s ease forwards;
  background-image: linear-gradient(90deg, #8ec5fc 0%, #e0c3fc 100%);
  background-color: #fff;
  border-radius: 10px;
  box-shadow: 0 10px 20px #00000026;
  text-shadow: 0px 0px 20px #ffffff;
  color: #fff;
}

.message-info {
  height: 100px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 36px;
  position: relative;
}

.info {
  transform: translateY(-30px);
  display: flex;
  align-items: center;
}

.avatar {
  width: 150px;
  height: 150px;
  border-radius: 50%;
  border: 10px #fff solid;
  display: inline-block;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

strong {
  position: absolute;
  width: 100%;
  max-width: 800px;
  letter-spacing: 3px;
  top: 70px;
  left: 170px;
}

.time {
  position: absolute;
  top: 10px;
  right: 10px;
  font-size: 24px;
}

.content {
  font-size: 36px;
  margin: 30px;
  width: 95%;
}

/* ---------- 响应式 ---------- */
@media (max-width: 768px) {
  .demo {
    padding: 20px 0;
  }

  .messages {
    padding: 30px clamp(16px, 5vw, 40px);
  }

  input,
  textarea {
    font: 900 clamp(20px, 4vw, 28px) sans-serif;
    padding: 18px;
    margin-bottom: 24px;
  }

  input {
    height: 60px;
  }

  textarea {
    height: 140px;
  }

  .message {
    margin: 40px 0;
  }

  .message-info {
    height: auto;
    font-size: 24px;
  }

  .avatar {
    width: 100px;
    height: 100px;
    border: 6px #fff solid;
  }

  strong {
    top: 46px;
    left: 116px;
  }

  .time {
    font-size: 16px;
  }

  .content {
    font-size: 24px;
    margin: 20px;
  }
}

@media (max-width: 480px) {
  .messages {
    padding: 20px 12px;
  }

  .messages h1 {
    letter-spacing: 4px;
    margin-bottom: 40px;
  }

  #submitBtn {
    width: 100%;
    height: 56px;
    font-size: 24px;
  }

  .form {
    padding-bottom: 80px;
  }

  input,
  textarea {
    font: 900 18px sans-serif;
    padding: 14px;
    margin-bottom: 18px;
  }

  input {
    height: 52px;
  }

  textarea {
    height: 120px;
  }

  .message {
    margin: 30px 0;
    padding: 8px;
  }

  .message-info {
    font-size: 18px;
  }

  .avatar {
    width: 70px;
    height: 70px;
    border: 4px #fff solid;
  }

  strong {
    top: 32px;
    left: 82px;
  }

  .time {
    font-size: 13px;
  }

  .content {
    font-size: 18px;
    margin: 14px;
  }
}
</style>
