function ___$insertStyle(css) {
    if (!css || typeof window === 'undefined') {
        return;
    }
    const style = document.createElement('style');
    style.setAttribute('type', 'text/css');
    style.innerHTML = css;
    document.head.appendChild(style);
    return css;
}

import { useState, useEffect, createElement } from 'react';

___$insertStyle(".popup-overlay {\n  max-height: 100vh;\n  max-width: 100vw;\n}\n\n.popup-overlay--top {\n  top: 0 !important;\n  right: 0 !important;\n  bottom: auto !important;\n  left: 0 !important;\n  width: 100vw !important;\n  transform: translateY(-100%);\n}\n\n.popup-overlay--right {\n  height: 100vh !important;\n  top: 0 !important;\n  right: 0 !important;\n  bottom: 0 !important;\n  left: auto !important;\n  transform: translateX(100%);\n}\n\n.popup-overlay--bottom {\n  top: auto !important;\n  right: 0 !important;\n  bottom: 0 !important;\n  left: 0 !important;\n  width: 100vw !important;\n  transform: translateY(100%);\n}\n\n.popup-overlay--left {\n  height: 100vh !important;\n  top: 0 !important;\n  right: auto !important;\n  bottom: 0 !important;\n  left: 0 !important;\n  transform: translateX(-100%);\n}\n\n.popup-overlay.transition {\n  transition: transform 0.3s cubic-bezier(0.23, 1, 0.32, 1);\n  will-change: transition;\n}\n\n.popup-overlay.transition.visible {\n  transform: translate(0%, 0%);\n}\n\n.popup-overlay .modal-header {\n  pointer-events: none;\n}\n\n.popup-overlay .modal-content {\n  border: 0;\n  border-radius: 0;\n  box-shadow: none;\n}\n\n.popup-overlay .mx-resizer {\n  display: none;\n}\n\n.popup-overlay .popup-underlay {\n  background-color: black;\n  bottom: 0;\n  content: \"\";\n  display: block;\n  left: calc(0px - 100vw);\n  /* opacity: .3; */\n  opacity: 0;\n  position: fixed;\n  transition: opacity 0.3s cubic-bezier(0.23, 1, 0.32, 1);\n  top: 0;\n  right: 0;\n  will-change: opacity;\n  z-index: -1;\n}\n\n.popup-overlay--remove-header .modal-header {\n  display: none;\n}\n\n.popup-overlay__closebutton {\n  height: 50px;\n  position: absolute;\n  right: 0;\n  top: 0;\n  width: 50px;\n}\n\n.popup-overlay__closebutton:hover {\n  cursor: pointer;\n}\n\n.popup-underlay.visible {\n  opacity: 0.45;\n}\n\n.popup-underlay.visible:hover {\n  cursor: pointer;\n}\n\nbody.popup-overlay-noscroll {\n  overflow: hidden;\n}");

function waitFor(elementClass, callback, parent) {
  const context = parent || document;

  if (context.querySelector(elementClass)) {
    callback();
  } else {
    const observer = new MutationObserver(() => {
      if (context.querySelector(elementClass)) {
        observer.disconnect();
        callback();
      }
    }); // Start observing

    observer.observe(context, {
      childList: true,
      //This is a must have for the observer with subtree
      subtree: true //Set to true if changes must also be observed in descendants.

    });
  }
}

