import { defineStore } from 'pinia'
import { collection, query, orderBy, limit, getDocs, where, startAt, endAt, doc, getDoc, Firestore } from 'firebase/firestore'
import { useNuxtApp } from '#app'

interface Movie {
  id: string
  title: string
  release_date: string
  [key: string]: any
}

interface MoviesState {
  movies: Movie[]
  searchResults: Movie[]
  latestMovies: Movie[]
  favoriteMovies: Movie[]
  loading: boolean
  error: string | null
}

export const useMoviesStore = defineStore('movies', {
  state: (): MoviesState => ({
    movies: [],
    searchResults: [],
    latestMovies: [],
    favoriteMovies: [],
    loading: false,
    error: null
  }),

  getters: {
    getMovieById: (state) => (id: string) => state.movies.find(movie => movie.id === id),
    getFavoriteMovies: (state) => state.favoriteMovies,
    getSearchResults: (state) => state.searchResults,
    getLatestMovies: (state) => state.latestMovies
  },

  actions: {
    async fetchMovies() {
      this.loading = true
      this.error = null
      try {
        const { $firestore } = useNuxtApp()
        const moviesRef = collection($firestore as Firestore, 'movies')
        const q = query(moviesRef, orderBy('release_date', 'desc'))
        const querySnapshot = await getDocs(q)
        
        this.movies = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Movie[]
      } catch (error: any) {
        this.error = error.message
        console.error('Error fetching movies:', error)
      } finally {
        this.loading = false
      }
    },

    async fetchLatestMovies() {
      this.loading = true
      this.error = null
      try {
        const { $firestore } = useNuxtApp()
        const moviesRef = collection($firestore as Firestore, 'movies')
        const q = query(moviesRef, orderBy('release_date', 'desc'), limit(4))
        const querySnapshot = await getDocs(q)
        
        this.latestMovies = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Movie[]
      } catch (error: any) {
        this.error = error.message
        console.error('Error fetching latest movies:', error)
      } finally {
        this.loading = false
      }
    },

    async searchMovies(searchQuery: string) {
      if (!searchQuery.trim()) {
        this.searchResults = []
        return
      }

      this.loading = true
      this.error = null
      try {
        const { $firestore } = useNuxtApp()
        const moviesRef = collection($firestore as Firestore, 'movies')
        const searchTerms = searchQuery.toLowerCase().split(/\s+/)
        
        const allMoviesQuery = query(moviesRef, limit(50))
        const querySnapshot = await getDocs(allMoviesQuery)
        
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
          .slice(0, 5) as Movie[]
        
        this.searchResults = filteredMovies
      } catch (error: any) {
        this.error = error.message
        console.error('Error searching movies:', error)
      } finally {
        this.loading = false
      }
    },

    async getMovieDetails(id: string) {
      this.loading = true
      this.error = null
      try {
        const { $firestore } = useNuxtApp()
        const movieRef = doc($firestore as Firestore, 'movies', id)
        const movieDoc = await getDoc(movieRef)
        
        if (movieDoc.exists()) {
          return {
            id: movieDoc.id,
            ...movieDoc.data()
          } as Movie
        }
        return null
      } catch (error: any) {
        this.error = error.message
        console.error('Error getting movie details:', error)
        return null
      } finally {
        this.loading = false
      }
    },

    toggleFavorite(movie: Movie) {
      const index = this.favoriteMovies.findIndex(m => m.id === movie.id)
      if (index === -1) {
        this.favoriteMovies.push(movie)
      } else {
        this.favoriteMovies.splice(index, 1)
      }
    },

    clearSearchResults() {
      this.searchResults = []
    },

    clearError() {
      this.error = null
    }
  }
})