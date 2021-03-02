'use strict';

(function () {
  let footer;
  let headers;

  if (document.querySelector(`.page-footer`)) {
    footer = document.querySelector(`.page-footer`);

    if (footer.querySelectorAll(`h3`)) {
      headers = footer.querySelectorAll(`h3:not(.visually-hidden)`);
    }
  }

  const hideContent = (element) => {
    const className = element.parentNode.classList.item(0);
    element.parentNode.classList.remove(`${className}--open`);
  };

  const toggleClass = (evt) => {
    const parentClass = evt.target.parentNode.classList.item(0);

    if (evt.target.parentNode.classList.contains(`${parentClass}--open`)) {
      evt.target.parentNode.classList.remove(`${parentClass}--open`);
    } else {
      headers.forEach((header) => {
        hideContent(header);
      });

      evt.target.parentNode.classList.add(`${parentClass}--open`);
    }
  };

  const onHeaderClick = (evt) => {
    toggleClass(evt);
  };

  const onHeaderEnter = (evt) => {
    if (evt.key === `Enter`) {
      evt.preventDefault();
      toggleClass(evt);
    }
  };

  if (headers) {
    for (let header of headers) {
      hideContent(header);
      header.addEventListener(`click`, onHeaderClick);
      header.addEventListener(`keydown`, onHeaderEnter);
    }
  }
})();

(function () {
  const storageAvailable = (type) => {
    let storage;
    try {
      storage = window[type];
      const x = `__storage_test__`;
      storage.setItem(x, x);
      storage.removeItem(x);
      return true;
    } catch (e) {
      return e instanceof DOMException && (
        e.code === 22 ||
        e.code === 1014 ||
        e.name === `QuotaExceededError` ||
        e.name === `NS_ERROR_DOM_QUOTA_REACHED`) &&
        (storage && storage.length !== 0);
    }
  };

  const setValues = (form) => {
    const name = localStorage.getItem(`name`);
    const tel = localStorage.getItem(`tel`);
    const question = localStorage.getItem(`question`);

    form.querySelector(`.form__input--name input`).value = name;
    form.querySelector(`.form__input--tel input`).value = tel;
    form.querySelector(`.form__input--textarea textarea`).value = question;
  };

  const saveToStorage = (form) => {
    localStorage.setItem(`name`, form.querySelector(`.form__input--name input`).value);
    localStorage.setItem(`tel`, form.querySelector(`.form__input--tel input`).value);
    localStorage.setItem(`question`, form.querySelector(`.form__input--textarea textarea`).value);

    setValues(form);
  };

  window.storage = {
    storageAvailable,
    setValues,
    saveToStorage
  };
})();

