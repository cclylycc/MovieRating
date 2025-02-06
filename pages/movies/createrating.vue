<template>
  <div class="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
    <h1 class="text-3xl font-bold mb-6">Create Review</h1>
    <div class="bg-white rounded-lg shadow p-4 sm:p-6 lg:p-8 max-w-3xl mx-auto">
      <!-- 步骤指示器 -->
      <div class="mb-8">
        <div class="flex items-center justify-between w-full">
          <div v-for="(step, index) in steps" :key="index" class="flex items-center flex-1">
            <div
              class="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
              :class="{
                'bg-blue-500 text-white': currentStep >= index,
                'bg-gray-200 text-gray-500': currentStep < index
              }"
            >
              {{ index + 1 }}
            </div>
            <div
              v-if="index < steps.length - 1"
              class="h-1 flex-1 mx-4"
              :class="{
                'bg-blue-500': currentStep > index,
                'bg-gray-200': currentStep <= index
              }"
            ></div>
          </div>
        </div>
        <div class="flex justify-between mt-2 w-full">
          <div v-for="(step, index) in steps" :key="index" class="text-sm text-gray-500 text-center flex-1">
            {{ step }}
          </div>
        </div>
      </div>

      <!-- 第一步：搜索电影 -->
      <div v-if="currentStep === 0" class="space-y-6">
        <div>
          <label for="movieSearch" class="block text-sm font-medium text-gray-700">Search Movie</label>
          <div class="mt-1 flex space-x-3">
            <input
              type="text"
              id="movieSearch"
              v-model="searchQuery"
              class="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              placeholder="Find your movie..."
              @keyup.enter="searchMovie"
            />
            <button
              @click="searchMovie"
              class="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              :disabled="isSearching"
            >
              {{ isSearching ? 'Searing...' : 'Search' }}
            </button>
          </div>
        </div>

        <!-- 搜索结果列表 -->
        <div v-if="searchResults.length > 0" class="space-y-4">
          <h3 class="text-lg font-medium">Results</h3>
          <div class="grid grid-cols-1 gap-4">
            <div
              v-for="movie in paginatedMovies"
              :key="movie.id"
              class="flex items-start p-4 border rounded-lg hover:bg-gray-50 cursor-pointer"
              @click="selectMovie(movie)"
            >
              <div class="w-16 h-24 flex-shrink-0 mr-4">
                <img
                  :src="movie.poster_path ? `https://image.tmdb.org/t/p/w92${movie.poster_path}` : '/placeholder.png'"
                  :alt="movie.title"
                  class="w-full h-full object-cover rounded"
                />
              </div>
              <div class="flex-1 min-w-0">
                <h4 class="text-lg font-medium truncate">{{ movie.title }}</h4>
                <p class="text-sm text-gray-500">{{ movie.release_date ? new Date(movie.release_date).getFullYear() : 'Unknown Year' }}</p>
                <p class="text-sm text-gray-600 line-clamp-2 mt-1">{{ movie.overview || 'No details' }}</p>
              </div>
            </div>
          </div>
          
          <!-- 分页控制器 -->
          <div v-if="totalPages > 1" class="flex justify-center items-center space-x-2 mt-4">
            <button
              @click="changePage(currentPage - 1)"
              :disabled="currentPage === 1"
              class="px-3 py-1 border rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <div class="flex space-x-1">
              <button
                v-for="page in totalPages"
                :key="page"
                @click="changePage(page)"
                :class="[
                  'px-3 py-1 rounded-md text-sm',
                  currentPage === page
                    ? 'bg-blue-500 text-white'
                    : 'border hover:bg-gray-50'
                ]"
              >
                {{ page }}
              </button>
            </div>
            <button
              @click="changePage(currentPage + 1)"
              :disabled="currentPage === totalPages"
              class="px-3 py-1 border rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>

        <div v-else-if="hasSearched" class="text-center py-8 text-gray-500">
          No movie founded
        </div>
      </div>

      <!-- 第二步和第三步的占位 -->
      <div v-else>
        <!-- 第二步：评分 -->
        <div v-if="currentStep === 1" class="space-y-6">
          <!-- 已选择的电影信息 -->
          <div v-if="selectedMovie" class="bg-gray-50 rounded-lg p-4 flex items-start space-x-4">
            <img
              :src="selectedMovie.poster_path ? `https://image.tmdb.org/t/p/w92${selectedMovie.poster_path}` : '/placeholder.png'"
              :alt="selectedMovie.title"
              class="w-20 h-30 object-cover rounded"
            />
            <div class="flex-1">
              <h3 class="text-lg font-medium">{{ selectedMovie.title }}</h3>
              <p class="text-sm text-gray-500">{{ selectedMovie.release_date ? new Date(selectedMovie.release_date).getFullYear() : '未知年份' }}</p>
              <p class="text-sm text-gray-600 mt-2 line-clamp-2">{{ selectedMovie.overview || '暂无简介' }}</p>
            </div>
          </div>
          <!-- 评分组件将在这里添加 -->
          <p class="text-gray-500 text-center">评分功能开发中...</p>
        </div>

        <!-- 第三步：评论 -->
        <div v-else-if="currentStep === 2" class="space-y-6">
          <p class="text-gray-500 text-center">评论功能开发中...</p>
        </div>
      </div>

      <!-- 导航按钮 -->
      <div class="flex justify-between mt-8">
        <button
          v-if="currentStep > 0"
          @click="currentStep--"
          class="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Go Back 
        </button>
        <div></div>
        <button
          v-if="currentStep < steps.length - 1 && canProceed"
          @click="currentStep++"
          class="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          下一步
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useHead } from 'nuxt'
import { getFirestore, collection, query, where, getDocs, addDoc } from 'firebase/firestore'

