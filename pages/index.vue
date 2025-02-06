<template>
  <div class="space-y-8">
    <!-- Welcome Banner -->
    <div class="bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg p-8">
      <h1 class="text-4xl font-bold mb-4">Welcome to MovieRating</h1>
      <p class="text-xl">Discover great movies, share your viewing experience</p>
    </div>

    <!-- Search Box -->
    <div class="relative">
      <input
        v-model="searchQuery"
        type="text"
        placeholder="Search movies..."
        class="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      />
      <button
        class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </button>
    </div>

    <!-- Popular Movies -->
    <section>
      <h2 class="text-2xl font-bold mb-4">Popular Movies</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div v-for="movie in popularMovies" :key="movie.id" class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
          <div class="relative pb-[150%] overflow-hidden">
            <img :src="movie.poster" :alt="movie.title" class="absolute inset-0 w-full h-full object-cover" loading="lazy" />
          </div>
          <div class="p-4">
            <h3 class="font-bold text-lg mb-2">{{ movie.title }}</h3>
            <div class="flex items-center mb-2">
              <div class="flex text-yellow-400">
                <svg v-for="i in Math.floor(movie.rating)" :key="i" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              </div>
              <span class="ml-2 text-gray-600">{{ movie.rating.toFixed(1) }}</span>
            </div>
            <p class="text-gray-600 text-sm line-clamp-2">{{ movie.description }}</p>
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
import { ref } from 'vue'

const searchQuery = ref('')

// Mock data
const popularMovies = [
  {
    id: 1,
    title: 'The Shawshank Redemption',
    rating: 9.7,
    poster: 'https://www.themoviedb.org/t/p/w1280/9cqNxx0GxF0bflZmeSMuL5tnGzr.jpg',
    description: 'Hope is a good thing, maybe the best of things, and no good thing ever dies.'
  },
  {
    id: 2,
    title: 'Forrest Gump',
    rating: 9.5,
    poster: 'https://www.themoviedb.org/t/p/w1280/arw2vcBveWOVZr6pxd9XTd1TdQa.jpg',
    description: 'Life is like a box of chocolates. You never know what youre gonna get.'
  },
  {
    id: 3,
    title: 'Titanic',
    rating: 9.4,
    poster: 'https://www.themoviedb.org/t/p/w1280/9xjZS2rlVxm8SFx8kPC3aIGCOYQ.jpg',
    description: 'A timeless love story set against the backdrop of the ill-fated maiden voyage.'
  },
  {
    id: 4,
    title: 'Léon: The Professional',
    rating: 9.4,
    poster: 'https://www.themoviedb.org/t/p/w1280/yI6X2cCM5YPJtxMhUd3dPGqDAhw.jpg',
    description: 'A unique relationship between a professional assassin and a young girl.'
  }
]

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
</script>