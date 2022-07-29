import { useEffect, useRef, useState } from 'react';
import { buildId } from 'react-hook-core';
import { Link, useParams } from 'react-router-dom';
import { Carousel, CarouselImageItem, CarouselVideoItem } from 'reactx-carousel';
import { getFileExtension, removeFileExtension } from 'reactx-upload';
import { useResource } from 'uione';
import imageOnline from '../assets/images/online.svg';
import { Appreciations } from './appreciations';
import { getMyProfileService, User } from './service/user';

export function UserPage() {
  const params = useParams();
  const [user, setUser] = useState<User>({} as User);
  const [uploadedCover, setUploadedCover] = useState<string>();
  const [uploadedAvatar, setUploadedAvatar] = useState<string>();
  const refId = useRef<string>();
  const refForm = useRef();
  useEffect(() => {
    refId.current = buildId<string>(params) || '';
    getMyProfileService().getMyProfile(refId.current).then(usr => {
      if (usr) {
        setUser(usr);
        setUploadedAvatar(usr.imageURL);
        setUploadedCover(usr.coverURL);
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const resource = useResource();
  const getImageBySize = (url: string | undefined, size: number): string => {
    if (!url) { return ''; }
    return removeFileExtension(url) + `_${size}.` + getFileExtension(url);
  };
  const followers = '7 followers';
  const following = '10 following';
  return (
    <div className='profile view-container'>
      <form id='userForm' name='userForm' ref={refForm as any}>
        <header className='border-bottom-highlight'>
          <div className='cover-image'>
            <img src={uploadedCover ? uploadedCover : 'https://pre00.deviantart.net/6ecb/th/pre/f/2013/086/3/d/facebook_cover_1_by_alphacid-d5zfrww.jpg'} alt='cover' />
            <div className='contact-group'>
              <button id='btnPhone' name='btnPhone' className='btn-phone' />
              <button id='btnEmail' name='btnEmail' className='btn-email' />
            </div>
            <button id='btnFollow' name='btnFollow' className='btn-follow'>Follow</button>
          </div>
          <button id='btnCamera' name='btnCamera' className='btn-camera' />
          <div className='avatar-wrapper'>
            <img className='avatar'
              src={getImageBySize(uploadedAvatar, 400) || 'https://www.bluebridgewindowcleaning.co.uk/wp-content/uploads/2016/04/default-avatar.png'} alt='avatar' />
            <img className='profile-status' src={imageOnline} alt='status' />
          </div>
          <div className='profile-title'>
            <h3>{user.displayName}</h3>
            <p>{user.website}</p>
          </div>
          <div className='profile-followers'>
            <p><i className='material-icons highlight'>group</i> {followers}</p>
            <p><i className='material-icons highlight'>group_add</i> {following}</p>
          </div>
          <nav className='menu'>
            <ul>
              <li><Link to={`/profile/${refId.current}`}  > Overview </Link></li>
              <li><Link to={`/profile/${refId.current}/appreciation`}  > Appreciation </Link></li>
            </ul>
          </nav>
        </header>
        <Appreciations />
        {!window.location.pathname.includes('appreciation') &&
          <div className='row'>
            <div className='col m12 l4'>
              {(user.occupation || user.company) && <div className='card'>
                <header>
                  <i className='material-icons highlight'>account_box</i>
                  {resource.user_profile_basic_info}
                </header>
                {user.occupation && <p>{user.occupation}</p>}
                {user.company && <p>{user.company}</p>}
              </div>
              }
              {user.skills && user.skills.length > 0 && <div className='card'>
                <header>
                  <i className='material-icons highlight'>local_mall</i>
                  {resource.skills}
                </header>
                <section>
                  {
                    user.skills.map((item, index) => {
                      return <p key={index}>{item.skill}<i hidden={!item.hirable} className='star highlight' /></p>;
                    })
                  }
                  <hr />
                  <p className='description'>
                    <i className='star highlight' />
                    {resource.user_profile_hireable_skill}
                  </p>
                </section>
              </div>}
              {user.lookingFor && user.lookingFor.length > 0 && <div className='card'>
                <header>
                  <i className='material-icons highlight'>find_in_page</i>
                  {resource.user_profile_looking_for}
                </header>
                <section>
                  {
                    user.lookingFor.map((item, index) => {
                      return (<p key={index}>{item}</p>);
                    })
                  }
                </section>
              </div>
              }
              <div className='card'>
                <header>
                  <i className='material-icons highlight'>chat</i>
                  {resource.user_profile_social}
                </header>
                <div>
                  {user.links && Object.keys(user.links).map((key: string, index) => {
                    return (
                      <a key={index} href={`https://${key}/` + (user.links as any)[key]} title={key} target='_blank' rel='noreferrer'>
                        <i className={`fab fa-${key}`} />
                        <span>{key}</span>
                      </a>
                    )
                  })}
                  {
                    user.customLink01 &&
                    <a href={user.customLink01} target='_blank' rel='noreferrer'>
                      <i className='fab fa-globe-asia' />
                    </a>
                  }
                  {
                    user.customLink02 &&
                    <a href={user.customLink02} target='_blank' rel='noreferrer'>
                      <i className='fab fa-globe-asia' />
                    </a>
                  }
                  {
                    user.customLink03 && <a href={user.customLink03} target='_blank' rel='noreferrer'>
                      <i className='fab fa-globe-asia' />
                    </a>
                  }
                  {
                    user.customLink04 && <a href={user.customLink04} target='_blank' rel='noreferrer'>
                      <i className='fab fa-globe-asia' />
                    </a>
                  }
                  {
                    user.customLink05 && <a href={user.customLink05} target='_blank' rel='noreferrer'>
                      <i className='fab fa-globe-asia' />
                    </a>
                  }
                  {
                    user.customLink06 && <a href={user.customLink06} target='_blank' rel='noreferrer'>
                      <i className='fab fa-globe-asia' />
                    </a>
                  }
                  {
                    user.customLink07 && <a href={user.customLink07} target='_blank' rel='noreferrer'>
                      <i className='fab fa-globe-asia' />
                    </a>
                  }
                  {
                    user.customLink08 && <a href={user.customLink08} target='_blank' rel='noreferrer'>
                      <i className='fab fa-globe-asia' />
                    </a>
                  }
                </div>
              </div>
            </div>
            <div className='col m12 l8'>
              {user.bio && user.bio.length > 0 && <div className='card border-bottom-highlight'>
                <header>
                  <i className='material-icons highlight'>person</i>
                  {resource.user_profile_bio}
                </header>
                <p>{user.bio}</p>
              </div>
              }
              {user.interests && user.interests.length > 0 && <div className='card border-bottom-highlight'>
                <header>
                  <i className='material-icons highlight'>flash_on</i>
                  {resource.interests}
                </header>
                <section className='row'>
                  {
                    user.interests.map((item, index) => {
                      return (<span key={index} className='col s4'>{item}</span>);
                    })
                  }
                </section>
              </div>}

              {user.achievements && user.achievements.length > 0 && <div className='card border-bottom-highlight'>
                <header>
                  <i className='material-icons highlight'>beenhere</i>
                  {resource.achievements}
                </header>
                {
                  user.achievements && user.achievements.map((achievement, index) => {
                    return <section key={index}>
                      <h3>{achievement.subject}
                        {achievement.highlight && <i className='star highlight float-right' />}
                      </h3>
                      <p className='description'>{achievement.description}</p>
                      <hr />
                    </section>;
                  })
                }
              </div>
              }
              <div className='card border-bottom-highlight'>
                <header>
                  <i className='material-icons highlight btn-camera'></i>
                  {resource.title_modal_gallery}
                
                </header>
                <section className='row'>
                  <div className='user-carousel-container'>
                    <Carousel infiniteLoop={true}>
                      {user.gallery
                        ? user.gallery.map((itemData, index) => {
                          switch (itemData.type) {
                            case 'video':
                              return (
                                <CarouselVideoItem
                                  key={index}
                                  type={itemData.type}
                                  src={itemData.url}
                                />
                              );
                            case 'image':
                              return (
                                // <img className='image-carousel' src={itemData.url} key={index} alt={itemData.url} draggable={false}/>
                                <CarouselImageItem
                                  key={index}
                                  src={itemData.url}
                                />
                              );
                            case 'youtube':
                              return (
                                <div className='data-item-youtube'>
                                  <iframe
                                    src={itemData.url + '?enablejsapi=1'}
                                    frameBorder='0'
                                    className='iframe-youtube'
                                    title='youtube video'
                                  ></iframe>
                                  ;
                                </div>
                              );
                            default:
                              return <></>;
                          }
                        })
                        : [<></>]}
                    </Carousel>
                  </div>
                </section>
              </div>
            </div>
          </div>}
      </form>
    </div>
  );
}

