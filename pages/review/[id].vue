<template>
  <div class="review-container">
    <div class="movie-details" v-if="movie">
      <div class="movie-poster">
        <img :src="`https://image.tmdb.org/t/p/w500${movie.poster_path}`" :alt="movie.title">
      </div>
      <div class="movie-info">
        <h1>{{ movie.title }}</h1>
        <div class="rating">
          <span class="vote-average">Rate: {{ movie.vote_average }}/10</span>
          <span class="release-date">Release Date: {{ formatDate(movie.release_date) }}</span>
        </div>
        <p class="overview">{{ movie.overview }}</p>
      </div>
    </div>

    <!-- User comments -->
    <div class="reviews-section">
      <h2>Comments</h2>
      <div class="reviews-list" v-if="reviews.length">
        <div v-for="review in reviews" :key="review.id" class="review-item">
          <div class="review-header">
            <span class="user-name">{{ review.userName }}</span>
            <span class="review-rating">Scores: {{ review.rating }}/5</span>
          </div>
          <p class="review-content">{{ review.content }}</p>
          <span class="review-date">{{ formatDate(review.createdAt) }}</span>
        </div>
      </div>
      <div v-else class="no-reviews">
        Nothing to tell
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { doc, setDoc, getDoc } from 'firebase/firestore'
const { $firestore } = useNuxtApp()
const route = useRoute()
const movieId = route.params.id
const movie = ref({
  overview: '',
  poster_path: '',
  release_date: '',
  title: '',
  tmdb_id: '',
  vote_average: ''
})
const reviews = ref([])

// fetchMovieDetails
const fetchMovieDetails = async () => {
  try {
    const movie_info = await getDoc(doc($firestore, 'movies', movieId))
    if (movie_info.exists()){
      const movieData = movie_info.data()
      movie.value.overview = movieData.overview || ''
      movie.value.poster_path = movieData.poster_path || ''
      movie.value.release_date = movieData.release_date || ''
      movie.value.title = movieData.title || ''
      movie.value.tmdb_id = movieData.tmdb_id || ''
      movie.value.vote_average = movieData.vote_average || ''
    }else{
      console.log('Movie does not exist')
    }
  } catch (error) {
    console.error('Failed to fetch Movie details:', error)
  }
}

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('zh-CN')
}

onMounted(() => {
  fetchMovieDetails()
})
</script>

<style scoped>
.review-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.movie-details {
  display: flex;
  gap: 30px;
  margin-bottom: 40px;
}

.movie-poster img {
  max-width: 300px;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.movie-info {
  flex: 1;
}

.movie-info h1 {
  margin-bottom: 16px;
  font-size: 2em;
}

.rating {
  display: flex;
  gap: 20px;
  margin-bottom: 16px;
}

.overview {
  line-height: 1.6;
}

.reviews-section {
  margin-top: 40px;
}

.reviews-section h2 {
  margin-bottom: 20px;
}

.review-item {
  background-color: #f5f5f5;
  padding: 20px;
  border-radius: 8px;
  margin-bottom: 20px;
}

.review-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
}

.user-name {
  font-weight: bold;
}

.review-content {
  margin-bottom: 10px;
  line-height: 1.5;
}

.review-date {
  color: #666;
  font-size: 0.9em;
}

.no-reviews {
  text-align: center;
  padding: 40px;
  color: #666;
}
</style>
