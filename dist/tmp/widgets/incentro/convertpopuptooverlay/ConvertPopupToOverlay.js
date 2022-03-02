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
        return react.createElement("div", {
          className: "convert-popup-to-overlay"
        });
      }
    }

    return ConvertPopupToOverlay;

}));
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQ29udmVydFBvcHVwVG9PdmVybGF5LmpzIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9zcmMvaGVscGVycy93YWl0Rm9yLmpzIiwiLi4vLi4vLi4vLi4vLi4vc3JjL0NvbnZlcnRQb3B1cFRvT3ZlcmxheS5qc3giXSwic291cmNlc0NvbnRlbnQiOlsiZXhwb3J0IGZ1bmN0aW9uIHdhaXRGb3IoZWxlbWVudENsYXNzLCBjYWxsYmFjaywgcGFyZW50KSB7XG4gIGNvbnN0IGNvbnRleHQgPSBwYXJlbnQgfHwgZG9jdW1lbnQ7XG5cbiAgaWYgKGNvbnRleHQucXVlcnlTZWxlY3RvcihlbGVtZW50Q2xhc3MpKSB7XG4gICAgY2FsbGJhY2soKTtcbiAgfSBlbHNlIHtcbiAgICBjb25zdCBvYnNlcnZlciA9IG5ldyBNdXRhdGlvbk9ic2VydmVyKCgpID0+IHtcbiAgICAgIGlmIChjb250ZXh0LnF1ZXJ5U2VsZWN0b3IoZWxlbWVudENsYXNzKSkge1xuICAgICAgICBvYnNlcnZlci5kaXNjb25uZWN0KCk7XG4gICAgICAgIGNhbGxiYWNrKCk7XG4gICAgICB9XG4gICAgfSk7XG4gIFxuICAgIC8vIFN0YXJ0IG9ic2VydmluZ1xuICAgIG9ic2VydmVyLm9ic2VydmUoY29udGV4dCwge1xuICAgICAgY2hpbGRMaXN0OiB0cnVlLCAvL1RoaXMgaXMgYSBtdXN0IGhhdmUgZm9yIHRoZSBvYnNlcnZlciB3aXRoIHN1YnRyZWVcbiAgICAgIHN1YnRyZWU6IHRydWUsIC8vU2V0IHRvIHRydWUgaWYgY2hhbmdlcyBtdXN0IGFsc28gYmUgb2JzZXJ2ZWQgaW4gZGVzY2VuZGFudHMuXG4gICAgfSk7XG4gIH1cbn07IiwiLyogZXNsaW50LWRpc2FibGUgbm8tdW51c2VkLWV4cHJlc3Npb25zICovXG5pbXBvcnQgXCIuL3VpL0NvbnZlcnRQb3B1cFRvT3ZlcmxheS5jc3NcIjtcbmltcG9ydCB7IGNyZWF0ZUVsZW1lbnQsIHVzZUVmZmVjdCwgdXNlU3RhdGUgfSBmcm9tIFwicmVhY3RcIjtcbmltcG9ydCB7IHdhaXRGb3IgfSBmcm9tIFwiLi9oZWxwZXJzL3dhaXRGb3JcIjtcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gQ29udmVydFBvcHVwVG9PdmVybGF5KHtcbiAgICBib2R5Tm9TY3JvbGwsXG4gICAgY2xvc2VCdXR0b25DbGFzcyxcbiAgICBjbG9zZUFjdGlvbixcbiAgICBwb3NpdGlvbixcbiAgICBzaG91bGRDbG9zZVBhZ2UsXG4gICAgc2l6ZSxcbiAgICBzaG93SGVhZGVyLFxuICAgIHVuZGVybGF5Q29sb3Jcbn0pIHtcbiAgICBjb25zdCBbY2FuUmVuZGVyLCBzZXRDYW5SZW5kZXJdID0gdXNlU3RhdGUoZmFsc2UpO1xuICAgIGNvbnN0IFttb2RhbCwgc2V0TW9kYWxdID0gdXNlU3RhdGUobnVsbCk7XG5cbiAgICB1c2VFZmZlY3QoKCkgPT4ge1xuICAgICAgICBpZiAoZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5jb252ZXJ0LXBvcHVwLXRvLW92ZXJsYXlcIikpIHtcbiAgICAgICAgICAgIHNldE1vZGFsKGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIuY29udmVydC1wb3B1cC10by1vdmVybGF5XCIpLmNsb3Nlc3QoXCIubW9kYWwtZGlhbG9nXCIpKTtcbiAgICAgICAgICAgIHNldENhblJlbmRlcih0cnVlKTtcbiAgICAgICAgfVxuICAgIH0pO1xuXG4gICAgZnVuY3Rpb24gc2V0VW5kZXJsYXlDb2xvcigpIHtcbiAgICAgICAgdW5kZXJsYXlDb2xvciAmJiBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuc3R5bGUuc2V0UHJvcGVydHkoYC0tdW5kZXJsYXktY29sb3JgLCB1bmRlcmxheUNvbG9yKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiByZW1vdmVVbmRlcmxheSgpIHtcbiAgICAgICAgY29uc3QgdW5kZXJsYXkgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLnBvcHVwLXVuZGVybGF5Lm9sZFwiKTtcbiAgICAgICAgdW5kZXJsYXkgJiYgdW5kZXJsYXkuY2xhc3NMaXN0LnJlbW92ZShcInZpc2libGVcIik7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gQW5pbWF0ZUNsb3NlTW9kYWwoKSB7XG4gICAgICAgIGNvbnN0IG1vZGFsID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5wb3B1cC1vdmVybGF5XCIpO1xuICAgICAgICBtb2RhbCAmJiBtb2RhbC5jbGFzc0xpc3QucmVtb3ZlKFwidmlzaWJsZVwiKTtcbiAgICAgICAgYm9keU5vU2Nyb2xsID09PSB0cnVlICYmIHNldFRpbWVvdXQoKCkgPT4gZG9jdW1lbnQuYm9keS5jbGFzc0xpc3QucmVtb3ZlKFwicG9wdXAtb3ZlcmxheS1ub3Njcm9sbFwiKSwgMTAwKTtcbiAgICAgICAgcmVtb3ZlVW5kZXJsYXkoKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBjbG9zZU1vZGFsKCkge1xuICAgICAgICBBbmltYXRlQ2xvc2VNb2RhbCgpO1xuXG4gICAgICAgIGlmIChjbG9zZUFjdGlvbiAmJiBjbG9zZUFjdGlvbi5jYW5FeGVjdXRlKSB7XG4gICAgICAgICAgICBjbG9zZUFjdGlvbi5leGVjdXRlKCk7XG4gICAgICAgIH0gZWxzZSBpZiAoIWNsb3NlQWN0aW9uICYmIHNob3VsZENsb3NlUGFnZSA9PT0gdHJ1ZSkge1xuICAgICAgICAgICAgY29uc3QgY2xvc2VCdG4gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLnBvcHVwLW92ZXJsYXkgLmNsb3NlXCIpO1xuICAgICAgICAgICAgc2V0VGltZW91dCgoKSA9PiBjbG9zZUJ0bi5jbGljaygpLCAzMDApO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZ2VuZXJhdGVVbmRlcmxheSgpIHtcbiAgICAgICAgbW9kYWwuaW5zZXJ0QWRqYWNlbnRIVE1MKFwiYmVmb3JlZW5kXCIsICc8ZGl2IGNsYXNzPVwicG9wdXAtdW5kZXJsYXlcIj48L2Rpdj4nKTtcbiAgICAgICAgY29uc3QgdW5kZXJsYXkgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLnBvcHVwLXVuZGVybGF5Om5vdCgub2xkKVwiKTtcbiAgICAgICAgdW5kZXJsYXkgJiYgdW5kZXJsYXkuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGNsb3NlTW9kYWwpO1xuICAgICAgICB1bmRlcmxheSAmJiB1bmRlcmxheS5jbGFzc0xpc3QuYWRkKFwib2xkXCIpO1xuICAgICAgICByZXR1cm4gdW5kZXJsYXk7XG4gICAgfVxuXG4gICAgLy8gb3ZlcmxheSBmb3IgdGhlIGRlZmF1bHQgY2xvc2UgYnV0dG9uXG4gICAgZnVuY3Rpb24gZ2VuZXJhdGVDbG9zZUJ0bigpIHtcbiAgICAgICAgaWYgKHNob3dIZWFkZXIgPT09IHRydWUgJiYgc2hvdWxkQ2xvc2VQYWdlID09PSB0cnVlKSB7XG4gICAgICAgICAgICBjb25zdCBtb2RhbENvbnRlbnQgPSBtb2RhbC5xdWVyeVNlbGVjdG9yKFwiLm1vZGFsLWNvbnRlbnRcIik7XG4gICAgICAgICAgICBtb2RhbENvbnRlbnQuaW5zZXJ0QWRqYWNlbnRIVE1MKFwiYWZ0ZXJiZWdpblwiLCBgPGRpdiBjbGFzcz1cInBvcHVwLW92ZXJsYXlfX2Nsb3NlYnV0dG9uXCI+PC9kaXY+YCk7XG4gICAgICAgICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLnBvcHVwLW92ZXJsYXlfX2Nsb3NlYnV0dG9uXCIpLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBjbG9zZU1vZGFsKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIGxpbmtDbG9zZUJ1dHRvbnMoKSB7XG4gICAgICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoYC4ke2Nsb3NlQnV0dG9uQ2xhc3N9YCkuZm9yRWFjaChjbG9zZUJ0biA9PiB7XG4gICAgICAgICAgICBpZiAoc2hvdWxkQ2xvc2VQYWdlID09PSB0cnVlKSB7XG4gICAgICAgICAgICAgICAgY2xvc2VCdG4uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGNsb3NlTW9kYWwpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBjbG9zZUJ0bi5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgQW5pbWF0ZUNsb3NlTW9kYWwpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICAvLyBXYWl0IHdpdGggdHJhbnNpdGlvbnMgaW4gY2FzZSBvZiBwcm9ncmVzc2JhclxuICAgIGZ1bmN0aW9uIGZvdW5kUHJvZ3Jlc3MoKSB7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cblxuICAgIGlmIChjYW5SZW5kZXIpIHtcbiAgICAgICAgbW9kYWwuY2xhc3NMaXN0LmFkZChcInBvcHVwLW92ZXJsYXlcIiwgYHBvcHVwLW92ZXJsYXktLSR7cG9zaXRpb259YCk7XG5cbiAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgICAgICAvLyBTZXQgc2l6ZSBhcyB3aWR0aFxuICAgICAgICAgICAgaWYgKHBvc2l0aW9uID09PSBcImxlZnRcIiB8fCBwb3NpdGlvbiA9PT0gXCJyaWdodFwiKSB7XG4gICAgICAgICAgICAgICAgbW9kYWwuc3R5bGUud2lkdGggPSBgJHtzaXplfXB4YDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8vIFNldCBzaXplIGFzIGhlaWdodFxuICAgICAgICAgICAgaWYgKHBvc2l0aW9uID09PSBcInRvcFwiIHx8IHBvc2l0aW9uID09PSBcImJvdHRvbVwiKSB7XG4gICAgICAgICAgICAgICAgbW9kYWwuc3R5bGUuaGVpZ2h0ID0gYCR7c2l6ZX1weGA7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sIDEwMCk7XG5cbiAgICAgICAgLy8gU2hvdy9oaWRlIG92ZXJsYXkgaGVhZGVyXG4gICAgICAgIGlmIChzaG93SGVhZGVyID09PSBmYWxzZSkge1xuICAgICAgICAgICAgbW9kYWwuY2xhc3NMaXN0LmFkZChcInBvcHVwLW92ZXJsYXktLXJlbW92ZS1oZWFkZXJcIik7XG4gICAgICAgIH1cblxuICAgICAgICBib2R5Tm9TY3JvbGwgPT09IHRydWUgJiYgZG9jdW1lbnQuYm9keS5jbGFzc0xpc3QuYWRkKFwicG9wdXAtb3ZlcmxheS1ub3Njcm9sbFwiKTtcblxuICAgICAgICBzZXRVbmRlcmxheUNvbG9yKCk7XG4gICAgICAgIGNvbnN0IHVuZGVybGF5ID0gZ2VuZXJhdGVVbmRlcmxheSgpO1xuICAgICAgICBjb25zdCBwcm9ncmVzcyA9IHdhaXRGb3IoXCIubXgtcHJvZ3Jlc3NcIiwgZm91bmRQcm9ncmVzcywgZG9jdW1lbnQpO1xuXG4gICAgICAgIGlmIChwcm9ncmVzcykge1xuICAgICAgICAgICAgdW5kZXJsYXkuY2xhc3NMaXN0LnJlbW92ZShcInZpc2libGVcIik7XG4gICAgICAgICAgICBtb2RhbC5jbGFzc0xpc3QucmVtb3ZlKFwidHJhbnNpdGlvblwiKTtcbiAgICAgICAgICAgIG1vZGFsLmNsYXNzTGlzdC5yZW1vdmUoXCJ2aXNpYmxlXCIpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgICAgICAgICAgZ2VuZXJhdGVDbG9zZUJ0bigpO1xuICAgICAgICAgICAgICAgIHNldFRpbWVvdXQoKCkgPT4gbGlua0Nsb3NlQnV0dG9ucygpLCAzMDApO1xuICAgICAgICAgICAgICAgIHNldFRpbWVvdXQoKCkgPT4gdW5kZXJsYXkgJiYgdW5kZXJsYXkuY2xhc3NMaXN0LmFkZChcInZpc2libGVcIiksIDMwMCk7XG4gICAgICAgICAgICAgICAgc2V0VGltZW91dCgoKSA9PiBtb2RhbCAmJiBtb2RhbC5jbGFzc0xpc3QuYWRkKFwidHJhbnNpdGlvblwiKSwgMzAwKTtcbiAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KCgpID0+IG1vZGFsICYmIG1vZGFsLmNsYXNzTGlzdC5hZGQoXCJ2aXNpYmxlXCIpLCAzMDApO1xuICAgICAgICAgICAgfSwgMzAwKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBudWxsO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiA8ZGl2IGNsYXNzTmFtZT1cImNvbnZlcnQtcG9wdXAtdG8tb3ZlcmxheVwiPjwvZGl2PjtcbiAgICB9XG59XG4iXSwibmFtZXMiOlsid2FpdEZvciIsImVsZW1lbnRDbGFzcyIsImNhbGxiYWNrIiwicGFyZW50IiwiY29udGV4dCIsImRvY3VtZW50IiwicXVlcnlTZWxlY3RvciIsIm9ic2VydmVyIiwiTXV0YXRpb25PYnNlcnZlciIsImRpc2Nvbm5lY3QiLCJvYnNlcnZlIiwiY2hpbGRMaXN0Iiwic3VidHJlZSIsIkNvbnZlcnRQb3B1cFRvT3ZlcmxheSIsImJvZHlOb1Njcm9sbCIsImNsb3NlQnV0dG9uQ2xhc3MiLCJjbG9zZUFjdGlvbiIsInBvc2l0aW9uIiwic2hvdWxkQ2xvc2VQYWdlIiwic2l6ZSIsInNob3dIZWFkZXIiLCJ1bmRlcmxheUNvbG9yIiwiY2FuUmVuZGVyIiwic2V0Q2FuUmVuZGVyIiwidXNlU3RhdGUiLCJtb2RhbCIsInNldE1vZGFsIiwidXNlRWZmZWN0IiwiY2xvc2VzdCIsInNldFVuZGVybGF5Q29sb3IiLCJkb2N1bWVudEVsZW1lbnQiLCJzdHlsZSIsInNldFByb3BlcnR5IiwicmVtb3ZlVW5kZXJsYXkiLCJ1bmRlcmxheSIsImNsYXNzTGlzdCIsInJlbW92ZSIsIkFuaW1hdGVDbG9zZU1vZGFsIiwic2V0VGltZW91dCIsImJvZHkiLCJjbG9zZU1vZGFsIiwiY2FuRXhlY3V0ZSIsImV4ZWN1dGUiLCJjbG9zZUJ0biIsImNsaWNrIiwiZ2VuZXJhdGVVbmRlcmxheSIsImluc2VydEFkamFjZW50SFRNTCIsImFkZEV2ZW50TGlzdGVuZXIiLCJhZGQiLCJnZW5lcmF0ZUNsb3NlQnRuIiwibW9kYWxDb250ZW50IiwibGlua0Nsb3NlQnV0dG9ucyIsInF1ZXJ5U2VsZWN0b3JBbGwiLCJmb3JFYWNoIiwiZm91bmRQcm9ncmVzcyIsIndpZHRoIiwiaGVpZ2h0IiwicHJvZ3Jlc3MiLCJjcmVhdGVFbGVtZW50Il0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7OztJQUFPLFNBQVNBLE9BQVQsQ0FBaUJDLFlB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
