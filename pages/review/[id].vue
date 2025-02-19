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

    <!-- Comments-->
    <div class="reviews-section">
      <h2>Comments</h2>
      <div class="reviews-list" v-if="reviews.length > 0">
        <div v-for="review in reviews" :key="review.id" class="review-item">
          <div class="review-header">
            <span class="user-name">{{ review.userName }}</span>
            <span class="review-rating">Scores: {{ review.rating }}/5</span>
          </div>
          <p class="review-content">{{ review.comment }}</p>
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
import { ref, onMounted, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'
import { doc, getDoc, collection, query, where, orderBy, onSnapshot } from 'firebase/firestore'
const { $firestore } = useNuxtApp()
const route = useRoute()
const movieId = route.params.id
const movie = ref(null)
const reviews = ref([])

//fetchMovieDetails 
const fetchMovieDetails = async () => {
    try {
        const movie_info = await getDoc(doc($firestore, 'movies', movieId))

        if(movie_info.exists()){
            const movieData = movie_info.data()
            movie.value = {
              id: movie_info.id, 
              overview: movieData.overview || '',
              poster_path: movieData.poster_path || '',
              release_date: movieData.release_date || '',
              title: movieData.title || '',
              tmdb_id: movieData.tmdb_id || '',
              vote_average: movieData.vote_average || ''
            }

        }else{
            console.log('Movie does not exist')
        }

    } catch (error) {
        console.error('Failed to fetch Movie details:', error)
    }
}

const formatDate = (timestamp) => {
    if (!timestamp) return ''; 
  try {
    const date = timestamp.toDate(); 
    return date.toLocaleDateString([], { 
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  } catch (error) {
    console.error("Error formatting date:", error);
    return 'Invalid Date'; 
  }
};

//reviews en tiempo real
onMounted(() => {

  fetchMovieDetails() 

  const reviewsRef = collection($firestore, 'reviews');
  const q = query(reviewsRef, where('movieId', '==', movieId), orderBy('createdAt', 'desc'));

  const unsubscribe = onSnapshot(q, (querySnapshot) => {
    reviews.value = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  }, (error) => {
    console.error("Error al obtener las reviews:", error);
  });

    onUnmounted(unsubscribe) 
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