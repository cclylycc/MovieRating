<template>
  <div class="container mx-auto py-8 px-4">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-3xl font-bold">Movies</h1>
      
      <!-- Sort Controls -->
      <div class="flex space-x-4">
        <select 
          v-model="sortField" 
          @change="handleSortChange"
          class="px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="release_date">Release Date</option>
          <option value="vote_average">Rating</option>
        </select>
        <select 
          v-model="sortDirection" 
          @change="handleSortChange"
          class="px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="desc">Descending</option>
          <option value="asc">Ascending</option>
        </select>
      </div>
    </div>

    <!-- Search Box -->
    <div class="relative">
      <input
        v-model="searchQuery"
        type="text"
        placeholder="Search movies..."
        class="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        @input="handleSearch"
      />
      <button
        class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </button>
      
      <!-- Search Results Dropdown -->
      <div v-if="searchResults.length > 0" class="absolute z-50 w-full mt-2 bg-white rounded-lg shadow-lg max-h-96 overflow-y-auto">
        <div v-for="movie in searchResults" :key="movie.id" @click="navigateToReview(movie.id)" class="p-4 hover:bg-gray-50 cursor-pointer border-b last:border-b-0">
          <div class="flex space-x-4">
            <img :src="movie.poster_path ? `https://image.tmdb.org/t/p/w92${movie.poster_path}` : '/placeholder.png'" :alt="movie.title" class="w-16 h-24 object-cover rounded" />
            <div class="flex-1">
              <h4 class="font-medium text-gray-900">{{ movie.title }}</h4>
              <p class="text-sm text-gray-500 mb-1">{{ movie.release_date ? new Date(movie.release_date).getFullYear() : 'Unknown Year' }}</p>
              <p class="text-sm text-gray-600 line-clamp-2">{{ movie.overview }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Movie List -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div v-for="movie in movies" :key="movie.id" class="bg-white rounded-lg shadow overflow-hidden">
        <img 
          :src="movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : '/placeholder.png'"
          :alt="movie.title"
          class="w-full h-64 object-cover"
        />
        <div class="p-4">
          <h2 class="text-xl font-semibold mb-2">{{ movie.title }}</h2>
          <div class="flex items-center mb-2">
            <span class="text-yellow-500 mr-2">★</span>
            <span>{{ movie.vote_average }}/10</span>
          </div>
          <p class="text-gray-600 text-sm mb-4 line-clamp-2">{{ movie.overview }}</p>
          <NuxtLink 
            :to="`/review/${movie.id}`"
            class="inline-block bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
          >
            More Info
          </NuxtLink>
        </div>
      </div>
    </div>

    <!-- 分页控件 -->
    <div class="mt-8 flex justify-center space-x-2" v-if="totalPages > 1">
      <button 
        @click="changePage(currentPage - 1)"
        :disabled="currentPage === 1"
        class="px-4 py-2 border rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed"
      >
      Previous page
      </button>
      <span class="px-4 py-2">{{ currentPage }} / {{ totalPages }}</span>
      <button 
        @click="changePage(currentPage + 1)"
        :disabled="currentPage === totalPages"
        class="px-4 py-2 border rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Next Page
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { collection, getDocs, query, orderBy, limit, startAfter } from 'firebase/firestore'

const { $firestore } = useNuxtApp()

const movies = ref([])
const currentPage = ref(1)
const totalPages = ref(0)
const lastVisible = ref(null)
const pageSize = 9
const sortField = ref('release_date')
const sortDirection = ref('desc')

const searchQuery = ref('')
const searchResults = ref([])

// Debounce function
const debounce = (fn, delay) => {
  let timeoutId
  return (...args) => {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => fn(...args), delay)
  }
}

// Fetch movies lists
const fetchMovies = async () => {
  try {
    const moviesRef = collection($firestore, 'movies')
    let q

    if (lastVisible.value && currentPage.value > 1) {
      q = query(moviesRef, orderBy(sortField.value, sortDirection.value), startAfter(lastVisible.value), limit(pageSize))
    } else {
      q = query(moviesRef, orderBy(sortField.value, sortDirection.value), limit(pageSize))
    }

    const querySnapshot = await getDocs(q)
    movies.value = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }))

    if (querySnapshot.docs.length > 0) {
      lastVisible.value = querySnapshot.docs[querySnapshot.docs.length - 1]
    }

    // 获取总文档数以计算总页数
    const totalDocs = await getDocs(collection($firestore, 'movies'))
    totalPages.value = Math.ceil(totalDocs.size / pageSize)
  } catch (error) {
    console.error('Failed to load movies:', error)
  }
}

// change pages
const changePage = async (page) => {
  if (page < 1 || page > totalPages.value) return
  currentPage.value = page
  if (page === 1) {
    lastVisible.value = null
  }
  await fetchMovies()
}

// handle sort change
const handleSortChange = async () => {
  currentPage.value = 1
  lastVisible.value = null
  await fetchMovies()
}

// Search movies function
const handleSearch = debounce(async () => {
  if (!searchQuery.value.trim()) {
    searchResults.value = []
    return
  }

  try {
    const moviesRef = collection($firestore, 'movies')
    const searchTerms = searchQuery.value.toLowerCase().split(/\s+/)
    
    // get all the movies
    const allMoviesQuery = query(moviesRef, limit(50))
    const querySnapshot = await getDocs(allMoviesQuery)
    
    // filter the movies
    const filteredMovies = querySnapshot.docs
      .map(doc => ({
        id: doc.id,
        ...doc.data(),
        title: doc.data().title || ''
      }))
      .filter(movie => {
        const movieTitle = movie.title.toLowerCase()
        return searchTerms.every(term => movieTitle.includes(term))
      })
      .slice(0, 5)  // 5 movies can be more
    
    searchResults.value = filteredMovies
  } catch (error) {
    console.error('Error searching movies:', error)
    searchResults.value = []
  }
}, 300)

const navigateToReview = (movieId) => {
  navigateTo(`/review/${movieId}`)
}

onMounted(() => {
  fetchMovies()
})
</script>