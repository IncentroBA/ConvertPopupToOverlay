import { useState, useEffect, createElement } from 'react';

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

    return () => {
      setTimeout(() => {
        if (!document.querySelector(".popup-overlay")) {
          document.body.classList.remove("popup-overlay-noscroll");
        }
      }, 300);
    };
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

      document.body.classList.add("popup-overlay-noscroll");
    }, 100);
    showHeader === false && modal.classList.add("popup-overlay--remove-header");
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
        underlay && underlay.classList.add("visible");
        setTimeout(() => modal && modal.classList.add("transition"), 100);
        setTimeout(() => modal && modal.classList.add("visible"), 100);
      }, 200);
    }

    return null;
  } else {
    return createElement("div", {
      className: "convert-popup-to-overlay"
    });
  }
}

export { ConvertPopupToOverlay as default };
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQ29udmVydFBvcHVwVG9PdmVybGF5Lm1qcyIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vc3JjL2hlbHBlcnMvd2FpdEZvci5qcyIsIi4uLy4uLy4uLy4uLy4uL3NyYy9Db252ZXJ0UG9wdXBUb092ZXJsYXkuanN4Il0sInNvdXJjZXNDb250ZW50IjpbImV4cG9ydCBmdW5jdGlvbiB3YWl0Rm9yKGVsZW1lbnRDbGFzcywgY2FsbGJhY2ssIHBhcmVudCkge1xuICBjb25zdCBjb250ZXh0ID0gcGFyZW50IHx8IGRvY3VtZW50O1xuXG4gIGlmIChjb250ZXh0LnF1ZXJ5U2VsZWN0b3IoZWxlbWVudENsYXNzKSkge1xuICAgIGNhbGxiYWNrKCk7XG4gIH0gZWxzZSB7XG4gICAgY29uc3Qgb2JzZXJ2ZXIgPSBuZXcgTXV0YXRpb25PYnNlcnZlcigoKSA9PiB7XG4gICAgICBpZiAoY29udGV4dC5xdWVyeVNlbGVjdG9yKGVsZW1lbnRDbGFzcykpIHtcbiAgICAgICAgb2JzZXJ2ZXIuZGlzY29ubmVjdCgpO1xuICAgICAgICBjYWxsYmFjaygpO1xuICAgICAgfVxuICAgIH0pO1xuICBcbiAgICAvLyBTdGFydCBvYnNlcnZpbmdcbiAgICBvYnNlcnZlci5vYnNlcnZlKGNvbnRleHQsIHtcbiAgICAgIGNoaWxkTGlzdDogdHJ1ZSwgLy9UaGlzIGlzIGEgbXVzdCBoYXZlIGZvciB0aGUgb2JzZXJ2ZXIgd2l0aCBzdWJ0cmVlXG4gICAgICBzdWJ0cmVlOiB0cnVlLCAvL1NldCB0byB0cnVlIGlmIGNoYW5nZXMgbXVzdCBhbHNvIGJlIG9ic2VydmVkIGluIGRlc2NlbmRhbnRzLlxuICAgIH0pO1xuICB9XG59OyIsImltcG9ydCBcIi4vdWkvQ29udmVydFBvcHVwVG9PdmVybGF5LmNzc1wiO1xuaW1wb3J0IHsgY3JlYXRlRWxlbWVudCwgdXNlRWZmZWN0LCB1c2VTdGF0ZSB9IGZyb20gXCJyZWFjdFwiO1xuaW1wb3J0IHsgd2FpdEZvciB9IGZyb20gXCIuL2hlbHBlcnMvd2FpdEZvclwiO1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBDb252ZXJ0UG9wdXBUb092ZXJsYXkoe1xuICAgIGNsb3NlQnV0dG9uQ2xhc3MsXG4gICAgY2xvc2VBY3Rpb24sXG4gICAgcG9zaXRpb24sXG4gICAgc2hvdWxkQ2xvc2VQYWdlLFxuICAgIHNpemUsXG4gICAgc2hvd0hlYWRlcixcbiAgICB1bmRlcmxheUNvbG9yXG59KSB7XG4gICAgY29uc3QgW2NhblJlbmRlciwgc2V0Q2FuUmVuZGVyXSA9IHVzZVN0YXRlKGZhbHNlKTtcbiAgICBjb25zdCBbbW9kYWwsIHNldE1vZGFsXSA9IHVzZVN0YXRlKG51bGwpO1xuXG4gICAgdXNlRWZmZWN0KCgpID0+IHtcbiAgICAgICAgaWYgKGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIuY29udmVydC1wb3B1cC10by1vdmVybGF5XCIpKSB7XG4gICAgICAgICAgICBzZXRNb2RhbChkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLmNvbnZlcnQtcG9wdXAtdG8tb3ZlcmxheVwiKS5jbG9zZXN0KFwiLm1vZGFsLWRpYWxvZ1wiKSk7XG4gICAgICAgICAgICBzZXRDYW5SZW5kZXIodHJ1ZSk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gKCkgPT4ge1xuICAgICAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKCFkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLnBvcHVwLW92ZXJsYXlcIikpIHtcbiAgICAgICAgICAgICAgICAgICAgZG9jdW1lbnQuYm9keS5jbGFzc0xpc3QucmVtb3ZlKFwicG9wdXAtb3ZlcmxheS1ub3Njcm9sbFwiKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9LCAzMDApO1xuICAgICAgICB9O1xuICAgIH0pO1xuXG4gICAgZnVuY3Rpb24gc2V0VW5kZXJsYXlDb2xvcigpIHtcbiAgICAgICAgdW5kZXJsYXlDb2xvciAmJiBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuc3R5bGUuc2V0UHJvcGVydHkoYC0tdW5kZXJsYXktY29sb3JgLCB1bmRlcmxheUNvbG9yKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiByZW1vdmVVbmRlcmxheSgpIHtcbiAgICAgICAgY29uc3QgdW5kZXJsYXkgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLnBvcHVwLXVuZGVybGF5Lm9sZFwiKTtcbiAgICAgICAgdW5kZXJsYXkgJiYgdW5kZXJsYXkuY2xhc3NMaXN0LnJlbW92ZShcInZpc2libGVcIik7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gQW5pbWF0ZUNsb3NlTW9kYWwoKSB7XG4gICAgICAgIGNvbnN0IG1vZGFsID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5wb3B1cC1vdmVybGF5XCIpO1xuICAgICAgICBtb2RhbCAmJiBtb2RhbC5jbGFzc0xpc3QucmVtb3ZlKFwidmlzaWJsZVwiKTtcbiAgICAgICAgc2V0VGltZW91dCgoKSA9PiBkb2N1bWVudC5ib2R5LmNsYXNzTGlzdC5yZW1vdmUoXCJwb3B1cC1vdmVybGF5LW5vc2Nyb2xsXCIpLCAxMDApO1xuICAgICAgICByZW1vdmVVbmRlcmxheSgpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGNsb3NlTW9kYWwoKSB7XG4gICAgICAgIEFuaW1hdGVDbG9zZU1vZGFsKCk7XG5cbiAgICAgICAgaWYgKGNsb3NlQWN0aW9uICYmIGNsb3NlQWN0aW9uLmNhbkV4ZWN1dGUpIHtcbiAgICAgICAgICAgIGNsb3NlQWN0aW9uLmV4ZWN1dGUoKTtcbiAgICAgICAgfSBlbHNlIGlmICghY2xvc2VBY3Rpb24gJiYgc2hvdWxkQ2xvc2VQYWdlID09PSB0cnVlKSB7XG4gICAgICAgICAgICBjb25zdCBjbG9zZUJ0biA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIucG9wdXAtb3ZlcmxheSAuY2xvc2VcIik7XG4gICAgICAgICAgICBzZXRUaW1lb3V0KCgpID0+IGNsb3NlQnRuLmNsaWNrKCksIDMwMCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBmdW5jdGlvbiBnZW5lcmF0ZVVuZGVybGF5KCkge1xuICAgICAgICBtb2RhbC5pbnNlcnRBZGphY2VudEhUTUwoXCJiZWZvcmVlbmRcIiwgJzxkaXYgY2xhc3M9XCJwb3B1cC11bmRlcmxheVwiPjwvZGl2PicpO1xuICAgICAgICBjb25zdCB1bmRlcmxheSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIucG9wdXAtdW5kZXJsYXk6bm90KC5vbGQpXCIpO1xuICAgICAgICB1bmRlcmxheT8uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGNsb3NlTW9kYWwpO1xuICAgICAgICB1bmRlcmxheT8uY2xhc3NMaXN0LmFkZChcIm9sZFwiKTtcbiAgICAgICAgcmV0dXJuIHVuZGVybGF5O1xuICAgIH1cblxuICAgIC8vIG92ZXJsYXkgZm9yIHRoZSBkZWZhdWx0IGNsb3NlIGJ1dHRvblxuICAgIGZ1bmN0aW9uIGdlbmVyYXRlQ2xvc2VCdG4oKSB7XG4gICAgICAgIGlmIChzaG93SGVhZGVyID09PSB0cnVlICYmIHNob3VsZENsb3NlUGFnZSA9PT0gdHJ1ZSkge1xuICAgICAgICAgICAgY29uc3QgbW9kYWxDb250ZW50ID0gbW9kYWwucXVlcnlTZWxlY3RvcihcIi5tb2RhbC1jb250ZW50XCIpO1xuICAgICAgICAgICAgbW9kYWxDb250ZW50Lmluc2VydEFkamFjZW50SFRNTChcImFmdGVyYmVnaW5cIiwgYDxkaXYgY2xhc3M9XCJwb3B1cC1vdmVybGF5X19jbG9zZWJ1dHRvblwiPjwvZGl2PmApO1xuICAgICAgICAgICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5wb3B1cC1vdmVybGF5X19jbG9zZWJ1dHRvblwiKT8uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGNsb3NlTW9kYWwpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gbGlua0Nsb3NlQnV0dG9ucygpIHtcbiAgICAgICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChgLiR7Y2xvc2VCdXR0b25DbGFzc31gKS5mb3JFYWNoKGNsb3NlQnRuID0+IHtcbiAgICAgICAgICAgIGlmIChzaG91bGRDbG9zZVBhZ2UgPT09IHRydWUpIHtcbiAgICAgICAgICAgICAgICBjbG9zZUJ0bj8uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGNsb3NlTW9kYWwpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBjbG9zZUJ0bj8uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIEFuaW1hdGVDbG9zZU1vZGFsKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgLy8gV2FpdCB3aXRoIHRyYW5zaXRpb25zIGluIGNhc2Ugb2YgcHJvZ3Jlc3NiYXJcbiAgICBmdW5jdGlvbiBmb3VuZFByb2dyZXNzKCkge1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG5cbiAgICBpZiAoY2FuUmVuZGVyKSB7XG4gICAgICAgIG1vZGFsLmNsYXNzTGlzdC5hZGQoXCJwb3B1cC1vdmVybGF5XCIsIGBwb3B1cC1vdmVybGF5LS0ke3Bvc2l0aW9ufWApO1xuICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgICAgIC8vIFNldCBzaXplIGFzIHdpZHRoXG4gICAgICAgICAgICBpZiAocG9zaXRpb24gPT09IFwibGVmdFwiIHx8IHBvc2l0aW9uID09PSBcInJpZ2h0XCIpIHtcbiAgICAgICAgICAgICAgICBtb2RhbC5zdHlsZS53aWR0aCA9IGAke3NpemV9cHhgO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy8gU2V0IHNpemUgYXMgaGVpZ2h0XG4gICAgICAgICAgICBpZiAocG9zaXRpb24gPT09IFwidG9wXCIgfHwgcG9zaXRpb24gPT09IFwiYm90dG9tXCIpIHtcbiAgICAgICAgICAgICAgICBtb2RhbC5zdHlsZS5oZWlnaHQgPSBgJHtzaXplfXB4YDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGRvY3VtZW50LmJvZHkuY2xhc3NMaXN0LmFkZChcInBvcHVwLW92ZXJsYXktbm9zY3JvbGxcIik7XG4gICAgICAgIH0sIDEwMCk7XG4gICAgICAgIHNob3dIZWFkZXIgPT09IGZhbHNlICYmIG1vZGFsLmNsYXNzTGlzdC5hZGQoXCJwb3B1cC1vdmVybGF5LS1yZW1vdmUtaGVhZGVyXCIpO1xuICAgICAgICBzZXRVbmRlcmxheUNvbG9yKCk7XG4gICAgICAgIGNvbnN0IHVuZGVybGF5ID0gZ2VuZXJhdGVVbmRlcmxheSgpO1xuICAgICAgICBjb25zdCBwcm9ncmVzcyA9IHdhaXRGb3IoXCIubXgtcHJvZ3Jlc3NcIiwgZm91bmRQcm9ncmVzcywgZG9jdW1lbnQpO1xuXG4gICAgICAgIGlmIChwcm9ncmVzcykge1xuICAgICAgICAgICAgdW5kZXJsYXkuY2xhc3NMaXN0LnJlbW92ZShcInZpc2libGVcIik7XG4gICAgICAgICAgICBtb2RhbC5jbGFzc0xpc3QucmVtb3ZlKFwidHJhbnNpdGlvblwiKTtcbiAgICAgICAgICAgIG1vZGFsLmNsYXNzTGlzdC5yZW1vdmUoXCJ2aXNpYmxlXCIpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgICAgICAgICAgZ2VuZXJhdGVDbG9zZUJ0bigpO1xuICAgICAgICAgICAgICAgIHNldFRpbWVvdXQoKCkgPT4gbGlua0Nsb3NlQnV0dG9ucygpLCAzMDApO1xuICAgICAgICAgICAgICAgIHVuZGVybGF5ICYmIHVuZGVybGF5LmNsYXNzTGlzdC5hZGQoXCJ2aXNpYmxlXCIpO1xuICAgICAgICAgICAgICAgIHNldFRpbWVvdXQoKCkgPT4gbW9kYWwgJiYgbW9kYWwuY2xhc3NMaXN0LmFkZChcInRyYW5zaXRpb25cIiksIDEwMCk7XG4gICAgICAgICAgICAgICAgc2V0VGltZW91dCgoKSA9PiBtb2RhbCAmJiBtb2RhbC5jbGFzc0xpc3QuYWRkKFwidmlzaWJsZVwiKSwgMTAwKTtcbiAgICAgICAgICAgIH0sIDIwMCk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gPGRpdiBjbGFzc05hbWU9XCJjb252ZXJ0LXBvcHVwLXRvLW92ZXJsYXlcIj48L2Rpdj47XG4gICAgfVxufVxuIl0sIm5hbWVzIjpbIndhaXRGb3IiLCJlbGVtZW50Q2xhc3MiLCJjYWxsYmFjayIsInBhcmVudCIsImNvbnRleHQiLCJkb2N1bWVudCIsInF1ZXJ5U2VsZWN0b3IiLCJvYnNlcnZlciIsIk11dGF0aW9uT2JzZXJ2ZXIiLCJkaXNjb25uZWN0Iiwib2JzZXJ2ZSIsImNoaWxkTGlzdCIsInN1YnRyZWUiLCJDb252ZXJ0UG9wdXBUb092ZXJsYXkiLCJjbG9zZUJ1dHRvbkNsYXNzIiwiY2xvc2VBY3Rpb24iLCJwb3NpdGlvbiIsInNob3VsZENsb3NlUGFnZSIsInNpemUiLCJzaG93SGVhZGVyIiwidW5kZXJsYXlDb2xvciIsImNhblJlbmRlciIsInNldENhblJlbmRlciIsInVzZVN0YXRlIiwibW9kYWwiLCJzZXRNb2RhbCIsInVzZUVmZmVjdCIsImNsb3Nlc3QiLCJzZXRUaW1lb3V0IiwiYm9keSIsImNsYXNzTGlzdCIsInJlbW92ZSIsInNldFVuZGVybGF5Q29sb3IiLCJkb2N1bWVudEVsZW1lbnQiLCJzdHlsZSIsInNldFByb3BlcnR5IiwicmVtb3ZlVW5kZXJsYXkiLCJ1bmRlcmxheSIsIkFuaW1hdGVDbG9zZU1vZGFsIiwiY2xvc2VNb2RhbCIsImNhbkV4ZWN1dGUiLCJleGVjdXRlIiwiY2xvc2VCdG4iLCJjbGljayIsImdlbmVyYXRlVW5kZXJsYXkiLCJpbnNlcnRBZGphY2VudEhUTUwiLCJhZGRFdmVudExpc3RlbmVyIiwiYWRkIiwiZ2VuZXJhdGVDbG9zZUJ0biIsIm1vZGFsQ29udGVudCIsImxpbmtDbG9zZUJ1dHRvbnMiLCJxdWVyeVNlbGVjdG9yQWxsIiwiZm9yRWFjaCIsImZvdW5kUHJvZ3Jlc3MiLCJ3aWR0aCIsImhlaWdodCIsInByb2dyZXNzIl0sIm1hcHBpbmdzIjoiOztBQUFPLFNBQVNBLE9BQVQsQ0FBaUJDLFlBQWpCLEVBQStC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
