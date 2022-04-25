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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQ29udmVydFBvcHVwVG9PdmVybGF5LmpzIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9zcmMvaGVscGVycy93YWl0Rm9yLmpzIiwiLi4vLi4vLi4vLi4vLi4vc3JjL0NvbnZlcnRQb3B1cFRvT3ZlcmxheS5qc3giXSwic291cmNlc0NvbnRlbnQiOlsiZXhwb3J0IGZ1bmN0aW9uIHdhaXRGb3IoZWxlbWVudENsYXNzLCBjYWxsYmFjaywgcGFyZW50KSB7XG4gIGNvbnN0IGNvbnRleHQgPSBwYXJlbnQgfHwgZG9jdW1lbnQ7XG5cbiAgaWYgKGNvbnRleHQucXVlcnlTZWxlY3RvcihlbGVtZW50Q2xhc3MpKSB7XG4gICAgY2FsbGJhY2soKTtcbiAgfSBlbHNlIHtcbiAgICBjb25zdCBvYnNlcnZlciA9IG5ldyBNdXRhdGlvbk9ic2VydmVyKCgpID0+IHtcbiAgICAgIGlmIChjb250ZXh0LnF1ZXJ5U2VsZWN0b3IoZWxlbWVudENsYXNzKSkge1xuICAgICAgICBvYnNlcnZlci5kaXNjb25uZWN0KCk7XG4gICAgICAgIGNhbGxiYWNrKCk7XG4gICAgICB9XG4gICAgfSk7XG4gIFxuICAgIC8vIFN0YXJ0IG9ic2VydmluZ1xuICAgIG9ic2VydmVyLm9ic2VydmUoY29udGV4dCwge1xuICAgICAgY2hpbGRMaXN0OiB0cnVlLCAvL1RoaXMgaXMgYSBtdXN0IGhhdmUgZm9yIHRoZSBvYnNlcnZlciB3aXRoIHN1YnRyZWVcbiAgICAgIHN1YnRyZWU6IHRydWUsIC8vU2V0IHRvIHRydWUgaWYgY2hhbmdlcyBtdXN0IGFsc28gYmUgb2JzZXJ2ZWQgaW4gZGVzY2VuZGFudHMuXG4gICAgfSk7XG4gIH1cbn07IiwiLyogZXNsaW50LWRpc2FibGUgbm8tdW51c2VkLWV4cHJlc3Npb25zICovXG5pbXBvcnQgXCIuL3VpL0NvbnZlcnRQb3B1cFRvT3ZlcmxheS5jc3NcIjtcbmltcG9ydCB7IGNyZWF0ZUVsZW1lbnQsIHVzZUVmZmVjdCwgdXNlU3RhdGUgfSBmcm9tIFwicmVhY3RcIjtcbmltcG9ydCB7IHdhaXRGb3IgfSBmcm9tIFwiLi9oZWxwZXJzL3dhaXRGb3JcIjtcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gQ29udmVydFBvcHVwVG9PdmVybGF5KHtcbiAgICBib2R5Tm9TY3JvbGwsXG4gICAgY2xvc2VCdXR0b25DbGFzcyxcbiAgICBjbG9zZUFjdGlvbixcbiAgICBwb3NpdGlvbixcbiAgICBzaG91bGRDbG9zZVBhZ2UsXG4gICAgc2l6ZSxcbiAgICBzaG93SGVhZGVyLFxuICAgIHVuZGVybGF5Q29sb3Jcbn0pIHtcbiAgICBjb25zdCBbY2FuUmVuZGVyLCBzZXRDYW5SZW5kZXJdID0gdXNlU3RhdGUoZmFsc2UpO1xuICAgIGNvbnN0IFttb2RhbCwgc2V0TW9kYWxdID0gdXNlU3RhdGUobnVsbCk7XG5cbiAgICB1c2VFZmZlY3QoKCkgPT4ge1xuICAgICAgICBpZiAoZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5jb252ZXJ0LXBvcHVwLXRvLW92ZXJsYXlcIikpIHtcbiAgICAgICAgICAgIHNldE1vZGFsKGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIuY29udmVydC1wb3B1cC10by1vdmVybGF5XCIpLmNsb3Nlc3QoXCIubW9kYWwtZGlhbG9nXCIpKTtcbiAgICAgICAgICAgIHNldENhblJlbmRlcih0cnVlKTtcbiAgICAgICAgfVxuICAgIH0pO1xuXG4gICAgZnVuY3Rpb24gc2V0VW5kZXJsYXlDb2xvcigpIHtcbiAgICAgICAgdW5kZXJsYXlDb2xvciAmJiBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuc3R5bGUuc2V0UHJvcGVydHkoYC0tdW5kZXJsYXktY29sb3JgLCB1bmRlcmxheUNvbG9yKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiByZW1vdmVVbmRlcmxheSgpIHtcbiAgICAgICAgY29uc3QgdW5kZXJsYXkgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLnBvcHVwLXVuZGVybGF5Lm9sZFwiKTtcbiAgICAgICAgdW5kZXJsYXkgJiYgdW5kZXJsYXkuY2xhc3NMaXN0LnJlbW92ZShcInZpc2libGVcIik7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gQW5pbWF0ZUNsb3NlTW9kYWwoKSB7XG4gICAgICAgIGNvbnN0IG1vZGFsID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5wb3B1cC1vdmVybGF5XCIpO1xuICAgICAgICBtb2RhbCAmJiBtb2RhbC5jbGFzc0xpc3QucmVtb3ZlKFwidmlzaWJsZVwiKTtcbiAgICAgICAgYm9keU5vU2Nyb2xsID09PSB0cnVlICYmIHNldFRpbWVvdXQoKCkgPT4gZG9jdW1lbnQuYm9keS5jbGFzc0xpc3QucmVtb3ZlKFwicG9wdXAtb3ZlcmxheS1ub3Njcm9sbFwiKSwgMTAwKTtcbiAgICAgICAgcmVtb3ZlVW5kZXJsYXkoKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBjbG9zZU1vZGFsKCkge1xuICAgICAgICBBbmltYXRlQ2xvc2VNb2RhbCgpO1xuXG4gICAgICAgIGlmIChjbG9zZUFjdGlvbiAmJiBjbG9zZUFjdGlvbi5jYW5FeGVjdXRlKSB7XG4gICAgICAgICAgICBjbG9zZUFjdGlvbi5leGVjdXRlKCk7XG4gICAgICAgIH0gZWxzZSBpZiAoIWNsb3NlQWN0aW9uICYmIHNob3VsZENsb3NlUGFnZSA9PT0gdHJ1ZSkge1xuICAgICAgICAgICAgY29uc3QgY2xvc2VCdG4gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLnBvcHVwLW92ZXJsYXkgLmNsb3NlXCIpO1xuICAgICAgICAgICAgc2V0VGltZW91dCgoKSA9PiBjbG9zZUJ0bi5jbGljaygpLCAzMDApO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZ2VuZXJhdGVVbmRlcmxheSgpIHtcbiAgICAgICAgbW9kYWwuaW5zZXJ0QWRqYWNlbnRIVE1MKFwiYmVmb3JlZW5kXCIsICc8ZGl2IGNsYXNzPVwicG9wdXAtdW5kZXJsYXlcIj48L2Rpdj4nKTtcbiAgICAgICAgY29uc3QgdW5kZXJsYXkgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLnBvcHVwLXVuZGVybGF5Om5vdCgub2xkKVwiKTtcbiAgICAgICAgdW5kZXJsYXk/LmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBjbG9zZU1vZGFsKTtcbiAgICAgICAgdW5kZXJsYXk/LmNsYXNzTGlzdC5hZGQoXCJvbGRcIik7XG4gICAgICAgIHJldHVybiB1bmRlcmxheTtcbiAgICB9XG5cbiAgICAvLyBvdmVybGF5IGZvciB0aGUgZGVmYXVsdCBjbG9zZSBidXR0b25cbiAgICBmdW5jdGlvbiBnZW5lcmF0ZUNsb3NlQnRuKCkge1xuICAgICAgICBpZiAoc2hvd0hlYWRlciA9PT0gdHJ1ZSAmJiBzaG91bGRDbG9zZVBhZ2UgPT09IHRydWUpIHtcbiAgICAgICAgICAgIGNvbnN0IG1vZGFsQ29udGVudCA9IG1vZGFsLnF1ZXJ5U2VsZWN0b3IoXCIubW9kYWwtY29udGVudFwiKTtcbiAgICAgICAgICAgIG1vZGFsQ29udGVudC5pbnNlcnRBZGphY2VudEhUTUwoXCJhZnRlcmJlZ2luXCIsIGA8ZGl2IGNsYXNzPVwicG9wdXAtb3ZlcmxheV9fY2xvc2VidXR0b25cIj48L2Rpdj5gKTtcbiAgICAgICAgICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIucG9wdXAtb3ZlcmxheV9fY2xvc2VidXR0b25cIik/LmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBjbG9zZU1vZGFsKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIGxpbmtDbG9zZUJ1dHRvbnMoKSB7XG4gICAgICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoYC4ke2Nsb3NlQnV0dG9uQ2xhc3N9YCkuZm9yRWFjaChjbG9zZUJ0biA9PiB7XG4gICAgICAgICAgICBpZiAoc2hvdWxkQ2xvc2VQYWdlID09PSB0cnVlKSB7XG4gICAgICAgICAgICAgICAgY2xvc2VCdG4/LmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBjbG9zZU1vZGFsKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgY2xvc2VCdG4/LmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBBbmltYXRlQ2xvc2VNb2RhbCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIC8vIFdhaXQgd2l0aCB0cmFuc2l0aW9ucyBpbiBjYXNlIG9mIHByb2dyZXNzYmFyXG4gICAgZnVuY3Rpb24gZm91bmRQcm9ncmVzcygpIHtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuXG4gICAgaWYgKGNhblJlbmRlcikge1xuICAgICAgICBtb2RhbC5jbGFzc0xpc3QuYWRkKFwicG9wdXAtb3ZlcmxheVwiLCBgcG9wdXAtb3ZlcmxheS0tJHtwb3NpdGlvbn1gKTtcblxuICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgICAgIC8vIFNldCBzaXplIGFzIHdpZHRoXG4gICAgICAgICAgICBpZiAocG9zaXRpb24gPT09IFwibGVmdFwiIHx8IHBvc2l0aW9uID09PSBcInJpZ2h0XCIpIHtcbiAgICAgICAgICAgICAgICBtb2RhbC5zdHlsZS53aWR0aCA9IGAke3NpemV9cHhgO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy8gU2V0IHNpemUgYXMgaGVpZ2h0XG4gICAgICAgICAgICBpZiAocG9zaXRpb24gPT09IFwidG9wXCIgfHwgcG9zaXRpb24gPT09IFwiYm90dG9tXCIpIHtcbiAgICAgICAgICAgICAgICBtb2RhbC5zdHlsZS5oZWlnaHQgPSBgJHtzaXplfXB4YDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSwgMTAwKTtcblxuICAgICAgICAvLyBTaG93L2hpZGUgb3ZlcmxheSBoZWFkZXJcbiAgICAgICAgaWYgKHNob3dIZWFkZXIgPT09IGZhbHNlKSB7XG4gICAgICAgICAgICBtb2RhbC5jbGFzc0xpc3QuYWRkKFwicG9wdXAtb3ZlcmxheS0tcmVtb3ZlLWhlYWRlclwiKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGJvZHlOb1Njcm9sbCA9PT0gdHJ1ZSAmJiBkb2N1bWVudC5ib2R5LmNsYXNzTGlzdC5hZGQoXCJwb3B1cC1vdmVybGF5LW5vc2Nyb2xsXCIpO1xuXG4gICAgICAgIHNldFVuZGVybGF5Q29sb3IoKTtcbiAgICAgICAgY29uc3QgdW5kZXJsYXkgPSBnZW5lcmF0ZVVuZGVybGF5KCk7XG4gICAgICAgIGNvbnN0IHByb2dyZXNzID0gd2FpdEZvcihcIi5teC1wcm9ncmVzc1wiLCBmb3VuZFByb2dyZXNzLCBkb2N1bWVudCk7XG5cbiAgICAgICAgaWYgKHByb2dyZXNzKSB7XG4gICAgICAgICAgICB1bmRlcmxheS5jbGFzc0xpc3QucmVtb3ZlKFwidmlzaWJsZVwiKTtcbiAgICAgICAgICAgIG1vZGFsLmNsYXNzTGlzdC5yZW1vdmUoXCJ0cmFuc2l0aW9uXCIpO1xuICAgICAgICAgICAgbW9kYWwuY2xhc3NMaXN0LnJlbW92ZShcInZpc2libGVcIik7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgICAgICAgICBnZW5lcmF0ZUNsb3NlQnRuKCk7XG4gICAgICAgICAgICAgICAgc2V0VGltZW91dCgoKSA9PiBsaW5rQ2xvc2VCdXR0b25zKCksIDMwMCk7XG4gICAgICAgICAgICAgICAgc2V0VGltZW91dCgoKSA9PiB1bmRlcmxheSAmJiB1bmRlcmxheS5jbGFzc0xpc3QuYWRkKFwidmlzaWJsZVwiKSwgMzAwKTtcbiAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KCgpID0+IG1vZGFsICYmIG1vZGFsLmNsYXNzTGlzdC5hZGQoXCJ0cmFuc2l0aW9uXCIpLCAzMDApO1xuICAgICAgICAgICAgICAgIHNldFRpbWVvdXQoKCkgPT4gbW9kYWwgJiYgbW9kYWwuY2xhc3NMaXN0LmFkZChcInZpc2libGVcIiksIDMwMCk7XG4gICAgICAgICAgICB9LCAzMDApO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIDxkaXYgY2xhc3NOYW1lPVwiY29udmVydC1wb3B1cC10by1vdmVybGF5XCI+PC9kaXY+O1xuICAgIH1cbn1cbiJdLCJuYW1lcyI6WyJ3YWl0Rm9yIiwiZWxlbWVudENsYXNzIiwiY2FsbGJhY2siLCJwYXJlbnQiLCJjb250ZXh0IiwiZG9jdW1lbnQiLCJxdWVyeVNlbGVjdG9yIiwib2JzZXJ2ZXIiLCJNdXRhdGlvbk9ic2VydmVyIiwiZGlzY29ubmVjdCIsIm9ic2VydmUiLCJjaGlsZExpc3QiLCJzdWJ0cmVlIiwiQ29udmVydFBvcHVwVG9PdmVybGF5IiwiYm9keU5vU2Nyb2xsIiwiY2xvc2VCdXR0b25DbGFzcyIsImNsb3NlQWN0aW9uIiwicG9zaXRpb24iLCJzaG91bGRDbG9zZVBhZ2UiLCJzaXplIiwic2hvd0hlYWRlciIsInVuZGVybGF5Q29sb3IiLCJjYW5SZW5kZXIiLCJzZXRDYW5SZW5kZXIiLCJ1c2VTdGF0ZSIsIm1vZGFsIiwic2V0TW9kYWwiLCJ1c2VFZmZlY3QiLCJjbG9zZXN0Iiwic2V0VW5kZXJsYXlDb2xvciIsImRvY3VtZW50RWxlbWVudCIsInN0eWxlIiwic2V0UHJvcGVydHkiLCJyZW1vdmVVbmRlcmxheSIsInVuZGVybGF5IiwiY2xhc3NMaXN0IiwicmVtb3ZlIiwiQW5pbWF0ZUNsb3NlTW9kYWwiLCJzZXRUaW1lb3V0IiwiYm9keSIsImNsb3NlTW9kYWwiLCJjYW5FeGVjdXRlIiwiZXhlY3V0ZSIsImNsb3NlQnRuIiwiY2xpY2siLCJnZW5lcmF0ZVVuZGVybGF5IiwiaW5zZXJ0QWRqYWNlbnRIVE1MIiwiYWRkRXZlbnRMaXN0ZW5lciIsImFkZCIsImdlbmVyYXRlQ2xvc2VCdG4iLCJtb2RhbENvbnRlbnQiLCJsaW5rQ2xvc2VCdXR0b25zIiwicXVlcnlTZWxlY3RvckFsbCIsImZvckVhY2giLCJmb3VuZFByb2dyZXNzIiwid2lkdGgiLCJoZWlnaHQiLCJwcm9ncmVzcyIsImNyZWF0ZUVsZW1lbnQiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7O0lBQU8sU0FBU0EsT0FBVCxDQUFpQkMsWUFBakIsRUFBK0JDLFFBQS9CLEVB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
