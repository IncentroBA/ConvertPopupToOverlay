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
    closeAction,
    shouldClosePage,
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
      return react.createElement("div", {
        className: "convert-popup-to-overlay"
      });
    }
  }

  return ConvertPopupToOverlay;

}));
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQ29udmVydFBvcHVwVG9PdmVybGF5LmpzIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9zcmMvaGVscGVycy93YWl0Rm9yLmpzIiwiLi4vLi4vLi4vLi4vLi4vc3JjL0NvbnZlcnRQb3B1cFRvT3ZlcmxheS5qc3giXSwic291cmNlc0NvbnRlbnQiOlsiZXhwb3J0IGZ1bmN0aW9uIHdhaXRGb3IoZWxlbWVudENsYXNzLCBjYWxsYmFjaywgcGFyZW50KSB7XG4gIGNvbnN0IGNvbnRleHQgPSBwYXJlbnQgfHwgZG9jdW1lbnQ7XG5cbiAgaWYgKGNvbnRleHQucXVlcnlTZWxlY3RvcihlbGVtZW50Q2xhc3MpKSB7XG4gICAgY2FsbGJhY2soKTtcbiAgfSBlbHNlIHtcbiAgICBjb25zdCBvYnNlcnZlciA9IG5ldyBNdXRhdGlvbk9ic2VydmVyKCgpID0+IHtcbiAgICAgIGlmIChjb250ZXh0LnF1ZXJ5U2VsZWN0b3IoZWxlbWVudENsYXNzKSkge1xuICAgICAgICBvYnNlcnZlci5kaXNjb25uZWN0KCk7XG4gICAgICAgIGNhbGxiYWNrKCk7XG4gICAgICB9XG4gICAgfSk7XG4gIFxuICAgIC8vIFN0YXJ0IG9ic2VydmluZ1xuICAgIG9ic2VydmVyLm9ic2VydmUoY29udGV4dCwge1xuICAgICAgY2hpbGRMaXN0OiB0cnVlLCAvL1RoaXMgaXMgYSBtdXN0IGhhdmUgZm9yIHRoZSBvYnNlcnZlciB3aXRoIHN1YnRyZWVcbiAgICAgIHN1YnRyZWU6IHRydWUsIC8vU2V0IHRvIHRydWUgaWYgY2hhbmdlcyBtdXN0IGFsc28gYmUgb2JzZXJ2ZWQgaW4gZGVzY2VuZGFudHMuXG4gICAgfSk7XG4gIH1cbn07IiwiLyogZXNsaW50LWRpc2FibGUgbm8tdW51c2VkLWV4cHJlc3Npb25zICovXG5pbXBvcnQgXCIuL3VpL0NvbnZlcnRQb3B1cFRvT3ZlcmxheS5jc3NcIjtcbmltcG9ydCB7IGNyZWF0ZUVsZW1lbnQsIHVzZUVmZmVjdCwgdXNlU3RhdGUgfSBmcm9tIFwicmVhY3RcIjtcbmltcG9ydCB7IHdhaXRGb3IgfSBmcm9tIFwiLi9oZWxwZXJzL3dhaXRGb3JcIjtcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gQ29udmVydFBvcHVwVG9PdmVybGF5KHtcbiAgICBjbG9zZUJ1dHRvbkNsYXNzLFxuICAgIGNsb3NlQWN0aW9uLFxuICAgIHNob3VsZENsb3NlUGFnZSxcbiAgICBwb3NpdGlvbixcbiAgICBzaXplLFxuICAgIHNob3dIZWFkZXJcbn0pIHtcbiAgICBjb25zdCBbY2FuUmVuZGVyLCBzZXRDYW5SZW5kZXJdID0gdXNlU3RhdGUoZmFsc2UpO1xuICAgIGNvbnN0IFttb2RhbCwgc2V0TW9kYWxdID0gdXNlU3RhdGUobnVsbCk7XG5cbiAgICB1c2VFZmZlY3QoKCkgPT4ge1xuICAgICAgICBpZiAoZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5jb252ZXJ0LXBvcHVwLXRvLW92ZXJsYXlcIikpIHtcbiAgICAgICAgICAgIHNldE1vZGFsKGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIuY29udmVydC1wb3B1cC10by1vdmVybGF5XCIpLmNsb3Nlc3QoXCIubW9kYWwtZGlhbG9nXCIpKTtcbiAgICAgICAgICAgIHNldENhblJlbmRlcih0cnVlKTtcbiAgICAgICAgfVxuICAgIH0pO1xuXG4gICAgaWYgKGNhblJlbmRlcikge1xuICAgICAgICBmdW5jdGlvbiByZW1vdmVVbmRlcmxheSgpIHtcbiAgICAgICAgICAgIGNvbnN0IHVuZGVybGF5ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5wb3B1cC11bmRlcmxheVwiKTtcbiAgICAgICAgICAgIHVuZGVybGF5ICYmIHVuZGVybGF5LmNsYXNzTGlzdC5yZW1vdmUoXCJ2aXNpYmxlXCIpO1xuXG4gICAgICAgICAgICBpZiAoZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5wb3B1cC11bmRlcmxheS5vbGQ6bm90KC52aXNpYmxlKVwiKSkge1xuICAgICAgICAgICAgICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIucG9wdXAtdW5kZXJsYXkub2xkOm5vdCgudmlzaWJsZSlcIikucmVtb3ZlKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiBBbmltYXRlQ2xvc2VNb2RhbCgpIHtcbiAgICAgICAgICAgIGNvbnN0IG1vZGFsID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5wb3B1cC1vdmVybGF5XCIpO1xuICAgICAgICAgICAgbW9kYWwgJiYgbW9kYWwuY2xhc3NMaXN0LnJlbW92ZShcInZpc2libGVcIik7XG4gICAgICAgICAgICBkb2N1bWVudC5ib2R5LmNsYXNzTGlzdC5yZW1vdmUoXCJwb3B1cC1vdmVybGF5LW5vc2Nyb2xsXCIpO1xuICAgICAgICAgICAgcmVtb3ZlVW5kZXJsYXkoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIGNsb3NlTW9kYWwoKSB7XG4gICAgICAgICAgICBBbmltYXRlQ2xvc2VNb2RhbCgpO1xuXG4gICAgICAgICAgICBpZiAoY2xvc2VBY3Rpb24gJiYgY2xvc2VBY3Rpb24uY2FuRXhlY3V0ZSkge1xuICAgICAgICAgICAgICAgIGNsb3NlQWN0aW9uLmV4ZWN1dGUoKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoIWNsb3NlQWN0aW9uICYmIHNob3VsZENsb3NlUGFnZSA9PT0gdHJ1ZSkge1xuICAgICAgICAgICAgICAgIGNvbnN0IGNsb3NlQnRuID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5wb3B1cC1vdmVybGF5IC5jbG9zZVwiKTtcbiAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KCgpID0+IGNsb3NlQnRuLmNsaWNrKCksIDMwMCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiBnZW5lcmF0ZVVuZGVybGF5KCkge1xuICAgICAgICAgICAgY29uc3Qgb2xkVW5kZXJsYXkgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLnBvcHVwLXVuZGVybGF5XCIpO1xuXG4gICAgICAgICAgICBpZiAoIW9sZFVuZGVybGF5KSB7XG4gICAgICAgICAgICAgICAgcmVtb3ZlVW5kZXJsYXkoKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgbW9kYWwuaW5zZXJ0QWRqYWNlbnRIVE1MKFwiYmVmb3JlZW5kXCIsICc8ZGl2IGNsYXNzPVwicG9wdXAtdW5kZXJsYXlcIj48L2Rpdj4nKTtcbiAgICAgICAgICAgIGNvbnN0IHVuZGVybGF5ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5wb3B1cC11bmRlcmxheTpub3QoLm9sZClcIik7XG4gICAgICAgICAgICB1bmRlcmxheSAmJiB1bmRlcmxheS5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgY2xvc2VNb2RhbCk7XG4gICAgICAgICAgICB1bmRlcmxheSAmJiB1bmRlcmxheS5jbGFzc0xpc3QuYWRkKFwib2xkXCIpO1xuICAgICAgICAgICAgcmV0dXJuIHVuZGVybGF5O1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gb3ZlcmxheSBmb3IgdGhlIGRlZmF1bHQgY2xvc2UgYnV0dG9uXG4gICAgICAgIGZ1bmN0aW9uIGdlbmVyYXRlQ2xvc2VCdG4oKSB7XG4gICAgICAgICAgICBpZiAoc2hvd0hlYWRlciA9PT0gdHJ1ZSAmJiBzaG91bGRDbG9zZVBhZ2UgPT09IHRydWUpIHtcbiAgICAgICAgICAgICAgICBjb25zdCBtb2RhbENvbnRlbnQgPSBtb2RhbC5xdWVyeVNlbGVjdG9yKFwiLm1vZGFsLWNvbnRlbnRcIik7XG4gICAgICAgICAgICAgICAgbW9kYWxDb250ZW50Lmluc2VydEFkamFjZW50SFRNTChcImFmdGVyYmVnaW5cIiwgYDxkaXYgY2xhc3M9XCJwb3B1cC1vdmVybGF5X19jbG9zZWJ1dHRvblwiPjwvZGl2PmApO1xuICAgICAgICAgICAgICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIucG9wdXAtb3ZlcmxheV9fY2xvc2VidXR0b25cIikuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGNsb3NlTW9kYWwpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gbGlua0Nsb3NlQnV0dG9ucygpIHtcbiAgICAgICAgICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoYC4ke2Nsb3NlQnV0dG9uQ2xhc3N9YCkuZm9yRWFjaChjbG9zZUJ0biA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKHNob3VsZENsb3NlUGFnZSA9PT0gdHJ1ZSkge1xuICAgICAgICAgICAgICAgICAgICBjbG9zZUJ0bi5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgY2xvc2VNb2RhbCk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgY2xvc2VCdG4uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIEFuaW1hdGVDbG9zZU1vZGFsKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIG1vZGFsLmNsYXNzTGlzdC5hZGQoXCJwb3B1cC1vdmVybGF5XCIsIGBwb3B1cC1vdmVybGF5LS0ke3Bvc2l0aW9ufWApO1xuXG4gICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgICAgLy8gU2V0IHNpemUgYXMgd2lkdGhcbiAgICAgICAgICAgIGlmIChwb3NpdGlvbiA9PT0gXCJsZWZ0XCIgfHwgcG9zaXRpb24gPT09IFwicmlnaHRcIikge1xuICAgICAgICAgICAgICAgIG1vZGFsLnN0eWxlLndpZHRoID0gYCR7c2l6ZX1weGA7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvLyBTZXQgc2l6ZSBhcyBoZWlnaHRcbiAgICAgICAgICAgIGlmIChwb3NpdGlvbiA9PT0gXCJ0b3BcIiB8fCBwb3NpdGlvbiA9PT0gXCJib3R0b21cIikge1xuICAgICAgICAgICAgICAgIG1vZGFsLnN0eWxlLmhlaWdodCA9IGAke3NpemV9cHhgO1xuICAgICAgICAgICAgfVxuICAgICAgICB9LCAxMDApO1xuXG4gICAgICAgIC8vIFNob3cvaGlkZSBvdmVybGF5IGhlYWRlclxuICAgICAgICBpZiAoc2hvd0hlYWRlciA9PT0gZmFsc2UpIHtcbiAgICAgICAgICAgIG1vZGFsLmNsYXNzTGlzdC5hZGQoXCJwb3B1cC1vdmVybGF5LS1yZW1vdmUtaGVhZGVyXCIpO1xuICAgICAgICB9XG5cbiAgICAgICAgZG9jdW1lbnQuYm9keS5jbGFzc0xpc3QuYWRkKFwicG9wdXAtb3ZlcmxheS1ub3Njcm9sbFwiKTtcblxuICAgICAgICAvLyBXYWl0IHdpdGggdHJhbnNpdGlvbnMgaW4gY2FzZSBvZiBwcm9ncmVzc2JhclxuICAgICAgICBmdW5jdGlvbiBmb3VuZFByb2dyZXNzKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBwcm9ncmVzcyA9IHdhaXRGb3IoXCIubXgtcHJvZ3Jlc3NcIiwgZm91bmRQcm9ncmVzcywgZG9jdW1lbnQpO1xuICAgICAgICBpZiAocHJvZ3Jlc3MpIHtcbiAgICAgICAgICAgIHVuZGVybGF5LmNsYXNzTGlzdC5yZW1vdmUoXCJ2aXNpYmxlXCIpO1xuICAgICAgICAgICAgbW9kYWwuY2xhc3NMaXN0LnJlbW92ZShcInRyYW5zaXRpb25cIik7XG4gICAgICAgICAgICBtb2RhbC5jbGFzc0xpc3QucmVtb3ZlKFwidmlzaWJsZVwiKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgICAgICAgIGNvbnN0IHVuZGVybGF5ID0gZ2VuZXJhdGVVbmRlcmxheSgpO1xuICAgICAgICAgICAgICAgIGdlbmVyYXRlQ2xvc2VCdG4oKTtcbiAgICAgICAgICAgICAgICBsaW5rQ2xvc2VCdXR0b25zKCk7XG4gICAgICAgICAgICAgICAgc2V0VGltZW91dCgoKSA9PiB1bmRlcmxheSAmJiB1bmRlcmxheS5jbGFzc0xpc3QuYWRkKFwidmlzaWJsZVwiKSwgMzAwKTtcbiAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KCgpID0+IG1vZGFsICYmIG1vZGFsLmNsYXNzTGlzdC5hZGQoXCJ0cmFuc2l0aW9uXCIpLCAzMDApO1xuICAgICAgICAgICAgICAgIHNldFRpbWVvdXQoKCkgPT4gbW9kYWwgJiYgbW9kYWwuY2xhc3NMaXN0LmFkZChcInZpc2libGVcIiksIDMwMCk7XG4gICAgICAgICAgICB9LCAzMDApO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIDxkaXYgY2xhc3NOYW1lPVwiY29udmVydC1wb3B1cC10by1vdmVybGF5XCI+PC9kaXY+O1xuICAgIH1cbn1cbiJdLCJuYW1lcyI6WyJ3YWl0Rm9yIiwiZWxlbWVudENsYXNzIiwiY2FsbGJhY2siLCJwYXJlbnQiLCJjb250ZXh0IiwiZG9jdW1lbnQiLCJxdWVyeVNlbGVjdG9yIiwib2JzZXJ2ZXIiLCJNdXRhdGlvbk9ic2VydmVyIiwiZGlzY29ubmVjdCIsIm9ic2VydmUiLCJjaGlsZExpc3QiLCJzdWJ0cmVlIiwiQ29udmVydFBvcHVwVG9PdmVybGF5IiwiY2xvc2VCdXR0b25DbGFzcyIsImNsb3NlQWN0aW9uIiwic2hvdWxkQ2xvc2VQYWdlIiwicG9zaXRpb24iLCJzaXplIiwic2hvd0hlYWRlciIsImNhblJlbmRlciIsInNldENhblJlbmRlciIsInVzZVN0YXRlIiwibW9kYWwiLCJzZXRNb2RhbCIsInVzZUVmZmVjdCIsImNsb3Nlc3QiLCJyZW1vdmVVbmRlcmxheSIsInVuZGVybGF5IiwiY2xhc3NMaXN0IiwicmVtb3ZlIiwiQW5pbWF0ZUNsb3NlTW9kYWwiLCJib2R5IiwiY2xvc2VNb2RhbCIsImNhbkV4ZWN1dGUiLCJleGVjdXRlIiwiY2xvc2VCdG4iLCJzZXRUaW1lb3V0IiwiY2xpY2siLCJnZW5lcmF0ZVVuZGVybGF5Iiwib2xkVW5kZXJsYXkiLCJpbnNlcnRBZGphY2VudEhUTUwiLCJhZGRFdmVudExpc3RlbmVyIiwiYWRkIiwiZ2VuZXJhdGVDbG9zZUJ0biIsIm1vZGFsQ29udGVudCIsImxpbmtDbG9zZUJ1dHRvbnMiLCJxdWVyeVNlbGVjdG9yQWxsIiwiZm9yRWFjaCIsInN0eWxlIiwid2lkdGgiLCJoZWlnaHQiLCJmb3VuZFByb2dyZXNzIiwicHJvZ3Jlc3MiLCJjcmVhdGVFbGVtZW50Il0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7OztFQUFPLFNBQVNBLE9BQVQsQ0FBaUJDLFlBQWpCLEVBQStCQyxRQUEvQixFQUF5Q0MsTUFBekMsRUFBaUQ7RUFDdEQsUUFBTUMsT0FBTyxHQUFHRCxNQUFNLElBQUlFLFFBQTFCOztFQUVBLE1BQUlELE9BQU8sQ0FBQ0UsYUFBUixDQUFzQkwsWUFBdEIsQ0FBSixFQUF5QztFQUN2Q0MsSUFBQUEsUUFBUTtFQUNULEdBRkQsTUFFTztFQUNMLFVBQU1LLFFBQVEsR0FBRyxJQUFJQyxnQkFBSixDQUFxQixNQUFNO0VBQzFDLFVBQUlKLE9BQU8sQ0FBQ0UsYUFBUixDQUFzQkwsWUFBdEIsQ0FBSixFQUF5QztFQUN2Q00sUUFBQUEsUUFBUSxDQUFDRSxVQUFUO0VBQ0FQLFFBQUFBLFFBQVE7RUFDVDtFQUNGLEtBTGdCLENBQWpCLENBREs7O0VBU0xLLElBQUFBLFFBQVEsQ0FBQ0csT0FBVCxDQUFpQk4sT0FBakIsRUFBMEI7RUFDeEJPLE1BQUFBLFNBQVMsRUFBRSxJQURhO0VBQ1A7RUFDakJDLE1BQUFBLE9BQU8sRUFBRSxJQUZlOztFQUFBLEtBQTFCO0VBSUQ7RUFDRjs7RUNuQkQ7RUFLZSxTQUFTQyxxQkFBVCxDQUErQjtFQUMxQ0MsRUFBQUEsZ0JBRDBDO0VBRTFDQyxFQUFBQSxXQUYwQztFQUcxQ0MsRUFBQUEsZUFIMEM7RUFJMUNDLEVBQUFBLFFBSjBDO0VBSzFDQyxFQUFBQSxJQUwwQztFQU0xQ0MsRUFBQUE7RUFOMEMsQ0FBL0IsRUFPWjtFQUNDLFFBQU0sQ0FBQ0MsU0FBRCxFQUFZQyxZQUFaLElBQTRCQyxjQUFRLENBQUMsS0FBRCxDQUExQztFQUNBLFFBQU0sQ0FBQ0MsS0FBRCxFQUFRQyxRQUFSLElBQW9CRixjQUFRLENBQUMsSUFBRCxDQUFsQztF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
