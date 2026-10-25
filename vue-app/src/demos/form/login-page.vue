<script setup lang="ts">
import { ref } from 'vue'

const currentVariant = ref<'glass' | 'slide'>('glass')

/* ============ 变体一：毛玻璃登录注册（login.html/new.html） ============ */
const glassIsSignup = ref(false)

/* ============ 变体二：简洁响应式登录注册表单（index.html） ============ */
const slideIsActive = ref(false)
</script>

<template>
  <div class="demo">
    <div class="variant-tabs">
      <button
        :class="{ on: currentVariant === 'glass' }"
        @click="currentVariant = 'glass'"
      >
        毛玻璃登录注册
      </button>
      <button
        :class="{ on: currentVariant === 'slide' }"
        @click="currentVariant = 'slide'"
      >
        简洁响应式表单
      </button>
    </div>

    <!-- ============ 变体一：毛玻璃登录注册 ============ -->
    <div
      v-if="currentVariant === 'glass'"
      class="glass-stage"
      :class="{ signup: glassIsSignup }"
    >
      <div class="container" :class="{ signup: glassIsSignup }">
        <span></span>
        <span></span>
        <span></span>

        <form class="signinForm" @submit.prevent>
          <h2>Login</h2>
          <div class="inputBox">
            <input type="text" placeholder="UserName" />
          </div>
          <div class="inputBox">
            <input type="password" placeholder="PassWord" />
          </div>
          <div class="inputBox group">
            <a href="#" @click.prevent>Forgot Password</a>
            <a href="#" @click.prevent="glassIsSignup = true">Signup</a>
          </div>
          <div class="inputBox">
            <input type="submit" value="Sign in" />
          </div>
        </form>

        <form class="signupForm" @submit.prevent>
          <h2>Registration</h2>
          <div class="inputBox">
            <input type="text" placeholder="UserName" />
          </div>
          <div class="inputBox">
            <input type="email" placeholder="Email Address" />
          </div>
          <div class="inputBox">
            <input type="password" placeholder="Create PassWord" />
          </div>
          <div class="inputBox">
            <input type="password" placeholder="Confirm PassWord" />
          </div>
          <div class="inputBox">
            <input type="submit" value="Register Account" />
          </div>
          <div class="inputBox group">
            <a href="#" @click.prevent
              >Already Have an Account?
              <b @click.prevent="glassIsSignup = false">Login</b>
            </a>
          </div>
        </form>
      </div>
    </div>

    <!-- ============ 变体二：简洁响应式登录注册表单 ============ -->
    <div v-else class="slide-stage">
      <div class="s-container" :class="{ active: slideIsActive }">
        <div class="form-box login">
          <form @submit.prevent>
            <h1>Login</h1>
            <div class="input-box">
              <input type="text" placeholder="Username" required />
            </div>
            <div class="input-box">
              <input type="password" placeholder="Password" required />
            </div>
            <div class="forgot-link">
              <a href="#" @click.prevent>Forgot password?</a>
            </div>
            <button type="submit" class="btn">Login</button>
            <p>or login with social platforms</p>
            <div class="social-icons">
              <a href="#" @click.prevent>G</a>
              <a href="#" @click.prevent>f</a>
              <a href="#" @click.prevent>Git</a>
              <a href="#" @click.prevent>in</a>
            </div>
          </form>
        </div>

        <div class="form-box register">
          <form @submit.prevent>
            <h1>Registration</h1>
            <div class="input-box">
              <input type="text" placeholder="Username" required />
            </div>
            <div class="input-box">
              <input type="email" placeholder="Email" required />
            </div>
            <div class="input-box">
              <input type="password" placeholder="Password" required />
            </div>
            <button type="submit" class="btn">Register</button>
            <p>or register with social platforms</p>
            <div class="social-icons">
              <a href="#" @click.prevent>G</a>
              <a href="#" @click.prevent>f</a>
              <a href="#" @click.prevent>Git</a>
              <a href="#" @click.prevent>in</a>
            </div>
          </form>
        </div>

        <div class="toggle-box">
          <div class="toggle-panel toggle-left">
            <h1>Hello,Welcome!</h1>
            <p>Don't have an account?</p>
            <button class="btn register-btn" @click="slideIsActive = true">
              Register
            </button>
          </div>
          <div class="toggle-panel toggle-right">
            <h1>Welcome Back!</h1>
            <p>Already have an account?</p>
            <button class="btn login-btn" @click="slideIsActive = false">
              Login
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.demo {
  min-height: 320px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.variant-tabs {
  display: flex;
  justify-content: center;
  gap: 10px;
}

.variant-tabs button {
  padding: 6px 16px;
  border: 1px solid #ccc;
  border-radius: 20px;
  background: #fff;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.3s;
}

.variant-tabs button.on {
  background: #333;
  color: #fff;
  border-color: #333;
}

/* ============ 变体一：毛玻璃登录注册 ============ */
.glass-stage {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 500px;
  position: relative;
  overflow: hidden;
  background: linear-gradient(135deg, #ead2ad 0%, #56ccf2 50%, #e79f6c 100%);
}

.glass-stage::before,
.glass-stage::after {
  content: '';
  position: absolute;
  inset: 0;
  background-size: cover;
  background-position: center;
  transition: 0.5s;
}

.glass-stage::before {
  background: linear-gradient(135deg, #ead2ad 0%, #56ccf2 50%, #e79f6c 100%);
}

.glass-stage::after {
  background: linear-gradient(225deg, #56ccf2 0%, #7b68ee 60%, #ead2ad 100%);
  opacity: 0;
}

.glass-stage.signup::after {
  opacity: 1;
}

.container {
  position: relative;
  width: 350px;
  height: 340px;
  border-radius: 15px;
  box-shadow: 0 5px 25px rgba(0, 0, 0, 0.25);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  transition: 0.5s;
  overflow: hidden;
}

.container.signup {
  height: 440px;
}

.container::before {
  content: '';
  position: absolute;
  width: 100%;
  height: 100%;
  background: repeating-conic-gradient(
    from var(--a),
    #ead2ad 0%,
    #56ccf2 10%,
    transparent 10%,
    transparent 80%,
    #e79f6c 100%
  );
  border-radius: 20px;
  animation: loginAni 2.5s linear infinite;
}

.container.signup::before {
  filter: hue-rotate(200deg);
}

@property --a {
  syntax: '<angle>';
  inherits: false;
  initial-value: 0deg;
}

@keyframes loginAni {
  0% {
    --a: 0deg;
  }
  100% {
    --a: 360deg;
  }
}

.container span {
  position: absolute;
  inset: 5px;
  overflow: hidden;
  border-radius: 15px;
}

.container span::before,
.container span::after {
  content: '';
  position: absolute;
  inset: 5px;
  background-size: cover;
  background-position: center;
}

.container span::before {
  background: linear-gradient(135deg, #ead2ad 0%, #56ccf2 50%, #e79f6c 100%);
  filter: blur(10px);
}

.container span::after {
  background: linear-gradient(135deg, #ead2ad 0%, #56ccf2 50%, #e79f6c 100%);
  filter: blur(15px);
}

.container.signup span::before,
.container.signup span::after {
  background: linear-gradient(225deg, #56ccf2 0%, #7b68ee 60%, #ead2ad 100%);
  filter: blur(15px);
}

.glass-stage form {
  position: absolute;
  left: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  width: 100%;
  gap: 15px;
  transition: 0.5s;
}

form.signupForm {
  left: 100%;
}

.container.signup form.signinForm {
  left: -100%;
}

.container.signup form.signupForm {
  left: 0;
}

.glass-stage form h2 {
  position: relative;
  color: #fff;
  font-size: 1.5em;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  font-weight: 500;
  margin-bottom: 10px;
  user-select: none;
}

.glass-stage .inputBox {
  position: relative;
  width: 70%;
  display: flex;
  justify-content: space-between;
}

.glass-stage .inputBox a {
  color: #fff;
  text-decoration: none;
  font-size: 0.85em;
}

.glass-stage .inputBox a:nth-child(2) {
  text-decoration: underline;
}

.glass-stage .inputBox input {
  width: 100%;
  outline: none;
  border: 1px solid rgba(255, 255, 255, 0.25);
  background: rgba(0, 0, 0, 0.15);
  padding: 6px 15px;
  border-radius: 4px;
  font-size: 0.85em;
  color: #fff;
}

.glass-stage .inputBox input::placeholder {
  color: rgba(255, 255, 255, 0.5);
}

.glass-stage .inputBox input[type='submit'] {
  background: #2196f3;
  font-weight: 500;
  cursor: pointer;
}

form.signupForm .inputBox input[type='submit'] {
  background: #f08568;
}

form.signupForm b {
  margin-left: 3px;
  font-weight: 500;
  color: #ead2ad;
  text-decoration: underline;
  cursor: pointer;
}

/* ============ 变体二：简洁响应式登录注册表单 ============ */
.slide-stage {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 30px 0;
  background: linear-gradient(90deg, #e2e2e2, #c9d6ff);
}

.s-container {
  position: relative;
  width: 850px;
  max-width: 100%;
  height: 550px;
  background: #fff;
  border-radius: 30px;
  box-shadow: 0 0 30px rgba(0, 0, 0, 0.2);
  overflow: hidden;
}

.form-box {
  position: absolute;
  right: 0;
  width: 50%;
  height: 100%;
  background: #fff;
  display: flex;
  align-items: center;
  color: #333;
  text-align: center;
  padding: 40px;
  z-index: 1;
  transition:
    0.6s ease-in-out 1.2s,
    visibility 0s 1s;
}

.s-container.active .form-box {
  right: 50%;
}

.form-box.register {
  visibility: hidden;
}

.s-container.active .form-box.register {
  visibility: visible;
}

.slide-stage form {
  width: 100%;
  display: flex;
  flex-direction: column;
}

.s-container h1 {
  font-size: 36px;
  margin: -10px 0;
}

.input-box {
  position: relative;
  margin: 30px 0;
}

.input-box input {
  width: 100%;
  padding: 13px 50px 13px 20px;
  background: #eee;
  border-radius: 8px;
  border: none;
  outline: none;
  font-size: 16px;
  color: #333;
  font-weight: 500;
  box-sizing: border-box;
}

.input-box input::placeholder {
  color: #888;
  font-weight: 400;
}

.forgot-link {
  margin: -15px 0 15px;
}

.forgot-link a {
  font-size: 14.5px;
  color: #333;
  text-decoration: none;
}

.btn {
  width: 100%;
  height: 48px;
  background: #7494ec;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  border: none;
  cursor: pointer;
  font-size: 16px;
  color: #fff;
  font-weight: 600;
}

.s-container p {
  font-size: 14.5px;
  margin: 15px 0;
}

.social-icons {
  display: flex;
  justify-content: center;
}

.social-icons a {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 10px;
  border: 2px solid #ccc;
  border-radius: 8px;
  font-size: 18px;
  color: #333;
  text-decoration: none;
  margin: 0 8px;
  width: 24px;
  height: 24px;
}

.toggle-box {
  position: absolute;
  width: 100%;
  height: 100%;
}

.toggle-box::before {
  content: '';
  position: absolute;
  left: -250%;
  width: 300%;
  height: 100%;
  background: #7494ec;
  border-radius: 150px;
  z-index: 2;
  transition: 1.8s ease-in-out;
}

.s-container.active .toggle-box::before {
  left: 50%;
}

.toggle-panel {
  position: absolute;
  width: 50%;
  height: 100%;
  color: #fff;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  z-index: 2;
  transition: 0.6s ease-in-out;
}

.toggle-panel.toggle-left {
  left: 0;
  transition-delay: 1.2s;
}

.s-container.active .toggle-panel.toggle-left {
  left: -50%;
  transition-delay: 0.6s;
}

.toggle-panel.toggle-right {
  right: -50%;
  transition-delay: 0.6s;
}

.s-container.active .toggle-panel.toggle-right {
  right: 0;
  transition-delay: 1.2s;
}

.toggle-panel p {
  margin-bottom: 20px;
}

.toggle-panel .btn {
  width: 160px;
  height: 46px;
  background: transparent;
  border: 2px solid #fff;
  box-shadow: none;
}
</style>
