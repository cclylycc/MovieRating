import { defineStore } from 'pinia'
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth'
import type { User } from 'firebase/auth'

interface AuthState {
  user: User | null
  loading: boolean
  error: string | null
}

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    user: null,
    loading: false,
    error: null
  }),

  getters: {
    isAuthenticated: (state) => !!state.user,
    currentUser: (state) => state.user
  },

  actions: {
    setUser(user: User | null) {
      this.user = user
    },

    async loginWithEmail(auth: any, email: string, password: string) {
      this.loading = true
      this.error = null
      try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password)
        this.user = userCredential.user
        return userCredential
      } catch (error: any) {
        this.error = error.message
        throw error
      } finally {
        this.loading = false
      }
    },

    async loginWithGoogle(auth: any) {
      this.loading = true
      this.error = null
      try {
        const provider = new GoogleAuthProvider()
        const userCredential = await signInWithPopup(auth, provider)
        this.user = userCredential.user
        return userCredential
      } catch (error: any) {
        this.error = error.message
        throw error
      } finally {
        this.loading = false
      }
    },

    async logout(auth: any) {
      try {
        await signOut(auth)
        this.user = null
      } catch (error: any) {
        this.error = error.message
        throw error
      }
    },

    clearError() {
      this.error = null
    }
  }
})