(function () {
  let body;
  let feedbackLink;
  let modal;
  let modalContent;
  let modalClose;
  let modalForm;
  let modalFormTel;
  let modalFormName;
  let modalFormText;

  if (document.querySelector(`.body`)) {
    body = document.querySelector(`.body`);

    if (body.querySelector(`.page-header__feedback a`)) {
      feedbackLink = body.querySelector(`.page-header__feedback a`);
    }

    if (body.querySelector(`.modal`)) {
      modal = body.querySelector(`.modal`);

      if (modal.querySelector(`.modal__content`)) {
        modalContent = modal.querySelector(`.modal__content`);

        if (modal.querySelector(`.form`)) {
          modalForm = modal.querySelector(`.form`);

          if (modalForm.querySelector(`.form__input--tel input`)) {
            modalFormTel = modalForm.querySelector(`.form__input--tel input`);
          }

          if (modalForm.querySelector(`.form__input--name input`)) {
            modalFormName = modalForm.querySelector(`.form__input--name input`);
          }

          if (modalForm.querySelector(`.form__input--textarea textarea`)) {
            modalFormText = modalForm.querySelector(`.form__input--textarea textarea`);
          }
        }

        if (modalContent.querySelector(`#close-modal`)) {
          modalClose = modalContent.querySelector(`#close-modal`);
        }
      }
    }
  }

  const existVerticalScroll = () => {
    return document.body.offsetHeight > window.innerHeight;
  };

  const getBodyScrollTop = () => {
    return self.pageYOffset || (document.documentElement && document.documentElement.scrollTop) || (document.body && document.body.scrollTop);
  };

  const showModal = () => {
    body.dataset.scrollY = getBodyScrollTop();
    modal.classList.add(`modal--open`);

    if (existVerticalScroll()) {
      body.classList.add(`body--lock`);
      body.style.top = `-${body.dataset.scrollY}px`;
    }

    let modalMask = IMask(modalFormTel, window.form.maskOptions);
    modal.querySelector(`.form__input--name input`).focus();
    modalFormTel.addEventListener(`focus`, window.form.onFormTelFocus.bind(undefined, modalFormTel));
    modalFormTel.addEventListener(`input`, window.form.onFormTelInput.bind(undefined, modalFormTel));
    modalFormTel.addEventListener(`keydown`, window.form.onFormTelBackspace.bind(undefined, modalFormTel));
    modalForm.addEventListener(`submit`, window.form.onFormSubmit.bind(undefined, modalForm));
    modalClose.addEventListener(`click`, onModalCloseClick);
    modalContent.addEventListener(`click`, onModalContentClick);
    body.addEventListener(`keydown`, onModalEsc);
    modal.addEventListener(`click`, onModalOverlayClick);

    if (window.storage.storageAvailable(`localStorage`)) {
      window.storage.setValues(modalForm);

      const onInputChange = (input, form) => {
        window.storage.saveToStorage(form);
      };

      modalFormName.addEventListener(`change`, onInputChange.bind(undefined, modalFormName, modalForm, `name`));
      modalFormTel.addEventListener(`change`, onInputChange.bind(undefined, modalFormTel, modalForm, `tel`));
      modalFormText.addEventListener(`change`, onInputChange.bind(undefined, modalFormText, modalForm, `question`));
    }
  };

  const hideModal = () => {
    modal.classList.remove(`modal--open`);

    if (existVerticalScroll()) {
      body.classList.remove(`body--lock`);
      window.scrollTo(0, body.dataset.scrollY);
    }

    modalFormTel.removeEventListener(`focus`, window.form.onFormTelFocus.bind(undefined, modalFormTel));
    modalFormTel.removeEventListener(`input`, window.form.onFormTelInput.bind(undefined, modalFormTel));
    modalFormTel.removeEventListener(`keydown`, window.form.onFormTelBackspace.bind(undefined, modalFormTel));
    modalForm.removeEventListener(`submit`, window.form.onFormSubmit.bind(undefined, modalForm));
    modalClose.removeEventListener(`click`, onModalCloseClick);
    modalContent.removeEventListener(`click`, onModalContentClick);
    body.removeEventListener(`keydown`, onModalEsc);
    modal.removeEventListener(`click`, onModalOverlayClick);
  };

  const onFeedbackLinkClick = (evt) => {
    evt.preventDefault();
    showModal();
  };

  const onModalCloseClick = () => {
    hideModal();
  };

  const onModalEsc = (evt) => {
    if (evt.key === `Escape`) {
      evt.preventDefault();
      hideModal();
    }
  };

  const onModalOverlayClick = (evt) => {
    if (evt.currentTarget.className === `modal modal--open`) {
      hideModal();
    }
  };

  const onModalContentClick = (evt) => {
    evt.stopPropagation();
  };

  if (feedbackLink) {
    feedbackLink.addEventListener(`click`, onFeedbackLinkClick);
  }

  window.modal = {
    body
  };
})();

