<template>
  <div class="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
    <h1 class="text-3xl font-bold mb-6">Create Review</h1>

    <div class="bg-white rounded-lg shadow p-4 sm:p-6 lg:p-8 max-w-3xl mx-auto">
      <div class="mb-8">
        <div class="flex items-center justify-between w-full">
          <div v-for="(step, index) in steps" :key="index" class="flex flex-col items-center flex-1 gap-1">
            <div class="flex items-center justify-center w-full mb-2">
              <div
                class="relative w-full text-center h-1 mx-4"
                :class="{
                  'bg-blue-500': currentStep >= index,
                  'bg-gray-200': currentStep < index
                }"
              >
                <div
                    :class="['absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-6 h-6 rounded-full border-2', {'bg-blue-500 border-blue-500 text-white': currentStep >= index, 'bg-white border-gray-200 text-gray-400': currentStep < index}]">
                    <span class="text-xs">{{ index + 1 }}</span>
                </div>
              </div>
              <div v-if="index < steps.length - 1" class="h-1 flex-1 mx-4"
                :class="{
                  'bg-blue-500': currentStep > index,
                  'bg-gray-200': currentStep <= index
                }"
              ></div>
            </div>
              <p class="text-sm" :class="{'font-medium text-gray-900' : currentStep >= index, 'text-gray-500': currentStep < index }">{{ step }}</p>
          </div>
        </div>
      </div>

      <div v-if="currentStep === 0" class="space-y-6">
        <div>
          <label for="movieSearch" class="block text-sm font-medium text-gray-700">Search Movie</label>
          <div class="mt-1 flex space-x-3 w-full max-w-2xl mx-auto">
            <input
              type="text"
              id="movieSearch"
              v-model="searchQuery"
              class="block flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              placeholder="Find your movie..."
              @keyup.enter="searchMovie"
            />
            <button
              @click="searchMovie"
              class="px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 whitespace-nowrap"
              :disabled="isSearching"
            >
              {{ isSearching ? 'Searching...' : 'Search' }}
            </button>
          </div>

          <div v-if="totalPages > 1" class="flex justify-center items-center space-x-4 mt-6">
           </div>
        </div>

        <div v-if="searchResults.length > 0" class="space-y-4">
          <h3 class="text-lg font-medium">Results</h3>
          <div class="grid grid-cols-1 gap-4 max-w-2xl mx-auto">
            <div
              v-for="movie in paginatedMovies"
              :key="movie.id"
              class="flex items-center p-4 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors duration-200"
              @click="selectMovie(movie)"
            >
              <div class="w-20 h-30 flex-shrink-0 mr-6">
                <img
                  :src="movie.poster_path ? `https://image.tmdb.org/t/p/w92${movie.poster_path}` : '/placeholder.png'"
                  :alt="movie.title"
                  class="w-full h-full object-cover rounded shadow-sm"
                />
              </div>
              <div class="flex-1 min-w-0 space-y-2">
                <h4 class="text-lg font-medium truncate flex items-center">
                  {{ movie.title }}
                  <span
                    :class="[
                      'ml-2 text-xs px-2 py-1 rounded-full',
                      movie.tmdb_id ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'
                    ]"
                  >
                    {{ movie.tmdb_id ? 'from MovieRating' : 'from TMDB' }}
                  </span>
                </h4>
                <p class="text-sm text-gray-500">{{ movie.release_date ? new Date(movie.release_date).getFullYear() : 'Unknown Year' }}</p>
                <p class="text-sm text-gray-600 line-clamp-2">{{ movie.overview || 'No details' }}</p>
              </div>
            </div>
          </div>

          <div v-if="totalPages > 1" class="flex justify-center items-center space-x-4 mt-6">
            </div>
        </div>
        <div v-else-if="hasSearched" class="text-center py-8 text-gray-500">
          No movie founded
        </div>
      </div>

      <div v-else>
        <div v-if="currentStep === 1" class="space-y-6">
            <div v-if="selectedMovie" class="bg-gray-50 rounded-lg p-4 flex items-start space-x-4">

                <img
                    :src="selectedMovie.poster_path ? `https://image.tmdb.org/t/p/w92${selectedMovie.poster_path}` : '/placeholder.png'"
                    :alt="selectedMovie.title"
                    class="w-20 h-30 object-cover rounded"
                />

                <div class="flex-1">
                    <h3 class="text-lg font-medium">{{ selectedMovie.title }}</h3>
                    <p class="text-sm text-gray-500">{{ selectedMovie.release_date ? new Date(selectedMovie.release_date).getFullYear() : 'Unknown Year' }}</p>
                    <p class="text-sm text-gray-600 mt-2 line-clamp-2">{{ selectedMovie.overview || 'No details' }}</p>
                </div>

            </div>
            <div class="flex items-center justify-center">
                <button
                    v-for="star in 5"
                    :key="star"
                    @click="rating = star"
                    class="text-4xl"
                    :class="star <= rating ? 'text-yellow-400' : 'text-gray-300 hover:text-yellow-300'"
                >
                    ★
                </button>
            </div>
             <p class="text-gray-500 text-center">Select your score</p>
        </div>

        <div v-else-if="currentStep === 2" class="space-y-6">
             <div v-if="selectedMovie" class="bg-gray-50 rounded-lg p-4 flex items-start space-x-4">
                <img
                    :src="selectedMovie.poster_path ? `https://image.tmdb.org/t/p/w92${selectedMovie.poster_path}` : '/placeholder.png'"
                    :alt="selectedMovie.title"
                    class="w-20 h-30 object-cover rounded"
                />
                 <div class="flex-1">
                    <h3 class="text-lg font-medium">{{ selectedMovie.title }}</h3>
                    <p class="text-sm text-gray-500">{{ selectedMovie.release_date ? new Date(selectedMovie.release_date).getFullYear() : 'Unknown Year' }}</p>
                    <p class="text-sm text-gray-600 mt-2 line-clamp-2">{{ selectedMovie.overview || 'No details' }}</p>
                </div>

             </div>

            <label for="comment" class="block text-sm font-medium text-gray-700">Your Review</label>
            <textarea
              id="comment"
              v-model="comment"
              rows="4"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              placeholder="Write your review here..."
            ></textarea>
          </div>
      </div>

        <div class="flex justify-between mt-8">

        <button
          v-if="currentStep > 0"
          @click="currentStep--"
          class="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Go Back
        </button>
          <div v-if="currentStep < steps.length -1"></div>
           <button v-else @click="createReview" :disabled="!canProceed" class="px-4 py-2 border border-transparent
            rounded-md shadow-sm text-sm font-medium text-white bg-green-600
            hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2
            focus:ring-green-500">Submit</button>


        <button
          v-if="currentStep < steps.length - 1 && canProceed"
          @click="currentStep++"
          class="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Next Step
        </button>
      </div>

    </div>
  </div>
  <Toast :message="toastMessage" :type="toastType" :duration="3000" v-if="showToast" @close="showToast = false"/>
