import React, { Component } from 'react';
import './moviesList.css';
import PropTypes from 'prop-types';
import MoviesListItem from '../moviesListItem/moviesListItem';

export default class MoviesList extends Component {
  render() {
    const { filmData, handleRate, ratedMovie } = this.props;

    return (
      <ul className="list__film">
        {filmData?.map((movie) => {
          return (
            <MoviesListItem
              key={movie.id}
              filmName={movie.title}
              dateRelise={movie.release_date}
              filmPhoto={movie.poster_path}
              description={movie.overview}
              movieId={movie.id}
              handleRate={handleRate}
              ratedMovie={ratedMovie}
              genreIds={movie.genre_ids}
              voteAverage={movie.vote_average}
            />
          );
        })}
      </ul>
    );
  }
}
MoviesList.propTypes = {
  filmData: PropTypes.array.isRequired,
  handleRate: PropTypes.func.isRequired,
  ratedMovie: PropTypes.object.isRequired,
};
