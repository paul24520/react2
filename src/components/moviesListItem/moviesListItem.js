import React, { Component } from 'react';
import './moviesListItem.css';
import { format } from 'date-fns';
import { Rate } from 'antd';
import PropTypes from 'prop-types';
import GenresContext from '../GenresContext/GenresContext';

export default class MoviesListItem extends Component {
  static contextType = GenresContext;

  truncateText(text, maxLength = 200) {
    if (!text) return '';
    if (text.length <= maxLength) return text;

    const trimmedText = text.slice(0, maxLength);
    return trimmedText.slice(0, trimmedText.lastIndexOf(' ')) + '...';
  }

  renderGenres() {
    const { genreIds = [] } = this.props;
    const allGenres = this.context || [];

    const matchedGenres = genreIds
      .map((id) => allGenres?.find((genre) => genre.id === id))
      .filter(Boolean);

    return matchedGenres?.map((genre) => (
      <span key={genre.id} className="category__name">
        {genre.name}
      </span>
    ));
  }

  getRatingColor(rating) {
    if (rating <= 3) return '#E90000';
    if (rating <= 5) return '#E97E00';
    if (rating <= 7) return '#E9D100';
    return '#66E900';
  }

  render() {
    const {
      description,
      filmName,
      dateRelise,
      filmPhoto,
      handleRate,
      movieId,
      ratedMovie,
      voteAverage,
    } = this.props;

    const ratingColor = this.getRatingColor(voteAverage);
    const foto = filmPhoto ? `https://image.tmdb.org/t/p/w500${filmPhoto}` : '/Rectangle36.png';
    return (
      <li className="itemWrap">
        <div className="itemWrap--desktop">
          <div className="fotka">
            <img src={foto} alt={filmName} />
          </div>
          <div className="itemDescription">
            <div className="rating-badge" style={{ borderColor: ratingColor }}>
              {voteAverage?.toFixed(1)}
            </div>
            <h3 className="film__name">{filmName}</h3>
            <div className="dateRelise">
              {dateRelise ? format(new Date(dateRelise), 'MMMM d, yyyy') : 'No date'}
            </div>
            <div className="category">{this.renderGenres()}</div>
            <div className="film__description">{this.truncateText(description)}</div>
            <div className="rate">
              <Rate
                allowHalf
                count={10}
                value={ratedMovie[movieId] || 0}
                onChange={(value) => handleRate(movieId, value)}
              />
            </div>
          </div>
        </div>
        <div className="film__description--mobile">{this.truncateText(description)}</div>
        <div className="rate--mobile">
          <Rate
            allowHalf
            count={10}
            value={ratedMovie[movieId] || 0}
            onChange={(value) => handleRate(movieId, value)}
          />
        </div>
      </li>
    );
  }
}
MoviesListItem.propTypes = {
  genreIds: PropTypes.array.isRequired,
  description: PropTypes.string,
  filmName: PropTypes.string,
  dateRelise: PropTypes.string,
  filmPhoto: PropTypes.string,
  handleRate: PropTypes.func,
  movieId: PropTypes.number,
  ratedMovie: PropTypes.object,
  voteAverage: PropTypes.number,
};