/* eslint-disable no-unused-expressions */
function ConvertPopupToOverlay({
  closeButtonClass,
  closePage,
  position,
  size,
  showHeader
}) {
  const [canRender, setCanRender] = useState(false);
  const [modal, setModal] = useState(null);
  useEffect(() => {
    if (document.querySelector(".convert-popup-to-overlay")) {
      setModal(document.querySelector(".convert-popup-to-overlay").closest(".modal-dialog"));
      setCanRender(true);
    }
  });

  if (canRender) {
    function removeUnderlay() {
      const underlay = document.querySelector(".popup-underlay");
      underlay && underlay.classList.remove("visible");

      if (document.querySelector(".popup-underlay.old:not(.visible)")) {
        document.querySelector(".popup-underlay.old:not(.visible)").remove();
      }
    }

    function AnimateCloseModal() {
      const modal = document.querySelector(".popup-overlay");
      modal && modal.classList.remove("visible");
      document.body.classList.remove("popup-overlay-noscroll");
    }

    function closeModal() {
      AnimateCloseModal();
      removeUnderlay();

      if (closePage === true) {
        const modal = document.querySelector(".popup-overlay");
        const closeBtn = modal.querySelector(".close");
        setTimeout(() => closeBtn.click(), 300);
      }
    }

    function generateUnderlay() {
      const oldUnderlay = document.querySelector(".popup-underlay");

      if (!oldUnderlay) {
        removeUnderlay();
      }

      modal.insertAdjacentHTML("beforeend", '<div class="popup-underlay"></div>');
      const underlay = document.querySelector(".popup-underlay:not(.old)");
      underlay.addEventListener("click", closeModal);
      underlay.classList.add("old");
      return underlay;
    } // overlay for the default close button


    function generateCloseBtn() {
      if (showHeader === true && closePage === true) {
        const modalContent = modal.querySelector(".modal-content");
        modalContent.insertAdjacentHTML("afterbegin", `<div class="popup-overlay__closebutton ${closeButtonClass}"></div>`);
      }
    }

    function linkCloseButtons() {
      document.querySelectorAll(`.${closeButtonClass}`).forEach(closeBtn => {
        if (closePage === true) {
          closeBtn.addEventListener("click", closeModal);
        } else {
          closeBtn.addEventListener("click", AnimateCloseModal);
        }
      });
    }

    modal.classList.add("popup-overlay", `popup-overlay--${position}`);
    setTimeout(() => {
      // Set size as width
      if (position === "left" || position === "right") {
        modal.style.width = `${size}px`;
      } // Set size as height


      if (position === "top" || position === "bottom") {
        modal.style.height = `${size}px`;
      }
    }, 100); // Show/hide overlay header

    if (showHeader === false) {
      modal.classList.add("popup-overlay--remove-header");
    }

    document.body.classList.add("popup-overlay-noscroll"); // Wait with transitions in case of progressbar

    function foundProgress() {
      return true;
    }

    const progress = waitFor(".mx-progress", foundProgress, document);

    if (progress) {
      underlay.classList.remove("visible");
      modal.classList.remove("transition");
      modal.classList.remove("visible");
    } else {
      setTimeout(() => {
        const underlay = generateUnderlay();
        generateCloseBtn();
        linkCloseButtons();
        setTimeout(() => underlay.classList.add("visible"), 300);
        setTimeout(() => modal.classList.add("transition"), 300);
        setTimeout(() => modal.classList.add("visible"), 300);
      }, 300);
    }

    return null;
  } else {
    return createElement("div", {
      className: "convert-popup-to-overlay"
    });
  }
}

