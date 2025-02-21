 <!-- Show Six top rated Movies-->

<template>
  <div class="container mx-auto py-1 px-1">
   
      <h1 class="text-4xl font-bold text-center">Six Top Rated Movies </h1>
      <br></br><br></br>
  

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
const totalPages = 1
const lastVisible = ref(null)
const pageSize = 6
const sortField = ref('vote_average')
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
    const allMoviesQuery = query(moviesRef, limit(6))
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