define(['react'], (function (react) { 'use strict';

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
    const [canRender, setCanRender] = react.useState(false);
    const [modal, setModal] = react.useState(null);
    react.useEffect(() => {
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQ29udmVydFBvcHVwVG9PdmVybGF5LmpzIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9zcmMvaGVscGVycy93YWl0Rm9yLmpzIiwiLi4vLi4vLi4vLi4vLi4vc3JjL0NvbnZlcnRQb3B1cFRvT3ZlcmxheS5qc3giXSwic291cmNlc0NvbnRlbnQiOlsiZXhwb3J0IGZ1bmN0aW9uIHdhaXRGb3IoZWxlbWVudENsYXNzLCBjYWxsYmFjaywgcGFyZW50KSB7XG4gIGNvbnN0IGNvbnRleHQgPSBwYXJlbnQgfHwgZG9jdW1lbnQ7XG5cbiAgaWYgKGNvbnRleHQucXVlcnlTZWxlY3RvcihlbGVtZW50Q2xhc3MpKSB7XG4gICAgY2FsbGJhY2soKTtcbiAgfSBlbHNlIHtcbiAgICBjb25zdCBvYnNlcnZlciA9IG5ldyBNdXRhdGlvbk9ic2VydmVyKCgpID0+IHtcbiAgICAgIGlmIChjb250ZXh0LnF1ZXJ5U2VsZWN0b3IoZWxlbWVudENsYXNzKSkge1xuICAgICAgICBvYnNlcnZlci5kaXNjb25uZWN0KCk7XG4gICAgICAgIGNhbGxiYWNrKCk7XG4gICAgICB9XG4gICAgfSk7XG4gIFxuICAgIC8vIFN0YXJ0IG9ic2VydmluZ1xuICAgIG9ic2VydmVyLm9ic2VydmUoY29udGV4dCwge1xuICAgICAgY2hpbGRMaXN0OiB0cnVlLCAvL1RoaXMgaXMgYSBtdXN0IGhhdmUgZm9yIHRoZSBvYnNlcnZlciB3aXRoIHN1YnRyZWVcbiAgICAgIHN1YnRyZWU6IHRydWUsIC8vU2V0IHRvIHRydWUgaWYgY2hhbmdlcyBtdXN0IGFsc28gYmUgb2JzZXJ2ZWQgaW4gZGVzY2VuZGFudHMuXG4gICAgfSk7XG4gIH1cbn07IiwiaW1wb3J0IFwiLi91aS9Db252ZXJ0UG9wdXBUb092ZXJsYXkuY3NzXCI7XG5pbXBvcnQgeyBjcmVhdGVFbGVtZW50LCB1c2VFZmZlY3QsIHVzZVN0YXRlIH0gZnJvbSBcInJlYWN0XCI7XG5pbXBvcnQgeyB3YWl0Rm9yIH0gZnJvbSBcIi4vaGVscGVycy93YWl0Rm9yXCI7XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIENvbnZlcnRQb3B1cFRvT3ZlcmxheSh7XG4gICAgY2xvc2VCdXR0b25DbGFzcyxcbiAgICBjbG9zZUFjdGlvbixcbiAgICBwb3NpdGlvbixcbiAgICBzaG91bGRDbG9zZVBhZ2UsXG4gICAgc2l6ZSxcbiAgICBzaG93SGVhZGVyLFxuICAgIHVuZGVybGF5Q29sb3Jcbn0pIHtcbiAgICBjb25zdCBbY2FuUmVuZGVyLCBzZXRDYW5SZW5kZXJdID0gdXNlU3RhdGUoZmFsc2UpO1xuICAgIGNvbnN0IFttb2RhbCwgc2V0TW9kYWxdID0gdXNlU3RhdGUobnVsbCk7XG5cbiAgICB1c2VFZmZlY3QoKCkgPT4ge1xuICAgICAgICBpZiAoZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5jb252ZXJ0LXBvcHVwLXRvLW92ZXJsYXlcIikpIHtcbiAgICAgICAgICAgIHNldE1vZGFsKGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIuY29udmVydC1wb3B1cC10by1vdmVybGF5XCIpLmNsb3Nlc3QoXCIubW9kYWwtZGlhbG9nXCIpKTtcbiAgICAgICAgICAgIHNldENhblJlbmRlcih0cnVlKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiAoKSA9PiB7XG4gICAgICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgICAgICAgICBpZiAoIWRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIucG9wdXAtb3ZlcmxheVwiKSkge1xuICAgICAgICAgICAgICAgICAgICBkb2N1bWVudC5ib2R5LmNsYXNzTGlzdC5yZW1vdmUoXCJwb3B1cC1vdmVybGF5LW5vc2Nyb2xsXCIpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sIDMwMCk7XG4gICAgICAgIH07XG4gICAgfSk7XG5cbiAgICBmdW5jdGlvbiBzZXRVbmRlcmxheUNvbG9yKCkge1xuICAgICAgICB1bmRlcmxheUNvbG9yICYmIGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5zdHlsZS5zZXRQcm9wZXJ0eShgLS11bmRlcmxheS1jb2xvcmAsIHVuZGVybGF5Q29sb3IpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHJlbW92ZVVuZGVybGF5KCkge1xuICAgICAgICBjb25zdCB1bmRlcmxheSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIucG9wdXAtdW5kZXJsYXkub2xkXCIpO1xuICAgICAgICB1bmRlcmxheSAmJiB1bmRlcmxheS5jbGFzc0xpc3QucmVtb3ZlKFwidmlzaWJsZVwiKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBBbmltYXRlQ2xvc2VNb2RhbCgpIHtcbiAgICAgICAgY29uc3QgbW9kYWwgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLnBvcHVwLW92ZXJsYXlcIik7XG4gICAgICAgIG1vZGFsICYmIG1vZGFsLmNsYXNzTGlzdC5yZW1vdmUoXCJ2aXNpYmxlXCIpO1xuICAgICAgICBzZXRUaW1lb3V0KCgpID0+IGRvY3VtZW50LmJvZHkuY2xhc3NMaXN0LnJlbW92ZShcInBvcHVwLW92ZXJsYXktbm9zY3JvbGxcIiksIDEwMCk7XG4gICAgICAgIHJlbW92ZVVuZGVybGF5KCk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gY2xvc2VNb2RhbCgpIHtcbiAgICAgICAgQW5pbWF0ZUNsb3NlTW9kYWwoKTtcblxuICAgICAgICBpZiAoY2xvc2VBY3Rpb24gJiYgY2xvc2VBY3Rpb24uY2FuRXhlY3V0ZSkge1xuICAgICAgICAgICAgY2xvc2VBY3Rpb24uZXhlY3V0ZSgpO1xuICAgICAgICB9IGVsc2UgaWYgKCFjbG9zZUFjdGlvbiAmJiBzaG91bGRDbG9zZVBhZ2UgPT09IHRydWUpIHtcbiAgICAgICAgICAgIGNvbnN0IGNsb3NlQnRuID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5wb3B1cC1vdmVybGF5IC5jbG9zZVwiKTtcbiAgICAgICAgICAgIHNldFRpbWVvdXQoKCkgPT4gY2xvc2VCdG4uY2xpY2soKSwgMzAwKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIGdlbmVyYXRlVW5kZXJsYXkoKSB7XG4gICAgICAgIG1vZGFsLmluc2VydEFkamFjZW50SFRNTChcImJlZm9yZWVuZFwiLCAnPGRpdiBjbGFzcz1cInBvcHVwLXVuZGVybGF5XCI+PC9kaXY+Jyk7XG4gICAgICAgIGNvbnN0IHVuZGVybGF5ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5wb3B1cC11bmRlcmxheTpub3QoLm9sZClcIik7XG4gICAgICAgIHVuZGVybGF5Py5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgY2xvc2VNb2RhbCk7XG4gICAgICAgIHVuZGVybGF5Py5jbGFzc0xpc3QuYWRkKFwib2xkXCIpO1xuICAgICAgICByZXR1cm4gdW5kZXJsYXk7XG4gICAgfVxuXG4gICAgLy8gb3ZlcmxheSBmb3IgdGhlIGRlZmF1bHQgY2xvc2UgYnV0dG9uXG4gICAgZnVuY3Rpb24gZ2VuZXJhdGVDbG9zZUJ0bigpIHtcbiAgICAgICAgaWYgKHNob3dIZWFkZXIgPT09IHRydWUgJiYgc2hvdWxkQ2xvc2VQYWdlID09PSB0cnVlKSB7XG4gICAgICAgICAgICBjb25zdCBtb2RhbENvbnRlbnQgPSBtb2RhbC5xdWVyeVNlbGVjdG9yKFwiLm1vZGFsLWNvbnRlbnRcIik7XG4gICAgICAgICAgICBtb2RhbENvbnRlbnQuaW5zZXJ0QWRqYWNlbnRIVE1MKFwiYWZ0ZXJiZWdpblwiLCBgPGRpdiBjbGFzcz1cInBvcHVwLW92ZXJsYXlfX2Nsb3NlYnV0dG9uXCI+PC9kaXY+YCk7XG4gICAgICAgICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLnBvcHVwLW92ZXJsYXlfX2Nsb3NlYnV0dG9uXCIpPy5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgY2xvc2VNb2RhbCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBmdW5jdGlvbiBsaW5rQ2xvc2VCdXR0b25zKCkge1xuICAgICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKGAuJHtjbG9zZUJ1dHRvbkNsYXNzfWApLmZvckVhY2goY2xvc2VCdG4gPT4ge1xuICAgICAgICAgICAgaWYgKHNob3VsZENsb3NlUGFnZSA9PT0gdHJ1ZSkge1xuICAgICAgICAgICAgICAgIGNsb3NlQnRuPy5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgY2xvc2VNb2RhbCk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGNsb3NlQnRuPy5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgQW5pbWF0ZUNsb3NlTW9kYWwpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICAvLyBXYWl0IHdpdGggdHJhbnNpdGlvbnMgaW4gY2FzZSBvZiBwcm9ncmVzc2JhclxuICAgIGZ1bmN0aW9uIGZvdW5kUHJvZ3Jlc3MoKSB7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cblxuICAgIGlmIChjYW5SZW5kZXIpIHtcbiAgICAgICAgbW9kYWwuY2xhc3NMaXN0LmFkZChcInBvcHVwLW92ZXJsYXlcIiwgYHBvcHVwLW92ZXJsYXktLSR7cG9zaXRpb259YCk7XG4gICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgICAgLy8gU2V0IHNpemUgYXMgd2lkdGhcbiAgICAgICAgICAgIGlmIChwb3NpdGlvbiA9PT0gXCJsZWZ0XCIgfHwgcG9zaXRpb24gPT09IFwicmlnaHRcIikge1xuICAgICAgICAgICAgICAgIG1vZGFsLnN0eWxlLndpZHRoID0gYCR7c2l6ZX1weGA7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvLyBTZXQgc2l6ZSBhcyBoZWlnaHRcbiAgICAgICAgICAgIGlmIChwb3NpdGlvbiA9PT0gXCJ0b3BcIiB8fCBwb3NpdGlvbiA9PT0gXCJib3R0b21cIikge1xuICAgICAgICAgICAgICAgIG1vZGFsLnN0eWxlLmhlaWdodCA9IGAke3NpemV9cHhgO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZG9jdW1lbnQuYm9keS5jbGFzc0xpc3QuYWRkKFwicG9wdXAtb3ZlcmxheS1ub3Njcm9sbFwiKTtcbiAgICAgICAgfSwgMTAwKTtcbiAgICAgICAgc2hvd0hlYWRlciA9PT0gZmFsc2UgJiYgbW9kYWwuY2xhc3NMaXN0LmFkZChcInBvcHVwLW92ZXJsYXktLXJlbW92ZS1oZWFkZXJcIik7XG4gICAgICAgIHNldFVuZGVybGF5Q29sb3IoKTtcbiAgICAgICAgY29uc3QgdW5kZXJsYXkgPSBnZW5lcmF0ZVVuZGVybGF5KCk7XG4gICAgICAgIGNvbnN0IHByb2dyZXNzID0gd2FpdEZvcihcIi5teC1wcm9ncmVzc1wiLCBmb3VuZFByb2dyZXNzLCBkb2N1bWVudCk7XG5cbiAgICAgICAgaWYgKHByb2dyZXNzKSB7XG4gICAgICAgICAgICB1bmRlcmxheS5jbGFzc0xpc3QucmVtb3ZlKFwidmlzaWJsZVwiKTtcbiAgICAgICAgICAgIG1vZGFsLmNsYXNzTGlzdC5yZW1vdmUoXCJ0cmFuc2l0aW9uXCIpO1xuICAgICAgICAgICAgbW9kYWwuY2xhc3NMaXN0LnJlbW92ZShcInZpc2libGVcIik7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgICAgICAgICBnZW5lcmF0ZUNsb3NlQnRuKCk7XG4gICAgICAgICAgICAgICAgc2V0VGltZW91dCgoKSA9PiBsaW5rQ2xvc2VCdXR0b25zKCksIDMwMCk7XG4gICAgICAgICAgICAgICAgc2V0VGltZW91dCgoKSA9PiB1bmRlcmxheSAmJiB1bmRlcmxheS5jbGFzc0xpc3QuYWRkKFwidmlzaWJsZVwiKSwgMzAwKTtcbiAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KCgpID0+IG1vZGFsICYmIG1vZGFsLmNsYXNzTGlzdC5hZGQoXCJ0cmFuc2l0aW9uXCIpLCAzMDApO1xuICAgICAgICAgICAgICAgIHNldFRpbWVvdXQoKCkgPT4gbW9kYWwgJiYgbW9kYWwuY2xhc3NMaXN0LmFkZChcInZpc2libGVcIiksIDMwMCk7XG4gICAgICAgICAgICB9LCAzMDApO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIDxkaXYgY2xhc3NOYW1lPVwiY29udmVydC1wb3B1cC10by1vdmVybGF5XCI+PC9kaXY+O1xuICAgIH1cbn1cbiJdLCJuYW1lcyI6WyJ3YWl0Rm9yIiwiZWxlbWVudENsYXNzIiwiY2FsbGJhY2siLCJwYXJlbnQiLCJjb250ZXh0IiwiZG9jdW1lbnQiLCJxdWVyeVNlbGVjdG9yIiwib2JzZXJ2ZXIiLCJNdXRhdGlvbk9ic2VydmVyIiwiZGlzY29ubmVjdCIsIm9ic2VydmUiLCJjaGlsZExpc3QiLCJzdWJ0cmVlIiwiQ29udmVydFBvcHVwVG9PdmVybGF5IiwiY2xvc2VCdXR0b25DbGFzcyIsImNsb3NlQWN0aW9uIiwicG9zaXRpb24iLCJzaG91bGRDbG9zZVBhZ2UiLCJzaXplIiwic2hvd0hlYWRlciIsInVuZGVybGF5Q29sb3IiLCJjYW5SZW5kZXIiLCJzZXRDYW5SZW5kZXIiLCJ1c2VTdGF0ZSIsIm1vZGFsIiwic2V0TW9kYWwiLCJ1c2VFZmZlY3QiLCJjbG9zZXN0Iiwic2V0VGltZW91dCIsImJvZHkiLCJjbGFzc0xpc3QiLCJyZW1vdmUiLCJzZXRVbmRlcmxheUNvbG9yIiwiZG9jdW1lbnRFbGVtZW50Iiwic3R5bGUiLCJzZXRQcm9wZXJ0eSIsInJlbW92ZVVuZGVybGF5IiwidW5kZXJsYXkiLCJBbmltYXRlQ2xvc2VNb2RhbCIsImNsb3NlTW9kYWwiLCJjYW5FeGVjdXRlIiwiZXhlY3V0ZSIsImNsb3NlQnRuIiwiY2xpY2siLCJnZW5lcmF0ZVVuZGVybGF5IiwiaW5zZXJ0QWRqYWNlbnRIVE1MIiwiYWRkRXZlbnRMaXN0ZW5lciIsImFkZCIsImdlbmVyYXRlQ2xvc2VCdG4iLCJtb2RhbENvbnRlbnQiLCJsaW5rQ2xvc2VCdXR0b25zIiwicXVlcnlTZWxlY3RvckFsbCIsImZvckVhY2giLCJmb3VuZFByb2dyZXNzIiwid2lkdGgiLCJoZWlnaHQiLCJwcm9ncmVzcyIsImNyZWF0ZUVsZW1lbnQiXSwibWFwcGluZ3Mi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
