export default class MovieService {
  options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization:
        'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI3ODJmOWZjOTQ0MmQ5OWYwNGNjZGYxYjRhOTlmZGIxMCIsIm5iZiI6MTc0MjQwNTYwNC43MjIsInN1YiI6IjY3ZGFmZmU0ZjA4ZThkYmJkMDk2N2RhZSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.8nLM03r-a8z4fE458ap_V-ux1qYJsEgrKkKEm7bWGKg',
    },
  };

  async getFilm(query, page = 1) {
    const encodedQuery = encodeURIComponent(query);
    const response = await fetch(
      `https://api.themoviedb.org/3/search/movie?query=${encodedQuery}&include_adult=false&language=en-US&page=${page}`,
      this.options,
    );
    const dataRes = await response.json();
    return dataRes;
  }

  async createGuestSession() {
    const response = await fetch(
      'https://api.themoviedb.org/3/authentication/guest_session/new',
      this.options,
    );
    const data = await response.json();
    return data.guest_session_id;
  }

  async getRatedMovies(guestSessionId, page = 1) {
    const response = await fetch(
      `https://api.themoviedb.org/3/guest_session/${guestSessionId}/rated/movies?page=${page}&language=en-US&sort_by=created_at.asc`,
      this.options,
    );
    return await response.json();
  }

  async rateMovie(movieId, value, sessionId) {
    const response = await fetch(
      `https://api.themoviedb.org/3/movie/${movieId}/rating?guest_session_id=${sessionId}`,
      {
        method: 'POST',
        headers: {
          accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization:
            'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI3ODJmOWZjOTQ0MmQ5OWYwNGNjZGYxYjRhOTlmZGIxMCIsIm5iZiI6MTc0MjQwNTYwNC43MjIsInN1YiI6IjY3ZGFmZmU0ZjA4ZThkYmJkMDk2N2RhZSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.8nLM03r-a8z4fE458ap_V-ux1qYJsEgrKkKEm7bWGKg',
        },
        body: JSON.stringify({ value }),
      },
    );
    if (!response.ok) {
      throw new Error('Не удалось поставить рейтинг');
    }
    return response.json();
  }

  async getGenres() {
    const response = await fetch(
      `https://api.themoviedb.org/3/genre/movie/list?language=en`,
      this.options,
    );
    const data = await response.json();
    return data;
  }
}
