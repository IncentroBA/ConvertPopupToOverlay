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
  closeAction,
  shouldClosePage,
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
      const oldUnderlay = document.querySelector(".popup-underlay");

      if (!oldUnderlay) {
        removeUnderlay();
      }

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQ29udmVydFBvcHVwVG9PdmVybGF5Lm1qcyIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vc3JjL2hlbHBlcnMvd2FpdEZvci5qcyIsIi4uLy4uLy4uLy4uLy4uL3NyYy9Db252ZXJ0UG9wdXBUb092ZXJsYXkuanN4Il0sInNvdXJjZXNDb250ZW50IjpbImV4cG9ydCBmdW5jdGlvbiB3YWl0Rm9yKGVsZW1lbnRDbGFzcywgY2FsbGJhY2ssIHBhcmVudCkge1xuICBjb25zdCBjb250ZXh0ID0gcGFyZW50IHx8IGRvY3VtZW50O1xuXG4gIGlmIChjb250ZXh0LnF1ZXJ5U2VsZWN0b3IoZWxlbWVudENsYXNzKSkge1xuICAgIGNhbGxiYWNrKCk7XG4gIH0gZWxzZSB7XG4gICAgY29uc3Qgb2JzZXJ2ZXIgPSBuZXcgTXV0YXRpb25PYnNlcnZlcigoKSA9PiB7XG4gICAgICBpZiAoY29udGV4dC5xdWVyeVNlbGVjdG9yKGVsZW1lbnRDbGFzcykpIHtcbiAgICAgICAgb2JzZXJ2ZXIuZGlzY29ubmVjdCgpO1xuICAgICAgICBjYWxsYmFjaygpO1xuICAgICAgfVxuICAgIH0pO1xuICBcbiAgICAvLyBTdGFydCBvYnNlcnZpbmdcbiAgICBvYnNlcnZlci5vYnNlcnZlKGNvbnRleHQsIHtcbiAgICAgIGNoaWxkTGlzdDogdHJ1ZSwgLy9UaGlzIGlzIGEgbXVzdCBoYXZlIGZvciB0aGUgb2JzZXJ2ZXIgd2l0aCBzdWJ0cmVlXG4gICAgICBzdWJ0cmVlOiB0cnVlLCAvL1NldCB0byB0cnVlIGlmIGNoYW5nZXMgbXVzdCBhbHNvIGJlIG9ic2VydmVkIGluIGRlc2NlbmRhbnRzLlxuICAgIH0pO1xuICB9XG59OyIsIi8qIGVzbGludC1kaXNhYmxlIG5vLXVudXNlZC1leHByZXNzaW9ucyAqL1xuaW1wb3J0IFwiLi91aS9Db252ZXJ0UG9wdXBUb092ZXJsYXkuY3NzXCI7XG5pbXBvcnQgeyBjcmVhdGVFbGVtZW50LCB1c2VFZmZlY3QsIHVzZVN0YXRlIH0gZnJvbSBcInJlYWN0XCI7XG5pbXBvcnQgeyB3YWl0Rm9yIH0gZnJvbSBcIi4vaGVscGVycy93YWl0Rm9yXCI7XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIENvbnZlcnRQb3B1cFRvT3ZlcmxheSh7XG4gICAgY2xvc2VCdXR0b25DbGFzcyxcbiAgICBjbG9zZUFjdGlvbixcbiAgICBzaG91bGRDbG9zZVBhZ2UsXG4gICAgcG9zaXRpb24sXG4gICAgc2l6ZSxcbiAgICBzaG93SGVhZGVyXG59KSB7XG4gICAgY29uc3QgW2NhblJlbmRlciwgc2V0Q2FuUmVuZGVyXSA9IHVzZVN0YXRlKGZhbHNlKTtcbiAgICBjb25zdCBbbW9kYWwsIHNldE1vZGFsXSA9IHVzZVN0YXRlKG51bGwpO1xuXG4gICAgdXNlRWZmZWN0KCgpID0+IHtcbiAgICAgICAgaWYgKGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIuY29udmVydC1wb3B1cC10by1vdmVybGF5XCIpKSB7XG4gICAgICAgICAgICBzZXRNb2RhbChkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLmNvbnZlcnQtcG9wdXAtdG8tb3ZlcmxheVwiKS5jbG9zZXN0KFwiLm1vZGFsLWRpYWxvZ1wiKSk7XG4gICAgICAgICAgICBzZXRDYW5SZW5kZXIodHJ1ZSk7XG4gICAgICAgIH1cbiAgICB9KTtcblxuICAgIGlmIChjYW5SZW5kZXIpIHtcbiAgICAgICAgZnVuY3Rpb24gcmVtb3ZlVW5kZXJsYXkoKSB7XG4gICAgICAgICAgICBjb25zdCB1bmRlcmxheSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIucG9wdXAtdW5kZXJsYXlcIik7XG4gICAgICAgICAgICB1bmRlcmxheSAmJiB1bmRlcmxheS5jbGFzc0xpc3QucmVtb3ZlKFwidmlzaWJsZVwiKTtcblxuICAgICAgICAgICAgaWYgKGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIucG9wdXAtdW5kZXJsYXkub2xkOm5vdCgudmlzaWJsZSlcIikpIHtcbiAgICAgICAgICAgICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLnBvcHVwLXVuZGVybGF5Lm9sZDpub3QoLnZpc2libGUpXCIpLnJlbW92ZSgpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gQW5pbWF0ZUNsb3NlTW9kYWwoKSB7XG4gICAgICAgICAgICBjb25zdCBtb2RhbCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIucG9wdXAtb3ZlcmxheVwiKTtcbiAgICAgICAgICAgIG1vZGFsICYmIG1vZGFsLmNsYXNzTGlzdC5yZW1vdmUoXCJ2aXNpYmxlXCIpO1xuICAgICAgICAgICAgZG9jdW1lbnQuYm9keS5jbGFzc0xpc3QucmVtb3ZlKFwicG9wdXAtb3ZlcmxheS1ub3Njcm9sbFwiKTtcbiAgICAgICAgICAgIHJlbW92ZVVuZGVybGF5KCk7XG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiBjbG9zZU1vZGFsKCkge1xuICAgICAgICAgICAgQW5pbWF0ZUNsb3NlTW9kYWwoKTtcblxuICAgICAgICAgICAgaWYgKGNsb3NlQWN0aW9uICYmIGNsb3NlQWN0aW9uLmNhbkV4ZWN1dGUpIHtcbiAgICAgICAgICAgICAgICBjbG9zZUFjdGlvbi5leGVjdXRlKCk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKCFjbG9zZUFjdGlvbiAmJiBzaG91bGRDbG9zZVBhZ2UgPT09IHRydWUpIHtcbiAgICAgICAgICAgICAgICBjb25zdCBjbG9zZUJ0biA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIucG9wdXAtb3ZlcmxheSAuY2xvc2VcIik7XG4gICAgICAgICAgICAgICAgc2V0VGltZW91dCgoKSA9PiBjbG9zZUJ0bi5jbGljaygpLCAzMDApO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gZ2VuZXJhdGVVbmRlcmxheSgpIHtcbiAgICAgICAgICAgIGNvbnN0IG9sZFVuZGVybGF5ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5wb3B1cC11bmRlcmxheVwiKTtcblxuICAgICAgICAgICAgaWYgKCFvbGRVbmRlcmxheSkge1xuICAgICAgICAgICAgICAgIHJlbW92ZVVuZGVybGF5KCk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIG1vZGFsLmluc2VydEFkamFjZW50SFRNTChcImJlZm9yZWVuZFwiLCAnPGRpdiBjbGFzcz1cInBvcHVwLXVuZGVybGF5XCI+PC9kaXY+Jyk7XG4gICAgICAgICAgICBjb25zdCB1bmRlcmxheSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIucG9wdXAtdW5kZXJsYXk6bm90KC5vbGQpXCIpO1xuICAgICAgICAgICAgdW5kZXJsYXkgJiYgdW5kZXJsYXkuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGNsb3NlTW9kYWwpO1xuICAgICAgICAgICAgdW5kZXJsYXkgJiYgdW5kZXJsYXkuY2xhc3NMaXN0LmFkZChcIm9sZFwiKTtcbiAgICAgICAgICAgIHJldHVybiB1bmRlcmxheTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIG92ZXJsYXkgZm9yIHRoZSBkZWZhdWx0IGNsb3NlIGJ1dHRvblxuICAgICAgICBmdW5jdGlvbiBnZW5lcmF0ZUNsb3NlQnRuKCkge1xuICAgICAgICAgICAgaWYgKHNob3dIZWFkZXIgPT09IHRydWUgJiYgc2hvdWxkQ2xvc2VQYWdlID09PSB0cnVlKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgbW9kYWxDb250ZW50ID0gbW9kYWwucXVlcnlTZWxlY3RvcihcIi5tb2RhbC1jb250ZW50XCIpO1xuICAgICAgICAgICAgICAgIG1vZGFsQ29udGVudC5pbnNlcnRBZGphY2VudEhUTUwoXCJhZnRlcmJlZ2luXCIsIGA8ZGl2IGNsYXNzPVwicG9wdXAtb3ZlcmxheV9fY2xvc2VidXR0b25cIj48L2Rpdj5gKTtcbiAgICAgICAgICAgICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLnBvcHVwLW92ZXJsYXlfX2Nsb3NlYnV0dG9uXCIpLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBjbG9zZU1vZGFsKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIGxpbmtDbG9zZUJ1dHRvbnMoKSB7XG4gICAgICAgICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKGAuJHtjbG9zZUJ1dHRvbkNsYXNzfWApLmZvckVhY2goY2xvc2VCdG4gPT4ge1xuICAgICAgICAgICAgICAgIGlmIChzaG91bGRDbG9zZVBhZ2UgPT09IHRydWUpIHtcbiAgICAgICAgICAgICAgICAgICAgY2xvc2VCdG4uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGNsb3NlTW9kYWwpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGNsb3NlQnRuLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBBbmltYXRlQ2xvc2VNb2RhbCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cblxuICAgICAgICBtb2RhbC5jbGFzc0xpc3QuYWRkKFwicG9wdXAtb3ZlcmxheVwiLCBgcG9wdXAtb3ZlcmxheS0tJHtwb3NpdGlvbn1gKTtcblxuICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgICAgIC8vIFNldCBzaXplIGFzIHdpZHRoXG4gICAgICAgICAgICBpZiAocG9zaXRpb24gPT09IFwibGVmdFwiIHx8IHBvc2l0aW9uID09PSBcInJpZ2h0XCIpIHtcbiAgICAgICAgICAgICAgICBtb2RhbC5zdHlsZS53aWR0aCA9IGAke3NpemV9cHhgO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy8gU2V0IHNpemUgYXMgaGVpZ2h0XG4gICAgICAgICAgICBpZiAocG9zaXRpb24gPT09IFwidG9wXCIgfHwgcG9zaXRpb24gPT09IFwiYm90dG9tXCIpIHtcbiAgICAgICAgICAgICAgICBtb2RhbC5zdHlsZS5oZWlnaHQgPSBgJHtzaXplfXB4YDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSwgMTAwKTtcblxuICAgICAgICAvLyBTaG93L2hpZGUgb3ZlcmxheSBoZWFkZXJcbiAgICAgICAgaWYgKHNob3dIZWFkZXIgPT09IGZhbHNlKSB7XG4gICAgICAgICAgICBtb2RhbC5jbGFzc0xpc3QuYWRkKFwicG9wdXAtb3ZlcmxheS0tcmVtb3ZlLWhlYWRlclwiKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGRvY3VtZW50LmJvZHkuY2xhc3NMaXN0LmFkZChcInBvcHVwLW92ZXJsYXktbm9zY3JvbGxcIik7XG5cbiAgICAgICAgLy8gV2FpdCB3aXRoIHRyYW5zaXRpb25zIGluIGNhc2Ugb2YgcHJvZ3Jlc3NiYXJcbiAgICAgICAgZnVuY3Rpb24gZm91bmRQcm9ncmVzcygpIHtcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgcHJvZ3Jlc3MgPSB3YWl0Rm9yKFwiLm14LXByb2dyZXNzXCIsIGZvdW5kUHJvZ3Jlc3MsIGRvY3VtZW50KTtcbiAgICAgICAgaWYgKHByb2dyZXNzKSB7XG4gICAgICAgICAgICB1bmRlcmxheS5jbGFzc0xpc3QucmVtb3ZlKFwidmlzaWJsZVwiKTtcbiAgICAgICAgICAgIG1vZGFsLmNsYXNzTGlzdC5yZW1vdmUoXCJ0cmFuc2l0aW9uXCIpO1xuICAgICAgICAgICAgbW9kYWwuY2xhc3NMaXN0LnJlbW92ZShcInZpc2libGVcIik7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgICAgICAgICBjb25zdCB1bmRlcmxheSA9IGdlbmVyYXRlVW5kZXJsYXkoKTtcbiAgICAgICAgICAgICAgICBnZW5lcmF0ZUNsb3NlQnRuKCk7XG4gICAgICAgICAgICAgICAgbGlua0Nsb3NlQnV0dG9ucygpO1xuICAgICAgICAgICAgICAgIHNldFRpbWVvdXQoKCkgPT4gdW5kZXJsYXkgJiYgdW5kZXJsYXkuY2xhc3NMaXN0LmFkZChcInZpc2libGVcIiksIDMwMCk7XG4gICAgICAgICAgICAgICAgc2V0VGltZW91dCgoKSA9PiBtb2RhbCAmJiBtb2RhbC5jbGFzc0xpc3QuYWRkKFwidHJhbnNpdGlvblwiKSwgMzAwKTtcbiAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KCgpID0+IG1vZGFsICYmIG1vZGFsLmNsYXNzTGlzdC5hZGQoXCJ2aXNpYmxlXCIpLCAzMDApO1xuICAgICAgICAgICAgfSwgMzAwKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBudWxsO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiA8ZGl2IGNsYXNzTmFtZT1cImNvbnZlcnQtcG9wdXAtdG8tb3ZlcmxheVwiPjwvZGl2PjtcbiAgICB9XG59XG4iXSwibmFtZXMiOlsid2FpdEZvciIsImVsZW1lbnRDbGFzcyIsImNhbGxiYWNrIiwicGFyZW50IiwiY29udGV4dCIsImRvY3VtZW50IiwicXVlcnlTZWxlY3RvciIsIm9ic2VydmVyIiwiTXV0YXRpb25PYnNlcnZlciIsImRpc2Nvbm5lY3QiLCJvYnNlcnZlIiwiY2hpbGRMaXN0Iiwic3VidHJlZSIsIkNvbnZlcnRQb3B1cFRvT3ZlcmxheSIsImNsb3NlQnV0dG9uQ2xhc3MiLCJjbG9zZUFjdGlvbiIsInNob3VsZENsb3NlUGFnZSIsInBvc2l0aW9uIiwic2l6ZSIsInNob3dIZWFkZXIiLCJjYW5SZW5kZXIiLCJzZXRDYW5SZW5kZXIiLCJ1c2VTdGF0ZSIsIm1vZGFsIiwic2V0TW9kYWwiLCJ1c2VFZmZlY3QiLCJjbG9zZXN0IiwicmVtb3ZlVW5kZXJsYXkiLCJ1bmRlcmxheSIsImNsYXNzTGlzdCIsInJlbW92ZSIsIkFuaW1hdGVDbG9zZU1vZGFsIiwiYm9keSIsImNsb3NlTW9kYWwiLCJjYW5FeGVjdXRlIiwiZXhlY3V0ZSIsImNsb3NlQnRuIiwic2V0VGltZW91dCIsImNsaWNrIiwiZ2VuZXJhdGVVbmRlcmxheSIsIm9sZFVuZGVybGF5IiwiaW5zZXJ0QWRqYWNlbnRIVE1MIiwiYWRkRXZlbnRMaXN0ZW5lciIsImFkZCIsImdlbmVyYXRlQ2xvc2VCdG4iLCJtb2RhbENvbnRlbnQiLCJsaW5rQ2xvc2VCdXR0b25zIiwicXVlcnlTZWxlY3RvckFsbCIsImZvckVhY2giLCJzdHlsZSIsIndpZHRoIiwiaGVpZ2h0IiwiZm91bmRQcm9ncmVzcyIsInByb2dyZXNzIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7QUFBTyxTQUFTQSxPQUFULENBQWlCQyxZQUFqQixFQUErQkMsUUFBL0IsRUFBeUNDLE1BQXpDLEVBQWlEO0FBQ3RELFFBQU1DLE9BQU8sR0FBR0QsTUFBTSxJQUFJRSxRQUExQjs7QUFFQSxNQUFJRCxPQUFPLENBQUNFLGFBQVIsQ0FBc0JMLFlBQXRCLENBQUosRUFBeUM7QUFDdkNDLElBQUFBLFFBQVE7QUFDVCxHQUZELE1BRU87QUFDTCxVQUFNSyxRQUFRLEdBQUcsSUFBSUMsZ0JBQUosQ0FBcUIsTUFBTTtBQUMxQyxVQUFJSixPQUFPLENBQUNFLGFBQVIsQ0FBc0JMLFlBQXRCLENBQUosRUFBeUM7QUFDdkNNLFFBQUFBLFFBQVEsQ0FBQ0UsVUFBVDtBQUNBUCxRQUFBQSxRQUFRO0FBQ1Q7QUFDRixLQUxnQixDQUFqQixDQURLOztBQVNMSyxJQUFBQSxRQUFRLENBQUNHLE9BQVQsQ0FBaUJOLE9BQWpCLEVBQTBCO0FBQ3hCTyxNQUFBQSxTQUFTLEVBQUUsSUFEYTtBQUNQO0FBQ2pCQyxNQUFBQSxPQUFPLEVBQUUsSUFGZTs7QUFBQSxLQUExQjtBQUlEO0FBQ0Y7O0FDbkJEO0FBS2UsU0FBU0MscUJBQVQsQ0FBK0I7QUFDMUNDLEVBQUFBLGdCQUQwQztBQUUxQ0MsRUFBQUEsV0FGMEM7QUFHMUNDLEVBQUFBLGVBSDBDO0FBSTFDQyxFQUFBQSxRQUowQztBQUsxQ0MsRUFBQUEsSUFMMEM7QUFNMUNDLEVBQUFBO0FBTjBDLENBQS9CLEVBT1o7QUFDQyxRQUFNLENBQUNDLFNBQUQsRUFBWUMsWUFBWixJQUE0QkMsUUFBUSxDQUFDLEtBQUQsQ0FBMUM7QUFDQSxRQUFNLENBQUNDLEtBQUQsRUFBUUMsUUFBUixJQUFvQkYsUUFBUSxDQUFDLElBQUQsQ0FBbEM7QUFFQUcsRUFBQUEsU0FBUyxD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
