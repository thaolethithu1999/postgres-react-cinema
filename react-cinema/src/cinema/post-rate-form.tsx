import React, { useState } from 'react';
import ReactModal from 'react-modal';
import { storage } from 'uione';
import '../rate.css';

export interface Props {
  name: string;
  rate: number;
  postRate: (data: DataPostRate) => Promise<void>;
  isOpenRateModal: boolean;
  close(): void;
  load: any;
}

export interface DataPostRate {
  review: string;
  rate: number;
}

export const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
  }
};

ReactModal.setAppElement('#root');

export const PostRateForm = (props: Props) => {
  const [review, setReview] = useState('');
  const [resource] = useState(storage.resource().resource());
  const { name, rate, postRate, isOpenRateModal, close, load } = props;

  const closeModal = () => {
    close();
  };

  const handleChange = (event: any) => {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    setReview(value);
  };

  const renderRateStar = (value: any) => {
    let list5 = Array(5);
    list5 = list5.fill(<i />).map((_, index) => {
      return (<i key={index}></i>)
    });
    const listClass = [];
    for (let i = 1; i <= value; i++) {
      listClass.push(`star-${i}`);
    }
    const longClass = listClass.join(' ');
    const divStar = <div className={`rv-star3 ${longClass}`}>{list5}</div>;
    return divStar;
  };

  const postReview = async (event: any) => {
    event.preventDefault();
    const rate: DataPostRate = {
      rate: props.rate,
      review
    };
    await postRate(rate);
    load();
  };
  return (
    <ReactModal
      isOpen={isOpenRateModal}
      style={customStyles}
      onRequestClose={() => close()}
      contentLabel='Modal'
      portalClassName='modal-portal'
      className='modal-portal-content small-width'
      bodyOpenClassName='modal-portal-open'
      overlayClassName='modal-portal-backdrop'>

      <div className='view-container'>
        <form
          id='addNewRate'
          name='addNewRate'
          model-name='addNewRate'
        >
          <header>
            <button
              type='button'
              id='btnClose'
              name='btnClose'
              className='btn-close'
              onClick={() => closeModal()}
            />
            <h2>{name}</h2>
          </header>
          <div>
            <section className='user-title'>
              <span>
                <b>{resource.user_name}</b>
              </span>
            </section>
            <section className='user-star'>
              {renderRateStar(rate)}
            </section>
            <section className='user-input'>
              <textarea
                className='rateReview'
                id='review'
                name='review'
                onChange={handleChange}
                value={review}
                placeholder={resource.placeholder_text}
              />
            </section>
            <section className='user-input'>
              <div className='takePhoto'>
                <button className='addPhoto'>
                  <i className='camera' />
                  <i className='text-camera'>{resource.add_photo_btn}</i>
                </button>
              </div>
            </section>
          </div>
          <footer>
            <button
              type='submit'
              id='btnSave'
              name='btnSave'
              onClick={(event) => postReview(event)}
            >
              Post
            </button>
          </footer>
        </form>
      </div>
    </ReactModal>
  );
};