useHead({
  title: 'Create Review - MovieRating'
})

const router = useRouter()
const db = getFirestore()

// 步骤配置
const steps = ['Choose Movie', 'Rate', 'Comment']
const currentStep = ref(0)

// 电影搜索相关
const searchQuery = ref('')
const searchResults = ref([])
const isSearching = ref(false)
const hasSearched = ref(false)
const selectedMovie = ref(null)

// TMDb API 配置
const TMDB_API_KEY = '05498067b8f3b73c9b52711db7826e7e'
const TMDB_API_URL = 'https://api.themoviedb.org/3'

// 评分相关
const rating = ref(0)
const comment = ref('')

// 控制是否可以进行下一步
const canProceed = computed(() => {
  switch (currentStep.value) {
    case 0:
      return selectedMovie.value !== null
    case 1:
      return rating.value > 0
    case 2:
      return comment.value.trim().length > 0
    default:
      return false
  }
})

// 搜索电影
const searchMovie = async () => {
  if (!searchQuery.value.trim() || isSearching.value) return

  isSearching.value = true
  searchResults.value = []
  hasSearched.value = true

  try {
    // 首先在 Firebase 中搜索
    const moviesRef = collection(db, 'movies')
    const q = query(moviesRef, where('title', '>=', searchQuery.value), where('title', '<=', searchQuery.value + '\uf8ff'))
    const querySnapshot = await getDocs(q)
    
    if (!querySnapshot.empty) {
      searchResults.value = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
      totalPages.value = Math.ceil(searchResults.value.length / 5)
    } else {
      // 如果 Firebase 中没有找到，则从 TMDb API 获取
      const response = await fetch(
        `${TMDB_API_URL}/search/movie?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(searchQuery.value)}&language=en-US&page=${currentPage.value}`
      )
      const data = await response.json()
      
      if (data.results && data.results.length > 0) {
        searchResults.value = data.results
        totalPages.value = Math.min(data.total_pages, 5) // 限制最大页数为5
        
        // 将搜索结果保存到 Firebase
        for (const movie of data.results) {
          await addDoc(collection(db, 'movies'), {
            tmdb_id: movie.id,
            title: movie.title,
            overview: movie.overview,
            poster_path: movie.poster_path,
            release_date: movie.release_date,
            vote_average: movie.vote_average
          })
        }
      }
    }
  } catch (error) {
    console.error('Error searching movies:', error)
  } finally {
    isSearching.value = false
  }
}

// 选择电影
const selectMovie = (movie) => {
  selectedMovie.value = movie
  currentStep.value++
}

// 分页相关
const currentPage = ref(1)
const totalPages = ref(1)

// 切换页码
const changePage = (page) => {
  currentPage.value = page
  searchMovie()
}

// 计算当前页的电影数据
const paginatedMovies = computed(() => searchResults.value)
</script>