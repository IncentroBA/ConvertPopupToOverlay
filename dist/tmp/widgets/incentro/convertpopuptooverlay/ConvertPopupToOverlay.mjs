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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQ29udmVydFBvcHVwVG9PdmVybGF5Lm1qcyIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vc3JjL2hlbHBlcnMvd2FpdEZvci5qcyIsIi4uLy4uLy4uLy4uLy4uL3NyYy9Db252ZXJ0UG9wdXBUb092ZXJsYXkuanN4Il0sInNvdXJjZXNDb250ZW50IjpbImV4cG9ydCBmdW5jdGlvbiB3YWl0Rm9yKGVsZW1lbnRDbGFzcywgY2FsbGJhY2ssIHBhcmVudCkge1xuICBjb25zdCBjb250ZXh0ID0gcGFyZW50IHx8IGRvY3VtZW50O1xuXG4gIGlmIChjb250ZXh0LnF1ZXJ5U2VsZWN0b3IoZWxlbWVudENsYXNzKSkge1xuICAgIGNhbGxiYWNrKCk7XG4gIH0gZWxzZSB7XG4gICAgY29uc3Qgb2JzZXJ2ZXIgPSBuZXcgTXV0YXRpb25PYnNlcnZlcigoKSA9PiB7XG4gICAgICBpZiAoY29udGV4dC5xdWVyeVNlbGVjdG9yKGVsZW1lbnRDbGFzcykpIHtcbiAgICAgICAgb2JzZXJ2ZXIuZGlzY29ubmVjdCgpO1xuICAgICAgICBjYWxsYmFjaygpO1xuICAgICAgfVxuICAgIH0pO1xuICBcbiAgICAvLyBTdGFydCBvYnNlcnZpbmdcbiAgICBvYnNlcnZlci5vYnNlcnZlKGNvbnRleHQsIHtcbiAgICAgIGNoaWxkTGlzdDogdHJ1ZSwgLy9UaGlzIGlzIGEgbXVzdCBoYXZlIGZvciB0aGUgb2JzZXJ2ZXIgd2l0aCBzdWJ0cmVlXG4gICAgICBzdWJ0cmVlOiB0cnVlLCAvL1NldCB0byB0cnVlIGlmIGNoYW5nZXMgbXVzdCBhbHNvIGJlIG9ic2VydmVkIGluIGRlc2NlbmRhbnRzLlxuICAgIH0pO1xuICB9XG59OyIsIi8qIGVzbGludC1kaXNhYmxlIG5vLXVudXNlZC1leHByZXNzaW9ucyAqL1xuaW1wb3J0IFwiLi91aS9Db252ZXJ0UG9wdXBUb092ZXJsYXkuY3NzXCI7XG5pbXBvcnQgeyBjcmVhdGVFbGVtZW50LCB1c2VFZmZlY3QsIHVzZVN0YXRlIH0gZnJvbSBcInJlYWN0XCI7XG5pbXBvcnQgeyB3YWl0Rm9yIH0gZnJvbSBcIi4vaGVscGVycy93YWl0Rm9yXCI7XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIENvbnZlcnRQb3B1cFRvT3ZlcmxheSh7XG4gICAgY2xvc2VCdXR0b25DbGFzcyxcbiAgICBjbG9zZUFjdGlvbixcbiAgICBwb3NpdGlvbixcbiAgICBzaG91bGRDbG9zZVBhZ2UsXG4gICAgc2l6ZSxcbiAgICBzaG93SGVhZGVyLFxuICAgIHVuZGVybGF5Q29sb3Jcbn0pIHtcbiAgICBjb25zdCBbY2FuUmVuZGVyLCBzZXRDYW5SZW5kZXJdID0gdXNlU3RhdGUoZmFsc2UpO1xuICAgIGNvbnN0IFttb2RhbCwgc2V0TW9kYWxdID0gdXNlU3RhdGUobnVsbCk7XG5cbiAgICB1c2VFZmZlY3QoKCkgPT4ge1xuICAgICAgICBpZiAoZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5jb252ZXJ0LXBvcHVwLXRvLW92ZXJsYXlcIikpIHtcbiAgICAgICAgICAgIHNldE1vZGFsKGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIuY29udmVydC1wb3B1cC10by1vdmVybGF5XCIpLmNsb3Nlc3QoXCIubW9kYWwtZGlhbG9nXCIpKTtcbiAgICAgICAgICAgIHNldENhblJlbmRlcih0cnVlKTtcbiAgICAgICAgfVxuICAgIH0pO1xuXG4gICAgZnVuY3Rpb24gc2V0VW5kZXJsYXlDb2xvcigpIHtcbiAgICAgICAgdW5kZXJsYXlDb2xvciAmJiBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuc3R5bGUuc2V0UHJvcGVydHkoYC0tdW5kZXJsYXktY29sb3JgLCB1bmRlcmxheUNvbG9yKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiByZW1vdmVVbmRlcmxheSgpIHtcbiAgICAgICAgY29uc3QgdW5kZXJsYXkgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLnBvcHVwLXVuZGVybGF5Lm9sZFwiKTtcbiAgICAgICAgdW5kZXJsYXkgJiYgdW5kZXJsYXkuY2xhc3NMaXN0LnJlbW92ZShcInZpc2libGVcIik7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gQW5pbWF0ZUNsb3NlTW9kYWwoKSB7XG4gICAgICAgIGNvbnN0IG1vZGFsID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5wb3B1cC1vdmVybGF5XCIpO1xuICAgICAgICBtb2RhbCAmJiBtb2RhbC5jbGFzc0xpc3QucmVtb3ZlKFwidmlzaWJsZVwiKTtcbiAgICAgICAgZG9jdW1lbnQuYm9keS5jbGFzc0xpc3QucmVtb3ZlKFwicG9wdXAtb3ZlcmxheS1ub3Njcm9sbFwiKTtcbiAgICAgICAgcmVtb3ZlVW5kZXJsYXkoKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBjbG9zZU1vZGFsKCkge1xuICAgICAgICBBbmltYXRlQ2xvc2VNb2RhbCgpO1xuXG4gICAgICAgIGlmIChjbG9zZUFjdGlvbiAmJiBjbG9zZUFjdGlvbi5jYW5FeGVjdXRlKSB7XG4gICAgICAgICAgICBjbG9zZUFjdGlvbi5leGVjdXRlKCk7XG4gICAgICAgIH0gZWxzZSBpZiAoIWNsb3NlQWN0aW9uICYmIHNob3VsZENsb3NlUGFnZSA9PT0gdHJ1ZSkge1xuICAgICAgICAgICAgY29uc3QgY2xvc2VCdG4gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLnBvcHVwLW92ZXJsYXkgLmNsb3NlXCIpO1xuICAgICAgICAgICAgc2V0VGltZW91dCgoKSA9PiBjbG9zZUJ0bi5jbGljaygpLCAzMDApO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZ2VuZXJhdGVVbmRlcmxheSgpIHtcbiAgICAgICAgbW9kYWwuaW5zZXJ0QWRqYWNlbnRIVE1MKFwiYmVmb3JlZW5kXCIsICc8ZGl2IGNsYXNzPVwicG9wdXAtdW5kZXJsYXlcIj48L2Rpdj4nKTtcbiAgICAgICAgY29uc3QgdW5kZXJsYXkgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLnBvcHVwLXVuZGVybGF5Om5vdCgub2xkKVwiKTtcbiAgICAgICAgdW5kZXJsYXkgJiYgdW5kZXJsYXkuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGNsb3NlTW9kYWwpO1xuICAgICAgICB1bmRlcmxheSAmJiB1bmRlcmxheS5jbGFzc0xpc3QuYWRkKFwib2xkXCIpO1xuICAgICAgICByZXR1cm4gdW5kZXJsYXk7XG4gICAgfVxuXG4gICAgLy8gb3ZlcmxheSBmb3IgdGhlIGRlZmF1bHQgY2xvc2UgYnV0dG9uXG4gICAgZnVuY3Rpb24gZ2VuZXJhdGVDbG9zZUJ0bigpIHtcbiAgICAgICAgaWYgKHNob3dIZWFkZXIgPT09IHRydWUgJiYgc2hvdWxkQ2xvc2VQYWdlID09PSB0cnVlKSB7XG4gICAgICAgICAgICBjb25zdCBtb2RhbENvbnRlbnQgPSBtb2RhbC5xdWVyeVNlbGVjdG9yKFwiLm1vZGFsLWNvbnRlbnRcIik7XG4gICAgICAgICAgICBtb2RhbENvbnRlbnQuaW5zZXJ0QWRqYWNlbnRIVE1MKFwiYWZ0ZXJiZWdpblwiLCBgPGRpdiBjbGFzcz1cInBvcHVwLW92ZXJsYXlfX2Nsb3NlYnV0dG9uXCI+PC9kaXY+YCk7XG4gICAgICAgICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLnBvcHVwLW92ZXJsYXlfX2Nsb3NlYnV0dG9uXCIpLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBjbG9zZU1vZGFsKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIGxpbmtDbG9zZUJ1dHRvbnMoKSB7XG4gICAgICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoYC4ke2Nsb3NlQnV0dG9uQ2xhc3N9YCkuZm9yRWFjaChjbG9zZUJ0biA9PiB7XG4gICAgICAgICAgICBpZiAoc2hvdWxkQ2xvc2VQYWdlID09PSB0cnVlKSB7XG4gICAgICAgICAgICAgICAgY2xvc2VCdG4uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGNsb3NlTW9kYWwpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBjbG9zZUJ0bi5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgQW5pbWF0ZUNsb3NlTW9kYWwpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICAvLyBXYWl0IHdpdGggdHJhbnNpdGlvbnMgaW4gY2FzZSBvZiBwcm9ncmVzc2JhclxuICAgIGZ1bmN0aW9uIGZvdW5kUHJvZ3Jlc3MoKSB7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cblxuICAgIGlmIChjYW5SZW5kZXIpIHtcbiAgICAgICAgbW9kYWwuY2xhc3NMaXN0LmFkZChcInBvcHVwLW92ZXJsYXlcIiwgYHBvcHVwLW92ZXJsYXktLSR7cG9zaXRpb259YCk7XG5cbiAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgICAgICAvLyBTZXQgc2l6ZSBhcyB3aWR0aFxuICAgICAgICAgICAgaWYgKHBvc2l0aW9uID09PSBcImxlZnRcIiB8fCBwb3NpdGlvbiA9PT0gXCJyaWdodFwiKSB7XG4gICAgICAgICAgICAgICAgbW9kYWwuc3R5bGUud2lkdGggPSBgJHtzaXplfXB4YDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8vIFNldCBzaXplIGFzIGhlaWdodFxuICAgICAgICAgICAgaWYgKHBvc2l0aW9uID09PSBcInRvcFwiIHx8IHBvc2l0aW9uID09PSBcImJvdHRvbVwiKSB7XG4gICAgICAgICAgICAgICAgbW9kYWwuc3R5bGUuaGVpZ2h0ID0gYCR7c2l6ZX1weGA7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sIDEwMCk7XG5cbiAgICAgICAgLy8gU2hvdy9oaWRlIG92ZXJsYXkgaGVhZGVyXG4gICAgICAgIGlmIChzaG93SGVhZGVyID09PSBmYWxzZSkge1xuICAgICAgICAgICAgbW9kYWwuY2xhc3NMaXN0LmFkZChcInBvcHVwLW92ZXJsYXktLXJlbW92ZS1oZWFkZXJcIik7XG4gICAgICAgIH1cblxuICAgICAgICBkb2N1bWVudC5ib2R5LmNsYXNzTGlzdC5hZGQoXCJwb3B1cC1vdmVybGF5LW5vc2Nyb2xsXCIpO1xuXG4gICAgICAgIHNldFVuZGVybGF5Q29sb3IoKTtcbiAgICAgICAgY29uc3QgdW5kZXJsYXkgPSBnZW5lcmF0ZVVuZGVybGF5KCk7XG4gICAgICAgIGNvbnN0IHByb2dyZXNzID0gd2FpdEZvcihcIi5teC1wcm9ncmVzc1wiLCBmb3VuZFByb2dyZXNzLCBkb2N1bWVudCk7XG5cbiAgICAgICAgaWYgKHByb2dyZXNzKSB7XG4gICAgICAgICAgICB1bmRlcmxheS5jbGFzc0xpc3QucmVtb3ZlKFwidmlzaWJsZVwiKTtcbiAgICAgICAgICAgIG1vZGFsLmNsYXNzTGlzdC5yZW1vdmUoXCJ0cmFuc2l0aW9uXCIpO1xuICAgICAgICAgICAgbW9kYWwuY2xhc3NMaXN0LnJlbW92ZShcInZpc2libGVcIik7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgICAgICAgICBnZW5lcmF0ZUNsb3NlQnRuKCk7XG4gICAgICAgICAgICAgICAgc2V0VGltZW91dCgoKSA9PiBsaW5rQ2xvc2VCdXR0b25zKCksIDMwMCk7XG4gICAgICAgICAgICAgICAgc2V0VGltZW91dCgoKSA9PiB1bmRlcmxheSAmJiB1bmRlcmxheS5jbGFzc0xpc3QuYWRkKFwidmlzaWJsZVwiKSwgMzAwKTtcbiAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KCgpID0+IG1vZGFsICYmIG1vZGFsLmNsYXNzTGlzdC5hZGQoXCJ0cmFuc2l0aW9uXCIpLCAzMDApO1xuICAgICAgICAgICAgICAgIHNldFRpbWVvdXQoKCkgPT4gbW9kYWwgJiYgbW9kYWwuY2xhc3NMaXN0LmFkZChcInZpc2libGVcIiksIDMwMCk7XG4gICAgICAgICAgICB9LCAzMDApO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIDxkaXYgY2xhc3NOYW1lPVwiY29udmVydC1wb3B1cC10by1vdmVybGF5XCI+PC9kaXY+O1xuICAgIH1cbn1cbiJdLCJuYW1lcyI6WyJ3YWl0Rm9yIiwiZWxlbWVudENsYXNzIiwiY2FsbGJhY2siLCJwYXJlbnQiLCJjb250ZXh0IiwiZG9jdW1lbnQiLCJxdWVyeVNlbGVjdG9yIiwib2JzZXJ2ZXIiLCJNdXRhdGlvbk9ic2VydmVyIiwiZGlzY29ubmVjdCIsIm9ic2VydmUiLCJjaGlsZExpc3QiLCJzdWJ0cmVlIiwiQ29udmVydFBvcHVwVG9PdmVybGF5IiwiY2xvc2VCdXR0b25DbGFzcyIsImNsb3NlQWN0aW9uIiwicG9zaXRpb24iLCJzaG91bGRDbG9zZVBhZ2UiLCJzaXplIiwic2hvd0hlYWRlciIsInVuZGVybGF5Q29sb3IiLCJjYW5SZW5kZXIiLCJzZXRDYW5SZW5kZXIiLCJ1c2VTdGF0ZSIsIm1vZGFsIiwic2V0TW9kYWwiLCJ1c2VFZmZlY3QiLCJjbG9zZXN0Iiwic2V0VW5kZXJsYXlDb2xvciIsImRvY3VtZW50RWxlbWVudCIsInN0eWxlIiwic2V0UHJvcGVydHkiLCJyZW1vdmVVbmRlcmxheSIsInVuZGVybGF5IiwiY2xhc3NMaXN0IiwicmVtb3ZlIiwiQW5pbWF0ZUNsb3NlTW9kYWwiLCJib2R5IiwiY2xvc2VNb2RhbCIsImNhbkV4ZWN1dGUiLCJleGVjdXRlIiwiY2xvc2VCdG4iLCJzZXRUaW1lb3V0IiwiY2xpY2siLCJnZW5lcmF0ZVVuZGVybGF5IiwiaW5zZXJ0QWRqYWNlbnRIVE1MIiwiYWRkRXZlbnRMaXN0ZW5lciIsImFkZCIsImdlbmVyYXRlQ2xvc2VCdG4iLCJtb2RhbENvbnRlbnQiLCJsaW5rQ2xvc2VCdXR0b25zIiwicXVlcnlTZWxlY3RvckFsbCIsImZvckVhY2giLCJmb3VuZFByb2dyZXNzIiwid2lkdGgiLCJoZWlnaHQiLCJwcm9ncmVzcyJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7O0FBQU8sU0FBU0EsT0FBVCxDQUFpQkMsWUFBakIsRUFBK0JDLFFBQS9CLEVBQXlDQyxNQUF6QyxFQUFpRDtBQUN0RCxRQUFNQyxPQUFPLEdBQUdELE1BQU0sSUFBSUUsUUFBMUI7O0FBRUEsTUFBSUQsT0FBTyxDQUFDRSxhQUFSLENBQXNCTCxZQUF0QixDQUFKLEVBQXlDO0FBQ3ZDQyxJQUFBQSxRQUFRO0FBQ1QsR0FGRCxNQUVPO0FBQ0wsVUFBTUssUUFBUSxHQUFHLElBQUlDLGdCQUFKLENBQXFCLE1BQU07QUFDMUMsVUFBSUosT0FBTyxDQUFDRSxhQUFSLENBQXNCTCxZQUF0QixDQUFKLEVBQXlDO0FBQ3ZDTSxRQUFBQSxRQUFRLENBQUNFLFVBQVQ7QUFDQVAsUUFBQUEsUUFBUTtBQUNUO0FBQ0YsS0FMZ0IsQ0FBakIsQ0FESzs7QUFTTEssSUFBQUEsUUFBUSxDQUFDRyxPQUFULENBQWlCTixPQUFqQixFQUEwQjtBQUN4Qk8sTUFBQUEsU0FBUyxFQUFFLElBRGE7QUFDUDtBQUNqQkMsTUFBQUEsT0FBTyxFQUFFLElBRmU7O0FBQUEsS0FBMUI7QUFJRDtBQUNGOztBQ25CRDtBQUtlLFNBQVNDLHFCQUFULENBQStCO0FBQzFDQyxFQUFBQSxnQkFEMEM7QUFFMUNDLEVBQUFBLFdBRjBDO0FBRzFDQyxFQUFBQSxRQUgwQztBQUkxQ0MsRUFBQUEsZUFKMEM7QUFLMUNDLEVBQUFBLElBTDBDO0FBTTFDQyxFQUFBQSxVQU4wQztBQU8xQ0MsRUFBQUE7QUFQMEMsQ0FBL0IsRUFRWjtBQUNDLFFBQU0sQ0FBQ0MsU0FBRCxFQUFZQyxZQUFaLElBQTRCQyxRQUFRLENBQUMsS0FBRCxDQUExQztBQUNBLFFBQU0sQ0FBQ0MsS0FBRCxFQUFRQyxRQUFSLElBQW9CRixRQUFRLENBQUMsSUFBRCxDQUFsQztBQUVBRyxFQUFBQSxTQUFTLENBQUMsTUFBTTtBQUNaLFFBQUlyQixRQUFRLENBQUNDLGFBQVQsQ0FBdUIsMkJBQXZCLENBQUosRUFBeUQ7QUFDckRtQixNQUFBQSxRQUFRLENBQUNwQixRQUFRLENBQUNDLGFBQVQsQ0FBdUIsMkJBQXZCLEVBQW9EcUIsT0FBcEQsQ0FBNEQsZUFBNUQsQ0FBRCxDQUFSO0FBQ0FMLE1BQUFBLFlBQVksQ0FBQyxJQUFELENBQVo7QUFDSDtBQUNKLEdBTFEsQ0FBVDs7QUFPQSxXQUFTTSxnQkFBVCxHQUE0QjtBQUN4QlIsSUFBQUEsYUFBYSxJQUFJZixRQUFRLENBQUN3QixlQUFULENBQXlCQyxLQUF6QixDQUErQkMsV0FBL0IsQ0FBNEMsa0JBQTVDLEVBQStEWCxhQUEvRCxDQUFqQjtBQUNIOztBQUVELFdBQVNZLGNBQVQsR0FBMEI7QUFDdEIsVUFBTUMsUUFBUSxHQUFHNUIsUUFBUSxDQUFDQyxhQUFULENBQXVCLHFCQUF2QixDQUFqQjtBQUNBMkIsSUFBQUEsUUFBUSxJQUFJQSxRQUFRLENBQUNDLFNBQVQsQ0FBbUJDLE1BQW5CLENBQTBCLFNBQTFCLENBQVo7QUFDSDs7QUFFRCxXQUFTQyxpQkFBVCxHQUE2QjtBQUN6QixVQUFNWixLQUFLLEdBQUduQixRQUFRLENBQUNDLGFBQVQsQ0FBdUIsZ0JBQXZCLENBQWQ7QUFDQWtCLElBQUFBLEtBQUssSUFBSUEsS0FBSyxDQUFDVSxTQUFOLENBQWdCQyxNQUFoQixDQUF1QixTQUF2QixDQUFUO0FBQ0E5QixJQUFBQSxRQUFRLENBQUNnQyxJQUFULENBQWNILFNBQWQsQ0FBd0JDLE1BQXhCLENBQStCLHdCQUEvQjtBQUNBSCxJQUFBQSxjQUFjO0FBQ2pCOztBQUVELFdBQVNNLFVBQVQsR0FBc0I7QUFDbEJGLElBQUFBLGlCQUFpQjs7QUFFakIsUUFBSXJCLFdBQVcsSUFBSUEsV0FBVyxDQUFDd0IsVUFBL0IsRUFBMkM7QUFDdkN4QixNQUFBQSxXQUFXLENBQUN5QixPQUFaO0FBQ0gsS0FGRCxNQUVPLElBQUksQ0FBQ3pCLFdBQUQsSUFBZ0JFLGVBQWUsS0FBSyxJQUF4QyxFQUE4QztBQUNqRCxZQUFNd0IsUUFBUSxHQUFHcEMsUUFBUSxDQUFDQyxhQUFULENBQXVCLHVCQUF2QixDQUFqQjtBQUNBb0MsTUFBQUEsVUFBVSxDQUFDLE1BQU1ELFFBQVEsQ0FBQ0UsS0FBVCxFQUFQLEVBQXlCLEdBQXpCLENBQVY7QUFDSDtBQUNKOztBQUVELFdBQVNDLGdCQUFULEdBQTRCO0FBQ3hCcEIsSUFBQUEsS0FBSyxDQUFDcUIsa0JBQU4sQ0FBeUIsV0FBekIsRUFBc0Msb0NBQXRDO0FBQ0EsVUFBTVosUUFBUSxHQUFHNUIsUUFBUSxDQUFDQyxhQUFULENBQXVCLDJCQUF2QixDQUFqQjtBQUNBMkIsSUFBQUEsUUFBUSxJQUFJQSxRQUFRLENBQUNhLGdCQUFULENBQTBCLE9BQTFCLEVBQW1DUixVQUFuQyxDQUFaO0FBQ0FMLElBQUFBLFFBQVEsSUFBSUEsUUFBUSxDQUFDQyxTQUFULENBQW1CYSxHQUFuQixDQUF1QixLQUF2QixDQUFaO0FBQ0EsV0FBT2QsUUFBUDtBQUNILEdBNUNGOzs7QUErQ0MsV0FBU2UsZ0JBQVQsR0FBNEI7QUFDeEIsUUFBSTdCLFVBQVUsS0FBSyxJQUFmLElBQXVCRixlQUFlLEtBQUssSUFBL0MsRUFBcUQ7QUFDakQsWUFBTWdDLFlBQVksR0FBR3pCLEtBQUssQ0FBQ2xCLGFBQU4sQ0FBb0IsZ0JBQXBCLENBQXJCO0FBQ0EyQyxNQUFBQSxZQUFZLENBQUNKLGtCQUFiLENBQWdDLFlBQWhDLEVBQStDLGdEQUEvQztBQUNBeEMsTUFBQUEsUUFBUSxDQUFDQyxhQUFULENBQXVCLDZCQUF2QixFQUFzRHdDLGdCQUF0RCxDQUF1RSxPQUF2RSxFQUFnRlIsVUFBaEY7QUFDSDtBQUNKOztBQUVELFdBQVNZLGdCQUFULEdBQTRCO0FBQ3hCN0MsSUFBQUEsUUFBUSxDQUFDOEMsZ0JBQVQsQ0FBMkIsSUFBR3JDLGdCQUFpQixFQUEvQyxFQUFrRHNDLE9BQWxELENBQTBEWCxRQUFRLElBQUk7QUFDbEUsVUFBSXhCLGVBQWUsS0FBSyxJQUF4QixFQUE4QjtBQUMxQndCLFFBQUFBLFFBQVEsQ0FBQ0ssZ0JBQVQsQ0FBMEIsT0FBMUIsRUFBbUNSLFVBQW5DO0FBQ0gsT0FGRCxNQUVPO0FBQ0hHLFFBQUFBLFFBQVEsQ0FBQ0ssZ0JBQVQsQ0FBMEIsT0FBMUIsRUFBbUNWLGlCQUFuQztBQUNIO0FBQ0osS0FORDtBQU9ILEdBL0RGOzs7QUFrRUMsV0FBU2lCLGFBQVQsR0FBeUI7QUFDckIsV0FBTyxJQUFQO0FBQ0g7O0FBRUQsTUFBSWhDLFNBQUosRUFBZTtBQUNYRyxJQUFBQSxLQUFLLENBQUNVLFNBQU4sQ0FBZ0JhLEdBQWhCLENBQW9CLGVBQXBCLEVBQXNDLGtCQUFpQi9CLFFBQVMsRUFBaEU7QUFFQTBCLElBQUFBLFVBQVUsQ0FBQyxNQUFNO0FBQ2I7QUFDQSxVQUFJMUIsUUFBUSxLQUFLLE1BQWIsSUFBdUJBLFFBQVEsS0FBSyxPQUF4QyxFQUFpRDtBQUM3Q1EsUUFBQUEsS0FBSyxDQUFDTSxLQUFOLENBQVl3QixLQUFaLEdBQXFCLEdBQUVwQyxJQUFLLElBQTVCO0FBQ0gsT0FKWTs7O0FBTWIsVUFBSUYsUUFBUSxLQUFLLEtBQWIsSUFBc0JBLFFBQVEsS0FBSyxRQUF2QyxFQUFpRDtBQUM3Q1EsUUFBQUEsS0FBSyxDQUFDTSxLQUFOLENBQVl5QixNQUFaLEdBQXNCLEdBQUVyQyxJQUFLLElBQTdCO0FBQ0g7QUFDSixLQVRTLEVBU1AsR0FUTyxDQUFWLENBSFc7O0FBZVgsUUFBSUMsVUFBVSxLQUFLLEtBQW5CLEVBQTBCO0FBQ3RCSyxNQUFBQSxLQUFLLENBQUNVLFNBQU4sQ0FBZ0JhLEdBQWhCLENBQW9CLDhCQUFwQjtBQUNIOztBQUVEMUMsSUFBQUEsUUFBUSxDQUFDZ0MsSUFBVCxDQUFjSCxTQUFkLENBQXdCYSxHQUF4QixDQUE0Qix3QkFBNUI7QUFFQW5CLElBQUFBLGdCQUFnQjtBQUNoQixVQUFNSyxRQUFRLEdBQUdXLGdCQUFnQixFQUFqQztBQUNBLFVBQU1ZLFFBQVEsR0FBR3hELE9BQU8sQ0FBQyxjQUFELEVBQWlCcUQsYUFBakIsRUFBZ0NoRCxRQUFoQyxDQUF4Qjs7QUFFQSxRQUFJbUQsUUFBSixFQUFjO0FBQ1Z2QixNQUFBQSxRQUFRLENBQUNDLFNBQVQsQ0FBbUJDLE1BQW5CLENBQTBCLFNBQTFCO0FBQ0FYLE1BQUFBLEtBQUssQ0FBQ1UsU0FBTixDQUFnQkMsTUFBaEIsQ0FBdUIsWUFBdkI7QUFDQVgsTUFBQUEsS0FBSyxDQUFDVSxTQUFOLENBQWdCQyxNQUFoQixDQUF1QixTQUF2QjtBQUNILEtBSkQsTUFJTztBQUNITyxNQUFBQSxVQUFVLENBQUMsTUFBTTtBQUNiTSxRQUFBQSxnQkFBZ0I7QUFDaEJOLFFBQUFBLFVBQVUsQ0FBQyxNQUFNUSxnQkFBZ0IsRUFBdkIsRUFBMkIsR0FBM0IsQ0FBVjtBQUNBUixRQUFBQSxVQUFVLENBQUMsTUFBTVQsUUFBUSxJQUFJQSxRQUFRLENBQUNDLFNBQVQsQ0FBbUJhLEdBQW5CLENBQXVCLFNBQXZCLENBQW5CLEVBQXNELEdBQXRELENBQVY7QUFDQUwsUUFBQUEsVUFBVSxDQUFDLE1BQU1sQixLQUFLLElBQUlBLEtBQUssQ0FBQ1UsU0FBTixDQUFnQmEsR0FBaEIsQ0FBb0IsWUFBcEIsQ0FBaEIsRUFBbUQsR0FBbkQsQ0FBVjtBQUNBTCxRQUFBQSxVQUFVLENBQUMsTUFBTWxCLEtBQUssSUFBSUEsS0FBSyxDQUFDVSxTQUFOLENBQWdCYSxHQUFoQixDQUFvQixTQUFwQixDQUFoQixFQUFnRCxHQUFoRCxDQUFWO0FBQ0gsT0FOUyxFQU1QLEdBTk8sQ0FBVjtBQU9IOztBQUVELFdBQU8sSUFBUDtBQUNILEdBeENELE1Bd0NPO0FBQ0gsV0FBTztBQUFLLE1BQUEsU0FBUyxFQUFDO0FBQWYsTUFBUDtBQUNIO0FBQ0o7Ozs7In0=
