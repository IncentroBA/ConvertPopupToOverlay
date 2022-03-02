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

___$insertStyle(".popup-overlay {\n  max-height: 100vh;\n  max-width: 100vw;\n}\n\n.popup-overlay--top {\n  top: 0 !important;\n  right: 0 !important;\n  bottom: auto !important;\n  left: 0 !important;\n  width: 100vw !important;\n  transform: translateY(-100%);\n}\n\n.popup-overlay--right {\n  height: 100vh !important;\n  top: 0 !important;\n  right: 0 !important;\n  bottom: 0 !important;\n  left: auto !important;\n  transform: translateX(100%);\n}\n\n.popup-overlay--bottom {\n  top: auto !important;\n  right: 0 !important;\n  bottom: 0 !important;\n  left: 0 !important;\n  width: 100vw !important;\n  transform: translateY(100%);\n}\n\n.popup-overlay--left {\n  height: 100vh !important;\n  top: 0 !important;\n  right: auto !important;\n  bottom: 0 !important;\n  left: 0 !important;\n  transform: translateX(-100%);\n}\n\n.popup-overlay.transition {\n  transition: transform 0.3s cubic-bezier(0.23, 1, 0.32, 1);\n  will-change: transition;\n}\n\n.popup-overlay.transition.visible {\n  transform: translate(0%, 0%);\n}\n\n.popup-overlay .modal-header {\n  pointer-events: none;\n}\n\n.popup-overlay .modal-content {\n  border: 0;\n  border-radius: 0;\n  box-shadow: none;\n}\n\n.popup-overlay .mx-resizer {\n  display: none;\n}\n\n.popup-overlay .popup-underlay {\n  background-color: var(--underlay-color, black);\n  bottom: calc(0px - 100vh);\n  content: \"\";\n  display: block;\n  left: calc(0px - 100vw);\n  opacity: 0;\n  position: fixed;\n  transition: opacity 0.3s cubic-bezier(0.23, 1, 0.32, 1);\n  top: calc(0px - 100vh);\n  right: calc(0px - 100vw);\n  will-change: opacity;\n  z-index: -1;\n}\n\n.popup-overlay--remove-header .modal-header {\n  display: none;\n}\n\n.popup-overlay__closebutton {\n  height: 50px;\n  position: absolute;\n  right: 0;\n  top: 0;\n  width: 50px;\n}\n\n.popup-overlay__closebutton:hover {\n  cursor: pointer;\n}\n\n.popup-underlay.visible {\n  opacity: 0.45;\n}\n\n.popup-underlay.visible:hover {\n  cursor: pointer;\n}\n\nbody.popup-overlay-noscroll {\n  overflow: hidden;\n}");

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
  bodyNoScroll,
  closeButtonClass,
  closeAction,
  position,
  shouldClosePage,
  size,
  showHeader,
  underlayColor
}) {
  const [canRender, setCanRender] = useState(false);
  const [modal, setModal] = useState(null);
  useEffect(() => {
    if (document.querySelector(".convert-popup-to-overlay")) {
      setModal(document.querySelector(".convert-popup-to-overlay").closest(".modal-dialog"));
      setCanRender(true);
    }
  });

  function setUnderlayColor() {
    underlayColor && document.documentElement.style.setProperty(`--underlay-color`, underlayColor);
  }

  function removeUnderlay() {
    const underlay = document.querySelector(".popup-underlay.old");
    underlay && underlay.classList.remove("visible");
  }

  function AnimateCloseModal() {
    const modal = document.querySelector(".popup-overlay");
    modal && modal.classList.remove("visible");
    bodyNoScroll === true && setTimeout(() => document.body.classList.remove("popup-overlay-noscroll"), 100);
    removeUnderlay();
  }

  function closeModal() {
    AnimateCloseModal();

    if (closeAction && closeAction.canExecute) {
      closeAction.execute();
    } else if (!closeAction && shouldClosePage === true) {
      const closeBtn = document.querySelector(".popup-overlay .close");
      setTimeout(() => closeBtn.click(), 300);
    }
  }

  function generateUnderlay() {
    modal.insertAdjacentHTML("beforeend", '<div class="popup-underlay"></div>');
    const underlay = document.querySelector(".popup-underlay:not(.old)");
    underlay && underlay.addEventListener("click", closeModal);
    underlay && underlay.classList.add("old");
    return underlay;
  } // overlay for the default close button


  function generateCloseBtn() {
    if (showHeader === true && shouldClosePage === true) {
      const modalContent = modal.querySelector(".modal-content");
      modalContent.insertAdjacentHTML("afterbegin", `<div class="popup-overlay__closebutton"></div>`);
      document.querySelector(".popup-overlay__closebutton").addEventListener("click", closeModal);
    }
  }

  function linkCloseButtons() {
    document.querySelectorAll(`.${closeButtonClass}`).forEach(closeBtn => {
      if (shouldClosePage === true) {
        closeBtn.addEventListener("click", closeModal);
      } else {
        closeBtn.addEventListener("click", AnimateCloseModal);
      }
    });
  } // Wait with transitions in case of progressbar


  function foundProgress() {
    return true;
  }

  if (canRender) {
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

    bodyNoScroll === true && document.body.classList.add("popup-overlay-noscroll");
    setUnderlayColor();
    const underlay = generateUnderlay();
    const progress = waitFor(".mx-progress", foundProgress, document);

    if (progress) {
      underlay.classList.remove("visible");
      modal.classList.remove("transition");
      modal.classList.remove("visible");
    } else {
      setTimeout(() => {
        generateCloseBtn();
        setTimeout(() => linkCloseButtons(), 300);
        setTimeout(() => underlay && underlay.classList.add("visible"), 300);
        setTimeout(() => modal && modal.classList.add("transition"), 300);
        setTimeout(() => modal && modal.classList.add("visible"), 300);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQ29udmVydFBvcHVwVG9PdmVybGF5Lm1qcyIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vc3JjL2hlbHBlcnMvd2FpdEZvci5qcyIsIi4uLy4uLy4uLy4uLy4uL3NyYy9Db252ZXJ0UG9wdXBUb092ZXJsYXkuanN4Il0sInNvdXJjZXNDb250ZW50IjpbImV4cG9ydCBmdW5jdGlvbiB3YWl0Rm9yKGVsZW1lbnRDbGFzcywgY2FsbGJhY2ssIHBhcmVudCkge1xuICBjb25zdCBjb250ZXh0ID0gcGFyZW50IHx8IGRvY3VtZW50O1xuXG4gIGlmIChjb250ZXh0LnF1ZXJ5U2VsZWN0b3IoZWxlbWVudENsYXNzKSkge1xuICAgIGNhbGxiYWNrKCk7XG4gIH0gZWxzZSB7XG4gICAgY29uc3Qgb2JzZXJ2ZXIgPSBuZXcgTXV0YXRpb25PYnNlcnZlcigoKSA9PiB7XG4gICAgICBpZiAoY29udGV4dC5xdWVyeVNlbGVjdG9yKGVsZW1lbnRDbGFzcykpIHtcbiAgICAgICAgb2JzZXJ2ZXIuZGlzY29ubmVjdCgpO1xuICAgICAgICBjYWxsYmFjaygpO1xuICAgICAgfVxuICAgIH0pO1xuICBcbiAgICAvLyBTdGFydCBvYnNlcnZpbmdcbiAgICBvYnNlcnZlci5vYnNlcnZlKGNvbnRleHQsIHtcbiAgICAgIGNoaWxkTGlzdDogdHJ1ZSwgLy9UaGlzIGlzIGEgbXVzdCBoYXZlIGZvciB0aGUgb2JzZXJ2ZXIgd2l0aCBzdWJ0cmVlXG4gICAgICBzdWJ0cmVlOiB0cnVlLCAvL1NldCB0byB0cnVlIGlmIGNoYW5nZXMgbXVzdCBhbHNvIGJlIG9ic2VydmVkIGluIGRlc2NlbmRhbnRzLlxuICAgIH0pO1xuICB9XG59OyIsIi8qIGVzbGludC1kaXNhYmxlIG5vLXVudXNlZC1leHByZXNzaW9ucyAqL1xuaW1wb3J0IFwiLi91aS9Db252ZXJ0UG9wdXBUb092ZXJsYXkuY3NzXCI7XG5pbXBvcnQgeyBjcmVhdGVFbGVtZW50LCB1c2VFZmZlY3QsIHVzZVN0YXRlIH0gZnJvbSBcInJlYWN0XCI7XG5pbXBvcnQgeyB3YWl0Rm9yIH0gZnJvbSBcIi4vaGVscGVycy93YWl0Rm9yXCI7XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIENvbnZlcnRQb3B1cFRvT3ZlcmxheSh7XG4gICAgYm9keU5vU2Nyb2xsLFxuICAgIGNsb3NlQnV0dG9uQ2xhc3MsXG4gICAgY2xvc2VBY3Rpb24sXG4gICAgcG9zaXRpb24sXG4gICAgc2hvdWxkQ2xvc2VQYWdlLFxuICAgIHNpemUsXG4gICAgc2hvd0hlYWRlcixcbiAgICB1bmRlcmxheUNvbG9yXG59KSB7XG4gICAgY29uc3QgW2NhblJlbmRlciwgc2V0Q2FuUmVuZGVyXSA9IHVzZVN0YXRlKGZhbHNlKTtcbiAgICBjb25zdCBbbW9kYWwsIHNldE1vZGFsXSA9IHVzZVN0YXRlKG51bGwpO1xuXG4gICAgdXNlRWZmZWN0KCgpID0+IHtcbiAgICAgICAgaWYgKGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIuY29udmVydC1wb3B1cC10by1vdmVybGF5XCIpKSB7XG4gICAgICAgICAgICBzZXRNb2RhbChkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLmNvbnZlcnQtcG9wdXAtdG8tb3ZlcmxheVwiKS5jbG9zZXN0KFwiLm1vZGFsLWRpYWxvZ1wiKSk7XG4gICAgICAgICAgICBzZXRDYW5SZW5kZXIodHJ1ZSk7XG4gICAgICAgIH1cbiAgICB9KTtcblxuICAgIGZ1bmN0aW9uIHNldFVuZGVybGF5Q29sb3IoKSB7XG4gICAgICAgIHVuZGVybGF5Q29sb3IgJiYgZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LnN0eWxlLnNldFByb3BlcnR5KGAtLXVuZGVybGF5LWNvbG9yYCwgdW5kZXJsYXlDb2xvcik7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gcmVtb3ZlVW5kZXJsYXkoKSB7XG4gICAgICAgIGNvbnN0IHVuZGVybGF5ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5wb3B1cC11bmRlcmxheS5vbGRcIik7XG4gICAgICAgIHVuZGVybGF5ICYmIHVuZGVybGF5LmNsYXNzTGlzdC5yZW1vdmUoXCJ2aXNpYmxlXCIpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIEFuaW1hdGVDbG9zZU1vZGFsKCkge1xuICAgICAgICBjb25zdCBtb2RhbCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIucG9wdXAtb3ZlcmxheVwiKTtcbiAgICAgICAgbW9kYWwgJiYgbW9kYWwuY2xhc3NMaXN0LnJlbW92ZShcInZpc2libGVcIik7XG4gICAgICAgIGJvZHlOb1Njcm9sbCA9PT0gdHJ1ZSAmJiBzZXRUaW1lb3V0KCgpID0+IGRvY3VtZW50LmJvZHkuY2xhc3NMaXN0LnJlbW92ZShcInBvcHVwLW92ZXJsYXktbm9zY3JvbGxcIiksIDEwMCk7XG4gICAgICAgIHJlbW92ZVVuZGVybGF5KCk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gY2xvc2VNb2RhbCgpIHtcbiAgICAgICAgQW5pbWF0ZUNsb3NlTW9kYWwoKTtcblxuICAgICAgICBpZiAoY2xvc2VBY3Rpb24gJiYgY2xvc2VBY3Rpb24uY2FuRXhlY3V0ZSkge1xuICAgICAgICAgICAgY2xvc2VBY3Rpb24uZXhlY3V0ZSgpO1xuICAgICAgICB9IGVsc2UgaWYgKCFjbG9zZUFjdGlvbiAmJiBzaG91bGRDbG9zZVBhZ2UgPT09IHRydWUpIHtcbiAgICAgICAgICAgIGNvbnN0IGNsb3NlQnRuID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5wb3B1cC1vdmVybGF5IC5jbG9zZVwiKTtcbiAgICAgICAgICAgIHNldFRpbWVvdXQoKCkgPT4gY2xvc2VCdG4uY2xpY2soKSwgMzAwKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIGdlbmVyYXRlVW5kZXJsYXkoKSB7XG4gICAgICAgIG1vZGFsLmluc2VydEFkamFjZW50SFRNTChcImJlZm9yZWVuZFwiLCAnPGRpdiBjbGFzcz1cInBvcHVwLXVuZGVybGF5XCI+PC9kaXY+Jyk7XG4gICAgICAgIGNvbnN0IHVuZGVybGF5ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5wb3B1cC11bmRlcmxheTpub3QoLm9sZClcIik7XG4gICAgICAgIHVuZGVybGF5ICYmIHVuZGVybGF5LmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBjbG9zZU1vZGFsKTtcbiAgICAgICAgdW5kZXJsYXkgJiYgdW5kZXJsYXkuY2xhc3NMaXN0LmFkZChcIm9sZFwiKTtcbiAgICAgICAgcmV0dXJuIHVuZGVybGF5O1xuICAgIH1cblxuICAgIC8vIG92ZXJsYXkgZm9yIHRoZSBkZWZhdWx0IGNsb3NlIGJ1dHRvblxuICAgIGZ1bmN0aW9uIGdlbmVyYXRlQ2xvc2VCdG4oKSB7XG4gICAgICAgIGlmIChzaG93SGVhZGVyID09PSB0cnVlICYmIHNob3VsZENsb3NlUGFnZSA9PT0gdHJ1ZSkge1xuICAgICAgICAgICAgY29uc3QgbW9kYWxDb250ZW50ID0gbW9kYWwucXVlcnlTZWxlY3RvcihcIi5tb2RhbC1jb250ZW50XCIpO1xuICAgICAgICAgICAgbW9kYWxDb250ZW50Lmluc2VydEFkamFjZW50SFRNTChcImFmdGVyYmVnaW5cIiwgYDxkaXYgY2xhc3M9XCJwb3B1cC1vdmVybGF5X19jbG9zZWJ1dHRvblwiPjwvZGl2PmApO1xuICAgICAgICAgICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5wb3B1cC1vdmVybGF5X19jbG9zZWJ1dHRvblwiKS5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgY2xvc2VNb2RhbCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBmdW5jdGlvbiBsaW5rQ2xvc2VCdXR0b25zKCkge1xuICAgICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKGAuJHtjbG9zZUJ1dHRvbkNsYXNzfWApLmZvckVhY2goY2xvc2VCdG4gPT4ge1xuICAgICAgICAgICAgaWYgKHNob3VsZENsb3NlUGFnZSA9PT0gdHJ1ZSkge1xuICAgICAgICAgICAgICAgIGNsb3NlQnRuLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBjbG9zZU1vZGFsKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgY2xvc2VCdG4uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIEFuaW1hdGVDbG9zZU1vZGFsKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgLy8gV2FpdCB3aXRoIHRyYW5zaXRpb25zIGluIGNhc2Ugb2YgcHJvZ3Jlc3NiYXJcbiAgICBmdW5jdGlvbiBmb3VuZFByb2dyZXNzKCkge1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG5cbiAgICBpZiAoY2FuUmVuZGVyKSB7XG4gICAgICAgIG1vZGFsLmNsYXNzTGlzdC5hZGQoXCJwb3B1cC1vdmVybGF5XCIsIGBwb3B1cC1vdmVybGF5LS0ke3Bvc2l0aW9ufWApO1xuXG4gICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgICAgLy8gU2V0IHNpemUgYXMgd2lkdGhcbiAgICAgICAgICAgIGlmIChwb3NpdGlvbiA9PT0gXCJsZWZ0XCIgfHwgcG9zaXRpb24gPT09IFwicmlnaHRcIikge1xuICAgICAgICAgICAgICAgIG1vZGFsLnN0eWxlLndpZHRoID0gYCR7c2l6ZX1weGA7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvLyBTZXQgc2l6ZSBhcyBoZWlnaHRcbiAgICAgICAgICAgIGlmIChwb3NpdGlvbiA9PT0gXCJ0b3BcIiB8fCBwb3NpdGlvbiA9PT0gXCJib3R0b21cIikge1xuICAgICAgICAgICAgICAgIG1vZGFsLnN0eWxlLmhlaWdodCA9IGAke3NpemV9cHhgO1xuICAgICAgICAgICAgfVxuICAgICAgICB9LCAxMDApO1xuXG4gICAgICAgIC8vIFNob3cvaGlkZSBvdmVybGF5IGhlYWRlclxuICAgICAgICBpZiAoc2hvd0hlYWRlciA9PT0gZmFsc2UpIHtcbiAgICAgICAgICAgIG1vZGFsLmNsYXNzTGlzdC5hZGQoXCJwb3B1cC1vdmVybGF5LS1yZW1vdmUtaGVhZGVyXCIpO1xuICAgICAgICB9XG5cbiAgICAgICAgYm9keU5vU2Nyb2xsID09PSB0cnVlICYmIGRvY3VtZW50LmJvZHkuY2xhc3NMaXN0LmFkZChcInBvcHVwLW92ZXJsYXktbm9zY3JvbGxcIik7XG5cbiAgICAgICAgc2V0VW5kZXJsYXlDb2xvcigpO1xuICAgICAgICBjb25zdCB1bmRlcmxheSA9IGdlbmVyYXRlVW5kZXJsYXkoKTtcbiAgICAgICAgY29uc3QgcHJvZ3Jlc3MgPSB3YWl0Rm9yKFwiLm14LXByb2dyZXNzXCIsIGZvdW5kUHJvZ3Jlc3MsIGRvY3VtZW50KTtcblxuICAgICAgICBpZiAocHJvZ3Jlc3MpIHtcbiAgICAgICAgICAgIHVuZGVybGF5LmNsYXNzTGlzdC5yZW1vdmUoXCJ2aXNpYmxlXCIpO1xuICAgICAgICAgICAgbW9kYWwuY2xhc3NMaXN0LnJlbW92ZShcInRyYW5zaXRpb25cIik7XG4gICAgICAgICAgICBtb2RhbC5jbGFzc0xpc3QucmVtb3ZlKFwidmlzaWJsZVwiKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgICAgICAgIGdlbmVyYXRlQ2xvc2VCdG4oKTtcbiAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KCgpID0+IGxpbmtDbG9zZUJ1dHRvbnMoKSwgMzAwKTtcbiAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHVuZGVybGF5ICYmIHVuZGVybGF5LmNsYXNzTGlzdC5hZGQoXCJ2aXNpYmxlXCIpLCAzMDApO1xuICAgICAgICAgICAgICAgIHNldFRpbWVvdXQoKCkgPT4gbW9kYWwgJiYgbW9kYWwuY2xhc3NMaXN0LmFkZChcInRyYW5zaXRpb25cIiksIDMwMCk7XG4gICAgICAgICAgICAgICAgc2V0VGltZW91dCgoKSA9PiBtb2RhbCAmJiBtb2RhbC5jbGFzc0xpc3QuYWRkKFwidmlzaWJsZVwiKSwgMzAwKTtcbiAgICAgICAgICAgIH0sIDMwMCk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gPGRpdiBjbGFzc05hbWU9XCJjb252ZXJ0LXBvcHVwLXRvLW92ZXJsYXlcIj48L2Rpdj47XG4gICAgfVxufVxuIl0sIm5hbWVzIjpbIndhaXRGb3IiLCJlbGVtZW50Q2xhc3MiLCJjYWxsYmFjayIsInBhcmVudCIsImNvbnRleHQiLCJkb2N1bWVudCIsInF1ZXJ5U2VsZWN0b3IiLCJvYnNlcnZlciIsIk11dGF0aW9uT2JzZXJ2ZXIiLCJkaXNjb25uZWN0Iiwib2JzZXJ2ZSIsImNoaWxkTGlzdCIsInN1YnRyZWUiLCJDb252ZXJ0UG9wdXBUb092ZXJsYXkiLCJib2R5Tm9TY3JvbGwiLCJjbG9zZUJ1dHRvbkNsYXNzIiwiY2xvc2VBY3Rpb24iLCJwb3NpdGlvbiIsInNob3VsZENsb3NlUGFnZSIsInNpemUiLCJzaG93SGVhZGVyIiwidW5kZXJsYXlDb2xvciIsImNhblJlbmRlciIsInNldENhblJlbmRlciIsInVzZVN0YXRlIiwibW9kYWwiLCJzZXRNb2RhbCIsInVzZUVmZmVjdCIsImNsb3Nlc3QiLCJzZXRVbmRlcmxheUNvbG9yIiwiZG9jdW1lbnRFbGVtZW50Iiwic3R5bGUiLCJzZXRQcm9wZXJ0eSIsInJlbW92ZVVuZGVybGF5IiwidW5kZXJsYXkiLCJjbGFzc0xpc3QiLCJyZW1vdmUiLCJBbmltYXRlQ2xvc2VNb2RhbCIsInNldFRpbWVvdXQiLCJib2R5IiwiY2xvc2VNb2RhbCIsImNhbkV4ZWN1dGUiLCJleGVjdXRlIiwiY2xvc2VCdG4iLCJjbGljayIsImdlbmVyYXRlVW5kZXJsYXkiLCJpbnNlcnRBZGphY2VudEhUTUwiLCJhZGRFdmVudExpc3RlbmVyIiwiYWRkIiwiZ2VuZXJhdGVDbG9zZUJ0biIsIm1vZGFsQ29udGVudCIsImxpbmtDbG9zZUJ1dHRvbnMiLCJxdWVyeVNlbGVjdG9yQWxsIiwiZm9yRWFjaCIsImZvdW5kUHJvZ3Jlc3MiLCJ3aWR0aCIsImhlaWdodCIsInByb2dyZXNzIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7QUFBTyxTQUFTQSxPQUFULENBQWlCQyxZQUFqQixFQUErQkMsUUFBL0Is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
