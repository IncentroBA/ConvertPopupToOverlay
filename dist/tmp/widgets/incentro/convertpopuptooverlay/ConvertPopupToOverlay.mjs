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

___$insertStyle(".popup-overlay {\n  max-height: 100vh;\n  max-width: 100vw;\n}\n\n.popup-overlay--top {\n  top: 0 !important;\n  right: 0 !important;\n  bottom: auto !important;\n  left: 0 !important;\n  width: 100vw !important;\n  transform: translateY(-100%);\n}\n\n.popup-overlay--right {\n  height: 100vh !important;\n  top: 0 !important;\n  right: 0 !important;\n  bottom: 0 !important;\n  left: auto !important;\n  transform: translateX(100%);\n}\n\n.popup-overlay--bottom {\n  top: auto !important;\n  right: 0 !important;\n  bottom: 0 !important;\n  left: 0 !important;\n  width: 100vw !important;\n  transform: translateY(100%);\n}\n\n.popup-overlay--left {\n  height: 100vh !important;\n  top: 0 !important;\n  right: auto !important;\n  bottom: 0 !important;\n  left: 0 !important;\n  transform: translateX(-100%);\n}\n\n.popup-overlay.transition {\n  transition: transform 0.3s cubic-bezier(0.23, 1, 0.32, 1);\n  will-change: transition;\n}\n\n.popup-overlay.transition.visible {\n  transform: translate(0%, 0%);\n}\n\n.popup-overlay .modal-header {\n  pointer-events: none;\n}\n\n.popup-overlay .modal-content {\n  border: 0;\n  border-radius: 0;\n  box-shadow: none;\n}\n\n.popup-overlay .mx-resizer {\n  display: none;\n}\n\n.popup-overlay .popup-underlay {\n  background-color: var(--underlay-color, black);\n  bottom: 0;\n  content: \"\";\n  display: block;\n  left: calc(0px - 100vw);\n  opacity: 0;\n  position: fixed;\n  transition: opacity 0.3s cubic-bezier(0.23, 1, 0.32, 1);\n  top: 0;\n  right: 0;\n  will-change: opacity;\n  z-index: -1;\n}\n\n.popup-overlay--remove-header .modal-header {\n  display: none;\n}\n\n.popup-overlay__closebutton {\n  height: 50px;\n  position: absolute;\n  right: 0;\n  top: 0;\n  width: 50px;\n}\n\n.popup-overlay__closebutton:hover {\n  cursor: pointer;\n}\n\n.popup-underlay.visible {\n  opacity: 0.45;\n}\n\n.popup-underlay.visible:hover {\n  cursor: pointer;\n}\n\nbody.popup-overlay-noscroll {\n  overflow: hidden;\n}");

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
    document.body.classList.remove("popup-overlay-noscroll");
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

    document.body.classList.add("popup-overlay-noscroll");
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
        linkCloseButtons();
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQ29udmVydFBvcHVwVG9PdmVybGF5Lm1qcyIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vc3JjL2hlbHBlcnMvd2FpdEZvci5qcyIsIi4uLy4uLy4uLy4uLy4uL3NyYy9Db252ZXJ0UG9wdXBUb092ZXJsYXkuanN4Il0sInNvdXJjZXNDb250ZW50IjpbImV4cG9ydCBmdW5jdGlvbiB3YWl0Rm9yKGVsZW1lbnRDbGFzcywgY2FsbGJhY2ssIHBhcmVudCkge1xuICBjb25zdCBjb250ZXh0ID0gcGFyZW50IHx8IGRvY3VtZW50O1xuXG4gIGlmIChjb250ZXh0LnF1ZXJ5U2VsZWN0b3IoZWxlbWVudENsYXNzKSkge1xuICAgIGNhbGxiYWNrKCk7XG4gIH0gZWxzZSB7XG4gICAgY29uc3Qgb2JzZXJ2ZXIgPSBuZXcgTXV0YXRpb25PYnNlcnZlcigoKSA9PiB7XG4gICAgICBpZiAoY29udGV4dC5xdWVyeVNlbGVjdG9yKGVsZW1lbnRDbGFzcykpIHtcbiAgICAgICAgb2JzZXJ2ZXIuZGlzY29ubmVjdCgpO1xuICAgICAgICBjYWxsYmFjaygpO1xuICAgICAgfVxuICAgIH0pO1xuICBcbiAgICAvLyBTdGFydCBvYnNlcnZpbmdcbiAgICBvYnNlcnZlci5vYnNlcnZlKGNvbnRleHQsIHtcbiAgICAgIGNoaWxkTGlzdDogdHJ1ZSwgLy9UaGlzIGlzIGEgbXVzdCBoYXZlIGZvciB0aGUgb2JzZXJ2ZXIgd2l0aCBzdWJ0cmVlXG4gICAgICBzdWJ0cmVlOiB0cnVlLCAvL1NldCB0byB0cnVlIGlmIGNoYW5nZXMgbXVzdCBhbHNvIGJlIG9ic2VydmVkIGluIGRlc2NlbmRhbnRzLlxuICAgIH0pO1xuICB9XG59OyIsIi8qIGVzbGludC1kaXNhYmxlIG5vLXVudXNlZC1leHByZXNzaW9ucyAqL1xuaW1wb3J0IFwiLi91aS9Db252ZXJ0UG9wdXBUb092ZXJsYXkuY3NzXCI7XG5pbXBvcnQgeyBjcmVhdGVFbGVtZW50LCB1c2VFZmZlY3QsIHVzZVN0YXRlIH0gZnJvbSBcInJlYWN0XCI7XG5pbXBvcnQgeyB3YWl0Rm9yIH0gZnJvbSBcIi4vaGVscGVycy93YWl0Rm9yXCI7XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIENvbnZlcnRQb3B1cFRvT3ZlcmxheSh7XG4gICAgY2xvc2VCdXR0b25DbGFzcyxcbiAgICBjbG9zZUFjdGlvbixcbiAgICBwb3NpdGlvbixcbiAgICBzaG91bGRDbG9zZVBhZ2UsXG4gICAgc2l6ZSxcbiAgICBzaG93SGVhZGVyLFxuICAgIHVuZGVybGF5Q29sb3Jcbn0pIHtcbiAgICBjb25zdCBbY2FuUmVuZGVyLCBzZXRDYW5SZW5kZXJdID0gdXNlU3RhdGUoZmFsc2UpO1xuICAgIGNvbnN0IFttb2RhbCwgc2V0TW9kYWxdID0gdXNlU3RhdGUobnVsbCk7XG5cbiAgICB1c2VFZmZlY3QoKCkgPT4ge1xuICAgICAgICBpZiAoZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5jb252ZXJ0LXBvcHVwLXRvLW92ZXJsYXlcIikpIHtcbiAgICAgICAgICAgIHNldE1vZGFsKGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIuY29udmVydC1wb3B1cC10by1vdmVybGF5XCIpLmNsb3Nlc3QoXCIubW9kYWwtZGlhbG9nXCIpKTtcbiAgICAgICAgICAgIHNldENhblJlbmRlcih0cnVlKTtcbiAgICAgICAgfVxuICAgIH0pO1xuXG4gICAgZnVuY3Rpb24gc2V0VW5kZXJsYXlDb2xvcigpIHtcbiAgICAgICAgdW5kZXJsYXlDb2xvciAmJiBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuc3R5bGUuc2V0UHJvcGVydHkoYC0tdW5kZXJsYXktY29sb3JgLCB1bmRlcmxheUNvbG9yKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiByZW1vdmVVbmRlcmxheSgpIHtcbiAgICAgICAgY29uc3QgdW5kZXJsYXkgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLnBvcHVwLXVuZGVybGF5Lm9sZFwiKTtcbiAgICAgICAgdW5kZXJsYXkgJiYgdW5kZXJsYXkuY2xhc3NMaXN0LnJlbW92ZShcInZpc2libGVcIik7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gQW5pbWF0ZUNsb3NlTW9kYWwoKSB7XG4gICAgICAgIGNvbnN0IG1vZGFsID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5wb3B1cC1vdmVybGF5XCIpO1xuICAgICAgICBtb2RhbCAmJiBtb2RhbC5jbGFzc0xpc3QucmVtb3ZlKFwidmlzaWJsZVwiKTtcbiAgICAgICAgZG9jdW1lbnQuYm9keS5jbGFzc0xpc3QucmVtb3ZlKFwicG9wdXAtb3ZlcmxheS1ub3Njcm9sbFwiKTtcbiAgICAgICAgcmVtb3ZlVW5kZXJsYXkoKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBjbG9zZU1vZGFsKCkge1xuICAgICAgICBBbmltYXRlQ2xvc2VNb2RhbCgpO1xuXG4gICAgICAgIGlmIChjbG9zZUFjdGlvbiAmJiBjbG9zZUFjdGlvbi5jYW5FeGVjdXRlKSB7XG4gICAgICAgICAgICBjbG9zZUFjdGlvbi5leGVjdXRlKCk7XG4gICAgICAgIH0gZWxzZSBpZiAoIWNsb3NlQWN0aW9uICYmIHNob3VsZENsb3NlUGFnZSA9PT0gdHJ1ZSkge1xuICAgICAgICAgICAgY29uc3QgY2xvc2VCdG4gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLnBvcHVwLW92ZXJsYXkgLmNsb3NlXCIpO1xuICAgICAgICAgICAgc2V0VGltZW91dCgoKSA9PiBjbG9zZUJ0bi5jbGljaygpLCAzMDApO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZ2VuZXJhdGVVbmRlcmxheSgpIHtcbiAgICAgICAgbW9kYWwuaW5zZXJ0QWRqYWNlbnRIVE1MKFwiYmVmb3JlZW5kXCIsICc8ZGl2IGNsYXNzPVwicG9wdXAtdW5kZXJsYXlcIj48L2Rpdj4nKTtcbiAgICAgICAgY29uc3QgdW5kZXJsYXkgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLnBvcHVwLXVuZGVybGF5Om5vdCgub2xkKVwiKTtcbiAgICAgICAgdW5kZXJsYXkgJiYgdW5kZXJsYXkuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGNsb3NlTW9kYWwpO1xuICAgICAgICB1bmRlcmxheSAmJiB1bmRlcmxheS5jbGFzc0xpc3QuYWRkKFwib2xkXCIpO1xuICAgICAgICByZXR1cm4gdW5kZXJsYXk7XG4gICAgfVxuXG4gICAgLy8gb3ZlcmxheSBmb3IgdGhlIGRlZmF1bHQgY2xvc2UgYnV0dG9uXG4gICAgZnVuY3Rpb24gZ2VuZXJhdGVDbG9zZUJ0bigpIHtcbiAgICAgICAgaWYgKHNob3dIZWFkZXIgPT09IHRydWUgJiYgc2hvdWxkQ2xvc2VQYWdlID09PSB0cnVlKSB7XG4gICAgICAgICAgICBjb25zdCBtb2RhbENvbnRlbnQgPSBtb2RhbC5xdWVyeVNlbGVjdG9yKFwiLm1vZGFsLWNvbnRlbnRcIik7XG4gICAgICAgICAgICBtb2RhbENvbnRlbnQuaW5zZXJ0QWRqYWNlbnRIVE1MKFwiYWZ0ZXJiZWdpblwiLCBgPGRpdiBjbGFzcz1cInBvcHVwLW92ZXJsYXlfX2Nsb3NlYnV0dG9uXCI+PC9kaXY+YCk7XG4gICAgICAgICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLnBvcHVwLW92ZXJsYXlfX2Nsb3NlYnV0dG9uXCIpLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBjbG9zZU1vZGFsKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIGxpbmtDbG9zZUJ1dHRvbnMoKSB7XG4gICAgICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoYC4ke2Nsb3NlQnV0dG9uQ2xhc3N9YCkuZm9yRWFjaChjbG9zZUJ0biA9PiB7XG4gICAgICAgICAgICBpZiAoc2hvdWxkQ2xvc2VQYWdlID09PSB0cnVlKSB7XG4gICAgICAgICAgICAgICAgY2xvc2VCdG4uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGNsb3NlTW9kYWwpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBjbG9zZUJ0bi5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgQW5pbWF0ZUNsb3NlTW9kYWwpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICAvLyBXYWl0IHdpdGggdHJhbnNpdGlvbnMgaW4gY2FzZSBvZiBwcm9ncmVzc2JhclxuICAgIGZ1bmN0aW9uIGZvdW5kUHJvZ3Jlc3MoKSB7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cblxuICAgIGlmIChjYW5SZW5kZXIpIHtcbiAgICAgICAgbW9kYWwuY2xhc3NMaXN0LmFkZChcInBvcHVwLW92ZXJsYXlcIiwgYHBvcHVwLW92ZXJsYXktLSR7cG9zaXRpb259YCk7XG5cbiAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgICAgICAvLyBTZXQgc2l6ZSBhcyB3aWR0aFxuICAgICAgICAgICAgaWYgKHBvc2l0aW9uID09PSBcImxlZnRcIiB8fCBwb3NpdGlvbiA9PT0gXCJyaWdodFwiKSB7XG4gICAgICAgICAgICAgICAgbW9kYWwuc3R5bGUud2lkdGggPSBgJHtzaXplfXB4YDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8vIFNldCBzaXplIGFzIGhlaWdodFxuICAgICAgICAgICAgaWYgKHBvc2l0aW9uID09PSBcInRvcFwiIHx8IHBvc2l0aW9uID09PSBcImJvdHRvbVwiKSB7XG4gICAgICAgICAgICAgICAgbW9kYWwuc3R5bGUuaGVpZ2h0ID0gYCR7c2l6ZX1weGA7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sIDEwMCk7XG5cbiAgICAgICAgLy8gU2hvdy9oaWRlIG92ZXJsYXkgaGVhZGVyXG4gICAgICAgIGlmIChzaG93SGVhZGVyID09PSBmYWxzZSkge1xuICAgICAgICAgICAgbW9kYWwuY2xhc3NMaXN0LmFkZChcInBvcHVwLW92ZXJsYXktLXJlbW92ZS1oZWFkZXJcIik7XG4gICAgICAgIH1cblxuICAgICAgICBkb2N1bWVudC5ib2R5LmNsYXNzTGlzdC5hZGQoXCJwb3B1cC1vdmVybGF5LW5vc2Nyb2xsXCIpO1xuXG4gICAgICAgIHNldFVuZGVybGF5Q29sb3IoKTtcbiAgICAgICAgY29uc3QgdW5kZXJsYXkgPSBnZW5lcmF0ZVVuZGVybGF5KCk7XG4gICAgICAgIGNvbnN0IHByb2dyZXNzID0gd2FpdEZvcihcIi5teC1wcm9ncmVzc1wiLCBmb3VuZFByb2dyZXNzLCBkb2N1bWVudCk7XG5cbiAgICAgICAgaWYgKHByb2dyZXNzKSB7XG4gICAgICAgICAgICB1bmRlcmxheS5jbGFzc0xpc3QucmVtb3ZlKFwidmlzaWJsZVwiKTtcbiAgICAgICAgICAgIG1vZGFsLmNsYXNzTGlzdC5yZW1vdmUoXCJ0cmFuc2l0aW9uXCIpO1xuICAgICAgICAgICAgbW9kYWwuY2xhc3NMaXN0LnJlbW92ZShcInZpc2libGVcIik7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgICAgICAgICBnZW5lcmF0ZUNsb3NlQnRuKCk7XG4gICAgICAgICAgICAgICAgbGlua0Nsb3NlQnV0dG9ucygpO1xuICAgICAgICAgICAgICAgIHNldFRpbWVvdXQoKCkgPT4gdW5kZXJsYXkgJiYgdW5kZXJsYXkuY2xhc3NMaXN0LmFkZChcInZpc2libGVcIiksIDMwMCk7XG4gICAgICAgICAgICAgICAgc2V0VGltZW91dCgoKSA9PiBtb2RhbCAmJiBtb2RhbC5jbGFzc0xpc3QuYWRkKFwidHJhbnNpdGlvblwiKSwgMzAwKTtcbiAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KCgpID0+IG1vZGFsICYmIG1vZGFsLmNsYXNzTGlzdC5hZGQoXCJ2aXNpYmxlXCIpLCAzMDApO1xuICAgICAgICAgICAgfSwgMzAwKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBudWxsO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiA8ZGl2IGNsYXNzTmFtZT1cImNvbnZlcnQtcG9wdXAtdG8tb3ZlcmxheVwiPjwvZGl2PjtcbiAgICB9XG59XG4iXSwibmFtZXMiOlsid2FpdEZvciIsImVsZW1lbnRDbGFzcyIsImNhbGxiYWNrIiwicGFyZW50IiwiY29udGV4dCIsImRvY3VtZW50IiwicXVlcnlTZWxlY3RvciIsIm9ic2VydmVyIiwiTXV0YXRpb25PYnNlcnZlciIsImRpc2Nvbm5lY3QiLCJvYnNlcnZlIiwiY2hpbGRMaXN0Iiwic3VidHJlZSIsIkNvbnZlcnRQb3B1cFRvT3ZlcmxheSIsImNsb3NlQnV0dG9uQ2xhc3MiLCJjbG9zZUFjdGlvbiIsInBvc2l0aW9uIiwic2hvdWxkQ2xvc2VQYWdlIiwic2l6ZSIsInNob3dIZWFkZXIiLCJ1bmRlcmxheUNvbG9yIiwiY2FuUmVuZGVyIiwic2V0Q2FuUmVuZGVyIiwidXNlU3RhdGUiLCJtb2RhbCIsInNldE1vZGFsIiwidXNlRWZmZWN0IiwiY2xvc2VzdCIsInNldFVuZGVybGF5Q29sb3IiLCJkb2N1bWVudEVsZW1lbnQiLCJzdHlsZSIsInNldFByb3BlcnR5IiwicmVtb3ZlVW5kZXJsYXkiLCJ1bmRlcmxheSIsImNsYXNzTGlzdCIsInJlbW92ZSIsIkFuaW1hdGVDbG9zZU1vZGFsIiwiYm9keSIsImNsb3NlTW9kYWwiLCJjYW5FeGVjdXRlIiwiZXhlY3V0ZSIsImNsb3NlQnRuIiwic2V0VGltZW91dCIsImNsaWNrIiwiZ2VuZXJhdGVVbmRlcmxheSIsImluc2VydEFkamFjZW50SFRNTCIsImFkZEV2ZW50TGlzdGVuZXIiLCJhZGQiLCJnZW5lcmF0ZUNsb3NlQnRuIiwibW9kYWxDb250ZW50IiwibGlua0Nsb3NlQnV0dG9ucyIsInF1ZXJ5U2VsZWN0b3JBbGwiLCJmb3JFYWNoIiwiZm91bmRQcm9ncmVzcyIsIndpZHRoIiwiaGVpZ2h0IiwicHJvZ3Jlc3MiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7OztBQUFPLFNBQVNBLE9BQVQsQ0FBaUJDLFlBQWpCLEVBQStCQyxRQUEvQixFQUF5Q0MsTUFBekMsRUFBaUQ7QUFDdEQsUUFBTUMsT0FBTyxHQUFHRCxNQUFNLElBQUlFLFFBQTFCOztBQUVBLE1BQUlELE9BQU8sQ0FBQ0UsYUFBUixDQUFzQkwsWUFBdEIsQ0FBSixFQUF5QztBQUN2Q0MsSUFBQUEsUUFBUTtBQUNULEdBRkQsTUFFTztBQUNMLFVBQU1LLFFBQVEsR0FBRyxJQUFJQyxnQkFBSixDQUFxQixNQUFNO0FBQzFDLFVBQUlKLE9BQU8sQ0FBQ0UsYUFBUixDQUFzQkwsWUFBdEIsQ0FBSixFQUF5QztBQUN2Q00sUUFBQUEsUUFBUSxDQUFDRSxVQUFUO0FBQ0FQLFFBQUFBLFFBQVE7QUFDVDtBQUNGLEtBTGdCLENBQWpCLENBREs7O0FBU0xLLElBQUFBLFFBQVEsQ0FBQ0csT0FBVCxDQUFpQk4sT0FBakIsRUFBMEI7QUFDeEJPLE1BQUFBLFNBQVMsRUFBRSxJQURhO0FBQ1A7QUFDakJDLE1BQUFBLE9BQU8sRUFBRSxJQUZlOztBQUFBLEtBQTFCO0FBSUQ7QUFDRjs7QUNuQkQ7QUFLZSxTQUFTQyxxQkFBVCxDQUErQjtBQUMxQ0MsRUFBQUEsZ0JBRDBDO0FBRTFDQyxFQUFBQSxXQUYwQztBQUcxQ0MsRUFBQUEsUUFIMEM7QUFJMUNDLEVBQUFBLGVBSjBDO0FBSzFDQyxFQUFBQSxJQUwwQztBQU0xQ0MsRUFBQUEsVUFOMEM7QUFPMUNDLEVBQUFBO0FBUDBDLENBQS9CLEVBUVo7QUFDQyxRQUFNLENBQUNDLFNBQUQsRUFBWUMsWUFBWixJQUE0QkMsUUFBUSxDQUFDLEtBQUQsQ0FBMUM7QUFDQSxRQUFNLENBQUNDLEtBQUQsRUFBUUMsUUFBUixJQUFvQkYsUUFBUSxDQUFDLElBQUQsQ0FBbEM7QUFFQUcsRUFBQUEsU0FBUyxDQUFDLE1BQU07QUFDWixRQUFJckIsUUFBUSxDQUFDQyxhQUFULENBQXVCLDJCQUF2QixDQUFKLEVBQXlEO0FBQ3JEbUIsTUFBQUEsUUFBUSxDQUFDcEIsUUFBUSxDQUFDQyxhQUFULENBQXVCLDJCQUF2QixFQUFvRHFCLE9BQXBELENBQTRELGVBQTVELENBQUQsQ0FBUjtBQUNBTCxNQUFBQSxZQUFZLENBQUMsSUFBRCxDQUFaO0FBQ0g7QUFDSixHQUxRLENBQVQ7O0FBT0EsV0FBU00sZ0JBQVQsR0FBNEI7QUFDeEJSLElBQUFBLGFBQWEsSUFBSWYsUUFBUSxDQUFDd0IsZUFBVCxDQUF5QkMsS0FBekIsQ0FBK0JDLFdBQS9CLENBQTRDLGtCQUE1QyxFQUErRFgsYUFBL0QsQ0FBakI7QUFDSDs7QUFFRCxXQUFTWSxjQUFULEdBQTBCO0FBQ3RCLFVBQU1DLFFBQVEsR0FBRzVCLFFBQVEsQ0FBQ0MsYUFBVCxDQUF1QixxQkFBdkIsQ0FBakI7QUFDQTJCLElBQUFBLFFBQVEsSUFBSUEsUUFBUSxDQUFDQyxTQUFULENBQW1CQyxNQUFuQixDQUEwQixTQUExQixDQUFaO0FBQ0g7O0FBRUQsV0FBU0MsaUJBQVQsR0FBNkI7QUFDekIsVUFBTVosS0FBSyxHQUFHbkIsUUFBUSxDQUFDQyxhQUFULENBQXVCLGdCQUF2QixDQUFkO0FBQ0FrQixJQUFBQSxLQUFLLElBQUlBLEtBQUssQ0FBQ1UsU0FBTixDQUFnQkMsTUFBaEIsQ0FBdUIsU0FBdkIsQ0FBVDtBQUNBOUIsSUFBQUEsUUFBUSxDQUFDZ0MsSUFBVCxDQUFjSCxTQUFkLENBQXdCQyxNQUF4QixDQUErQix3QkFBL0I7QUFDQUgsSUFBQUEsY0FBYztBQUNqQjs7QUFFRCxXQUFTTSxVQUFULEdBQXNCO0FBQ2xCRixJQUFBQSxpQkFBaUI7O0FBRWpCLFFBQUlyQixXQUFXLElBQUlBLFdBQVcsQ0FBQ3dCLFVBQS9CLEVBQTJDO0FBQ3ZDeEIsTUFBQUEsV0FBVyxDQUFDeUIsT0FBWjtBQUNILEtBRkQsTUFFTyxJQUFJLENBQUN6QixXQUFELElBQWdCRSxlQUFlLEtBQUssSUFBeEMsRUFBOEM7QUFDakQsWUFBTXdCLFFBQVEsR0FBR3BDLFFBQVEsQ0FBQ0MsYUFBVCxDQUF1Qix1QkFBdkIsQ0FBakI7QUFDQW9DLE1BQUFBLFVBQVUsQ0FBQyxNQUFNRCxRQUFRLENBQUNFLEtBQVQsRUFBUCxFQUF5QixHQUF6QixDQUFWO0FBQ0g7QUFDSjs7QUFFRCxXQUFTQyxnQkFBVCxHQUE0QjtBQUN4QnBCLElBQUFBLEtBQUssQ0FBQ3FCLGtCQUFOLENBQXlCLFdBQXpCLEVBQXNDLG9DQUF0QztBQUNBLFVBQU1aLFFBQVEsR0FBRzVCLFFBQVEsQ0FBQ0MsYUFBVCxDQUF1QiwyQkFBdkIsQ0FBakI7QUFDQTJCLElBQUFBLFFBQVEsSUFBSUEsUUFBUSxDQUFDYSxnQkFBVCxDQUEwQixPQUExQixFQUFtQ1IsVUFBbkMsQ0FBWjtBQUNBTCxJQUFBQSxRQUFRLElBQUlBLFFBQVEsQ0FBQ0MsU0FBVCxDQUFtQmEsR0FBbkIsQ0FBdUIsS0FBdkIsQ0FBWjtBQUNBLFdBQU9kLFFBQVA7QUFDSCxHQTVDRjs7O0FBK0NDLFdBQVNlLGdCQUFULEdBQTRCO0FBQ3hCLFFBQUk3QixVQUFVLEtBQUssSUFBZixJQUF1QkYsZUFBZSxLQUFLLElBQS9DLEVBQXFEO0FBQ2pELFlBQU1nQyxZQUFZLEdBQUd6QixLQUFLLENBQUNsQixhQUFOLENBQW9CLGdCQUFwQixDQUFyQjtBQUNBMkMsTUFBQUEsWUFBWSxDQUFDSixrQkFBYixDQUFnQyxZQUFoQyxFQUErQyxnREFBL0M7QUFDQXhDLE1BQUFBLFFBQVEsQ0FBQ0MsYUFBVCxDQUF1Qiw2QkFBdkIsRUFBc0R3QyxnQkFBdEQsQ0FBdUUsT0FBdkUsRUFBZ0ZSLFVBQWhGO0FBQ0g7QUFDSjs7QUFFRCxXQUFTWSxnQkFBVCxHQUE0QjtBQUN4QjdDLElBQUFBLFFBQVEsQ0FBQzhDLGdCQUFULENBQTJCLElBQUdyQyxnQkFBaUIsRUFBL0MsRUFBa0RzQyxPQUFsRCxDQUEwRFgsUUFBUSxJQUFJO0FBQ2xFLFVBQUl4QixlQUFlLEtBQUssSUFBeEIsRUFBOEI7QUFDMUJ3QixRQUFBQSxRQUFRLENBQUNLLGdCQUFULENBQTBCLE9BQTFCLEVBQW1DUixVQUFuQztBQUNILE9BRkQsTUFFTztBQUNIRyxRQUFBQSxRQUFRLENBQUNLLGdCQUFULENBQTBCLE9BQTFCLEVBQW1DVixpQkFBbkM7QUFDSDtBQUNKLEtBTkQ7QUFPSCxHQS9ERjs7O0FBa0VDLFdBQVNpQixhQUFULEdBQXlCO0FBQ3JCLFdBQU8sSUFBUDtBQUNIOztBQUVELE1BQUloQyxTQUFKLEVBQWU7QUFDWEcsSUFBQUEsS0FBSyxDQUFDVSxTQUFOLENBQWdCYSxHQUFoQixDQUFvQixlQUFwQixFQUFzQyxrQkFBaUIvQixRQUFTLEVBQWhFO0FBRUEwQixJQUFBQSxVQUFVLENBQUMsTUFBTTtBQUNiO0FBQ0EsVUFBSTFCLFFBQVEsS0FBSyxNQUFiLElBQXVCQSxRQUFRLEtBQUssT0FBeEMsRUFBaUQ7QUFDN0NRLFFBQUFBLEtBQUssQ0FBQ00sS0FBTixDQUFZd0IsS0FBWixHQUFxQixHQUFFcEMsSUFBSyxJQUE1QjtBQUNILE9BSlk7OztBQU1iLFVBQUlGLFFBQVEsS0FBSyxLQUFiLElBQXNCQSxRQUFRLEtBQUssUUFBdkMsRUFBaUQ7QUFDN0NRLFFBQUFBLEtBQUssQ0FBQ00sS0FBTixDQUFZeUIsTUFBWixHQUFzQixHQUFFckMsSUFBSyxJQUE3QjtBQUNIO0FBQ0osS0FUUyxFQVNQLEdBVE8sQ0FBVixDQUhXOztBQWVYLFFBQUlDLFVBQVUsS0FBSyxLQUFuQixFQUEwQjtBQUN0QkssTUFBQUEsS0FBSyxDQUFDVSxTQUFOLENBQWdCYSxHQUFoQixDQUFvQiw4QkFBcEI7QUFDSDs7QUFFRDFDLElBQUFBLFFBQVEsQ0FBQ2dDLElBQVQsQ0FBY0gsU0FBZCxDQUF3QmEsR0FBeEIsQ0FBNEIsd0JBQTVCO0FBRUFuQixJQUFBQSxnQkFBZ0I7QUFDaEIsVUFBTUssUUFBUSxHQUFHVyxnQkFBZ0IsRUFBakM7QUFDQSxVQUFNWSxRQUFRLEdBQUd4RCxPQUFPLENBQUMsY0FBRCxFQUFpQnFELGFBQWpCLEVBQWdDaEQsUUFBaEMsQ0FBeEI7O0FBRUEsUUFBSW1ELFFBQUosRUFBYztBQUNWdkIsTUFBQUEsUUFBUSxDQUFDQyxTQUFULENBQW1CQyxNQUFuQixDQUEwQixTQUExQjtBQUNBWCxNQUFBQSxLQUFLLENBQUNVLFNBQU4sQ0FBZ0JDLE1BQWhCLENBQXVCLFlBQXZCO0FBQ0FYLE1BQUFBLEtBQUssQ0FBQ1UsU0FBTixDQUFnQkMsTUFBaEIsQ0FBdUIsU0FBdkI7QUFDSCxLQUpELE1BSU87QUFDSE8sTUFBQUEsVUFBVSxDQUFDLE1BQU07QUFDYk0sUUFBQUEsZ0JBQWdCO0FBQ2hCRSxRQUFBQSxnQkFBZ0I7QUFDaEJSLFFBQUFBLFVBQVUsQ0FBQyxNQUFNVCxRQUFRLElBQUlBLFFBQVEsQ0FBQ0MsU0FBVCxDQUFtQmEsR0FBbkIsQ0FBdUIsU0FBdkIsQ0FBbkIsRUFBc0QsR0FBdEQsQ0FBVjtBQUNBTCxRQUFBQSxVQUFVLENBQUMsTUFBTWxCLEtBQUssSUFBSUEsS0FBSyxDQUFDVSxTQUFOLENBQWdCYSxHQUFoQixDQUFvQixZQUFwQixDQUFoQixFQUFtRCxHQUFuRCxDQUFWO0FBQ0FMLFFBQUFBLFVBQVUsQ0FBQyxNQUFNbEIsS0FBSyxJQUFJQSxLQUFLLENBQUNVLFNBQU4sQ0FBZ0JhLEdBQWhCLENBQW9CLFNBQXBCLENBQWhCLEVBQWdELEdBQWhELENBQVY7QUFDSCxPQU5TLEVBTVAsR0FOTyxDQUFWO0FBT0g7O0FBRUQsV0FBTyxJQUFQO0FBQ0gsR0F4Q0QsTUF3Q087QUFDSCxXQUFPO0FBQUssTUFBQSxTQUFTLEVBQUM7QUFBZixNQUFQO0FBQ0g7QUFDSjs7OzsifQ==