(function () {
  let feedbackForm;
  let formName;
  let formTel;
  let formText;

  if (window.modal.body) {
    if (window.modal.body.querySelector(`.form`)) {
      feedbackForm = window.modal.body.querySelector(`.form`);

      if (feedbackForm.querySelector(`.form__input--tel input`)) {
        formTel = feedbackForm.querySelector(`.form__input--tel input`);
      }

      if (feedbackForm.querySelector(`.form__input--name input`)) {
        formName = feedbackForm.querySelector(`.form__input--name input`);
      }

      if (feedbackForm.querySelector(`.form__input--textarea textarea`)) {
        formText = feedbackForm.querySelector(`.form__input--textarea textarea`);
      }
    }
  }

  let maskOptions = {
    mask: '+7(0000000000)'
  };
  let feedbackMask = IMask(formTel, maskOptions);

  const setCaretPosition = (input, position) => {
    input.setSelectionRange(position, position);
  };

  const onFormTelFocus = (input) => {
    let currentValue = input.value;
    currentValue === `` ? input.value = `+7(` : input.value = currentValue;
    setCaretPosition(input, 3);
  };

  const onFormTelInput = (input) => {
    const re = /\+7\([\d]/g;
    const completedRe = /\+7\([\d]{10}/g;
    const finalRe = /\+7\([\d]{10}\)/g;

    if (input.value.length > 0 && input.value.length < 13 && !re.test(input.value)) {
      input.setCustomValidity(`Пожалуйста, вводите только цифры.`);
    } else if (input.value.length === 13 && completedRe.test(input.value)) {
      input.value += `)`;
      input.setCustomValidity(``);
    } else if (input.value.length > 0 && (input.value.length <= 13 || input.value.length > 13) && !finalRe.test(input.value)) {
      if ((input.value.length <= 13 && /.*\)/.test(input.value))) {
        input.value = input.value.split(``).filter((char) => {
          return char !== `)`;
        }).join(``);
      }
      input.setCustomValidity(`Пожалуйста, введите 10 цифр номера телефона.`);
    } else if (input.value.length < 14 && !finalRe.test(input.value)) {
      input.setCustomValidity(`Пожалуйста, введите 10 цифр номера телефона.`);
    } else if (input.value.length === 14 && finalRe.test(input.value)) {
      input.setCustomValidity(``);
    }
    else {
      input.setCustomValidity(``);
    }
    input.reportValidity();
  };

  const onFormTelBackspace = (input, evt) => {
    if (evt.key === `Backspace` && input.value === `+7(`) {
      evt.preventDefault();
    }
  };

  const onFormSubmit = (input, evt) => {
    if (!input.validity.valid) {
      evt.preventDefault();
    }
  };

  if (window.storage.storageAvailable(`localStorage`) && feedbackForm) {
    window.storage.setValues(feedbackForm);

    const onInputChange = (input, form) => {
      window.storage.saveToStorage(form);
    };

    formName.addEventListener(`change`, onInputChange.bind(undefined, formName, feedbackForm, `name`));
    formTel.addEventListener(`change`, onInputChange.bind(undefined, formTel, feedbackForm, `tel`));
    formText.addEventListener(`change`, onInputChange.bind(undefined, formText, feedbackForm, `question`));
  }

  if (feedbackForm) {
    formTel.addEventListener(`focus`, onFormTelFocus.bind(undefined, formTel));
    formTel.addEventListener(`input`, onFormTelInput.bind(undefined, formTel));
    formTel.addEventListener(`keydown`, onFormTelBackspace.bind(undefined, formTel));
    feedbackForm.addEventListener(`submit`, onFormSubmit.bind(undefined, formTel));
  }

  window.form = {
    maskOptions,
    onFormTelFocus,
    onFormTelInput,
    onFormTelBackspace,
    onFormSubmit
  };
})();

(function () {
  let feedbackLink;
  let featuresLink;

  const scrollToLink = (link) => {
    const href = link.getAttribute(`href`);
    const offsetTop = document.querySelector(href).offsetTop;

    scroll({
      top: offsetTop,
      behavior: `smooth`
    });
  };

  const onLinkClick = (link, evt) => {
    evt.preventDefault();
    scrollToLink(link);
  };

  if (document.querySelector(`.heading__info a`)) {
    feedbackLink = document.querySelector(`.heading__info a`);
    feedbackLink.addEventListener(`click`, onLinkClick.bind(undefined, feedbackLink));
  }

  if (document.querySelector(`.heading__wrapper > a`)) {
    featuresLink = document.querySelector(`.heading__wrapper > a`);
    featuresLink.addEventListener(`click`, onLinkClick.bind(undefined, featuresLink));
  }
})();
