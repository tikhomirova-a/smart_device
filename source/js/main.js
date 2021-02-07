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

  for (let header of headers) {
    header.tabIndex = 0;
    header.addEventListener(`click`, onHeaderClick);
    header.addEventListener(`keydown`, onHeaderEnter);
  }
})();
