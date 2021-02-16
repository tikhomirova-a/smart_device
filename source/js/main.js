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
      header.addEventListener(`click`, onHeaderClick);
      header.addEventListener(`keydown`, onHeaderEnter);
    }
  }
})();

(function () {
  let body;
  let feedbackLink;
  let modal;
  let modalContent;
  let modalClose;
  let modalForm;
  let modalFormTel;

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
        }

        if (modalContent.querySelector(`#close-modal`)) {
          modalClose = modalContent.querySelector(`#close-modal`);
        }
      }
    }
  }

  const showModal = () => {
    modal.classList.add(`modal--open`);
    modal.querySelector(`.form__input--name input`).focus();
    modalFormTel.addEventListener(`input`, window.form.onFormTelInput.bind(undefined, modalFormTel));
    modalForm.addEventListener(`submit`, window.form.onFormSubmit.bind(undefined, modalForm));
    modalClose.addEventListener(`click`, onModalCloseClick);
    modalContent.addEventListener(`click`, onModalContentClick);
    body.addEventListener(`keydown`, onModalEsc);
    modal.addEventListener(`click`, onModalOverlayClick);
    body.classList.add(`body--modal`);
  };

  const hideModal = () => {
    modal.classList.remove(`modal--open`);
    modalFormTel.removeEventListener(`input`, window.form.onFormTelInput.bind(undefined, modalFormTel));
    modalForm.removeEventListener(`submit`, window.form.onFormSubmit.bind(undefined, modalForm));
    modalClose.removeEventListener(`click`, onModalCloseClick);
    modalContent.removeEventListener(`click`, onModalContentClick);
    body.removeEventListener(`keydown`, onModalEsc);
    modal.removeEventListener(`click`, onModalOverlayClick);
    body.classList.remove(`body--modal`);
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
  let form;
  let formTel;

  if (window.modal.body) {
    if (window.modal.body.querySelector(`.form`)) {
      form = window.modal.body.querySelector(`.form`);

      if (form.querySelector(`.form__input--tel input`)) {
        formTel = form.querySelector(`.form__input--tel input`);
      }
    }
  }

  const onFormTelInput = (input) => {
    const re = /[\d]/g;

    if (input.value.length > 0 && !re.test(input.value)) {
      input.setCustomValidity(`Пожалуйста, вводите только цифры.`);
    } else if (input.value.length > 0 && (input.value.length < 10 || input.value.length > 10)) {
      input.setCustomValidity(`Длина номера телефона должна составлять 10 цифр.`);
    } else {
      input.setCustomValidity(``);
    }
    input.reportValidity();
  };

  formTel.addEventListener(`input`, onFormTelInput.bind(undefined, formTel));

  const onFormSubmit = (input, evt) => {
    if (!input.validity.valid) {
      evt.preventDefault();
    }
  };

  form.addEventListener(`submit`, onFormSubmit.bind(undefined, formTel));

  window.form = {
    onFormTelInput,
    onFormSubmit
  };
})();
