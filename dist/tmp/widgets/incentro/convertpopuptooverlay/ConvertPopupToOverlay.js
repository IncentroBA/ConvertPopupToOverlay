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
      const [canRender, setCanRender] = react.useState(false);
      const [modal, setModal] = react.useState(null);
      react.useEffect(() => {
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
        return react.createElement("div", {
          className: "convert-popup-to-overlay"
        });
      }
    }

    return ConvertPopupToOverlay;

}));
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQ29udmVydFBvcHVwVG9PdmVybGF5LmpzIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9zcmMvaGVscGVycy93YWl0Rm9yLmpzIiwiLi4vLi4vLi4vLi4vLi4vc3JjL0NvbnZlcnRQb3B1cFRvT3ZlcmxheS5qc3giXSwic291cmNlc0NvbnRlbnQiOlsiZXhwb3J0IGZ1bmN0aW9uIHdhaXRGb3IoZWxlbWVudENsYXNzLCBjYWxsYmFjaywgcGFyZW50KSB7XG4gIGNvbnN0IGNvbnRleHQgPSBwYXJlbnQgfHwgZG9jdW1lbnQ7XG5cbiAgaWYgKGNvbnRleHQucXVlcnlTZWxlY3RvcihlbGVtZW50Q2xhc3MpKSB7XG4gICAgY2FsbGJhY2soKTtcbiAgfSBlbHNlIHtcbiAgICBjb25zdCBvYnNlcnZlciA9IG5ldyBNdXRhdGlvbk9ic2VydmVyKCgpID0+IHtcbiAgICAgIGlmIChjb250ZXh0LnF1ZXJ5U2VsZWN0b3IoZWxlbWVudENsYXNzKSkge1xuICAgICAgICBvYnNlcnZlci5kaXNjb25uZWN0KCk7XG4gICAgICAgIGNhbGxiYWNrKCk7XG4gICAgICB9XG4gICAgfSk7XG4gIFxuICAgIC8vIFN0YXJ0IG9ic2VydmluZ1xuICAgIG9ic2VydmVyLm9ic2VydmUoY29udGV4dCwge1xuICAgICAgY2hpbGRMaXN0OiB0cnVlLCAvL1RoaXMgaXMgYSBtdXN0IGhhdmUgZm9yIHRoZSBvYnNlcnZlciB3aXRoIHN1YnRyZWVcbiAgICAgIHN1YnRyZWU6IHRydWUsIC8vU2V0IHRvIHRydWUgaWYgY2hhbmdlcyBtdXN0IGFsc28gYmUgb2JzZXJ2ZWQgaW4gZGVzY2VuZGFudHMuXG4gICAgfSk7XG4gIH1cbn07IiwiLyogZXNsaW50LWRpc2FibGUgbm8tdW51c2VkLWV4cHJlc3Npb25zICovXG5pbXBvcnQgXCIuL3VpL0NvbnZlcnRQb3B1cFRvT3ZlcmxheS5jc3NcIjtcbmltcG9ydCB7IGNyZWF0ZUVsZW1lbnQsIHVzZUVmZmVjdCwgdXNlU3RhdGUgfSBmcm9tIFwicmVhY3RcIjtcbmltcG9ydCB7IHdhaXRGb3IgfSBmcm9tIFwiLi9oZWxwZXJzL3dhaXRGb3JcIjtcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gQ29udmVydFBvcHVwVG9PdmVybGF5KHtcbiAgICBjbG9zZUJ1dHRvbkNsYXNzLFxuICAgIGNsb3NlQWN0aW9uLFxuICAgIHBvc2l0aW9uLFxuICAgIHNob3VsZENsb3NlUGFnZSxcbiAgICBzaXplLFxuICAgIHNob3dIZWFkZXIsXG4gICAgdW5kZXJsYXlDb2xvclxufSkge1xuICAgIGNvbnN0IFtjYW5SZW5kZXIsIHNldENhblJlbmRlcl0gPSB1c2VTdGF0ZShmYWxzZSk7XG4gICAgY29uc3QgW21vZGFsLCBzZXRNb2RhbF0gPSB1c2VTdGF0ZShudWxsKTtcblxuICAgIHVzZUVmZmVjdCgoKSA9PiB7XG4gICAgICAgIGlmIChkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLmNvbnZlcnQtcG9wdXAtdG8tb3ZlcmxheVwiKSkge1xuICAgICAgICAgICAgc2V0TW9kYWwoZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5jb252ZXJ0LXBvcHVwLXRvLW92ZXJsYXlcIikuY2xvc2VzdChcIi5tb2RhbC1kaWFsb2dcIikpO1xuICAgICAgICAgICAgc2V0Q2FuUmVuZGVyKHRydWUpO1xuICAgICAgICB9XG4gICAgfSk7XG5cbiAgICBmdW5jdGlvbiBzZXRVbmRlcmxheUNvbG9yKCkge1xuICAgICAgICB1bmRlcmxheUNvbG9yICYmIGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5zdHlsZS5zZXRQcm9wZXJ0eShgLS11bmRlcmxheS1jb2xvcmAsIHVuZGVybGF5Q29sb3IpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHJlbW92ZVVuZGVybGF5KCkge1xuICAgICAgICBjb25zdCB1bmRlcmxheSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIucG9wdXAtdW5kZXJsYXkub2xkXCIpO1xuICAgICAgICB1bmRlcmxheSAmJiB1bmRlcmxheS5jbGFzc0xpc3QucmVtb3ZlKFwidmlzaWJsZVwiKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBBbmltYXRlQ2xvc2VNb2RhbCgpIHtcbiAgICAgICAgY29uc3QgbW9kYWwgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLnBvcHVwLW92ZXJsYXlcIik7XG4gICAgICAgIG1vZGFsICYmIG1vZGFsLmNsYXNzTGlzdC5yZW1vdmUoXCJ2aXNpYmxlXCIpO1xuICAgICAgICBzZXRUaW1lb3V0KCgpID0+IGRvY3VtZW50LmJvZHkuY2xhc3NMaXN0LnJlbW92ZShcInBvcHVwLW92ZXJsYXktbm9zY3JvbGxcIiksIDEwMCk7XG4gICAgICAgIHJlbW92ZVVuZGVybGF5KCk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gY2xvc2VNb2RhbCgpIHtcbiAgICAgICAgQW5pbWF0ZUNsb3NlTW9kYWwoKTtcblxuICAgICAgICBpZiAoY2xvc2VBY3Rpb24gJiYgY2xvc2VBY3Rpb24uY2FuRXhlY3V0ZSkge1xuICAgICAgICAgICAgY2xvc2VBY3Rpb24uZXhlY3V0ZSgpO1xuICAgICAgICB9IGVsc2UgaWYgKCFjbG9zZUFjdGlvbiAmJiBzaG91bGRDbG9zZVBhZ2UgPT09IHRydWUpIHtcbiAgICAgICAgICAgIGNvbnN0IGNsb3NlQnRuID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5wb3B1cC1vdmVybGF5IC5jbG9zZVwiKTtcbiAgICAgICAgICAgIHNldFRpbWVvdXQoKCkgPT4gY2xvc2VCdG4uY2xpY2soKSwgMzAwKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIGdlbmVyYXRlVW5kZXJsYXkoKSB7XG4gICAgICAgIG1vZGFsLmluc2VydEFkamFjZW50SFRNTChcImJlZm9yZWVuZFwiLCAnPGRpdiBjbGFzcz1cInBvcHVwLXVuZGVybGF5XCI+PC9kaXY+Jyk7XG4gICAgICAgIGNvbnN0IHVuZGVybGF5ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5wb3B1cC11bmRlcmxheTpub3QoLm9sZClcIik7XG4gICAgICAgIHVuZGVybGF5ICYmIHVuZGVybGF5LmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBjbG9zZU1vZGFsKTtcbiAgICAgICAgdW5kZXJsYXkgJiYgdW5kZXJsYXkuY2xhc3NMaXN0LmFkZChcIm9sZFwiKTtcbiAgICAgICAgcmV0dXJuIHVuZGVybGF5O1xuICAgIH1cblxuICAgIC8vIG92ZXJsYXkgZm9yIHRoZSBkZWZhdWx0IGNsb3NlIGJ1dHRvblxuICAgIGZ1bmN0aW9uIGdlbmVyYXRlQ2xvc2VCdG4oKSB7XG4gICAgICAgIGlmIChzaG93SGVhZGVyID09PSB0cnVlICYmIHNob3VsZENsb3NlUGFnZSA9PT0gdHJ1ZSkge1xuICAgICAgICAgICAgY29uc3QgbW9kYWxDb250ZW50ID0gbW9kYWwucXVlcnlTZWxlY3RvcihcIi5tb2RhbC1jb250ZW50XCIpO1xuICAgICAgICAgICAgbW9kYWxDb250ZW50Lmluc2VydEFkamFjZW50SFRNTChcImFmdGVyYmVnaW5cIiwgYDxkaXYgY2xhc3M9XCJwb3B1cC1vdmVybGF5X19jbG9zZWJ1dHRvblwiPjwvZGl2PmApO1xuICAgICAgICAgICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5wb3B1cC1vdmVybGF5X19jbG9zZWJ1dHRvblwiKS5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgY2xvc2VNb2RhbCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBmdW5jdGlvbiBsaW5rQ2xvc2VCdXR0b25zKCkge1xuICAgICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKGAuJHtjbG9zZUJ1dHRvbkNsYXNzfWApLmZvckVhY2goY2xvc2VCdG4gPT4ge1xuICAgICAgICAgICAgaWYgKHNob3VsZENsb3NlUGFnZSA9PT0gdHJ1ZSkge1xuICAgICAgICAgICAgICAgIGNsb3NlQnRuLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBjbG9zZU1vZGFsKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgY2xvc2VCdG4uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIEFuaW1hdGVDbG9zZU1vZGFsKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgLy8gV2FpdCB3aXRoIHRyYW5zaXRpb25zIGluIGNhc2Ugb2YgcHJvZ3Jlc3NiYXJcbiAgICBmdW5jdGlvbiBmb3VuZFByb2dyZXNzKCkge1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG5cbiAgICBpZiAoY2FuUmVuZGVyKSB7XG4gICAgICAgIG1vZGFsLmNsYXNzTGlzdC5hZGQoXCJwb3B1cC1vdmVybGF5XCIsIGBwb3B1cC1vdmVybGF5LS0ke3Bvc2l0aW9ufWApO1xuXG4gICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgICAgLy8gU2V0IHNpemUgYXMgd2lkdGhcbiAgICAgICAgICAgIGlmIChwb3NpdGlvbiA9PT0gXCJsZWZ0XCIgfHwgcG9zaXRpb24gPT09IFwicmlnaHRcIikge1xuICAgICAgICAgICAgICAgIG1vZGFsLnN0eWxlLndpZHRoID0gYCR7c2l6ZX1weGA7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvLyBTZXQgc2l6ZSBhcyBoZWlnaHRcbiAgICAgICAgICAgIGlmIChwb3NpdGlvbiA9PT0gXCJ0b3BcIiB8fCBwb3NpdGlvbiA9PT0gXCJib3R0b21cIikge1xuICAgICAgICAgICAgICAgIG1vZGFsLnN0eWxlLmhlaWdodCA9IGAke3NpemV9cHhgO1xuICAgICAgICAgICAgfVxuICAgICAgICB9LCAxMDApO1xuXG4gICAgICAgIC8vIFNob3cvaGlkZSBvdmVybGF5IGhlYWRlclxuICAgICAgICBpZiAoc2hvd0hlYWRlciA9PT0gZmFsc2UpIHtcbiAgICAgICAgICAgIG1vZGFsLmNsYXNzTGlzdC5hZGQoXCJwb3B1cC1vdmVybGF5LS1yZW1vdmUtaGVhZGVyXCIpO1xuICAgICAgICB9XG5cbiAgICAgICAgZG9jdW1lbnQuYm9keS5jbGFzc0xpc3QuYWRkKFwicG9wdXAtb3ZlcmxheS1ub3Njcm9sbFwiKTtcblxuICAgICAgICBzZXRVbmRlcmxheUNvbG9yKCk7XG4gICAgICAgIGNvbnN0IHVuZGVybGF5ID0gZ2VuZXJhdGVVbmRlcmxheSgpO1xuICAgICAgICBjb25zdCBwcm9ncmVzcyA9IHdhaXRGb3IoXCIubXgtcHJvZ3Jlc3NcIiwgZm91bmRQcm9ncmVzcywgZG9jdW1lbnQpO1xuXG4gICAgICAgIGlmIChwcm9ncmVzcykge1xuICAgICAgICAgICAgdW5kZXJsYXkuY2xhc3NMaXN0LnJlbW92ZShcInZpc2libGVcIik7XG4gICAgICAgICAgICBtb2RhbC5jbGFzc0xpc3QucmVtb3ZlKFwidHJhbnNpdGlvblwiKTtcbiAgICAgICAgICAgIG1vZGFsLmNsYXNzTGlzdC5yZW1vdmUoXCJ2aXNpYmxlXCIpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgICAgICAgICAgZ2VuZXJhdGVDbG9zZUJ0bigpO1xuICAgICAgICAgICAgICAgIHNldFRpbWVvdXQoKCkgPT4gbGlua0Nsb3NlQnV0dG9ucygpLCAzMDApO1xuICAgICAgICAgICAgICAgIHNldFRpbWVvdXQoKCkgPT4gdW5kZXJsYXkgJiYgdW5kZXJsYXkuY2xhc3NMaXN0LmFkZChcInZpc2libGVcIiksIDMwMCk7XG4gICAgICAgICAgICAgICAgc2V0VGltZW91dCgoKSA9PiBtb2RhbCAmJiBtb2RhbC5jbGFzc0xpc3QuYWRkKFwidHJhbnNpdGlvblwiKSwgMzAwKTtcbiAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KCgpID0+IG1vZGFsICYmIG1vZGFsLmNsYXNzTGlzdC5hZGQoXCJ2aXNpYmxlXCIpLCAzMDApO1xuICAgICAgICAgICAgfSwgMzAwKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBudWxsO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiA8ZGl2IGNsYXNzTmFtZT1cImNvbnZlcnQtcG9wdXAtdG8tb3ZlcmxheVwiPjwvZGl2PjtcbiAgICB9XG59XG4iXSwibmFtZXMiOlsid2FpdEZvciIsImVsZW1lbnRDbGFzcyIsImNhbGxiYWNrIiwicGFyZW50IiwiY29udGV4dCIsImRvY3VtZW50IiwicXVlcnlTZWxlY3RvciIsIm9ic2VydmVyIiwiTXV0YXRpb25PYnNlcnZlciIsImRpc2Nvbm5lY3QiLCJvYnNlcnZlIiwiY2hpbGRMaXN0Iiwic3VidHJlZSIsIkNvbnZlcnRQb3B1cFRvT3ZlcmxheSIsImNsb3NlQnV0dG9uQ2xhc3MiLCJjbG9zZUFjdGlvbiIsInBvc2l0aW9uIiwic2hvdWxkQ2xvc2VQYWdlIiwic2l6ZSIsInNob3dIZWFkZXIiLCJ1bmRlcmxheUNvbG9yIiwiY2FuUmVuZGVyIiwic2V0Q2FuUmVuZGVyIiwidXNlU3RhdGUiLCJtb2RhbCIsInNldE1vZGFsIiwidXNlRWZmZWN0IiwiY2xvc2VzdCIsInNldFVuZGVybGF5Q29sb3IiLCJkb2N1bWVudEVsZW1lbnQiLCJzdHlsZSIsInNldFByb3BlcnR5IiwicmVtb3ZlVW5kZXJsYXkiLCJ1bmRlcmxheSIsImNsYXNzTGlzdCIsInJlbW92ZSIsIkFuaW1hdGVDbG9zZU1vZGFsIiwic2V0VGltZW91dCIsImJvZHkiLCJjbG9zZU1vZGFsIiwiY2FuRXhlY3V0ZSIsImV4ZWN1dGUiLCJjbG9zZUJ0biIsImNsaWNrIiwiZ2VuZXJhdGVVbmRlcmxheSIsImluc2VydEFkamFjZW50SFRNTCIsImFkZEV2ZW50TGlzdGVuZXIiLCJhZGQiLCJnZW5lcmF0ZUNsb3NlQnRuIiwibW9kYWxDb250ZW50IiwibGlua0Nsb3NlQnV0dG9ucyIsInF1ZXJ5U2VsZWN0b3JBbGwiLCJmb3JFYWNoIiwiZm91bmRQcm9ncmVzcyIsIndpZHRoIiwiaGVpZ2h0IiwicHJvZ3Jlc3MiLCJjcmVhdGVFbGVtZW50Il0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7OztJQUFPLFNBQVNBLE9BQVQsQ0FBaUJDLFlBQWpCLEVBQStCQyxRQUEvQixFQUF5Q0MsTUFBekMsRUFBaUQ7SUFDdEQsUUFBTUMsT0FBTyxHQUFHRCxNQUFNLElBQUlFLFFBQTFCOztJQUVBLE1B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
