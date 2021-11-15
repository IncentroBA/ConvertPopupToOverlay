## ConvertPopupToOverlay
Convert a regular (non-modal) popup layout to overlay / drawer style. This is a panel which slides in from the edge of the screen.

Look at this design pattern in Ant design: 
https://ant.design/components/drawer/

## Features
- Align the overlay to a side of the screen
  - Overlay position: `top` | `right` | `bottom` | `left`
- Set the size you want (in `pixels`)
  - For the top and bottom orientation, the size means height.
  - For the left and right orientation, the size means width.
- Display or hide the default header.
  - Boolean: `true` or `false`

## Usage
- Place the widget inside a (non-modal) popup layout. This wil by default transform the modal to a right aligned overlay with a width of max. 600px.

- Specify close button(s) by classname.
These buttons will then trigger the close overlay transition. Otherwise the overlay closes just like a normal Mendix popup does (fading out).

## Limitations
The widget works best with a non-modal layout, because it generates it's own underlay including link to close the overlay. Basically making it a modal overlay again. Try to avoid opening multiple overlays without closing the previous one(s). This might result in unwanted situations.

## Development and contribution
1. Install NPM package dependencies by using: `npm install`. If you use NPM v7.x.x, which can be checked by executing `npm -v`, execute: `npm install --legacy-peer-deps`.
1. Run `npm start` to watch for code changes. On every change:
    - the widget will be bundled;
    - the bundle will be included in a `dist` folder in the root directory of the project;
    - the bundle will be included in the `deployment` and `widgets` folder of the Mendix test project.