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
    setTimeout(() => document.body.classList.remove("popup-overlay-noscroll"), 100);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQ29udmVydFBvcHVwVG9PdmVybGF5Lm1qcyIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vc3JjL2hlbHBlcnMvd2FpdEZvci5qcyIsIi4uLy4uLy4uLy4uLy4uL3NyYy9Db252ZXJ0UG9wdXBUb092ZXJsYXkuanN4Il0sInNvdXJjZXNDb250ZW50IjpbImV4cG9ydCBmdW5jdGlvbiB3YWl0Rm9yKGVsZW1lbnRDbGFzcywgY2FsbGJhY2ssIHBhcmVudCkge1xuICBjb25zdCBjb250ZXh0ID0gcGFyZW50IHx8IGRvY3VtZW50O1xuXG4gIGlmIChjb250ZXh0LnF1ZXJ5U2VsZWN0b3IoZWxlbWVudENsYXNzKSkge1xuICAgIGNhbGxiYWNrKCk7XG4gIH0gZWxzZSB7XG4gICAgY29uc3Qgb2JzZXJ2ZXIgPSBuZXcgTXV0YXRpb25PYnNlcnZlcigoKSA9PiB7XG4gICAgICBpZiAoY29udGV4dC5xdWVyeVNlbGVjdG9yKGVsZW1lbnRDbGFzcykpIHtcbiAgICAgICAgb2JzZXJ2ZXIuZGlzY29ubmVjdCgpO1xuICAgICAgICBjYWxsYmFjaygpO1xuICAgICAgfVxuICAgIH0pO1xuICBcbiAgICAvLyBTdGFydCBvYnNlcnZpbmdcbiAgICBvYnNlcnZlci5vYnNlcnZlKGNvbnRleHQsIHtcbiAgICAgIGNoaWxkTGlzdDogdHJ1ZSwgLy9UaGlzIGlzIGEgbXVzdCBoYXZlIGZvciB0aGUgb2JzZXJ2ZXIgd2l0aCBzdWJ0cmVlXG4gICAgICBzdWJ0cmVlOiB0cnVlLCAvL1NldCB0byB0cnVlIGlmIGNoYW5nZXMgbXVzdCBhbHNvIGJlIG9ic2VydmVkIGluIGRlc2NlbmRhbnRzLlxuICAgIH0pO1xuICB9XG59OyIsIi8qIGVzbGludC1kaXNhYmxlIG5vLXVudXNlZC1leHByZXNzaW9ucyAqL1xuaW1wb3J0IFwiLi91aS9Db252ZXJ0UG9wdXBUb092ZXJsYXkuY3NzXCI7XG5pbXBvcnQgeyBjcmVhdGVFbGVtZW50LCB1c2VFZmZlY3QsIHVzZVN0YXRlIH0gZnJvbSBcInJlYWN0XCI7XG5pbXBvcnQgeyB3YWl0Rm9yIH0gZnJvbSBcIi4vaGVscGVycy93YWl0Rm9yXCI7XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIENvbnZlcnRQb3B1cFRvT3ZlcmxheSh7XG4gICAgY2xvc2VCdXR0b25DbGFzcyxcbiAgICBjbG9zZUFjdGlvbixcbiAgICBwb3NpdGlvbixcbiAgICBzaG91bGRDbG9zZVBhZ2UsXG4gICAgc2l6ZSxcbiAgICBzaG93SGVhZGVyLFxuICAgIHVuZGVybGF5Q29sb3Jcbn0pIHtcbiAgICBjb25zdCBbY2FuUmVuZGVyLCBzZXRDYW5SZW5kZXJdID0gdXNlU3RhdGUoZmFsc2UpO1xuICAgIGNvbnN0IFttb2RhbCwgc2V0TW9kYWxdID0gdXNlU3RhdGUobnVsbCk7XG5cbiAgICB1c2VFZmZlY3QoKCkgPT4ge1xuICAgICAgICBpZiAoZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5jb252ZXJ0LXBvcHVwLXRvLW92ZXJsYXlcIikpIHtcbiAgICAgICAgICAgIHNldE1vZGFsKGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIuY29udmVydC1wb3B1cC10by1vdmVybGF5XCIpLmNsb3Nlc3QoXCIubW9kYWwtZGlhbG9nXCIpKTtcbiAgICAgICAgICAgIHNldENhblJlbmRlcih0cnVlKTtcbiAgICAgICAgfVxuICAgIH0pO1xuXG4gICAgZnVuY3Rpb24gc2V0VW5kZXJsYXlDb2xvcigpIHtcbiAgICAgICAgdW5kZXJsYXlDb2xvciAmJiBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuc3R5bGUuc2V0UHJvcGVydHkoYC0tdW5kZXJsYXktY29sb3JgLCB1bmRlcmxheUNvbG9yKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiByZW1vdmVVbmRlcmxheSgpIHtcbiAgICAgICAgY29uc3QgdW5kZXJsYXkgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLnBvcHVwLXVuZGVybGF5Lm9sZFwiKTtcbiAgICAgICAgdW5kZXJsYXkgJiYgdW5kZXJsYXkuY2xhc3NMaXN0LnJlbW92ZShcInZpc2libGVcIik7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gQW5pbWF0ZUNsb3NlTW9kYWwoKSB7XG4gICAgICAgIGNvbnN0IG1vZGFsID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5wb3B1cC1vdmVybGF5XCIpO1xuICAgICAgICBtb2RhbCAmJiBtb2RhbC5jbGFzc0xpc3QucmVtb3ZlKFwidmlzaWJsZVwiKTtcbiAgICAgICAgc2V0VGltZW91dCgoKSA9PiBkb2N1bWVudC5ib2R5LmNsYXNzTGlzdC5yZW1vdmUoXCJwb3B1cC1vdmVybGF5LW5vc2Nyb2xsXCIpLCAxMDApO1xuICAgICAgICByZW1vdmVVbmRlcmxheSgpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGNsb3NlTW9kYWwoKSB7XG4gICAgICAgIEFuaW1hdGVDbG9zZU1vZGFsKCk7XG5cbiAgICAgICAgaWYgKGNsb3NlQWN0aW9uICYmIGNsb3NlQWN0aW9uLmNhbkV4ZWN1dGUpIHtcbiAgICAgICAgICAgIGNsb3NlQWN0aW9uLmV4ZWN1dGUoKTtcbiAgICAgICAgfSBlbHNlIGlmICghY2xvc2VBY3Rpb24gJiYgc2hvdWxkQ2xvc2VQYWdlID09PSB0cnVlKSB7XG4gICAgICAgICAgICBjb25zdCBjbG9zZUJ0biA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIucG9wdXAtb3ZlcmxheSAuY2xvc2VcIik7XG4gICAgICAgICAgICBzZXRUaW1lb3V0KCgpID0+IGNsb3NlQnRuLmNsaWNrKCksIDMwMCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBmdW5jdGlvbiBnZW5lcmF0ZVVuZGVybGF5KCkge1xuICAgICAgICBtb2RhbC5pbnNlcnRBZGphY2VudEhUTUwoXCJiZWZvcmVlbmRcIiwgJzxkaXYgY2xhc3M9XCJwb3B1cC11bmRlcmxheVwiPjwvZGl2PicpO1xuICAgICAgICBjb25zdCB1bmRlcmxheSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIucG9wdXAtdW5kZXJsYXk6bm90KC5vbGQpXCIpO1xuICAgICAgICB1bmRlcmxheSAmJiB1bmRlcmxheS5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgY2xvc2VNb2RhbCk7XG4gICAgICAgIHVuZGVybGF5ICYmIHVuZGVybGF5LmNsYXNzTGlzdC5hZGQoXCJvbGRcIik7XG4gICAgICAgIHJldHVybiB1bmRlcmxheTtcbiAgICB9XG5cbiAgICAvLyBvdmVybGF5IGZvciB0aGUgZGVmYXVsdCBjbG9zZSBidXR0b25cbiAgICBmdW5jdGlvbiBnZW5lcmF0ZUNsb3NlQnRuKCkge1xuICAgICAgICBpZiAoc2hvd0hlYWRlciA9PT0gdHJ1ZSAmJiBzaG91bGRDbG9zZVBhZ2UgPT09IHRydWUpIHtcbiAgICAgICAgICAgIGNvbnN0IG1vZGFsQ29udGVudCA9IG1vZGFsLnF1ZXJ5U2VsZWN0b3IoXCIubW9kYWwtY29udGVudFwiKTtcbiAgICAgICAgICAgIG1vZGFsQ29udGVudC5pbnNlcnRBZGphY2VudEhUTUwoXCJhZnRlcmJlZ2luXCIsIGA8ZGl2IGNsYXNzPVwicG9wdXAtb3ZlcmxheV9fY2xvc2VidXR0b25cIj48L2Rpdj5gKTtcbiAgICAgICAgICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIucG9wdXAtb3ZlcmxheV9fY2xvc2VidXR0b25cIikuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGNsb3NlTW9kYWwpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gbGlua0Nsb3NlQnV0dG9ucygpIHtcbiAgICAgICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChgLiR7Y2xvc2VCdXR0b25DbGFzc31gKS5mb3JFYWNoKGNsb3NlQnRuID0+IHtcbiAgICAgICAgICAgIGlmIChzaG91bGRDbG9zZVBhZ2UgPT09IHRydWUpIHtcbiAgICAgICAgICAgICAgICBjbG9zZUJ0bi5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgY2xvc2VNb2RhbCk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGNsb3NlQnRuLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBBbmltYXRlQ2xvc2VNb2RhbCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIC8vIFdhaXQgd2l0aCB0cmFuc2l0aW9ucyBpbiBjYXNlIG9mIHByb2dyZXNzYmFyXG4gICAgZnVuY3Rpb24gZm91bmRQcm9ncmVzcygpIHtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuXG4gICAgaWYgKGNhblJlbmRlcikge1xuICAgICAgICBtb2RhbC5jbGFzc0xpc3QuYWRkKFwicG9wdXAtb3ZlcmxheVwiLCBgcG9wdXAtb3ZlcmxheS0tJHtwb3NpdGlvbn1gKTtcblxuICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgICAgIC8vIFNldCBzaXplIGFzIHdpZHRoXG4gICAgICAgICAgICBpZiAocG9zaXRpb24gPT09IFwibGVmdFwiIHx8IHBvc2l0aW9uID09PSBcInJpZ2h0XCIpIHtcbiAgICAgICAgICAgICAgICBtb2RhbC5zdHlsZS53aWR0aCA9IGAke3NpemV9cHhgO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy8gU2V0IHNpemUgYXMgaGVpZ2h0XG4gICAgICAgICAgICBpZiAocG9zaXRpb24gPT09IFwidG9wXCIgfHwgcG9zaXRpb24gPT09IFwiYm90dG9tXCIpIHtcbiAgICAgICAgICAgICAgICBtb2RhbC5zdHlsZS5oZWlnaHQgPSBgJHtzaXplfXB4YDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSwgMTAwKTtcblxuICAgICAgICAvLyBTaG93L2hpZGUgb3ZlcmxheSBoZWFkZXJcbiAgICAgICAgaWYgKHNob3dIZWFkZXIgPT09IGZhbHNlKSB7XG4gICAgICAgICAgICBtb2RhbC5jbGFzc0xpc3QuYWRkKFwicG9wdXAtb3ZlcmxheS0tcmVtb3ZlLWhlYWRlclwiKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGRvY3VtZW50LmJvZHkuY2xhc3NMaXN0LmFkZChcInBvcHVwLW92ZXJsYXktbm9zY3JvbGxcIik7XG5cbiAgICAgICAgc2V0VW5kZXJsYXlDb2xvcigpO1xuICAgICAgICBjb25zdCB1bmRlcmxheSA9IGdlbmVyYXRlVW5kZXJsYXkoKTtcbiAgICAgICAgY29uc3QgcHJvZ3Jlc3MgPSB3YWl0Rm9yKFwiLm14LXByb2dyZXNzXCIsIGZvdW5kUHJvZ3Jlc3MsIGRvY3VtZW50KTtcblxuICAgICAgICBpZiAocHJvZ3Jlc3MpIHtcbiAgICAgICAgICAgIHVuZGVybGF5LmNsYXNzTGlzdC5yZW1vdmUoXCJ2aXNpYmxlXCIpO1xuICAgICAgICAgICAgbW9kYWwuY2xhc3NMaXN0LnJlbW92ZShcInRyYW5zaXRpb25cIik7XG4gICAgICAgICAgICBtb2RhbC5jbGFzc0xpc3QucmVtb3ZlKFwidmlzaWJsZVwiKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgICAgICAgIGdlbmVyYXRlQ2xvc2VCdG4oKTtcbiAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KCgpID0+IGxpbmtDbG9zZUJ1dHRvbnMoKSwgMzAwKTtcbiAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHVuZGVybGF5ICYmIHVuZGVybGF5LmNsYXNzTGlzdC5hZGQoXCJ2aXNpYmxlXCIpLCAzMDApO1xuICAgICAgICAgICAgICAgIHNldFRpbWVvdXQoKCkgPT4gbW9kYWwgJiYgbW9kYWwuY2xhc3NMaXN0LmFkZChcInRyYW5zaXRpb25cIiksIDMwMCk7XG4gICAgICAgICAgICAgICAgc2V0VGltZW91dCgoKSA9PiBtb2RhbCAmJiBtb2RhbC5jbGFzc0xpc3QuYWRkKFwidmlzaWJsZVwiKSwgMzAwKTtcbiAgICAgICAgICAgIH0sIDMwMCk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gPGRpdiBjbGFzc05hbWU9XCJjb252ZXJ0LXBvcHVwLXRvLW92ZXJsYXlcIj48L2Rpdj47XG4gICAgfVxufVxuIl0sIm5hbWVzIjpbIndhaXRGb3IiLCJlbGVtZW50Q2xhc3MiLCJjYWxsYmFjayIsInBhcmVudCIsImNvbnRleHQiLCJkb2N1bWVudCIsInF1ZXJ5U2VsZWN0b3IiLCJvYnNlcnZlciIsIk11dGF0aW9uT2JzZXJ2ZXIiLCJkaXNjb25uZWN0Iiwib2JzZXJ2ZSIsImNoaWxkTGlzdCIsInN1YnRyZWUiLCJDb252ZXJ0UG9wdXBUb092ZXJsYXkiLCJjbG9zZUJ1dHRvbkNsYXNzIiwiY2xvc2VBY3Rpb24iLCJwb3NpdGlvbiIsInNob3VsZENsb3NlUGFnZSIsInNpemUiLCJzaG93SGVhZGVyIiwidW5kZXJsYXlDb2xvciIsImNhblJlbmRlciIsInNldENhblJlbmRlciIsInVzZVN0YXRlIiwibW9kYWwiLCJzZXRNb2RhbCIsInVzZUVmZmVjdCIsImNsb3Nlc3QiLCJzZXRVbmRlcmxheUNvbG9yIiwiZG9jdW1lbnRFbGVtZW50Iiwic3R5bGUiLCJzZXRQcm9wZXJ0eSIsInJlbW92ZVVuZGVybGF5IiwidW5kZXJsYXkiLCJjbGFzc0xpc3QiLCJyZW1vdmUiLCJBbmltYXRlQ2xvc2VNb2RhbCIsInNldFRpbWVvdXQiLCJib2R5IiwiY2xvc2VNb2RhbCIsImNhbkV4ZWN1dGUiLCJleGVjdXRlIiwiY2xvc2VCdG4iLCJjbGljayIsImdlbmVyYXRlVW5kZXJsYXkiLCJpbnNlcnRBZGphY2VudEhUTUwiLCJhZGRFdmVudExpc3RlbmVyIiwiYWRkIiwiZ2VuZXJhdGVDbG9zZUJ0biIsIm1vZGFsQ29udGVudCIsImxpbmtDbG9zZUJ1dHRvbnMiLCJxdWVyeVNlbGVjdG9yQWxsIiwiZm9yRWFjaCIsImZvdW5kUHJvZ3Jlc3MiLCJ3aWR0aCIsImhlaWdodCIsInByb2dyZXNzIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7QUFBTyxTQUFTQSxPQUFULENBQWlCQyxZQUFqQixFQUErQkMsUUFBL0IsRUFBeUNDLE1BQXpDLEVBQWlEO0FBQ3RELFFBQU1DLE9BQU8sR0FBR0QsTUFBTSxJQUFJRSxRQUExQjs7QUFFQSxNQUFJRCxPQUFPLENBQUNFLGFB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
