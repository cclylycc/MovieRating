<template>
  <Teleport to="body">
    <div
      v-if="isVisible"
      class="fixed top-4 right-4 z-50 flex items-center p-4 min-w-[320px] rounded-lg shadow-lg transition-all duration-300"
      :class="{
        'bg-green-50 text-green-800': type === 'success',
        'bg-red-50 text-red-800': type === 'error'
      }"
    >
      <div class="flex-1">
        <p class="font-medium">{{ message }}</p>
      </div>
      <button
        @click="close"
        class="ml-4 text-gray-400 hover:text-gray-600 focus:outline-none"
      >
        <svg
          class="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>
    </div>
  </Teleport>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const props = defineProps({
  message: {
    type: String,
    required: true
  },
  type: {
    type: String,
    default: 'success',
    validator: (value) => ['success', 'error'].includes(value)
  },
  duration: {
    type: Number,
    default: 3000
  }
})

const isVisible = ref(true)
let timer = null

const close = () => {
  isVisible.value = false
}

onMounted(() => {
  if (props.duration > 0) {
    timer = setTimeout(close, props.duration)
  }
})

onUnmounted(() => {
  if (timer) {
    clearTimeout(timer)
  }
})

defineExpose({
  close
})
</script>