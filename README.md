## ConvertPopupToOverlay
Convert a regular (non-modal) popup layout to overlay / drawer style.

## Features
- Align the overlay to a side of the screen
  - top, right, bottom, left.
- Set the size you want
  - For the top and bottom orientation, the size means height.
  - For the left and right orientation, the size means width.
- Display or hide the default header.

## Usage
### Place the widget inside a (non-modal) popup layout
This wil by default transform the modal to a right aligned overlay with a width of max. 600px. 

### Specify close button(s) by classname.
The overlay cannot be closed correctly via close page only. Any button inside the overlay with the given class will close the overlay animations after click.

### Auto close page
When set to true (default) the close button(s) will trigger a close page after clicking. In a situation where this is not desired, this boolean can be set to false. In that case the custom action needs to end with a close page (or the overlay will not be closed correctly).

## Limitations
A simple close page button or Microflow action will not be able to correctly close the overlay. The use of close button(s) by classname is therefore necessary.

The widget works best with a non-modal layout, because it generates it's own underlay. Basically making it a modal overlay again. Try to avoid opening multiple overlays without closing the previous one(s). This might result in unwanted situations.

## Development and contribution
1. Install NPM package dependencies by using: `npm install`. If you use NPM v7.x.x, which can be checked by executing `npm -v`, execute: `npm install --legacy-peer-deps`.
1. Run `npm start` to watch for code changes. On every change:
    - the widget will be bundled;
    - the bundle will be included in a `dist` folder in the root directory of the project;
    - the bundle will be included in the `deployment` and `widgets` folder of the Mendix test project.