</template>


<script setup>
import { ref, computed, createApp } from 'vue'
import { useRouter } from 'vue-router'
import { getFirestore, collection, query, where, getDocs, addDoc, serverTimestamp } from 'firebase/firestore'
import { getAuth, onAuthStateChanged } from 'firebase/auth'
import Toast from '~/components/Toast.vue' // Import the Toast component


useHead({
  title: 'Create Review - MovieRating'
})

const router = useRouter()
const db = getFirestore()
const auth = getAuth()  // Get the auth instance

const steps = ['Choose Movie', 'Rate', 'Comment']
const currentStep = ref(0)

const searchQuery = ref('')
const searchResults = ref([])
const isSearching = ref(false)
const hasSearched = ref(false)
const selectedMovie = ref(null)

// TMDb API
const TMDB_API_KEY = '05498067b8f3b73c9b52711db7826e7e'
const TMDB_API_URL = 'https://api.themoviedb.org/3'

// Comments
const rating = ref(0) // Initialize rating
const comment = ref('')

// Toast
const showToast = ref(false)
const toastMessage = ref('')
const toastType = ref('success') // or 'error'

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

// Search Movie
const searchMovie = async () => {
   if (!searchQuery.value.trim() || isSearching.value) return
    isSearching.value = true
    searchResults.value = []
    hasSearched.value = true

    try {
        const moviesRef = collection(db, 'movies')
        const searchLower = searchQuery.value.toLowerCase()
        const titleQuery = query(
            moviesRef,
            where('title_lower', '>=', searchLower),
            where('title_lower', '<=', searchLower + '\uf8ff')
        )
        const titleQuerySnapshot = await getDocs(titleQuery)

        if (!titleQuerySnapshot.empty) {
            searchResults.value = titleQuerySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
            totalPages.value = Math.ceil(searchResults.value.length / 5)
        } else {
          // if can not find from firebase, search from TMDb
          const response = await fetch(
            `${TMDB_API_URL}/search/movie?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(searchQuery.value)}&language=en-US&page=${currentPage.value}`
          )
          const data = await response.json()


          if (data.results && data.results.length > 0) {
            searchResults.value = data.results
            totalPages.value = Math.min(data.total_pages, 10)  // Max page 10

            // Save new movies to firebase
            for (const movie of data.results) {
              // Check if movie already exists by tmdb_id
              const tmdbQuery = query(moviesRef, where('tmdb_id', '==', movie.id))
              const tmdbQuerySnapshot = await getDocs(tmdbQuery)

              if (tmdbQuerySnapshot.empty) {
                // Only save if movie doesn't exist
                await addDoc(collection(db, 'movies'), {
                  tmdb_id: movie.id,
                  title: movie.title,
                  title_lower: movie.title.toLowerCase(), // 添加小写标题字段用于搜索
                  overview: movie.overview,
                  poster_path: movie.poster_path,
                  release_date: movie.release_date,
                  vote_average: movie.vote_average
                })
              }
            }
          }
        }
    } catch (error) {
      console.error('Error searching movies:', error)
      showToast.value = true
      toastMessage.value = 'Error searching movies. Please try again.'
      toastType.value = 'error'

    } finally {
        isSearching.value = false
    }
}

