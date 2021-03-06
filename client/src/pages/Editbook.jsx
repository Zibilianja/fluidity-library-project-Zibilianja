import React, { useState, useEffect, useRef } from 'react';
import { Link, useHistory, useParams } from 'react-router-dom';
import '../styles/editbook.scss';
import { getBook, editBook } from '../utils/API';
import { FaStar } from 'react-icons/fa';

const Editbook = () => {
  const [book, setBook] = useState({});
  const { title, image, published, synopsis, pages, rating, AuthorId, author } =
    book;
  const history = useHistory();
  const { id } = useParams();
  const [ratingStar, setRating] = useState(rating);
  const [hover, setHover] = useState(null);
  const [imageState, setImageState] = useState();
  const [preview, setPreview] = useState(image);
  const fileInput = useRef();

  useEffect(() => {
    if (imageState) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(imageState);
    } else {
      setPreview(null);
    }
  }, [imageState]);

  useEffect(() => {
    getBook(id)
      .then(({ data: book }) => {
        setPreview(book.image);
        setBook({
          ...book,
          author: book.Author.first_name + ' ' + book.Author.last_name,
        });
      })
      .catch((err) => console.log(err));
  }, [id]);

  const formSubmit = (e) => {
    e.preventDefault();
    const image = preview;
    if (!title || !author) {
      return alert('You must include both a title and author!');
    }

    editBook(id, {
      title,
      AuthorId,
      author,
      synopsis,
      pages,
      published,
      rating,
      image,
    })
      .then(() => {
        history.push('/bookshelf');
      })
      .catch((err) => console.log(err));
  };

  const inputChange = (e) => {
    const { name, value } = e.target;
    setBook({ ...book, [name]: value });
  };

  return (
    <div className="edit__page">
      <main className="edit__main">
        <h1 className="edit__title">Edit Book</h1>
        <form className="edit__form" onSubmit={formSubmit}>
          <div className="form__left">
            <div className="form__wrappers">
              <label htmlFor="title" className="form__labels">
                Title
                <input
                  id="title"
                  type="text"
                  className="form__input form__title"
                  value={title}
                  name="title"
                  onChange={inputChange}
                />
              </label>
            </div>
            <div className="form__wrappers author__wrapper">
              <label htmlFor="author" className="form__labels">
                Author
                <input
                  id="author"
                  type="text"
                  className="form__input form__author"
                  value={author}
                  name="author"
                  onChange={inputChange}
                />
              </label>
            </div>
            <div className="form__wrappers synopsis__wrapper">
              <label htmlFor="synopsis" className="form__labels">
                Synopsis
                <textarea
                  id="synopsis"
                  type="text"
                  className="form__input form__synopsis"
                  name="synopsis"
                  value={synopsis}
                  onChange={inputChange}
                ></textarea>
              </label>
            </div>
            <div className="input__smaller">
              <div className="form__wrappers wrappers__sidebyside published__wrapper">
                <label htmlFor="publish" className="form__labels">
                  Published
                  <input
                    id="publish"
                    type="date"
                    className="form__input form__published"
                    value={published}
                    name="published"
                    onChange={inputChange}
                  />
                </label>
              </div>

              <div className="form__wrappers wrappers__sidebyside pages__wrapper">
                <label className="form__labels">
                  Pages
                  <input
                    type="number"
                    className="form__input form__pages"
                    value={pages}
                    name="pages"
                    onChange={inputChange}
                  />
                </label>
              </div>
            </div>
            <div className="form__wrappers rating__wrapper">
              <label htmlFor="rating" className="label__rating">
                Rating
                <div className="form__rating">
                  {[...Array(5)].map((star, i) => {
                    let ratingValue = i + 1;
                    return (
                      <label>
                        <input
                          id="rating"
                          type="radio"
                          className="rating__radio"
                          value={ratingValue}
                          display="hidden"
                          onClick={() => setRating(ratingValue)}
                          name="rating"
                          onChange={inputChange}
                        />
                        <FaStar
                          className="fa fa-star star__rating"
                          color={
                            ratingValue <= (hover || rating) ? 'gold' : 'grey'
                          }
                          onMouseEnter={() => setHover(ratingValue)}
                          onMouseLeave={() => setHover('')}
                        />
                      </label>
                    );
                  })}
                </div>
              </label>
            </div>
          </div>
          <div className="form__right">
            <div className="image__frame">
              <img className="book__cover" src={preview} />
            </div>

            <input
              style={{ display: 'none' }}
              name="image"
              type="file"
              accept="image/*"
              ref={fileInput}
              onChange={(e) => {
                const file = e.target.files[0];
                if (file && file.type.substr(0, 5) === 'image') {
                  setImageState(file);
                } else {
                  setImageState(image);
                }
              }}
            />
            <button
              className="image__upload"
              onClick={(e) => {
                e.preventDefault();
                fileInput.current.click();
              }}
            >
              Add Image
            </button>
          </div>
          <div className="edit__btnwrap">
            <button type="submit" className="edit__button button--dark">
              Submit
            </button>
            <Link to="/bookshelf" className="cancel__button--nav">
              <button className="edit__button cancel__button" type="reset">
                Cancel
              </button>
            </Link>
          </div>
        </form>
      </main>
    </div>
  );
};
export default Editbook;
