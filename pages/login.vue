<template>
  <div class="max-w-md mx-auto bg-white rounded-lg shadow-md p-8">
    <h2 class="text-2xl font-bold text-center mb-6">Login</h2>
    <form @submit.prevent="handleLogin" class="space-y-4">
      <div>
        <label for="email" class="block text-sm font-medium text-gray-700">Email</label>
        <input
          v-model="email"
          type="email"
          id="email"
          required
          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
      </div>
      <div>
        <label for="password" class="block text-sm font-medium text-gray-700">Password</label>
        <input
          v-model="password"
          type="password"
          id="password"
          required
          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
      </div>
      <button
        type="submit"
        class="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      >
        Login
      </button>
    </form>
    <div class="mt-4">
      <button
        @click="handleGoogleLogin"
        class="w-full flex items-center justify-center space-x-2 border border-gray-300 rounded-md py-2 px-4 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      >
        <svg class="w-5 h-5" viewBox="0 0 24 24">
          <path
            fill="#4285F4"
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
          />
          <path
            fill="#34A853"
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
          />
          <path
            fill="#FBBC05"
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
          />
          <path
            fill="#EA4335"
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
          />
          <path fill="none" d="M1 1h22v22H1z" />
        </svg>
        <span>Use Google Account</span>
      </button>
    </div>
    <p v-if="error" class="mt-4 text-red-500 text-center">{{ error }}</p>
    <p class="mt-4 text-center text-sm text-gray-600">
      Don't have an account?
      <NuxtLink to="/register" class="text-blue-500 hover:text-blue-600">Register now</NuxtLink>
    </p>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from 'firebase/auth'
import Toast from '~/components/Toast.vue'

const { $auth } = useNuxtApp()
const router = useRouter()

onMounted(() => {
  const unsubscribe = $auth.onAuthStateChanged((user) => {
    if (user) {
      router.push('/')

      const toast = document.createElement('div')
      const vueInstance = createApp(Toast, {
        message: 'You have already logged in.',
        type: 'error'
      })
      document.body.appendChild(toast)
      vueInstance.mount(toast)

      setTimeout(() => {
        vueInstance.unmount()
        document.body.removeChild(toast)
      }, 3000)
    }
  })

  onUnmounted(() => {
    unsubscribe()
  })
})

const email = ref('')
const password = ref('')
const error = ref('')

const handleLogin = async () => {
  try {
    error.value = ''
    await signInWithEmailAndPassword($auth, email.value, password.value)
    router.push('/')

    const toast = document.createElement('div')
      const vueInstance = createApp(Toast, {
        message: 'Login Successfully, welcome back!',
        type: 'success'
      })
      document.body.appendChild(toast)
      vueInstance.mount(toast)

      setTimeout(() => {
        vueInstance.unmount()
        document.body.removeChild(toast)
      }, 3000)

  } catch (e) {
    error.value = 'Login failed, please check your email and password'
    console.error('Login error:', e)
    const toast = document.createElement('div')
      const vueInstance = createApp(Toast, {
        message: 'Login failed, please check your email and password',
        type: 'error'
      })
      document.body.appendChild(toast)
      vueInstance.mount(toast)

      setTimeout(() => {
        vueInstance.unmount()
        document.body.removeChild(toast)
      }, 3000)
  }
}

const handleGoogleLogin = async () => {
  try {
    error.value = ''
    const provider = new GoogleAuthProvider()
    await signInWithPopup($auth, provider)
    router.push('/')
  } catch (e) {
    error.value = 'Google login failed, please try later.'
    console.error('Google login error:', e)
  }
}
</script>