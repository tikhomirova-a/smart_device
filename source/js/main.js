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

  if (document.querySelector(`.body`)) {
    body = document.querySelector(`.body`);

    if (body.querySelector(`.page-header__feedback a`)) {
      feedbackLink = body.querySelector(`.page-header__feedback a`);
    }

    if (body.querySelector(`.modal`)) {
      modal = body.querySelector(`.modal`);

      if (modal.querySelector(`.modal__content`)) {
        modalContent = modal.querySelector(`.modal__content`);

        if (modalContent.querySelector(`#close-modal`)) {
          modalClose = modalContent.querySelector(`#close-modal`);
        }
      }
    }
  }

  const showModal = () => {
    modal.classList.add(`modal--open`);
    modalClose.addEventListener(`click`, onModalCloseClick);
    modalContent.addEventListener(`click`, onModalContentClick);
    body.addEventListener(`keydown`, onModalEsc);
    modal.addEventListener(`click`, onModalOverlayClick);
    body.classList.add(`body--modal`);
  };

  const hideModal = () => {
    modal.classList.remove(`modal--open`);
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
})();
