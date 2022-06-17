import Axios from 'axios';
import { HttpRequest } from 'axios-core';
import React, { useEffect, useState } from 'react';
import { clone, OnClick, useUpdate } from 'react-hook-core';
import ReactModal from 'react-modal';
import { Carousel, CarouselImageItem, CarouselVideoItem } from 'reactx-carousel';
import { FileInfo, getFileExtension, removeFileExtension, TypeFile } from 'reactx-upload';
import { SuggestionService } from 'suggestion-service';
import { alert, handleError, message, storage, useResource } from 'uione';
import { options } from 'uione';
import imageOnline from '../assets/images/online.svg';
import { config } from '../config';
import { UploadContainer } from '../core/upload';
import GeneralInfo from './general-info';
import { ModalSelectCover } from './modal-select-cover';
import { ModalUploadGallery } from './modal-upload-gallery';
import {
  Achievement,
  Skill,
  useInterestService,
  useMyProfileService,
  User,
} from './my-profile';
import { useLookingForService, useSkillService } from './my-profile';

const httpRequest = new HttpRequest(Axios, options);
interface Edit {
  edit: {
    lookingFor: string;
    interest: string;
    highlight: boolean;
    description: string;
    subject: string;
    skill: string;
    hirable: boolean;
  };
}
const data: Edit = {
  edit: {
    lookingFor: '',
    interest: '',
    highlight: false,
    description: '',
    subject: '',
    skill: '',
    hirable: false,
  },
};