// select movie
const selectMovie = (movie) => {
  selectedMovie.value = movie
  currentStep.value++
}

// pages
const currentPage = ref(1)
const totalPages = ref(1)

// change pages
const changePage = (page) => {
    currentPage.value = page
    searchMovie()
}

const paginatedMovies = computed(() => searchResults.value)

const createReview = async () => {
     if (!auth.currentUser) {
        showToast.value = true;
        toastMessage.value = "You must be logged in to create a review.";
        toastType.value = 'error';
        router.push('/login');
        return;
    }

  try {
    const reviewsRef = collection(db, 'reviews')
    await addDoc(reviewsRef, {
      movieId: selectedMovie.value.id,
      userId: auth.currentUser.uid,  // Use auth.currentUser
      userName: auth.currentUser.displayName || auth.currentUser.email, // Use displayName or email
      rating: rating.value,
      comment: comment.value,
      createdAt: serverTimestamp()
    });

    showToast.value = true;
    toastMessage.value = "Review created successfully!";
    toastType.value = 'success';


    // Reset form and navigate
    selectedMovie.value = null;
    rating.value = 0;
    comment.value = '';
    currentStep.value = 0;
     router.push(`/review/${selectedMovie.value.id}`);

  } catch (error) {
      console.error("Error creating review:", error);
        showToast.value = true;
        toastMessage.value = "Error creating review. Please try again.";
        toastType.value = 'error';
  }
}

onMounted(() => {
  onAuthStateChanged(auth, (user) => {
    if (!user) {
      //If user is not logged in, show a toast and redirect to login page
      showToast.value = true
      toastMessage.value = "You must be logged in to create a review."
      toastType.value = "error"
      router.push('/login')
    }
  })
})
</script>