export { ConvertPopupToOverlay as default };
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQ29udmVydFBvcHVwVG9PdmVybGF5Lm1qcyIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vc3JjL2hlbHBlcnMvd2FpdEZvci5qcyIsIi4uLy4uLy4uLy4uLy4uL3NyYy9Db252ZXJ0UG9wdXBUb092ZXJsYXkuanN4Il0sInNvdXJjZXNDb250ZW50IjpbImV4cG9ydCBmdW5jdGlvbiB3YWl0Rm9yKGVsZW1lbnRDbGFzcywgY2FsbGJhY2ssIHBhcmVudCkge1xuICBjb25zdCBjb250ZXh0ID0gcGFyZW50IHx8IGRvY3VtZW50O1xuXG4gIGlmIChjb250ZXh0LnF1ZXJ5U2VsZWN0b3IoZWxlbWVudENsYXNzKSkge1xuICAgIGNhbGxiYWNrKCk7XG4gIH0gZWxzZSB7XG4gICAgY29uc3Qgb2JzZXJ2ZXIgPSBuZXcgTXV0YXRpb25PYnNlcnZlcigoKSA9PiB7XG4gICAgICBpZiAoY29udGV4dC5xdWVyeVNlbGVjdG9yKGVsZW1lbnRDbGFzcykpIHtcbiAgICAgICAgb2JzZXJ2ZXIuZGlzY29ubmVjdCgpO1xuICAgICAgICBjYWxsYmFjaygpO1xuICAgICAgfVxuICAgIH0pO1xuICBcbiAgICAvLyBTdGFydCBvYnNlcnZpbmdcbiAgICBvYnNlcnZlci5vYnNlcnZlKGNvbnRleHQsIHtcbiAgICAgIGNoaWxkTGlzdDogdHJ1ZSwgLy9UaGlzIGlzIGEgbXVzdCBoYXZlIGZvciB0aGUgb2JzZXJ2ZXIgd2l0aCBzdWJ0cmVlXG4gICAgICBzdWJ0cmVlOiB0cnVlLCAvL1NldCB0byB0cnVlIGlmIGNoYW5nZXMgbXVzdCBhbHNvIGJlIG9ic2VydmVkIGluIGRlc2NlbmRhbnRzLlxuICAgIH0pO1xuICB9XG59OyIsIi8qIGVzbGludC1kaXNhYmxlIG5vLXVudXNlZC1leHByZXNzaW9ucyAqL1xuaW1wb3J0IFwiLi91aS9Db252ZXJ0UG9wdXBUb092ZXJsYXkuY3NzXCI7XG5pbXBvcnQgeyBjcmVhdGVFbGVtZW50LCB1c2VFZmZlY3QsIHVzZVN0YXRlIH0gZnJvbSBcInJlYWN0XCI7XG5pbXBvcnQgeyB3YWl0Rm9yIH0gZnJvbSBcIi4vaGVscGVycy93YWl0Rm9yXCI7XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIENvbnZlcnRQb3B1cFRvT3ZlcmxheSh7IGNsb3NlQnV0dG9uQ2xhc3MsIGNsb3NlUGFnZSwgcG9zaXRpb24sIHNpemUsIHNob3dIZWFkZXIgfSkge1xuICAgIGNvbnN0IFtjYW5SZW5kZXIsIHNldENhblJlbmRlcl0gPSB1c2VTdGF0ZShmYWxzZSk7XG4gICAgY29uc3QgW21vZGFsLCBzZXRNb2RhbF0gPSB1c2VTdGF0ZShudWxsKTtcblxuICAgIHVzZUVmZmVjdCgoKSA9PiB7XG4gICAgICAgIGlmIChkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLmNvbnZlcnQtcG9wdXAtdG8tb3ZlcmxheVwiKSkge1xuICAgICAgICAgICAgc2V0TW9kYWwoZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5jb252ZXJ0LXBvcHVwLXRvLW92ZXJsYXlcIikuY2xvc2VzdChcIi5tb2RhbC1kaWFsb2dcIikpO1xuICAgICAgICAgICAgc2V0Q2FuUmVuZGVyKHRydWUpO1xuICAgICAgICB9XG4gICAgfSk7XG5cbiAgICBpZiAoY2FuUmVuZGVyKSB7XG4gICAgICAgIGZ1bmN0aW9uIHJlbW92ZVVuZGVybGF5KCkge1xuICAgICAgICAgICAgY29uc3QgdW5kZXJsYXkgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLnBvcHVwLXVuZGVybGF5XCIpO1xuICAgICAgICAgICAgdW5kZXJsYXkgJiYgdW5kZXJsYXkuY2xhc3NMaXN0LnJlbW92ZShcInZpc2libGVcIik7XG5cbiAgICAgICAgICAgIGlmIChkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLnBvcHVwLXVuZGVybGF5Lm9sZDpub3QoLnZpc2libGUpXCIpKSB7XG4gICAgICAgICAgICAgICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5wb3B1cC11bmRlcmxheS5vbGQ6bm90KC52aXNpYmxlKVwiKS5yZW1vdmUoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIEFuaW1hdGVDbG9zZU1vZGFsKCkge1xuICAgICAgICAgICAgY29uc3QgbW9kYWwgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLnBvcHVwLW92ZXJsYXlcIik7XG4gICAgICAgICAgICBtb2RhbCAmJiBtb2RhbC5jbGFzc0xpc3QucmVtb3ZlKFwidmlzaWJsZVwiKTtcbiAgICAgICAgICAgIGRvY3VtZW50LmJvZHkuY2xhc3NMaXN0LnJlbW92ZShcInBvcHVwLW92ZXJsYXktbm9zY3JvbGxcIik7XG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiBjbG9zZU1vZGFsKCkge1xuICAgICAgICAgICAgQW5pbWF0ZUNsb3NlTW9kYWwoKTtcbiAgICAgICAgICAgIHJlbW92ZVVuZGVybGF5KCk7XG4gICAgICAgICAgICBpZiAoY2xvc2VQYWdlID09PSB0cnVlKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgbW9kYWwgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLnBvcHVwLW92ZXJsYXlcIik7XG4gICAgICAgICAgICAgICAgY29uc3QgY2xvc2VCdG4gPSBtb2RhbC5xdWVyeVNlbGVjdG9yKFwiLmNsb3NlXCIpO1xuICAgICAgICAgICAgICAgIHNldFRpbWVvdXQoKCkgPT4gY2xvc2VCdG4uY2xpY2soKSwgMzAwKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIGdlbmVyYXRlVW5kZXJsYXkoKSB7XG4gICAgICAgICAgICBjb25zdCBvbGRVbmRlcmxheSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIucG9wdXAtdW5kZXJsYXlcIik7XG5cbiAgICAgICAgICAgIGlmICghb2xkVW5kZXJsYXkpIHtcbiAgICAgICAgICAgICAgICByZW1vdmVVbmRlcmxheSgpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBtb2RhbC5pbnNlcnRBZGphY2VudEhUTUwoXCJiZWZvcmVlbmRcIiwgJzxkaXYgY2xhc3M9XCJwb3B1cC11bmRlcmxheVwiPjwvZGl2PicpO1xuICAgICAgICAgICAgY29uc3QgdW5kZXJsYXkgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLnBvcHVwLXVuZGVybGF5Om5vdCgub2xkKVwiKTtcbiAgICAgICAgICAgIHVuZGVybGF5LmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBjbG9zZU1vZGFsKTtcbiAgICAgICAgICAgIHVuZGVybGF5LmNsYXNzTGlzdC5hZGQoXCJvbGRcIik7XG4gICAgICAgICAgICByZXR1cm4gdW5kZXJsYXk7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBvdmVybGF5IGZvciB0aGUgZGVmYXVsdCBjbG9zZSBidXR0b25cbiAgICAgICAgZnVuY3Rpb24gZ2VuZXJhdGVDbG9zZUJ0bigpIHtcbiAgICAgICAgICAgIGlmIChzaG93SGVhZGVyID09PSB0cnVlICYmIGNsb3NlUGFnZSA9PT0gdHJ1ZSkge1xuICAgICAgICAgICAgICAgIGNvbnN0IG1vZGFsQ29udGVudCA9IG1vZGFsLnF1ZXJ5U2VsZWN0b3IoXCIubW9kYWwtY29udGVudFwiKTtcbiAgICAgICAgICAgICAgICBtb2RhbENvbnRlbnQuaW5zZXJ0QWRqYWNlbnRIVE1MKFxuICAgICAgICAgICAgICAgICAgICBcImFmdGVyYmVnaW5cIixcbiAgICAgICAgICAgICAgICAgICAgYDxkaXYgY2xhc3M9XCJwb3B1cC1vdmVybGF5X19jbG9zZWJ1dHRvbiAke2Nsb3NlQnV0dG9uQ2xhc3N9XCI+PC9kaXY+YFxuICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgXG4gICAgICAgIGZ1bmN0aW9uIGxpbmtDbG9zZUJ1dHRvbnMoKSB7XG4gICAgICAgICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKGAuJHtjbG9zZUJ1dHRvbkNsYXNzfWApLmZvckVhY2goY2xvc2VCdG4gPT4ge1xuICAgICAgICAgICAgICAgIGlmIChjbG9zZVBhZ2UgPT09IHRydWUpIHtcbiAgICAgICAgICAgICAgICAgICAgY2xvc2VCdG4uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGNsb3NlTW9kYWwpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGNsb3NlQnRuLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBBbmltYXRlQ2xvc2VNb2RhbCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cblxuICAgICAgICBtb2RhbC5jbGFzc0xpc3QuYWRkKFwicG9wdXAtb3ZlcmxheVwiLCBgcG9wdXAtb3ZlcmxheS0tJHtwb3NpdGlvbn1gKTtcbiAgICAgICAgXG4gICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgICAgLy8gU2V0IHNpemUgYXMgd2lkdGhcbiAgICAgICAgICAgIGlmIChwb3NpdGlvbiA9PT0gXCJsZWZ0XCIgfHwgcG9zaXRpb24gPT09IFwicmlnaHRcIikge1xuICAgICAgICAgICAgICAgIG1vZGFsLnN0eWxlLndpZHRoID0gYCR7c2l6ZX1weGA7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvLyBTZXQgc2l6ZSBhcyBoZWlnaHRcbiAgICAgICAgICAgIGlmIChwb3NpdGlvbiA9PT0gXCJ0b3BcIiB8fCBwb3NpdGlvbiA9PT0gXCJib3R0b21cIikge1xuICAgICAgICAgICAgICAgIG1vZGFsLnN0eWxlLmhlaWdodCA9IGAke3NpemV9cHhgO1xuICAgICAgICAgICAgfVxuICAgICAgICB9LCAxMDApOyBcbiAgICAgICAgXG4gICAgICAgIC8vIFNob3cvaGlkZSBvdmVybGF5IGhlYWRlclxuICAgICAgICBpZiAoc2hvd0hlYWRlciA9PT0gZmFsc2UpIHtcbiAgICAgICAgICAgIG1vZGFsLmNsYXNzTGlzdC5hZGQoXCJwb3B1cC1vdmVybGF5LS1yZW1vdmUtaGVhZGVyXCIpO1xuICAgICAgICB9XG5cbiAgICAgICAgZG9jdW1lbnQuYm9keS5jbGFzc0xpc3QuYWRkKFwicG9wdXAtb3ZlcmxheS1ub3Njcm9sbFwiKTtcbiAgICAgICAgXG4gICAgICAgIC8vIFdhaXQgd2l0aCB0cmFuc2l0aW9ucyBpbiBjYXNlIG9mIHByb2dyZXNzYmFyXG4gICAgICAgIGZ1bmN0aW9uIGZvdW5kUHJvZ3Jlc3MoKSB7XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBwcm9ncmVzcyA9IHdhaXRGb3IoXCIubXgtcHJvZ3Jlc3NcIiwgZm91bmRQcm9ncmVzcywgZG9jdW1lbnQpO1xuICAgICAgICBpZiAocHJvZ3Jlc3MpIHtcbiAgICAgICAgICAgIHVuZGVybGF5LmNsYXNzTGlzdC5yZW1vdmUoXCJ2aXNpYmxlXCIpO1xuICAgICAgICAgICAgbW9kYWwuY2xhc3NMaXN0LnJlbW92ZShcInRyYW5zaXRpb25cIik7XG4gICAgICAgICAgICBtb2RhbC5jbGFzc0xpc3QucmVtb3ZlKFwidmlzaWJsZVwiKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgICAgICAgIGNvbnN0IHVuZGVybGF5ID0gZ2VuZXJhdGVVbmRlcmxheSgpO1xuICAgICAgICAgICAgICAgIGdlbmVyYXRlQ2xvc2VCdG4oKTtcbiAgICAgICAgICAgICAgICBsaW5rQ2xvc2VCdXR0b25zKCk7XG4gICAgICAgICAgICAgICAgc2V0VGltZW91dCgoKSA9PiB1bmRlcmxheS5jbGFzc0xpc3QuYWRkKFwidmlzaWJsZVwiKSwgMzAwKTtcbiAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KCgpID0+IG1vZGFsLmNsYXNzTGlzdC5hZGQoXCJ0cmFuc2l0aW9uXCIpLCAzMDApO1xuICAgICAgICAgICAgICAgIHNldFRpbWVvdXQoKCkgPT4gbW9kYWwuY2xhc3NMaXN0LmFkZChcInZpc2libGVcIiksIDMwMCk7XG4gICAgICAgICAgICB9LCAzMDApO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIDxkaXYgY2xhc3NOYW1lPVwiY29udmVydC1wb3B1cC10by1vdmVybGF5XCI+PC9kaXY+O1xuICAgIH1cbn1cbiJdLCJuYW1lcyI6WyJ3YWl0Rm9yIiwiZWxlbWVudENsYXNzIiwiY2FsbGJhY2siLCJwYXJlbnQiLCJjb250ZXh0IiwiZG9jdW1lbnQiLCJxdWVyeVNlbGVjdG9yIiwib2JzZXJ2ZXIiLCJNdXRhdGlvbk9ic2VydmVyIiwiZGlzY29ubmVjdCIsIm9ic2VydmUiLCJjaGlsZExpc3QiLCJzdWJ0cmVlIiwiQ29udmVydFBvcHVwVG9PdmVybGF5IiwiY2xvc2VCdXR0b25DbGFzcyIsImNsb3NlUGFnZSIsInBvc2l0aW9uIiwic2l6ZSIsInNob3dIZWFkZXIiLCJjYW5SZW5kZXIiLCJzZXRDYW5SZW5kZXIiLCJ1c2VTdGF0ZSIsIm1vZGFsIiwic2V0TW9kYWwiLCJ1c2VFZmZlY3QiLCJjbG9zZXN0IiwicmVtb3ZlVW5kZXJsYXkiLCJ1bmRlcmxheSIsImNsYXNzTGlzdCIsInJlbW92ZSIsIkFuaW1hdGVDbG9zZU1vZGFsIiwiYm9keSIsImNsb3NlTW9kYWwiLCJjbG9zZUJ0biIsInNldFRpbWVvdXQiLCJjbGljayIsImdlbmVyYXRlVW5kZXJsYXkiLCJvbGRVbmRlcmxheSIsImluc2VydEFkamFjZW50SFRNTCIsImFkZEV2ZW50TGlzdGVuZXIiLCJhZGQiLCJnZW5lcmF0ZUNsb3NlQnRuIiwibW9kYWxDb250ZW50IiwibGlua0Nsb3NlQnV0dG9ucyIsInF1ZXJ5U2VsZWN0b3JBbGwiLCJmb3JFYWNoIiwic3R5bGUiLCJ3aWR0aCIsImhlaWdodCIsImZvdW5kUHJvZ3Jlc3MiLCJwcm9ncmVzcyJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7O0FBQU8sU0FBU0EsT0FBVCxDQUFpQkMsWUFBakIsRUFBK0JDLFFBQS9CLEVBQXlDQyxNQUF6QyxFQUFpRDtBQUN0RCxRQUFNQyxPQUFPLEdBQUdELE1BQU0sSUFBSUUsUUFBMUI7O0FBRUEsTUFBSUQs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
