<template>
  <div class="max-w-6xl mx-auto px-4 py-8">
    <div class="flex flex-col md:flex-row gap-8">
      <!-- Left -->
      <div class="w-full md:w-64 bg-white rounded-lg shadow-md p-6">
        <h2 class="text-xl font-bold text-gray-800 mb-4">User Center</h2>
        <nav class="space-y-2">
          <button
            @click="activeTab = 'profile'"
            :class="['w-full text-left px-4 py-2 rounded-md', activeTab === 'profile' ? 'bg-blue-500 text-white' : 'text-gray-600 hover:bg-gray-100']"
          >
            Profile
          </button>
          <button
            @click="activeTab = 'reviews'"
            :class="['w-full text-left px-4 py-2 rounded-md', activeTab === 'reviews' ? 'bg-blue-500 text-white' : 'text-gray-600 hover:bg-gray-100']"
          >
            My Reviews
          </button>
          <button
            @click="activeTab = 'favorites'"
            :class="['w-full text-left px-4 py-2 rounded-md', activeTab === 'favorites' ? 'bg-blue-500 text-white' : 'text-gray-600 hover:bg-gray-100']"
          >
            Favorite Movies
          </button>
          <button
            @click="activeTab = 'settings'"
            :class="['w-full text-left px-4 py-2 rounded-md', activeTab === 'settings' ? 'bg-blue-500 text-white' : 'text-gray-600 hover:bg-gray-100']"
          >
            Account Settings
          </button>
        </nav>
      </div>

      <!-- Right -->
      <div class="flex-1 bg-white rounded-lg shadow-md p-6">
        <!-- Basic Info -->
        <div v-if="activeTab === 'profile'" class="space-y-6">
          <h3 class="text-2xl font-bold text-gray-800 mb-6">Profile Information</h3>
          <form @submit.prevent="saveUserProfile" class="space-y-4">
            <div class="flex items-center space-x-4 mb-6">
              <img
                :src="userProfile.photoURL || 'https://ui-avatars.com/api/?name=' + userProfile.displayName"
                :alt="userProfile.displayName"
                class="w-24 h-24 rounded-full object-cover"
              />
              <button
                type="button"
                class="px-4 py-2 text-sm text-blue-500 border border-blue-500 rounded-md hover:bg-blue-50"
              >
                Change Avatar
              </button>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Username</label>
                <input
                  v-model="userProfile.displayName"
                  type="text"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <input
                  v-model="userProfile.email"
                  type="email"
                  disabled
                  class="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Gender</label>
                <select
                  v-model="userProfile.gender"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Date of Birth</label>
                <input
                  v-model="userProfile.birthDate"
                  type="date"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div class="mt-6">
              <button
                type="submit"
                class="w-full md:w-auto px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>

        <!-- Others -->
        <div v-else class="text-center text-gray-600 py-12">
          <p class="text-xl">This feature is under development...</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { createApp } from 'vue'
import { onAuthStateChanged, updateProfile } from 'firebase/auth'
import { doc, setDoc, getDoc } from 'firebase/firestore'
import { useRouter } from 'vue-router'
import Toast from '~/components/Toast.vue'
const { $auth, $firestore } = useNuxtApp()
const router = useRouter()

const activeTab = ref('profile')
const userProfile = ref({
  displayName: '',
  email: '',
  photoURL: '',
  gender: '',
  birthDate: ''
})

onMounted(() => {
  onAuthStateChanged($auth, async (user) => {
    if (user) {
      // Basic info
      userProfile.value = {
        displayName: user.displayName || '',
        email: user.email || '',
        photoURL: user.photoURL || '',
        gender: '',
        birthDate: ''
      }
      
      // Get info from Firebase
      try {
        const userDoc = await getDoc(doc($firestore, 'users', user.uid))
        if (userDoc.exists()) {
          const userData = userDoc.data()
          userProfile.value.gender = userData.gender || ''
          userProfile.value.birthDate = userData.birthDate || ''
        }
      } catch (error) {
        console.error('Failed to load Info:', error)
      }
    } else {
      router.push('/login')
    }
  })
})

const saveUserProfile = async () => {
  try {
    if ($auth.currentUser) {
      // Update Firebase Auth info
      await updateProfile($auth.currentUser, {
        displayName: userProfile.value.displayName,
        photoURL: userProfile.value.photoURL
      })

      // Save other info to Firestore
      await setDoc(doc($firestore, 'users', $auth.currentUser.uid), {
        gender: userProfile.value.gender,
        birthDate: userProfile.value.birthDate,
        updatedAt: new Date().toISOString()
      }, { merge: true })

      const toast = document.createElement('div')
      const vueInstance = createApp(Toast, {
        message: 'Update Successfully',
        type: 'success'
      })
      document.body.appendChild(toast)
      vueInstance.mount(toast)

      setTimeout(() => {
        vueInstance.unmount()
        document.body.removeChild(toast)
      }, 3000)
    }
  } catch (error) {
    console.error('Update Failed:', error)
    const toast = document.createElement('div')
    const vueInstance = createApp(Toast, {
      message: 'Failed to update, please try again.',
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
</script>