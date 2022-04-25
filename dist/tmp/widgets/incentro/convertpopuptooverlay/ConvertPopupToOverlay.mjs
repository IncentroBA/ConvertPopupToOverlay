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
    underlay?.addEventListener("click", closeModal);
    underlay?.classList.add("old");
    return underlay;
  } // overlay for the default close button


  function generateCloseBtn() {
    if (showHeader === true && shouldClosePage === true) {
      const modalContent = modal.querySelector(".modal-content");
      modalContent.insertAdjacentHTML("afterbegin", `<div class="popup-overlay__closebutton"></div>`);
      document.querySelector(".popup-overlay__closebutton")?.addEventListener("click", closeModal);
    }
  }

  function linkCloseButtons() {
    document.querySelectorAll(`.${closeButtonClass}`).forEach(closeBtn => {
      if (shouldClosePage === true) {
        closeBtn?.addEventListener("click", closeModal);
      } else {
        closeBtn?.addEventListener("click", AnimateCloseModal);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQ29udmVydFBvcHVwVG9PdmVybGF5Lm1qcyIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vc3JjL2hlbHBlcnMvd2FpdEZvci5qcyIsIi4uLy4uLy4uLy4uLy4uL3NyYy9Db252ZXJ0UG9wdXBUb092ZXJsYXkuanN4Il0sInNvdXJjZXNDb250ZW50IjpbImV4cG9ydCBmdW5jdGlvbiB3YWl0Rm9yKGVsZW1lbnRDbGFzcywgY2FsbGJhY2ssIHBhcmVudCkge1xuICBjb25zdCBjb250ZXh0ID0gcGFyZW50IHx8IGRvY3VtZW50O1xuXG4gIGlmIChjb250ZXh0LnF1ZXJ5U2VsZWN0b3IoZWxlbWVudENsYXNzKSkge1xuICAgIGNhbGxiYWNrKCk7XG4gIH0gZWxzZSB7XG4gICAgY29uc3Qgb2JzZXJ2ZXIgPSBuZXcgTXV0YXRpb25PYnNlcnZlcigoKSA9PiB7XG4gICAgICBpZiAoY29udGV4dC5xdWVyeVNlbGVjdG9yKGVsZW1lbnRDbGFzcykpIHtcbiAgICAgICAgb2JzZXJ2ZXIuZGlzY29ubmVjdCgpO1xuICAgICAgICBjYWxsYmFjaygpO1xuICAgICAgfVxuICAgIH0pO1xuICBcbiAgICAvLyBTdGFydCBvYnNlcnZpbmdcbiAgICBvYnNlcnZlci5vYnNlcnZlKGNvbnRleHQsIHtcbiAgICAgIGNoaWxkTGlzdDogdHJ1ZSwgLy9UaGlzIGlzIGEgbXVzdCBoYXZlIGZvciB0aGUgb2JzZXJ2ZXIgd2l0aCBzdWJ0cmVlXG4gICAgICBzdWJ0cmVlOiB0cnVlLCAvL1NldCB0byB0cnVlIGlmIGNoYW5nZXMgbXVzdCBhbHNvIGJlIG9ic2VydmVkIGluIGRlc2NlbmRhbnRzLlxuICAgIH0pO1xuICB9XG59OyIsIi8qIGVzbGludC1kaXNhYmxlIG5vLXVudXNlZC1leHByZXNzaW9ucyAqL1xuaW1wb3J0IFwiLi91aS9Db252ZXJ0UG9wdXBUb092ZXJsYXkuY3NzXCI7XG5pbXBvcnQgeyBjcmVhdGVFbGVtZW50LCB1c2VFZmZlY3QsIHVzZVN0YXRlIH0gZnJvbSBcInJlYWN0XCI7XG5pbXBvcnQgeyB3YWl0Rm9yIH0gZnJvbSBcIi4vaGVscGVycy93YWl0Rm9yXCI7XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIENvbnZlcnRQb3B1cFRvT3ZlcmxheSh7XG4gICAgYm9keU5vU2Nyb2xsLFxuICAgIGNsb3NlQnV0dG9uQ2xhc3MsXG4gICAgY2xvc2VBY3Rpb24sXG4gICAgcG9zaXRpb24sXG4gICAgc2hvdWxkQ2xvc2VQYWdlLFxuICAgIHNpemUsXG4gICAgc2hvd0hlYWRlcixcbiAgICB1bmRlcmxheUNvbG9yXG59KSB7XG4gICAgY29uc3QgW2NhblJlbmRlciwgc2V0Q2FuUmVuZGVyXSA9IHVzZVN0YXRlKGZhbHNlKTtcbiAgICBjb25zdCBbbW9kYWwsIHNldE1vZGFsXSA9IHVzZVN0YXRlKG51bGwpO1xuXG4gICAgdXNlRWZmZWN0KCgpID0+IHtcbiAgICAgICAgaWYgKGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIuY29udmVydC1wb3B1cC10by1vdmVybGF5XCIpKSB7XG4gICAgICAgICAgICBzZXRNb2RhbChkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLmNvbnZlcnQtcG9wdXAtdG8tb3ZlcmxheVwiKS5jbG9zZXN0KFwiLm1vZGFsLWRpYWxvZ1wiKSk7XG4gICAgICAgICAgICBzZXRDYW5SZW5kZXIodHJ1ZSk7XG4gICAgICAgIH1cbiAgICB9KTtcblxuICAgIGZ1bmN0aW9uIHNldFVuZGVybGF5Q29sb3IoKSB7XG4gICAgICAgIHVuZGVybGF5Q29sb3IgJiYgZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LnN0eWxlLnNldFByb3BlcnR5KGAtLXVuZGVybGF5LWNvbG9yYCwgdW5kZXJsYXlDb2xvcik7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gcmVtb3ZlVW5kZXJsYXkoKSB7XG4gICAgICAgIGNvbnN0IHVuZGVybGF5ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5wb3B1cC11bmRlcmxheS5vbGRcIik7XG4gICAgICAgIHVuZGVybGF5ICYmIHVuZGVybGF5LmNsYXNzTGlzdC5yZW1vdmUoXCJ2aXNpYmxlXCIpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIEFuaW1hdGVDbG9zZU1vZGFsKCkge1xuICAgICAgICBjb25zdCBtb2RhbCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIucG9wdXAtb3ZlcmxheVwiKTtcbiAgICAgICAgbW9kYWwgJiYgbW9kYWwuY2xhc3NMaXN0LnJlbW92ZShcInZpc2libGVcIik7XG4gICAgICAgIGJvZHlOb1Njcm9sbCA9PT0gdHJ1ZSAmJiBzZXRUaW1lb3V0KCgpID0+IGRvY3VtZW50LmJvZHkuY2xhc3NMaXN0LnJlbW92ZShcInBvcHVwLW92ZXJsYXktbm9zY3JvbGxcIiksIDEwMCk7XG4gICAgICAgIHJlbW92ZVVuZGVybGF5KCk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gY2xvc2VNb2RhbCgpIHtcbiAgICAgICAgQW5pbWF0ZUNsb3NlTW9kYWwoKTtcblxuICAgICAgICBpZiAoY2xvc2VBY3Rpb24gJiYgY2xvc2VBY3Rpb24uY2FuRXhlY3V0ZSkge1xuICAgICAgICAgICAgY2xvc2VBY3Rpb24uZXhlY3V0ZSgpO1xuICAgICAgICB9IGVsc2UgaWYgKCFjbG9zZUFjdGlvbiAmJiBzaG91bGRDbG9zZVBhZ2UgPT09IHRydWUpIHtcbiAgICAgICAgICAgIGNvbnN0IGNsb3NlQnRuID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5wb3B1cC1vdmVybGF5IC5jbG9zZVwiKTtcbiAgICAgICAgICAgIHNldFRpbWVvdXQoKCkgPT4gY2xvc2VCdG4uY2xpY2soKSwgMzAwKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIGdlbmVyYXRlVW5kZXJsYXkoKSB7XG4gICAgICAgIG1vZGFsLmluc2VydEFkamFjZW50SFRNTChcImJlZm9yZWVuZFwiLCAnPGRpdiBjbGFzcz1cInBvcHVwLXVuZGVybGF5XCI+PC9kaXY+Jyk7XG4gICAgICAgIGNvbnN0IHVuZGVybGF5ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5wb3B1cC11bmRlcmxheTpub3QoLm9sZClcIik7XG4gICAgICAgIHVuZGVybGF5Py5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgY2xvc2VNb2RhbCk7XG4gICAgICAgIHVuZGVybGF5Py5jbGFzc0xpc3QuYWRkKFwib2xkXCIpO1xuICAgICAgICByZXR1cm4gdW5kZXJsYXk7XG4gICAgfVxuXG4gICAgLy8gb3ZlcmxheSBmb3IgdGhlIGRlZmF1bHQgY2xvc2UgYnV0dG9uXG4gICAgZnVuY3Rpb24gZ2VuZXJhdGVDbG9zZUJ0bigpIHtcbiAgICAgICAgaWYgKHNob3dIZWFkZXIgPT09IHRydWUgJiYgc2hvdWxkQ2xvc2VQYWdlID09PSB0cnVlKSB7XG4gICAgICAgICAgICBjb25zdCBtb2RhbENvbnRlbnQgPSBtb2RhbC5xdWVyeVNlbGVjdG9yKFwiLm1vZGFsLWNvbnRlbnRcIik7XG4gICAgICAgICAgICBtb2RhbENvbnRlbnQuaW5zZXJ0QWRqYWNlbnRIVE1MKFwiYWZ0ZXJiZWdpblwiLCBgPGRpdiBjbGFzcz1cInBvcHVwLW92ZXJsYXlfX2Nsb3NlYnV0dG9uXCI+PC9kaXY+YCk7XG4gICAgICAgICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLnBvcHVwLW92ZXJsYXlfX2Nsb3NlYnV0dG9uXCIpPy5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgY2xvc2VNb2RhbCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBmdW5jdGlvbiBsaW5rQ2xvc2VCdXR0b25zKCkge1xuICAgICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKGAuJHtjbG9zZUJ1dHRvbkNsYXNzfWApLmZvckVhY2goY2xvc2VCdG4gPT4ge1xuICAgICAgICAgICAgaWYgKHNob3VsZENsb3NlUGFnZSA9PT0gdHJ1ZSkge1xuICAgICAgICAgICAgICAgIGNsb3NlQnRuPy5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgY2xvc2VNb2RhbCk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGNsb3NlQnRuPy5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgQW5pbWF0ZUNsb3NlTW9kYWwpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICAvLyBXYWl0IHdpdGggdHJhbnNpdGlvbnMgaW4gY2FzZSBvZiBwcm9ncmVzc2JhclxuICAgIGZ1bmN0aW9uIGZvdW5kUHJvZ3Jlc3MoKSB7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cblxuICAgIGlmIChjYW5SZW5kZXIpIHtcbiAgICAgICAgbW9kYWwuY2xhc3NMaXN0LmFkZChcInBvcHVwLW92ZXJsYXlcIiwgYHBvcHVwLW92ZXJsYXktLSR7cG9zaXRpb259YCk7XG5cbiAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgICAgICAvLyBTZXQgc2l6ZSBhcyB3aWR0aFxuICAgICAgICAgICAgaWYgKHBvc2l0aW9uID09PSBcImxlZnRcIiB8fCBwb3NpdGlvbiA9PT0gXCJyaWdodFwiKSB7XG4gICAgICAgICAgICAgICAgbW9kYWwuc3R5bGUud2lkdGggPSBgJHtzaXplfXB4YDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8vIFNldCBzaXplIGFzIGhlaWdodFxuICAgICAgICAgICAgaWYgKHBvc2l0aW9uID09PSBcInRvcFwiIHx8IHBvc2l0aW9uID09PSBcImJvdHRvbVwiKSB7XG4gICAgICAgICAgICAgICAgbW9kYWwuc3R5bGUuaGVpZ2h0ID0gYCR7c2l6ZX1weGA7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sIDEwMCk7XG5cbiAgICAgICAgLy8gU2hvdy9oaWRlIG92ZXJsYXkgaGVhZGVyXG4gICAgICAgIGlmIChzaG93SGVhZGVyID09PSBmYWxzZSkge1xuICAgICAgICAgICAgbW9kYWwuY2xhc3NMaXN0LmFkZChcInBvcHVwLW92ZXJsYXktLXJlbW92ZS1oZWFkZXJcIik7XG4gICAgICAgIH1cblxuICAgICAgICBib2R5Tm9TY3JvbGwgPT09IHRydWUgJiYgZG9jdW1lbnQuYm9keS5jbGFzc0xpc3QuYWRkKFwicG9wdXAtb3ZlcmxheS1ub3Njcm9sbFwiKTtcblxuICAgICAgICBzZXRVbmRlcmxheUNvbG9yKCk7XG4gICAgICAgIGNvbnN0IHVuZGVybGF5ID0gZ2VuZXJhdGVVbmRlcmxheSgpO1xuICAgICAgICBjb25zdCBwcm9ncmVzcyA9IHdhaXRGb3IoXCIubXgtcHJvZ3Jlc3NcIiwgZm91bmRQcm9ncmVzcywgZG9jdW1lbnQpO1xuXG4gICAgICAgIGlmIChwcm9ncmVzcykge1xuICAgICAgICAgICAgdW5kZXJsYXkuY2xhc3NMaXN0LnJlbW92ZShcInZpc2libGVcIik7XG4gICAgICAgICAgICBtb2RhbC5jbGFzc0xpc3QucmVtb3ZlKFwidHJhbnNpdGlvblwiKTtcbiAgICAgICAgICAgIG1vZGFsLmNsYXNzTGlzdC5yZW1vdmUoXCJ2aXNpYmxlXCIpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgICAgICAgICAgZ2VuZXJhdGVDbG9zZUJ0bigpO1xuICAgICAgICAgICAgICAgIHNldFRpbWVvdXQoKCkgPT4gbGlua0Nsb3NlQnV0dG9ucygpLCAzMDApO1xuICAgICAgICAgICAgICAgIHNldFRpbWVvdXQoKCkgPT4gdW5kZXJsYXkgJiYgdW5kZXJsYXkuY2xhc3NMaXN0LmFkZChcInZpc2libGVcIiksIDMwMCk7XG4gICAgICAgICAgICAgICAgc2V0VGltZW91dCgoKSA9PiBtb2RhbCAmJiBtb2RhbC5jbGFzc0xpc3QuYWRkKFwidHJhbnNpdGlvblwiKSwgMzAwKTtcbiAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KCgpID0+IG1vZGFsICYmIG1vZGFsLmNsYXNzTGlzdC5hZGQoXCJ2aXNpYmxlXCIpLCAzMDApO1xuICAgICAgICAgICAgfSwgMzAwKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBudWxsO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiA8ZGl2IGNsYXNzTmFtZT1cImNvbnZlcnQtcG9wdXAtdG8tb3ZlcmxheVwiPjwvZGl2PjtcbiAgICB9XG59XG4iXSwibmFtZXMiOlsid2FpdEZvciIsImVsZW1lbnRDbGFzcyIsImNhbGxiYWNrIiwicGFyZW50IiwiY29udGV4dCIsImRvY3VtZW50IiwicXVlcnlTZWxlY3RvciIsIm9ic2VydmVyIiwiTXV0YXRpb25PYnNlcnZlciIsImRpc2Nvbm5lY3QiLCJvYnNlcnZlIiwiY2hpbGRMaXN0Iiwic3VidHJlZSIsIkNvbnZlcnRQb3B1cFRvT3ZlcmxheSIsImJvZHlOb1Njcm9sbCIsImNsb3NlQnV0dG9uQ2xhc3MiLCJjbG9zZUFjdGlvbiIsInBvc2l0aW9uIiwic2hvdWxkQ2xvc2VQYWdlIiwic2l6ZSIsInNob3dIZWFkZXIiLCJ1bmRlcmxheUNvbG9yIiwiY2FuUmVuZGVyIiwic2V0Q2FuUmVuZGVyIiwidXNlU3RhdGUiLCJtb2RhbCIsInNldE1vZGFsIiwidXNlRWZmZWN0IiwiY2xvc2VzdCIsInNldFVuZGVybGF5Q29sb3IiLCJkb2N1bWVudEVsZW1lbnQiLCJzdHlsZSIsInNldFByb3BlcnR5IiwicmVtb3ZlVW5kZXJsYXkiLCJ1bmRlcmxheSIsImNsYXNzTGlzdCIsInJlbW92ZSIsIkFuaW1hdGVDbG9zZU1vZGFsIiwic2V0VGltZW91dCIsImJvZHkiLCJjbG9zZU1vZGFsIiwiY2FuRXhlY3V0ZSIsImV4ZWN1dGUiLCJjbG9zZUJ0biIsImNsaWNrIiwiZ2VuZXJhdGVVbmRlcmxheSIsImluc2VydEFkamFjZW50SFRNTCIsImFkZEV2ZW50TGlzdGVuZXIiLCJhZGQiLCJnZW5lcmF0ZUNsb3NlQnRuIiwibW9kYWxDb250ZW50IiwibGlua0Nsb3NlQnV0dG9ucyIsInF1ZXJ5U2VsZWN0b3JBbGwiLCJmb3JFYWNoIiwiZm91bmRQcm9ncmVzcyIsIndpZHRoIiwiaGVpZ2h0IiwicHJvZ3Jlc3MiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7OztBQUFPLFNBQVNBLE9BQVQsQ0FBaUJDLFlBQWpCLEVBQStCQyxRQUEvQixFQUF5Q0MsTUFBekMsRUFBaUQ7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
