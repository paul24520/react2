import React, { Component } from 'react';
import { Pagination, Input, Spin, Alert, Tabs } from 'antd';
import debounce from 'lodash.debounce';
import 'antd/dist/reset.css';
import MoviesList from './components/moviesList/moviesList';
import './App.css';
import './reset.css';
import MovieService from './components/movieservice/movieservise';
import GenresContext from './components/GenresContext/GenresContext';

export default class App extends Component {
  movieService = new MovieService();

  state = {
    searchQuery: '',
    filmData: [],
    isLoading: false,
    error: null,
    currentPage: 1,
    totalResults: 0,
    activeTab: 'search',
    guestSessionId: null,
    ratedMovie: {},
    filmDataRated: [],
    totalPageRated: null,
    currentPageRated: 1,
    genres: [],
  };

  handleSearch = debounce((query, page = 1) => {
    this.setState({ searchQuery: query, isLoading: true, currentPage: page, error: null });

    this.movieService
      .getFilm(query, page)
      .then((data) => {
        this.setState({
          filmData: data.results,
          totalResults: data.total_results,
          isLoading: false,
        });
      })
      .catch((err) => {
        this.setState({
          error: 'Ошибка при загрузке фильмов. Попробуйте позже.',
          isLoading: false,
        });
        console.error(err);
      });
  }, 500);

  handleRatedPageChange = (page) => {
    this.setState({ isLoading: true, currentPageRated: page });
    this.movieService
      .getRatedMovies(this.state.guestSessionId, page)
      .then((data) => {
        this.setState({
          filmDataRated: data.results,
          totalPageRated: data.total_results,
          isLoading: false,
        });
      })
      .catch((err) => {
        console.error(err);
        this.setState({
          error: 'Не удалось загрузить рейтингованные фильмы',
          isLoading: false,
        });
      });
  };

  componentDidMount() {
    this.movieService
      .createGuestSession()
      .then((id) => {
        localStorage.setItem('guestSessionId', id);
        this.setState({ guestSessionId: id });
      })
      .catch((err) => {
        this.setState({ error: 'Не удалось создать гостевую сессию' });
        console.error(err);
      });

    this.movieService
      .getGenres()
      .then((data) => {
        this.setState({ genres: data.genres });
      })
      .catch((err) => {
        this.setState({ error: 'Не удалось загрузить жанры' });
        console.error(err);
      });
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.state.activeTab === 'rated' && prevState.activeTab !== 'rated') {
      this.handleRatedPageChange(this.state.currentPageRated);
    }
  }

  handleRate = (movieId, value) => {
    const guestSessionId = localStorage.getItem('guestSessionId');

    this.movieService
      .rateMovie(movieId, value, guestSessionId)
      .then(() => {
        this.setState((prevState) => ({
          ratedMovie: {
            ...prevState.ratedMovie,
            [movieId]: value,
          },
        }));
      })
      .catch((err) => {
        console.error('Ошибка при выставлении рейтинга', err);
      });
  };

  render() {
    const {
      filmData,
      isLoading,
      error,
      currentPage,
      totalResults,
      searchQuery,
      ratedMovie,
      filmDataRated,
      totalPageRated,
      currentPageRated,
      genres,
    } = this.state;

    const searchTab = (
      <div className="basic">
        <Input
          placeholder="Search for a movie..."
          onChange={(e) => this.handleSearch(e.target.value)}
        />

        {error && <Alert message={error} type="error" showIcon style={{ margin: '20px 0' }} />}

        {isLoading ? (
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              height: '50vh',
            }}
          >
            <Spin size="large" style={{ transform: 'scale(2)' }} />
          </div>
        ) : (
          <>
            {filmData.length === 0 && searchQuery && !isLoading ? (
              <Alert
                message="По вашему запросу ничего не найдено"
                type="info"
                showIcon
                style={{ margin: '20px 0' }}
              />
            ) : (
              <MoviesList
                filmData={filmData}
                handleRate={this.handleRate}
                ratedMovie={ratedMovie}
              />
            )}
          </>
        )}

        {filmData.length > 0 && (
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
            <Pagination
              current={currentPage}
              total={totalResults}
              pageSize={20}
              onChange={(page) => this.handleSearch(searchQuery, page)}
            />
          </div>
        )}
      </div>
    );

    const ratedTab = (
      <div className="basic">
        <div className="basic">
          {error && <Alert message={error} type="error" showIcon style={{ margin: '20px 0' }} />}

          {isLoading ? (
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '50vh',
              }}
            >
              <Spin size="large" style={{ transform: 'scale(2)' }} />
            </div>
          ) : (
            Array.isArray(filmDataRated) &&
            filmDataRated.length > 0 && (
              <MoviesList
                filmData={filmDataRated}
                handleRate={this.handleRate}
                ratedMovie={ratedMovie}
              />
            )
          )}

          {filmDataRated?.length > 0 && (
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
              <Pagination
                current={currentPageRated}
                total={totalPageRated}
                pageSize={20}
                onChange={this.handleRatedPageChange}
              />
            </div>
          )}
        </div>
      </div>
    );

    return (
      <GenresContext.Provider value={genres || []}>
        <Tabs
          defaultActiveKey="1"
          centered
          onChange={(key) => {
            const tabMap = {
              1: 'search',
              2: 'rated',
            };
            this.setState({ activeTab: tabMap[key] });
          }}
        >
          <Tabs.TabPane tab="Search" key="1">
            {searchTab}
          </Tabs.TabPane>
          <Tabs.TabPane tab="Rated" key="2">
            {ratedTab}
          </Tabs.TabPane>
        </Tabs>
      </GenresContext.Provider>
    );
  }
}
