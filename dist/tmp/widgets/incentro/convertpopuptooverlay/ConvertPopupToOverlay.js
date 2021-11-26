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
        return react.createElement("div", {
          className: "convert-popup-to-overlay"
        });
      }
    }

    return ConvertPopupToOverlay;

}));
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQ29udmVydFBvcHVwVG9PdmVybGF5LmpzIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9zcmMvaGVscGVycy93YWl0Rm9yLmpzIiwiLi4vLi4vLi4vLi4vLi4vc3JjL0NvbnZlcnRQb3B1cFRvT3ZlcmxheS5qc3giXSwic291cmNlc0NvbnRlbnQiOlsiZXhwb3J0IGZ1bmN0aW9uIHdhaXRGb3IoZWxlbWVudENsYXNzLCBjYWxsYmFjaywgcGFyZW50KSB7XG4gIGNvbnN0IGNvbnRleHQgPSBwYXJlbnQgfHwgZG9jdW1lbnQ7XG5cbiAgaWYgKGNvbnRleHQucXVlcnlTZWxlY3RvcihlbGVtZW50Q2xhc3MpKSB7XG4gICAgY2FsbGJhY2soKTtcbiAgfSBlbHNlIHtcbiAgICBjb25zdCBvYnNlcnZlciA9IG5ldyBNdXRhdGlvbk9ic2VydmVyKCgpID0+IHtcbiAgICAgIGlmIChjb250ZXh0LnF1ZXJ5U2VsZWN0b3IoZWxlbWVudENsYXNzKSkge1xuICAgICAgICBvYnNlcnZlci5kaXNjb25uZWN0KCk7XG4gICAgICAgIGNhbGxiYWNrKCk7XG4gICAgICB9XG4gICAgfSk7XG4gIFxuICAgIC8vIFN0YXJ0IG9ic2VydmluZ1xuICAgIG9ic2VydmVyLm9ic2VydmUoY29udGV4dCwge1xuICAgICAgY2hpbGRMaXN0OiB0cnVlLCAvL1RoaXMgaXMgYSBtdXN0IGhhdmUgZm9yIHRoZSBvYnNlcnZlciB3aXRoIHN1YnRyZWVcbiAgICAgIHN1YnRyZWU6IHRydWUsIC8vU2V0IHRvIHRydWUgaWYgY2hhbmdlcyBtdXN0IGFsc28gYmUgb2JzZXJ2ZWQgaW4gZGVzY2VuZGFudHMuXG4gICAgfSk7XG4gIH1cbn07IiwiLyogZXNsaW50LWRpc2FibGUgbm8tdW51c2VkLWV4cHJlc3Npb25zICovXG5pbXBvcnQgXCIuL3VpL0NvbnZlcnRQb3B1cFRvT3ZlcmxheS5jc3NcIjtcbmltcG9ydCB7IGNyZWF0ZUVsZW1lbnQsIHVzZUVmZmVjdCwgdXNlU3RhdGUgfSBmcm9tIFwicmVhY3RcIjtcbmltcG9ydCB7IHdhaXRGb3IgfSBmcm9tIFwiLi9oZWxwZXJzL3dhaXRGb3JcIjtcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gQ29udmVydFBvcHVwVG9PdmVybGF5KHtcbiAgICBjbG9zZUJ1dHRvbkNsYXNzLFxuICAgIGNsb3NlQWN0aW9uLFxuICAgIHBvc2l0aW9uLFxuICAgIHNob3VsZENsb3NlUGFnZSxcbiAgICBzaXplLFxuICAgIHNob3dIZWFkZXIsXG4gICAgdW5kZXJsYXlDb2xvclxufSkge1xuICAgIGNvbnN0IFtjYW5SZW5kZXIsIHNldENhblJlbmRlcl0gPSB1c2VTdGF0ZShmYWxzZSk7XG4gICAgY29uc3QgW21vZGFsLCBzZXRNb2RhbF0gPSB1c2VTdGF0ZShudWxsKTtcblxuICAgIHVzZUVmZmVjdCgoKSA9PiB7XG4gICAgICAgIGlmIChkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLmNvbnZlcnQtcG9wdXAtdG8tb3ZlcmxheVwiKSkge1xuICAgICAgICAgICAgc2V0TW9kYWwoZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5jb252ZXJ0LXBvcHVwLXRvLW92ZXJsYXlcIikuY2xvc2VzdChcIi5tb2RhbC1kaWFsb2dcIikpO1xuICAgICAgICAgICAgc2V0Q2FuUmVuZGVyKHRydWUpO1xuICAgICAgICB9XG4gICAgfSk7XG5cbiAgICBmdW5jdGlvbiBzZXRVbmRlcmxheUNvbG9yKCkge1xuICAgICAgICB1bmRlcmxheUNvbG9yICYmIGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5zdHlsZS5zZXRQcm9wZXJ0eShgLS11bmRlcmxheS1jb2xvcmAsIHVuZGVybGF5Q29sb3IpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHJlbW92ZVVuZGVybGF5KCkge1xuICAgICAgICBjb25zdCB1bmRlcmxheSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIucG9wdXAtdW5kZXJsYXkub2xkXCIpO1xuICAgICAgICB1bmRlcmxheSAmJiB1bmRlcmxheS5jbGFzc0xpc3QucmVtb3ZlKFwidmlzaWJsZVwiKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBBbmltYXRlQ2xvc2VNb2RhbCgpIHtcbiAgICAgICAgY29uc3QgbW9kYWwgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLnBvcHVwLW92ZXJsYXlcIik7XG4gICAgICAgIG1vZGFsICYmIG1vZGFsLmNsYXNzTGlzdC5yZW1vdmUoXCJ2aXNpYmxlXCIpO1xuICAgICAgICBkb2N1bWVudC5ib2R5LmNsYXNzTGlzdC5yZW1vdmUoXCJwb3B1cC1vdmVybGF5LW5vc2Nyb2xsXCIpO1xuICAgICAgICByZW1vdmVVbmRlcmxheSgpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGNsb3NlTW9kYWwoKSB7XG4gICAgICAgIEFuaW1hdGVDbG9zZU1vZGFsKCk7XG5cbiAgICAgICAgaWYgKGNsb3NlQWN0aW9uICYmIGNsb3NlQWN0aW9uLmNhbkV4ZWN1dGUpIHtcbiAgICAgICAgICAgIGNsb3NlQWN0aW9uLmV4ZWN1dGUoKTtcbiAgICAgICAgfSBlbHNlIGlmICghY2xvc2VBY3Rpb24gJiYgc2hvdWxkQ2xvc2VQYWdlID09PSB0cnVlKSB7XG4gICAgICAgICAgICBjb25zdCBjbG9zZUJ0biA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIucG9wdXAtb3ZlcmxheSAuY2xvc2VcIik7XG4gICAgICAgICAgICBzZXRUaW1lb3V0KCgpID0+IGNsb3NlQnRuLmNsaWNrKCksIDMwMCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBmdW5jdGlvbiBnZW5lcmF0ZVVuZGVybGF5KCkge1xuICAgICAgICBtb2RhbC5pbnNlcnRBZGphY2VudEhUTUwoXCJiZWZvcmVlbmRcIiwgJzxkaXYgY2xhc3M9XCJwb3B1cC11bmRlcmxheVwiPjwvZGl2PicpO1xuICAgICAgICBjb25zdCB1bmRlcmxheSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIucG9wdXAtdW5kZXJsYXk6bm90KC5vbGQpXCIpO1xuICAgICAgICB1bmRlcmxheSAmJiB1bmRlcmxheS5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgY2xvc2VNb2RhbCk7XG4gICAgICAgIHVuZGVybGF5ICYmIHVuZGVybGF5LmNsYXNzTGlzdC5hZGQoXCJvbGRcIik7XG4gICAgICAgIHJldHVybiB1bmRlcmxheTtcbiAgICB9XG5cbiAgICAvLyBvdmVybGF5IGZvciB0aGUgZGVmYXVsdCBjbG9zZSBidXR0b25cbiAgICBmdW5jdGlvbiBnZW5lcmF0ZUNsb3NlQnRuKCkge1xuICAgICAgICBpZiAoc2hvd0hlYWRlciA9PT0gdHJ1ZSAmJiBzaG91bGRDbG9zZVBhZ2UgPT09IHRydWUpIHtcbiAgICAgICAgICAgIGNvbnN0IG1vZGFsQ29udGVudCA9IG1vZGFsLnF1ZXJ5U2VsZWN0b3IoXCIubW9kYWwtY29udGVudFwiKTtcbiAgICAgICAgICAgIG1vZGFsQ29udGVudC5pbnNlcnRBZGphY2VudEhUTUwoXCJhZnRlcmJlZ2luXCIsIGA8ZGl2IGNsYXNzPVwicG9wdXAtb3ZlcmxheV9fY2xvc2VidXR0b25cIj48L2Rpdj5gKTtcbiAgICAgICAgICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIucG9wdXAtb3ZlcmxheV9fY2xvc2VidXR0b25cIikuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGNsb3NlTW9kYWwpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gbGlua0Nsb3NlQnV0dG9ucygpIHtcbiAgICAgICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChgLiR7Y2xvc2VCdXR0b25DbGFzc31gKS5mb3JFYWNoKGNsb3NlQnRuID0+IHtcbiAgICAgICAgICAgIGlmIChzaG91bGRDbG9zZVBhZ2UgPT09IHRydWUpIHtcbiAgICAgICAgICAgICAgICBjbG9zZUJ0bi5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgY2xvc2VNb2RhbCk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGNsb3NlQnRuLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBBbmltYXRlQ2xvc2VNb2RhbCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIC8vIFdhaXQgd2l0aCB0cmFuc2l0aW9ucyBpbiBjYXNlIG9mIHByb2dyZXNzYmFyXG4gICAgZnVuY3Rpb24gZm91bmRQcm9ncmVzcygpIHtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuXG4gICAgaWYgKGNhblJlbmRlcikge1xuICAgICAgICBtb2RhbC5jbGFzc0xpc3QuYWRkKFwicG9wdXAtb3ZlcmxheVwiLCBgcG9wdXAtb3ZlcmxheS0tJHtwb3NpdGlvbn1gKTtcblxuICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgICAgIC8vIFNldCBzaXplIGFzIHdpZHRoXG4gICAgICAgICAgICBpZiAocG9zaXRpb24gPT09IFwibGVmdFwiIHx8IHBvc2l0aW9uID09PSBcInJpZ2h0XCIpIHtcbiAgICAgICAgICAgICAgICBtb2RhbC5zdHlsZS53aWR0aCA9IGAke3NpemV9cHhgO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy8gU2V0IHNpemUgYXMgaGVpZ2h0XG4gICAgICAgICAgICBpZiAocG9zaXRpb24gPT09IFwidG9wXCIgfHwgcG9zaXRpb24gPT09IFwiYm90dG9tXCIpIHtcbiAgICAgICAgICAgICAgICBtb2RhbC5zdHlsZS5oZWlnaHQgPSBgJHtzaXplfXB4YDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSwgMTAwKTtcblxuICAgICAgICAvLyBTaG93L2hpZGUgb3ZlcmxheSBoZWFkZXJcbiAgICAgICAgaWYgKHNob3dIZWFkZXIgPT09IGZhbHNlKSB7XG4gICAgICAgICAgICBtb2RhbC5jbGFzc0xpc3QuYWRkKFwicG9wdXAtb3ZlcmxheS0tcmVtb3ZlLWhlYWRlclwiKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGRvY3VtZW50LmJvZHkuY2xhc3NMaXN0LmFkZChcInBvcHVwLW92ZXJsYXktbm9zY3JvbGxcIik7XG5cbiAgICAgICAgc2V0VW5kZXJsYXlDb2xvcigpO1xuICAgICAgICBjb25zdCB1bmRlcmxheSA9IGdlbmVyYXRlVW5kZXJsYXkoKTtcbiAgICAgICAgY29uc3QgcHJvZ3Jlc3MgPSB3YWl0Rm9yKFwiLm14LXByb2dyZXNzXCIsIGZvdW5kUHJvZ3Jlc3MsIGRvY3VtZW50KTtcblxuICAgICAgICBpZiAocHJvZ3Jlc3MpIHtcbiAgICAgICAgICAgIHVuZGVybGF5LmNsYXNzTGlzdC5yZW1vdmUoXCJ2aXNpYmxlXCIpO1xuICAgICAgICAgICAgbW9kYWwuY2xhc3NMaXN0LnJlbW92ZShcInRyYW5zaXRpb25cIik7XG4gICAgICAgICAgICBtb2RhbC5jbGFzc0xpc3QucmVtb3ZlKFwidmlzaWJsZVwiKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgICAgICAgIGdlbmVyYXRlQ2xvc2VCdG4oKTtcbiAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KCgpID0+IGxpbmtDbG9zZUJ1dHRvbnMoKSwgMzAwKTtcbiAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHVuZGVybGF5ICYmIHVuZGVybGF5LmNsYXNzTGlzdC5hZGQoXCJ2aXNpYmxlXCIpLCAzMDApO1xuICAgICAgICAgICAgICAgIHNldFRpbWVvdXQoKCkgPT4gbW9kYWwgJiYgbW9kYWwuY2xhc3NMaXN0LmFkZChcInRyYW5zaXRpb25cIiksIDMwMCk7XG4gICAgICAgICAgICAgICAgc2V0VGltZW91dCgoKSA9PiBtb2RhbCAmJiBtb2RhbC5jbGFzc0xpc3QuYWRkKFwidmlzaWJsZVwiKSwgMzAwKTtcbiAgICAgICAgICAgIH0sIDMwMCk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gPGRpdiBjbGFzc05hbWU9XCJjb252ZXJ0LXBvcHVwLXRvLW92ZXJsYXlcIj48L2Rpdj47XG4gICAgfVxufVxuIl0sIm5hbWVzIjpbIndhaXRGb3IiLCJlbGVtZW50Q2xhc3MiLCJjYWxsYmFjayIsInBhcmVudCIsImNvbnRleHQiLCJkb2N1bWVudCIsInF1ZXJ5U2VsZWN0b3IiLCJvYnNlcnZlciIsIk11dGF0aW9uT2JzZXJ2ZXIiLCJkaXNjb25uZWN0Iiwib2JzZXJ2ZSIsImNoaWxkTGlzdCIsInN1YnRyZWUiLCJDb252ZXJ0UG9wdXBUb092ZXJsYXkiLCJjbG9zZUJ1dHRvbkNsYXNzIiwiY2xvc2VBY3Rpb24iLCJwb3NpdGlvbiIsInNob3VsZENsb3NlUGFnZSIsInNpemUiLCJzaG93SGVhZGVyIiwidW5kZXJsYXlDb2xvciIsImNhblJlbmRlciIsInNldENhblJlbmRlciIsInVzZVN0YXRlIiwibW9kYWwiLCJzZXRNb2RhbCIsInVzZUVmZmVjdCIsImNsb3Nlc3QiLCJzZXRVbmRlcmxheUNvbG9yIiwiZG9jdW1lbnRFbGVtZW50Iiwic3R5bGUiLCJzZXRQcm9wZXJ0eSIsInJlbW92ZVVuZGVybGF5IiwidW5kZXJsYXkiLCJjbGFzc0xpc3QiLCJyZW1vdmUiLCJBbmltYXRlQ2xvc2VNb2RhbCIsImJvZHkiLCJjbG9zZU1vZGFsIiwiY2FuRXhlY3V0ZSIsImV4ZWN1dGUiLCJjbG9zZUJ0biIsInNldFRpbWVvdXQiLCJjbGljayIsImdlbmVyYXRlVW5kZXJsYXkiLCJpbnNlcnRBZGphY2VudEhUTUwiLCJhZGRFdmVudExpc3RlbmVyIiwiYWRkIiwiZ2VuZXJhdGVDbG9zZUJ0biIsIm1vZGFsQ29udGVudCIsImxpbmtDbG9zZUJ1dHRvbnMiLCJxdWVyeVNlbGVjdG9yQWxsIiwiZm9yRWFjaCIsImZvdW5kUHJvZ3Jlc3MiLCJ3aWR0aCIsImhlaWdodCIsInByb2dyZXNzIiwiY3JlYXRlRWxlbWVudCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7SUFBTyxTQUFTQSxPQUFULENBQWlCQyxZQUFqQixFQUErQkMsUUFBL0IsRUFBeUNDLE1BQXpDLEVBQWlEO0lBQ3RELFFBQU1DLE9BQU8sR0FBR0QsTUFBTSxJQUFJRSxRQUExQjs7SUFFQSxNQUFJRCxPQUFPLENBQUNFLGFBQVIsQ0FB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
