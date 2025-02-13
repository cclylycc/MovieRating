<template>
  <div class="space-y-8">
    <!-- Welcome Banner -->
    <div class="bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg p-8">
      <h1 class="text-4xl font-bold mb-4">Welcome to MovieRating V1.0.2.13.1</h1>
      <p class="text-xl">Discover great movies, share your viewing experience</p>
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

    <!-- Newest Movies -->
    <section>
      <h2 class="text-2xl font-bold mb-4">Latest Movies</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div v-for="movie in lastestMovies" :key="movie.id" class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 cursor-pointer">
          <div class="relative pb-[150%] overflow-hidden" @click="navigateToReview(movie.id)">
            <img :src="movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : '/placeholder.png'" :alt="movie.title" class="absolute inset-0 w-full h-full object-cover" loading="lazy" />
          </div>
          <div class="p-4">
            <h3 class="font-bold text-lg mb-2" @click="navigateToReview(movie.id)">{{ movie.title }}</h3>
            <div class="flex items-center mb-2">
              <div class="flex text-yellow-400">
                <svg v-for="i in Math.floor(movie.vote_average)" :key="i" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              </div>
              <span class="ml-2 text-gray-600">{{ movie.vote_average.toFixed(1) }}</span>
            </div>
            <p class="text-gray-600 text-sm line-clamp-2">{{ movie.overview }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Latest Reviews -->
    <section>
      <h2 class="text-2xl font-bold mb-4">Latest Reviews</h2>
      <div class="bg-white rounded-lg shadow-md divide-y">
        <div v-for="review in latestReviews" :key="review.id" class="p-4 hover:bg-gray-50">
          <div class="flex items-start space-x-4">
            <div class="flex-shrink-0">
              <div class="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                <span class="text-gray-500 font-medium">{{ review.user.charAt(0) }}</span>
              </div>
            </div>
            <div class="flex-1 min-w-0">
              <p class="text-sm font-medium text-gray-900">{{ review.user }}</p>
              <p class="text-sm text-gray-500">reviewed <span class="font-medium">{{ review.movie }}</span></p>
              <div class="flex items-center mt-1">
                <div class="flex text-yellow-400">
                  <svg v-for="i in review.rating" :key="i" xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                </div>
                <span class="ml-2 text-sm text-gray-500">{{ review.comment }}</span>
              </div>
            </div>
            <div class="flex-shrink-0 text-sm text-gray-500">
              {{ review.date }}
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { collection, query, orderBy, limit, getDocs, where, startAt, endAt } from 'firebase/firestore'

const { $firestore } = useNuxtApp()
const searchQuery = ref('')
const lastestMovies = ref([])
const searchResults = ref([])

// Debounce function
const debounce = (fn, delay) => {
  let timeoutId
  return (...args) => {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => fn(...args), delay)
  }
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

// get 4 lastestMovies
const fetchLatestMovies = async () => {
  try {
    const moviesRef = collection($firestore, 'movies')
    const q = query(moviesRef, orderBy('release_date', 'desc'), limit(4))
    const querySnapshot = await getDocs(q)
    
    lastestMovies.value = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }))
  } catch (error) {
    console.error('Error fetching latest movies:', error)
  }
}

// Mock data for latest reviews
const latestReviews = [
  {
    id: 1,
    user: 'MovieLover',
    movie: 'Inception',
    rating: 5,
    comment: 'A visual masterpiece with mind-bending plot.',
    date: '2 hours ago'
  },
  {
    id: 2,
    user: 'CinemaFan',
    movie: 'Interstellar',
    rating: 4,
    comment: 'Stunning space scenes with emotional depth.',
    date: '4 hours ago'
  },
  {
    id: 3,
    user: 'FilmCritic',
    movie: 'The Truman Show',
    rating: 5,
    comment: 'Jim Carreys performance is absolutely brilliant!',
    date: '6 hours ago'
  }
]

const navigateToReview = (movieId) => {
  navigateTo(`/review/${movieId}`)
}

onMounted(() => {
  fetchLatestMovies()
})
</script>