export const MyProfileForm = () => {
  const service = useMyProfileService();
  const skillService = useSkillService();
  const interestService = useInterestService();
  const lookingForService = useLookingForService();
  const { state, setState, updateState } = useUpdate<Edit>(data, 'edit');

  const resource = useResource();
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [isEditingBio, setIsEditingBio] = useState<boolean>(false);
  const [isEditingInterest, setIsEditingInterest] = useState<boolean>(false);
  const [isEditingLookingFor, setIsEditingLookingFor] =
    useState<boolean>(false);
  const [isEditingSkill, setIsEditingSkill] = useState<boolean>(false);
  const [isEditingAchievement, setIsEditingAchievement] =
    useState<boolean>(false);
  const [bio, setBio] = useState<string>('');
  const [user, setUser] = useState<User>({} as any);
  const [modalIsOpen, setModalIsOpen] = useState<boolean>(false);
  const [modalConfirmIsOpen, setModalConfirmIsOpen] = useState<boolean>(false);
  const [modalUpload, setModalUpload] = useState(false);
  const [typeUpload, setTypeUpload] = useState<TypeFile>('cover');
  const [aspect, setAspect] = useState<number>(1);
  const [modalUploadGalleryOpen, setModalUploadGalleryOpen] = useState(false);
  const [modalSelectGalleryOpen, setModalSelectGalleryOpen] = useState(false);
  const [uploadedCover, setUploadedCover] = useState<string>();
  const [uploadedAvatar, setUploadedAvatar] = useState<string>();
  const [skillSuggestionService, setSkillSuggestionService] =
    useState<SuggestionService<string>>();
  const [interestSuggestionService, setInterestSuggestionService] =
    useState<SuggestionService<string>>();
  const [lookingForSuggestionService, setLookingForSuggestionService] =
    useState<SuggestionService<string>>();
  const [dropdownCover, setDropdownCover] = useState<boolean>(false);
  const [sizes, setSizes] = useState<number[]>([]);
  const [listSkill, setListSkill] = useState<string[]>([]);
  const [listInterest, setListInterest] = useState<string[]>([]);
  const [listLookingFor, setListLookingFor] = useState<string[]>([]);
  useState<FileInfo[]>();
  const handleChangeFile = (fi: string | undefined) => {
    if (typeUpload === 'cover') {
      setUploadedCover(fi);
    } else {
      setUploadedAvatar(fi);
    }
  };

  useEffect(() => {
    const skillSuggestion = new SuggestionService<string>(
      skillService.query,
      20
    );
    setSkillSuggestionService(skillSuggestion);

    const interestSuggestion = new SuggestionService<string>(
      interestService.query,
      20
    );
    setInterestSuggestionService(interestSuggestion);

    const lookingForSuggestion = new SuggestionService<string>(
      lookingForService.query,
      20
    );
    setLookingForSuggestionService(lookingForSuggestion);

    const userId = storage.getUserId();
    if (userId && userId.length > 0) {
      service.getMyProfile(userId).then((profile) => {
        if (profile) {
          setUser(profile);
          setBio(profile.bio || '');
          setUploadedCover(profile.coverURL);
          setUploadedAvatar(profile.imageURL);
        }
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const [previousSkill, setPreviousSkill] = useState({
    keyword: '',
    list: [] as string[],
  });
  const [previousInterest, setPreviousInterest] = useState({
    keyword: '',
    list: [] as string[],
  });

  const [previousLookingFor, setPreviousLookingFor] = useState({
    keyword: '',
    list: [] as string[],
  });
  const onChangeSkill = (e: React.FormEvent<HTMLInputElement>) => {
    updateState(e);
    const newSkill = e.currentTarget.value;
    if (newSkill) {
      if (skillSuggestionService) {
        skillSuggestionService
          .load(newSkill, previousSkill)
          .then((res) => {
            if (res !== null) {
              setPreviousSkill(res.last);
              setListSkill(res.list);
            }
          })
          .catch(handleError);
      }
    }
  };
  const onChangeInterest = (e: React.FormEvent<HTMLInputElement>) => {
    updateState(e);
    const newInterest = e.currentTarget.value;

    if (newInterest) {
      if (interestSuggestionService) {
        interestSuggestionService
          .load(newInterest, previousInterest)
          .then((res) => {
            if (res !== null) {
              setPreviousInterest(res.last);
              setListInterest(res.list);
            }
          })
          .catch(handleError);
      }
    }
  };

  const onChangeLookingFor = (e: React.FormEvent<HTMLInputElement>) => {
    updateState(e);
    const newLooking = e.currentTarget.value;

    if (newLooking) {
      if (lookingForSuggestionService) {
        lookingForSuggestionService
          .load(newLooking, previousLookingFor)
          .then((res) => {
            if (res !== null) {
              setPreviousLookingFor(res.last);
              setListLookingFor(res.list);
            }
          })
          .catch(handleError);
      }
    }
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };


  const showPopup = (e: OnClick) => {
    e.preventDefault();
    setModalIsOpen(true);
  };

  const close = () => {
    if (isEditingBio) {
      setIsEditingBio(!isEditingBio);
    }
    if (isEditingInterest) {
      setIsEditingInterest(!isEditingInterest);
    }
    if (isEditingLookingFor) {
      setIsEditingLookingFor(!isEditingLookingFor);
    }
    if (isEditingSkill) {
      setState({ edit: { ...state.edit, skill: '' } });
      setIsEditingSkill(!isEditingSkill);
    }
    if (isEditingAchievement) {
      setState({
        edit: { ...state.edit, subject: '', highlight: false, description: '' },
      });
      setIsEditingAchievement(!isEditingAchievement);
    }
    setIsEditing(!isEditing);
  };

  const addSkill = (e: OnClick) => {
    e.preventDefault();
    const { skill, hirable } = state.edit;
    const skillsEditing = user.skills ? user.skills : [];
    if (skill && skill.trim() !== '') {
      const item = { hirable, skill };
      if (
        skillsEditing.filter((skillEdit) => skillEdit.skill === skill)
          .length === 0
      ) {
        skillsEditing.push(item);
        user.skills = skillsEditing;
        setState({ edit: { ...state.edit, skill: '' } });
        setUser({ ...user });
      } else {
        alert(resource.error_duplicated_skill, resource.error);
      }
    }
  };

  const saveChanges = (event: OnClick) => {
    event.preventDefault();
    if (isEditing) {
      service
        .saveMyProfile(user)
        .then((successs) => {
          if (successs) {
            message(resource.success_save_my_profile);
            close();
          } else {
            alert(resource.fail_save_my_profile, resource.error);
          }
        });
    }
  };

  const saveEmit = (rs: any) => {
    if (rs.status === 'success' && rs.user) {
      setUser(rs.user);
      message(resource.success_save_my_profile);
    } else {
      alert(resource.fail_save_my_profile, resource.error);
    }
  };

  const toggleBio = (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
    e.preventDefault();
    if (user.bio !== bio && isEditingBio) {
      setModalConfirmIsOpen(true);
    } else {
      setIsEditingBio(!isEditingBio);
      setIsEditing(!isEditing);
    }
  };

  const revertBioChages = () => {
    setUser({ ...user, bio });
    setIsEditingBio(!isEditingBio);
    setIsEditing(!isEditing);
    setModalConfirmIsOpen(false);
  };
  const editBio = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    e.preventDefault();
    const bioText = e.target.value;
    setUser({ ...user, bio: bioText });
  };
  const toggleLookingFor = (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
    e.preventDefault();
    setIsEditingLookingFor(!isEditingLookingFor);
    setIsEditing(!isEditing);
  };
  const removeLookingFor = (
    e: React.MouseEvent<HTMLElement, MouseEvent>,
    lookingForContent: string
  ) => {
    e.preventDefault();
    user.lookingFor = user.lookingFor.filter(
      (item) => item !== lookingForContent
    );
    setUser({ ...user });
  };
  const addLookingFor = (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
    e.preventDefault();
    const lookingForUser = user.lookingFor ? user.lookingFor : [];
    if (state.edit.lookingFor && state.edit.lookingFor.trim() !== '') {
      if (!inArray(lookingForUser, state.edit.lookingFor)) {
        lookingForUser.push(state.edit.lookingFor);
        user.lookingFor = lookingForUser;
        setState({ edit: { ...state.edit, lookingFor: '' } });
        setUser({ ...user });
      } else {
        alert(resource.error_duplicated_looking_for, resource.error);
      }
    }
  };
  const toggleInterest = (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
    e.preventDefault();
    setIsEditingInterest(!isEditingInterest);
    setIsEditing(!isEditing);
  };
  const removeInterest = (
    e: React.MouseEvent<HTMLElement, MouseEvent>,
    subject: string
  ) => {
    e.preventDefault();
    if (user.interests) {
      const interests = user.interests.filter(
        (item: string) => item !== subject
      );
      user.interests = interests;
      setUser({ ...user });
    }
  };
  const addInterest = (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
    e.preventDefault();
    const interests = user.interests ? user.interests : [];
    if (state.edit.interest && state.edit.interest.trim() !== '') {
      if (!inArray(interests, state.edit.interest)) {
        interests.push(state.edit.interest);
        user.interests = interests;
        setUser({ ...user });
        setState({ edit: { ...state.edit, interest: '' } });
      } else {
        alert(resource.error_duplicated_interest, resource.error);
      }
    }
  };
  const toggleSkill = (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
    e.preventDefault();
    setIsEditingSkill(!isEditingSkill);
    setIsEditing(!isEditing);
  };
  const removeSkill = (
    e: React.MouseEvent<HTMLElement, MouseEvent>,
    skillContent: string
  ) => {
    e.preventDefault();
    user.skills = user.skills.filter((item) => item['skill'] !== skillContent);
    setUser({ ...user });
    setState({ edit: { ...state.edit, interest: '' } });
  };
  const toggleAchievement = (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
    e.preventDefault();
    setIsEditing(!isEditing);
    setIsEditingAchievement(!isEditingAchievement);
  };
  const removeAchievement = (
    e: React.MouseEvent<HTMLElement, MouseEvent>,
    subject: string
  ) => {
    if (user.achievements) {
      const achievements = user.achievements.filter(
        (item: Achievement) => item['subject'] !== subject
      );
      user.achievements = achievements;
      setUser({ ...user });
    }
  };
  const addAchievement = (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
    e.preventDefault();
    const achievement: Achievement = {
      subject: state.edit.subject,
      description: state.edit.description,
      highlight: state.edit.highlight,
    };
    const achievements = user.achievements ? clone(user.achievements) : [];
    achievement.subject = state.edit.subject;
    achievement.description = state.edit.description;
    achievement.highlight = state.edit.highlight;
    if (
      state.edit.subject &&
      state.edit.subject.trim().length > 0 &&
      !inAchievements(achievements, achievement)
    ) {
      achievements.push(achievement);
      user.achievements = achievements;
      setUser({ ...user });
      setState({ edit: { ...state.edit, description: '', subject: '' } });
    }
  };

  const closeModalConfirm = () => {
    setModalConfirmIsOpen(false);
  };

  const openModalUpload = (e: OnClick, type: TypeFile) => {
    e.preventDefault();
    setModalUpload(true);
    setTypeUpload(type);
    if (type === 'cover') {
      setAspect(2.7);
      setSizes([576, 768]);
    } else { setAspect(1); }
    setSizes([40, 400]);
  };

  const closeModalUpload = (e: OnClick) => {
    e.preventDefault();
    setModalUpload(false);
  };
  const openModalUploadGallery = (e: OnClick) => {
    e.preventDefault();
    setModalUploadGalleryOpen(true);
  };

  const closeModalUploadGallery = (e: OnClick) => {
    e.preventDefault();
    setModalUploadGalleryOpen(false);
  };

  const toggleDropdownCover = (e: OnClick) => {
    e.preventDefault();
    setDropdownCover(!dropdownCover);
  };

  const saveImageCover = (e: OnClick, url: string) => {
    e.preventDefault();
    setUser({ ...user, coverURL: url });
    setUploadedCover(url);
    service
      .saveMyProfile({ ...user, coverURL: url, userId: user.userId })
      .then((successs) => {
        if (successs) {
          message(resource.success_save_my_profile);
          close();
        } else {
          alert(resource.fail_save_my_profile, resource.error);
        }
      });
  };

  const toggleSelectGallery = (e: OnClick) => {
    e.preventDefault();
    setModalSelectGalleryOpen(!modalSelectGalleryOpen);
  };

  const getImageBySize = (url: string | undefined, size: number): string => {
    if (!url) { return ''; }
    return removeFileExtension(url) + `_${size}.` + getFileExtension(url);
  };

  const followers = '7 followers'; // StringUtil.format(ResourceManager.getString('user_profile_followers'), user.followerCount || 0);
  const following = '10 following'; // StringUtil.format(ResourceManager.getString('user_profile_following'), user.followingCount || 0);
  return (
    <div className='profile view-container'>
      <form id='userForm' name='userForm'>
        <header className='border-bottom-highlight'>
          <div className='cover-image'>
            <img
              src={
                uploadedCover
                  ? uploadedCover
                  : 'https://pre00.deviantart.net/6ecb/th/pre/f/2013/086/3/d/facebook_cover_1_by_alphacid-d5zfrww.jpg'
              }
              alt='cover'
              style={{ objectFit: 'cover' }}
            />
            <div className='contact-group'>
              <button id='btnPhone' name='btnPhone' className='btn-phone' />
              <button id='btnEmail' name='btnEmail' className='btn-email' />
            </div>
            <button id='btnFollow' name='btnFollow' className='btn-follow'>
              Follow
            </button>
          </div>
          <button
            id='btnCamera'
            name='btnCamera'
            className='btn-camera'
            onClick={toggleDropdownCover}
          />

          <ul
            id='dropdown-basic'
            className={`dropdown-content-profile dropdown-upload-cover ${dropdownCover ? 'show-upload-cover' : ''
              }`}
          >
            <li className='menu' onClick={(e) => openModalUpload(e, 'cover')}>
              Upload
            </li>
            <hr style={{ margin: 0 }} />
            <li className='menu' onClick={toggleSelectGallery}>
              Choose from gallery
            </li>
          </ul>

          <div className='avatar-wrapper'>
            <img
              className='avatar'
              src={
                getImageBySize(uploadedAvatar, 400) ||
                'https://www.bluebridgewindowcleaning.co.uk/wp-content/uploads/2016/04/default-avatar.png'
              }
              alt='avatar'
            />
            <button
              id='btnCamera'
              name='btnCamera'
              className='btn-camera'
              onClick={(e) => openModalUpload(e, 'upload')}
            />

            <img className='profile-status' src={imageOnline} alt='status' />
          </div>
          <div className='profile-title'>
            <h3>{user.displayName}</h3>
            <p>{user.website}</p>
          </div>
          <div className='profile-followers'>
            <p>
              <i className='material-icons highlight'>group</i> {followers}
            </p>
            <p>
              <i className='material-icons highlight'>group_add</i> {following}
            </p>
          </div>
        </header>
        <div className='row'>
          <div className='col m12 l4'>
            <div className='card'>
              <header>
                <i className='material-icons highlight'>account_box</i>
                {resource.user_profile_basic_info}
                <button
                  type='button'
                  id='btnBasicInfo'
                  name='btnBasicInfo'
                  hidden={isEditing}
                  className='btn-edit'
                  onClick={showPopup}
                />
              </header>
              <p>{user.occupation}</p>
              <p>{user.company}</p>
            </div>
            {!isEditingSkill && (
              <div className='card'>
                <header>
                  <i className='material-icons highlight'>local_mall</i>
                  {resource.skills}
                  <button
                    type='button'
                    id='btnSkill'
                    name='btnSkill'
                    hidden={isEditing}
                    className='btn-edit'
                    onClick={toggleSkill}
                  />
                </header>
                <section>
                  {user.skills &&
                    user.skills.map((item: Skill, index: number) => {
                      return (
                        <p key={index}>
                          {item.skill}
                          <i
                            hidden={!item.hirable}
                            className='star highlight'
                          />
                        </p>
                      );
                    })}
                  <hr />
                  <p className='description'>
                    <i className='star highlight' />
                    {resource.user_profile_hirable_skill}
                  </p>
                </section>
              </div>
            )}
            {isEditingSkill && (
              <div className='card'>
                <header>
                  <i className='material-icons highlight'>local_mall</i>
                  {resource.skills}
                  <button
                    type='button'
                    id='btnSkill'
                    name='btnSkill'
                    className='btn-close'
                    onClick={toggleSkill}
                  />
                </header>
                <section>
                  {user.skills &&
                    user.skills.map((item: Skill, index: number) => {
                      return (
                        <div key={index} className='chip'>
                          {item.skill}
                          {item.hirable === true && (
                            <i className='star highlight' />
                          )}
                          <button
                            type='button'
                            name='btnRemoveSkill'
                            className='close'
                            onClick={(e) => removeSkill(e, item.skill)}
                          />
                        </div>
                      );
                    })}

                  <section>
                    <div className='form-group'>
                      <input
                        list='listSkill'
                        type='text'
                        name='skill'
                        className='form-control'
                        value={state.edit.skill}
                        onChange={onChangeSkill}
                        placeholder={resource.placeholder_user_profile_skill}
                        maxLength={50}
                        required={true}
                        autoComplete='on'
                      />
                    </div>
                    {listSkill && listSkill.length > 0 && (
                      <datalist id='listSkill'>
                        {listSkill.map((item, index) => {
                          return <option key={index} value={item} />;
                        })}
                      </datalist>
                    )}
                    <div className='btn-group'>
                      <button
                        type='button'
                        id='btnAddSkill'
                        name='btnAddSkill'
                        className='btn-add'
                        onClick={addSkill}
                      />
                      {resource.button_add_skill}
                    </div>
                  </section>
                  <label className='checkbox-container'>
                    <input
                      type='checkbox'
                      id='hirable'
                      name='hirable'
                      checked={state.edit.hirable}
                      onChange={updateState}
                    />
                    {resource.user_profile_hirable_skill}
                  </label>
                  <hr />
                  <p className='description'>
                    <i className='star highlight' />
                    {resource.user_profile_hirable_skill}
                  </p>
                </section>
                <footer>
                  <button
                    type='button'
                    id='btnSaveSkill'
                    name='btnSaveSkill'
                    onClick={saveChanges}
                  >
                    {resource.save}
                  </button>
                </footer>
              </div>
            )}
            {!isEditingLookingFor && (
              <div className='card'>
                <header>
                  <i className='material-icons highlight'>find_in_page</i>
                  {resource.user_profile_looking_for}
                  <button
                    type='button'
                    id='btnLookingFor'
                    name='btnLookingFor'
                    hidden={isEditing && !isEditingLookingFor}
                    className='btn-edit'
                    onClick={toggleLookingFor}
                  />
                </header>
                <section>
                  {user.lookingFor &&
                    user.lookingFor.map((item: string, index: number) => {
                      return <p key={index}>{item}</p>;
                    })}
                </section>
              </div>
            )}
            {isEditingLookingFor && (
              <div className='card'>
                <header>
                  <i className='material-icons highlight'>find_in_page</i>
                  {resource.user_profile_looking_for}
                  <button
                    type='button'
                    id='btnLookingFor'
                    name='btnLookingFor'
                    className='btn-close'
                    onClick={toggleLookingFor}
                  />
                </header>
                <section>
                  {user.lookingFor &&
                    user.lookingFor.map((item: string, index: number) => {
                      return (
                        <div key={index} className='chip' tabIndex={index}>
                          {item}
                          <button
                            type='button'
                            name='btnRemoveLookingFor'
                            className='close'
                            onClick={(e) => removeLookingFor(e, item)}
                          />
                        </div>
                      );
                    })}
                  <label className='form-group inline-input'>
                    <input
                      list='listLookingFor'
                      type='text'
                      name='lookingFor'
                      className='form-control'
                      value={state.edit.lookingFor}
                      onChange={onChangeLookingFor}
                      placeholder={
                        resource.placeholder_user_profile_looking_for
                      }
                      maxLength={100}
                      autoComplete='on'
                    />
                    {listLookingFor && listLookingFor.length > 0 && (
                      <datalist id='listLookingFor'>
                        {listLookingFor.map((item, index) => {
                          return <option key={index} value={item} />;
                        })}
                      </datalist>
                    )}
                    <button
                      type='button'
                      id='btnAddLookingFor'
                      name='btnAddLookingFor'
                      className='btn-add'
                      onClick={addLookingFor}
                    />
                  </label>
                </section>
                <footer>
                  <button
                    type='button'
                    id='btnSaveLookingFor'
                    name='btnSaveLookingFor'
                    onClick={saveChanges}
                  >
                    {resource.save}
                  </button>
                </footer>
              </div>
            )}
            <div className='card'>
              <header>
                <i className='material-icons highlight'>chat</i>
                {resource.user_profile_social}
                <button
                  type='button'
                  id='btnSocial'
                  name='btnSocial'
                  hidden={isEditing}
                  className='btn-edit'
                  onClick={showPopup}
                />
              </header>
              <div>
                {user.links?.facebook && (
                  <a
                    href={'https://facebookcom/' + user.links.facebook}
                    title='facebook'
                    target='_blank'
                    rel='noreferrer'
                  >
                    <i className='fab fa-facebook' />
                    <span>facebook</span>
                  </a>
                )}
                {user.links?.skype && (
                  <a
                    href={'https://skype.com/' + user.links.skype}
                    title='Skype'
                    target='_blank'
                    rel='noreferrer'
                  >
                    <i className='fab fa-skype' />
                    <span>Skype</span>
                  </a>
                )}
                {user.links?.twitter && (
                  <a
                    href={'https://twitter.com/' + user.links.twitter}
                    title='Twitter'
                    target='_blank'
                    rel='noreferrer'
                  >
                    <i className='fab fa-twitter' />
                    <span>Twitter</span>
                  </a>
                )}
                {user.links?.instagram && (
                  <a
                    href={'https://instagram.com/' + user.links.instagram}
                    title='Instagram'
                    target='_blank'
                    rel='noreferrer'
                  >
                    <i className='fab fa-instagram' />
                    <span>Instagram</span>
                  </a>
                )}
                {user.links?.linkedin && (
                  <a
                    href={'https://linkedin.com/' + user.links.linkedin}
                    title='Linked in'
                    target='_blank'
                    rel='noreferrer'
                  >
                    <i className='fab fa-linkedin' />
                    <span>Linked in</span>
                  </a>
                )}
                {user.links?.google && (
                  <a
                    href={'https://plus.google.com/' + user.links.google}
                    title='Google'
                    target='_blank'
                    rel='noreferrer'
                  >
                    <i className='fab fa-google' />
                    <span>Google</span>
                  </a>
                )}
                {user.links?.dribble && (
                  <a
                    href={'https://dribbble.com/' + user.links.dribble}
                    title='dribbble'
                    target='_blank'
                    rel='noreferrer'
                  >
                    <i className='fab fa-dribbble' />
                    <span>dribbble</span>
                  </a>
                )}

                {user.customLink01 && (
                  <a href={user.customLink01} target='_blank' rel='noreferrer'>
                    <i className='fab fa-globe-asia' />
                  </a>
                )}
                {user.customLink02 && (
                  <a href={user.customLink02} target='_blank' rel='noreferrer'>
                    <i className='fab fa-globe-asia' />
                  </a>
                )}
                {user.customLink03 && (
                  <a href={user.customLink03} target='_blank' rel='noreferrer'>
                    <i className='fab fa-globe-asia' />
                  </a>
                )}
                {user.customLink04 && (
                  <a href={user.customLink04} target='_blank' rel='noreferrer'>
                    <i className='fab fa-globe-asia' />
                  </a>
                )}
                {user.customLink05 && (
                  <a href={user.customLink05} target='_blank' rel='noreferrer'>
                    <i className='fab fa-globe-asia' />
                  </a>
                )}
                {user.customLink06 && (
                  <a href={user.customLink06} target='_blank' rel='noreferrer'>
                    <i className='fab fa-globe-asia' />
                  </a>
                )}
                {user.customLink07 && (
                  <a href={user.customLink07} target='_blank' rel='noreferrer'>
                    <i className='fab fa-globe-asia' />
                  </a>
                )}
                {user.customLink08 && (
                  <a href={user.customLink08} target='_blank' rel='noreferrer'>
                    <i className='fab fa-globe-asia' />
                  </a>
                )}
              </div>
            </div>
          </div>
          <div className='col m12 l8'>
            <div className='card border-bottom-highlight'>
              <header>
                <i className='material-icons highlight'>person</i>
                {resource.user_profile_bio}
                <button
                  type='button'
                  id='btnBio'
                  name='btnBio'
                  hidden={isEditing && !isEditingBio}
                  className={!isEditingBio ? 'btn-edit' : 'btn-close'}
                  onClick={toggleBio}
                />
              </header>
              {!isEditingBio && <p>{user.bio}</p>}
              {isEditingBio && (
                <textarea name='bio' value={user.bio} onChange={editBio} />
              )}
              {isEditingBio && (
                <footer>
                  <button
                    type='button'
                    id='btnSaveBio'
                    name='btnSaveBio'
                    onClick={(e) => {
                      saveChanges(e);
                      setBio(user.bio || '');
                    }}
                  >
                    {resource.save}
                  </button>
                </footer>
              )}
            </div>
            <div className='card border-bottom-highlight'>
              <header>
                <i className='material-icons highlight'>flash_on</i>
                {resource.interests}
                <button
                  type='button'
                  id='btnInterest'
                  name='btnInterest'
                  hidden={isEditing && !isEditingInterest}
                  className={!isEditingInterest ? 'btn-edit' : 'btn-close'}
                  onClick={toggleInterest}
                />
              </header>
              {!isEditingInterest && (
                <section className='row'>
                  {user.interests &&
                    user.interests.map((item: string, index: number) => {
                      return (
                        <span key={index} className='col s4'>
                          {item}
                        </span>
                      );
                    })}
                </section>
              )}
              {isEditingInterest && (
                <section className='row'>
                  {user.interests &&
                    user.interests.map((item: string, index: number) => {
                      return (
                        <div key={index} className='chip' tabIndex={index}>
                          {item}
                          <button
                            type='button'
                            name='btnRemoveInterest'
                            className='close'
                            onClick={(e) => removeInterest(e, item)}
                          />
                        </div>
                      );
                    })}
                  <label className='col s12 inline-input'>
                    <input
                      list='listInterest'
                      type='text'
                      name='interest'
                      onChange={onChangeInterest}
                      placeholder={resource.placeholder_user_profile_interest}
                      value={state.edit.interest}
                      maxLength={100}
                      autoComplete='on'
                    />
                    {listInterest && listInterest.length > 0 && (
                      <datalist id='listInterest'>
                        {listInterest.map((item, index) => {
                          return <option key={index} value={item} />;
                        })}
                      </datalist>
                    )}
                    <button
                      type='button'
                      id='btnAddInterest'
                      name='btnAddInterest'
                      className='btn-add'
                      onClick={addInterest}
                    />
                  </label>
                </section>
              )}
              {isEditingInterest && (
                <footer>
                  <button
                    type='button'
                    id='btnSaveInterest'
                    name='btnSaveInterest'
                    onClick={saveChanges}
                  >
                    {resource.save}
                  </button>
                </footer>
              )}
            </div>

            <div className='card border-bottom-highlight'>
              <header>
                <i className='material-icons highlight'>beenhere</i>
                {resource.achievements}
                <button
                  type='button'
                  id='btnAchievement'
                  name='btnAchievement'
                  hidden={isEditing && !isEditingAchievement}
                  className={!isEditingAchievement ? 'btn-edit' : 'btn-close'}
                  onClick={toggleAchievement}
                />
              </header>
              {!isEditingAchievement &&
                user.achievements &&
                user.achievements.map(
                  (achievement: Achievement, index: number) => {
                    return (
                      <section key={index}>
                        <h3>
                          {achievement.subject}
                          {achievement.highlight && (
                            <i className='star highlight float-right' />
                          )}
                        </h3>
                        <p className='description'>{achievement.description}</p>
                        <hr />
                      </section>
                    );
                  }
                )}
              {isEditingAchievement &&
                user.achievements &&
                user.achievements.map(
                  (achievement: Achievement, index: number) => (
                    <section key={index}>
                      <h3>
                        {achievement.subject}
                        {achievement.highlight && (
                          <i className='star highlight' />
                        )}
                      </h3>
                      <p className='description'>{achievement.description}</p>
                      <button
                        type='button'
                        className='btn-remove'
                        onClick={(e) =>
                          removeAchievement(e, achievement.subject)
                        }
                      />
                      <hr />
                    </section>
                  )
                )}
              {isEditingAchievement && (
                <section>
                  <div className='form-group'>
                    <input
                      type='text'
                      name='subject'
                      className='form-control'
                      value={state.edit.subject}
                      onChange={updateState}
                      placeholder={
                        resource.placeholder_user_profile_achievement_subject
                      }
                      maxLength={50}
                      required={true}
                    />
                    <input
                      type='text'
                      name='description'
                      className='form-control'
                      value={state.edit.description}
                      onChange={updateState}
                      placeholder={
                        resource.placeholder_user_profile_achievement_description
                      }
                      maxLength={100}
                      required={true}
                    />
                  </div>
                  <label className='checkbox-container'>
                    <input
                      type='checkbox'
                      id='highlight'
                      name='highlight'
                      checked={state.edit.highlight}
                      onChange={updateState}
                    />
                    {resource.user_profile_highlight_achievement}
                  </label>
                  <div className='btn-group'>
                    <button
                      type='button'
                      id='btnAddAchievement'
                      name='btnAddAchievement'
                      className='btn-add'
                      onClick={addAchievement}
                    />
                    {resource.button_add_achievement}
                  </div>
                </section>
              )}
              {isEditingAchievement && (
                <footer>
                  <button
                    type='button'
                    id='btnSaveAchievement'
                    name='btnSaveAchievement'
                    onClick={saveChanges}
                  >
                    {resource.save}
                  </button>
                </footer>
              )}
            </div>
            <div className='card border-bottom-highlight'>
              <header>
                <i className='material-icons highlight btn-camera'></i>
                {resource.title_modal_gallery}
                <button
                  type='button'
                  id='btnGallery'
                  name='btnGallery'
                  className={'btn-edit'}
                  onClick={openModalUploadGallery}
                />
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
        </div>
      </form>
      <ReactModal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel='Modal'
        className='modal-portal-content'
        bodyOpenClassName='modal-portal-open'
        overlayClassName='modal-portal-backdrop'
      >
        <GeneralInfo
          resource={resource}
          close={closeModal}
          saveEmit={saveEmit}
          user={user}
        />
      </ReactModal>
      <ReactModal
        isOpen={modalUpload}
        onRequestClose={closeModalUpload}
        contentLabel='Modal'
        // portalClassName='modal-portal'
        className='modal-portal-content'
        bodyOpenClassName='modal-portal-open'
        overlayClassName='modal-portal-backdrop'
      >
        <div className='view-container profile-info'>
          <form model-name='data'>
            <header>
              <h2>{resource.title_modal_uploads}</h2>
              <button
                type='button'
                id='btnClose'
                name='btnClose'
                className='btn-close'
                onClick={closeModalUpload}
              />
            </header>
            <UploadContainer
              post={httpRequest.post}
              setURL={(dt: string) => handleChangeFile(dt)}
              type={typeUpload}
              id={user.userId}
              url={config.authentication_url + '/my-profile'}
              aspect={aspect}
              sizes={sizes}
            />
            <footer>
              <button
                type='button'
                id='btnSave'
                name='btnSave'
                onClick={closeModalUpload}
              >
                {resource.button_modal_ok}
              </button>
            </footer>
          </form>
        </div>
      </ReactModal>
      <ReactModal
        isOpen={modalConfirmIsOpen}
        onRequestClose={closeModalConfirm}
        contentLabel='Modal'
        className='modal-portal-content small-width-height'
        bodyOpenClassName='modal-portal-open'
        overlayClassName='modal-portal-backdrop'
      >
        <div className='view-container profile-info'>
          <form model-name='data'>
            <header>
              <h2>Edit About</h2>
              <button
                type='button'
                id='btnClose'
                name='btnClose'
                className='btn-close'
                onClick={closeModalConfirm}
              />
            </header>
            <div>
              <section className='row'>
                <div> {resource.warning_message_delete_bio}</div>
              </section>
            </div>

            <footer>
              <button
                type='button'
                id='btnSave'
                name='btnSave'
                onClick={revertBioChages}
              >
                {resource.button_modal_ok}
              </button>
            </footer>
          </form>
        </div>
      </ReactModal>
      <ModalUploadGallery
        closeModalUploadGallery={closeModalUploadGallery}
        modalUploadGalleryOpen={modalUploadGalleryOpen}
        setGallery={(files) => {
          setUser({ ...user, gallery: files });
        }}
      />
      <ModalSelectCover
        list={user.gallery ?? []}
        modalSelectGalleryOpen={modalSelectGalleryOpen}
        closeModalUploadGallery={toggleSelectGallery}
        setImageCover={saveImageCover}
      />
    </div>
  );
};
export function inArray(arr: string[], item: string): boolean {
  if (!arr || arr.length === 0) {
    return false;
  }
  const isExist = arr.filter((itemFilter) => itemFilter === item).length > 0;
  return isExist;
}

export function inAchievements(arr: Achievement[], item: Achievement): boolean {
  if (!arr || arr.length === 0) {
    return false;
  }
  const isExist =
    arr.filter((itemFilter) => itemFilter.subject === item.subject).length > 0;
  return isExist;
}
