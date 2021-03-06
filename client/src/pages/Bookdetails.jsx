import React, { useState, useEffect } from 'react';
import { Link, useParams, useHistory } from 'react-router-dom';
import '../styles/details.scss';
import { FaStar } from 'react-icons/fa';
import { getBook, deleteBook } from '../utils/API.js';

const Bookdetails = () => {
  const [
    { title, author, image, published, synopsis, pages, rating },
    setBook,
  ] = useState({});
  const { id } = useParams();
  const history = useHistory();

  useEffect(() => {
    getBook(id)
      .then(({ data: book }) => {
        setBook({
          ...book,
          author: book.Author.first_name + ' ' + book.Author.last_name,
        });
      })
      .catch((err) => console.log(err));
  }, [id]);

  const bookDelete = (e) => {
    deleteBook(id)
      .then(() => history.push('/bookshelf'))
      .catch((err) => console.log(err));
  };

  return (
    <div className="page__details">
      <main className="main__detail">
        <section className="main__detailcard">
          <div className="main__coverwrap">
            <h2 className="book__title--mobile">{title}</h2>
            <img src={image} className="book__cover" />
            <h3 className="author__mobile">{author}</h3>
            <div className="book__stars">
              <h4 className="book__rating">Rating</h4>
              <div className="star__wrapper">
                <div className="form__rating">
                  {[...Array(5)].map((star, i) => {
                    let ratingValue = i + 1;
                    return (
                      <label>
                        <input
                          type="radio"
                          className="rating__radio"
                          value={ratingValue}
                          display="hidden"
                        />
                        <FaStar
                          className="fa fa-star star__rating"
                          color={ratingValue <= rating ? 'gold' : 'grey'}
                        />
                      </label>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
          <section className="book__details">
            <h2 className="book__title">{title}</h2>
            <h3 className="book__author">{author}</h3>
            <p className="details">
              <i>Published: {published}</i>
            </p>
            <p className="details">
              <i>{pages} pages</i>
            </p>
            <p className="book__description">{synopsis}</p>
          </section>
          <div className="main__btnwrap">
            <Link to={'/editbook/' + id} className="edit__link">
              <button className="main__button button--dark" type="button">
                Edit This Book
              </button>
            </Link>
            <Link to="/bookshelf" className="shelf__link">
              <button className="main__button" type="button">Back to Shelf</button>
            </Link>
            <Link to="/bookshelf" className="delete__link">
              <button
                className="delete__button"
                type="button"
                onClick={bookDelete}
              >
                Delete Book
              </button>
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
};
export default Bookdetails;
