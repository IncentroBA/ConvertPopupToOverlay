define(['react'], (function (react) { 'use strict';

  

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
    const [canRender, setCanRender] = react.useState(false);
    const [modal, setModal] = react.useState(null);
    react.useEffect(() => {
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
      return react.createElement("div", {
        className: "convert-popup-to-overlay"
      });
    }
  }

  return ConvertPopupToOverlay;

}));
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQ29udmVydFBvcHVwVG9PdmVybGF5LmpzIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9zcmMvaGVscGVycy93YWl0Rm9yLmpzIiwiLi4vLi4vLi4vLi4vLi4vc3JjL0NvbnZlcnRQb3B1cFRvT3ZlcmxheS5qc3giXSwic291cmNlc0NvbnRlbnQiOlsiZXhwb3J0IGZ1bmN0aW9uIHdhaXRGb3IoZWxlbWVudENsYXNzLCBjYWxsYmFjaywgcGFyZW50KSB7XG4gIGNvbnN0IGNvbnRleHQgPSBwYXJlbnQgfHwgZG9jdW1lbnQ7XG5cbiAgaWYgKGNvbnRleHQucXVlcnlTZWxlY3RvcihlbGVtZW50Q2xhc3MpKSB7XG4gICAgY2FsbGJhY2soKTtcbiAgfSBlbHNlIHtcbiAgICBjb25zdCBvYnNlcnZlciA9IG5ldyBNdXRhdGlvbk9ic2VydmVyKCgpID0+IHtcbiAgICAgIGlmIChjb250ZXh0LnF1ZXJ5U2VsZWN0b3IoZWxlbWVudENsYXNzKSkge1xuICAgICAgICBvYnNlcnZlci5kaXNjb25uZWN0KCk7XG4gICAgICAgIGNhbGxiYWNrKCk7XG4gICAgICB9XG4gICAgfSk7XG4gIFxuICAgIC8vIFN0YXJ0IG9ic2VydmluZ1xuICAgIG9ic2VydmVyLm9ic2VydmUoY29udGV4dCwge1xuICAgICAgY2hpbGRMaXN0OiB0cnVlLCAvL1RoaXMgaXMgYSBtdXN0IGhhdmUgZm9yIHRoZSBvYnNlcnZlciB3aXRoIHN1YnRyZWVcbiAgICAgIHN1YnRyZWU6IHRydWUsIC8vU2V0IHRvIHRydWUgaWYgY2hhbmdlcyBtdXN0IGFsc28gYmUgb2JzZXJ2ZWQgaW4gZGVzY2VuZGFudHMuXG4gICAgfSk7XG4gIH1cbn07IiwiLyogZXNsaW50LWRpc2FibGUgbm8tdW51c2VkLWV4cHJlc3Npb25zICovXG5pbXBvcnQgXCIuL3VpL0NvbnZlcnRQb3B1cFRvT3ZlcmxheS5jc3NcIjtcbmltcG9ydCB7IGNyZWF0ZUVsZW1lbnQsIHVzZUVmZmVjdCwgdXNlU3RhdGUgfSBmcm9tIFwicmVhY3RcIjtcbmltcG9ydCB7IHdhaXRGb3IgfSBmcm9tIFwiLi9oZWxwZXJzL3dhaXRGb3JcIjtcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gQ29udmVydFBvcHVwVG9PdmVybGF5KHsgY2xvc2VCdXR0b25DbGFzcywgY2xvc2VQYWdlLCBwb3NpdGlvbiwgc2l6ZSwgc2hvd0hlYWRlciB9KSB7XG4gICAgY29uc3QgW2NhblJlbmRlciwgc2V0Q2FuUmVuZGVyXSA9IHVzZVN0YXRlKGZhbHNlKTtcbiAgICBjb25zdCBbbW9kYWwsIHNldE1vZGFsXSA9IHVzZVN0YXRlKG51bGwpO1xuXG4gICAgdXNlRWZmZWN0KCgpID0+IHtcbiAgICAgICAgaWYgKGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIuY29udmVydC1wb3B1cC10by1vdmVybGF5XCIpKSB7XG4gICAgICAgICAgICBzZXRNb2RhbChkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLmNvbnZlcnQtcG9wdXAtdG8tb3ZlcmxheVwiKS5jbG9zZXN0KFwiLm1vZGFsLWRpYWxvZ1wiKSk7XG4gICAgICAgICAgICBzZXRDYW5SZW5kZXIodHJ1ZSk7XG4gICAgICAgIH1cbiAgICB9KTtcblxuICAgIGlmIChjYW5SZW5kZXIpIHtcbiAgICAgICAgZnVuY3Rpb24gcmVtb3ZlVW5kZXJsYXkoKSB7XG4gICAgICAgICAgICBjb25zdCB1bmRlcmxheSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIucG9wdXAtdW5kZXJsYXlcIik7XG4gICAgICAgICAgICB1bmRlcmxheSAmJiB1bmRlcmxheS5jbGFzc0xpc3QucmVtb3ZlKFwidmlzaWJsZVwiKTtcblxuICAgICAgICAgICAgaWYgKGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIucG9wdXAtdW5kZXJsYXkub2xkOm5vdCgudmlzaWJsZSlcIikpIHtcbiAgICAgICAgICAgICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLnBvcHVwLXVuZGVybGF5Lm9sZDpub3QoLnZpc2libGUpXCIpLnJlbW92ZSgpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gQW5pbWF0ZUNsb3NlTW9kYWwoKSB7XG4gICAgICAgICAgICBjb25zdCBtb2RhbCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIucG9wdXAtb3ZlcmxheVwiKTtcbiAgICAgICAgICAgIG1vZGFsICYmIG1vZGFsLmNsYXNzTGlzdC5yZW1vdmUoXCJ2aXNpYmxlXCIpO1xuICAgICAgICAgICAgZG9jdW1lbnQuYm9keS5jbGFzc0xpc3QucmVtb3ZlKFwicG9wdXAtb3ZlcmxheS1ub3Njcm9sbFwiKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIGNsb3NlTW9kYWwoKSB7XG4gICAgICAgICAgICBBbmltYXRlQ2xvc2VNb2RhbCgpO1xuICAgICAgICAgICAgcmVtb3ZlVW5kZXJsYXkoKTtcbiAgICAgICAgICAgIGlmIChjbG9zZVBhZ2UgPT09IHRydWUpIHtcbiAgICAgICAgICAgICAgICBjb25zdCBtb2RhbCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIucG9wdXAtb3ZlcmxheVwiKTtcbiAgICAgICAgICAgICAgICBjb25zdCBjbG9zZUJ0biA9IG1vZGFsLnF1ZXJ5U2VsZWN0b3IoXCIuY2xvc2VcIik7XG4gICAgICAgICAgICAgICAgc2V0VGltZW91dCgoKSA9PiBjbG9zZUJ0bi5jbGljaygpLCAzMDApO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gZ2VuZXJhdGVVbmRlcmxheSgpIHtcbiAgICAgICAgICAgIGNvbnN0IG9sZFVuZGVybGF5ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5wb3B1cC11bmRlcmxheVwiKTtcblxuICAgICAgICAgICAgaWYgKCFvbGRVbmRlcmxheSkge1xuICAgICAgICAgICAgICAgIHJlbW92ZVVuZGVybGF5KCk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIG1vZGFsLmluc2VydEFkamFjZW50SFRNTChcImJlZm9yZWVuZFwiLCAnPGRpdiBjbGFzcz1cInBvcHVwLXVuZGVybGF5XCI+PC9kaXY+Jyk7XG4gICAgICAgICAgICBjb25zdCB1bmRlcmxheSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIucG9wdXAtdW5kZXJsYXk6bm90KC5vbGQpXCIpO1xuICAgICAgICAgICAgdW5kZXJsYXkuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGNsb3NlTW9kYWwpO1xuICAgICAgICAgICAgdW5kZXJsYXkuY2xhc3NMaXN0LmFkZChcIm9sZFwiKTtcbiAgICAgICAgICAgIHJldHVybiB1bmRlcmxheTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIG92ZXJsYXkgZm9yIHRoZSBkZWZhdWx0IGNsb3NlIGJ1dHRvblxuICAgICAgICBmdW5jdGlvbiBnZW5lcmF0ZUNsb3NlQnRuKCkge1xuICAgICAgICAgICAgaWYgKHNob3dIZWFkZXIgPT09IHRydWUgJiYgY2xvc2VQYWdlID09PSB0cnVlKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgbW9kYWxDb250ZW50ID0gbW9kYWwucXVlcnlTZWxlY3RvcihcIi5tb2RhbC1jb250ZW50XCIpO1xuICAgICAgICAgICAgICAgIG1vZGFsQ29udGVudC5pbnNlcnRBZGphY2VudEhUTUwoXG4gICAgICAgICAgICAgICAgICAgIFwiYWZ0ZXJiZWdpblwiLFxuICAgICAgICAgICAgICAgICAgICBgPGRpdiBjbGFzcz1cInBvcHVwLW92ZXJsYXlfX2Nsb3NlYnV0dG9uICR7Y2xvc2VCdXR0b25DbGFzc31cIj48L2Rpdj5gXG4gICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBcbiAgICAgICAgZnVuY3Rpb24gbGlua0Nsb3NlQnV0dG9ucygpIHtcbiAgICAgICAgICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoYC4ke2Nsb3NlQnV0dG9uQ2xhc3N9YCkuZm9yRWFjaChjbG9zZUJ0biA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKGNsb3NlUGFnZSA9PT0gdHJ1ZSkge1xuICAgICAgICAgICAgICAgICAgICBjbG9zZUJ0bi5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgY2xvc2VNb2RhbCk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgY2xvc2VCdG4uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIEFuaW1hdGVDbG9zZU1vZGFsKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIG1vZGFsLmNsYXNzTGlzdC5hZGQoXCJwb3B1cC1vdmVybGF5XCIsIGBwb3B1cC1vdmVybGF5LS0ke3Bvc2l0aW9ufWApO1xuICAgICAgICBcbiAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgICAgICAvLyBTZXQgc2l6ZSBhcyB3aWR0aFxuICAgICAgICAgICAgaWYgKHBvc2l0aW9uID09PSBcImxlZnRcIiB8fCBwb3NpdGlvbiA9PT0gXCJyaWdodFwiKSB7XG4gICAgICAgICAgICAgICAgbW9kYWwuc3R5bGUud2lkdGggPSBgJHtzaXplfXB4YDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8vIFNldCBzaXplIGFzIGhlaWdodFxuICAgICAgICAgICAgaWYgKHBvc2l0aW9uID09PSBcInRvcFwiIHx8IHBvc2l0aW9uID09PSBcImJvdHRvbVwiKSB7XG4gICAgICAgICAgICAgICAgbW9kYWwuc3R5bGUuaGVpZ2h0ID0gYCR7c2l6ZX1weGA7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sIDEwMCk7IFxuICAgICAgICBcbiAgICAgICAgLy8gU2hvdy9oaWRlIG92ZXJsYXkgaGVhZGVyXG4gICAgICAgIGlmIChzaG93SGVhZGVyID09PSBmYWxzZSkge1xuICAgICAgICAgICAgbW9kYWwuY2xhc3NMaXN0LmFkZChcInBvcHVwLW92ZXJsYXktLXJlbW92ZS1oZWFkZXJcIik7XG4gICAgICAgIH1cblxuICAgICAgICBkb2N1bWVudC5ib2R5LmNsYXNzTGlzdC5hZGQoXCJwb3B1cC1vdmVybGF5LW5vc2Nyb2xsXCIpO1xuICAgICAgICBcbiAgICAgICAgLy8gV2FpdCB3aXRoIHRyYW5zaXRpb25zIGluIGNhc2Ugb2YgcHJvZ3Jlc3NiYXJcbiAgICAgICAgZnVuY3Rpb24gZm91bmRQcm9ncmVzcygpIHtcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IHByb2dyZXNzID0gd2FpdEZvcihcIi5teC1wcm9ncmVzc1wiLCBmb3VuZFByb2dyZXNzLCBkb2N1bWVudCk7XG4gICAgICAgIGlmIChwcm9ncmVzcykge1xuICAgICAgICAgICAgdW5kZXJsYXkuY2xhc3NMaXN0LnJlbW92ZShcInZpc2libGVcIik7XG4gICAgICAgICAgICBtb2RhbC5jbGFzc0xpc3QucmVtb3ZlKFwidHJhbnNpdGlvblwiKTtcbiAgICAgICAgICAgIG1vZGFsLmNsYXNzTGlzdC5yZW1vdmUoXCJ2aXNpYmxlXCIpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgICAgICAgICAgY29uc3QgdW5kZXJsYXkgPSBnZW5lcmF0ZVVuZGVybGF5KCk7XG4gICAgICAgICAgICAgICAgZ2VuZXJhdGVDbG9zZUJ0bigpO1xuICAgICAgICAgICAgICAgIGxpbmtDbG9zZUJ1dHRvbnMoKTtcbiAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHVuZGVybGF5LmNsYXNzTGlzdC5hZGQoXCJ2aXNpYmxlXCIpLCAzMDApO1xuICAgICAgICAgICAgICAgIHNldFRpbWVvdXQoKCkgPT4gbW9kYWwuY2xhc3NMaXN0LmFkZChcInRyYW5zaXRpb25cIiksIDMwMCk7XG4gICAgICAgICAgICAgICAgc2V0VGltZW91dCgoKSA9PiBtb2RhbC5jbGFzc0xpc3QuYWRkKFwidmlzaWJsZVwiKSwgMzAwKTtcbiAgICAgICAgICAgIH0sIDMwMCk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gPGRpdiBjbGFzc05hbWU9XCJjb252ZXJ0LXBvcHVwLXRvLW92ZXJsYXlcIj48L2Rpdj47XG4gICAgfVxufVxuIl0sIm5hbWVzIjpbIndhaXRGb3IiLCJlbGVtZW50Q2xhc3MiLCJjYWxsYmFjayIsInBhcmVudCIsImNvbnRleHQiLCJkb2N1bWVudCIsInF1ZXJ5U2VsZWN0b3IiLCJvYnNlcnZlciIsIk11dGF0aW9uT2JzZXJ2ZXIiLCJkaXNjb25uZWN0Iiwib2JzZXJ2ZSIsImNoaWxkTGlzdCIsInN1YnRyZWUiLCJDb252ZXJ0UG9wdXBUb092ZXJsYXkiLCJjbG9zZUJ1dHRvbkNsYXNzIiwiY2xvc2VQYWdlIiwicG9zaXRpb24iLCJzaXplIiwic2hvd0hlYWRlciIsImNhblJlbmRlciIsInNldENhblJlbmRlciIsInVzZVN0YXRlIiwibW9kYWwiLCJzZXRNb2RhbCIsInVzZUVmZmVjdCIsImNsb3Nlc3QiLCJyZW1vdmVVbmRlcmxheSIsInVuZGVybGF5IiwiY2xhc3NMaXN0IiwicmVtb3ZlIiwiQW5pbWF0ZUNsb3NlTW9kYWwiLCJib2R5IiwiY2xvc2VNb2RhbCIsImNsb3NlQnRuIiwic2V0VGltZW91dCIsImNsaWNrIiwiZ2VuZXJhdGVVbmRlcmxheSIsIm9sZFVuZGVybGF5IiwiaW5zZXJ0QWRqYWNlbnRIVE1MIiwiYWRkRXZlbnRMaXN0ZW5lciIsImFkZCIsImdlbmVyYXRlQ2xvc2VCdG4iLCJtb2RhbENvbnRlbnQiLCJsaW5rQ2xvc2VCdXR0b25zIiwicXVlcnlTZWxlY3RvckFsbCIsImZvckVhY2giLCJzdHlsZSIsIndpZHRoIiwiaGVpZ2h0IiwiZm91bmRQcm9ncmVzcyIsInByb2dyZXNzIiwiY3JlYXRlRWxlbWVudCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7RUFBTyxTQUFTQSxPQUFULENBQWlCQyxZQUFqQixFQUErQkMsUUFBL0IsRUFBeUNDLE1BQXpDLEVBQWlEO0VBQ3RELFFBQU1DLE9BQU8sR0FBR0QsTUFBTSxJQUFJRSxR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
