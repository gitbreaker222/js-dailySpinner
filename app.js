import * as uiSwipe from './src/js/ui_swipe.js';
import * as uiFrontSide from './src/js/ui_front-side.js';
import * as uiBackSide from './src/js/ui_back-side.js';
import * as dataLocalStorage from './src/js/data_localstorage.js';
import * as dataPeople from './src/js/data_people.js';

// get UI elements
const needle = document.querySelector('#spin-needle');
const btnTurnEl = document.querySelector('#btn-turn');
const swipeEl = document.querySelector('#spin-container');
const frontSidePeopleEl = document.querySelector('#people-container');
const mainStyle = document.createElement('style');
const backSidePeopleEl = document.querySelector('#people-list');
const backSidePeopleFormEl = document.querySelector('#people-list__form');
const inputEl = backSidePeopleFormEl['new-name'];

// create Person-Object
let persons = [];
//FIXME: can be change to restPeople
let currentPersons = [];

// validate if localStorage has data, otherwise push default people
let preloadPeople = dataLocalStorage.loadPeople();
if (preloadPeople) {
  persons = dataLocalStorage.loadPeople();
} else {
  // FIXME: move to people.js
  persons.push(
    new dataPeople.Person('Sascha'),
    new dataPeople.Person('Adi')
    // new Person('Chris')
    // new Person('Yu')
    // new Person('Ali'),
    // new Person('Felix'),
    // new Person('Slawa')
  );
}

// inBeginning:
currentPersons = dataPeople.getSelectedPeople(persons);

/* -------------------------------------------------------------------------- */
/*                               Service Worker                               */
/* -------------------------------------------------------------------------- */

registerSW();

async function registerSW() {
  if ('serviceWorker' in navigator) {
    if ('serviceWorker' in navigator) {
      try {
        await navigator.serviceWorker.register('./sw.js');
      } catch (e) {
        console.log(`SW registration failed`);
      }
    }
  }
}

/* -------------------------------------------------------------------------- */
/*                     UI_SWIPE: flip + reset                                 */
/* -------------------------------------------------------------------------- */

/* ---------------------------------- start --------------------------------- */
swipeEl.addEventListener('mousedown', (e) => {
  uiSwipe.onSwipeMouseDonw(10);
});
swipeEl.addEventListener('touchstart', (e) => {
  uiSwipe.onSwipeTouchStart(0.2);
});

/* ----------------------------------- on ----------------------------------- */
window.addEventListener('mousemove', (e) => {
  let restPeople = uiSwipe.onSwipeTo(
    e,
    swipeEl,
    needle,
    frontSidePeopleEl,
    mainStyle,
    persons
  );
  if (restPeople) currentPersons = restPeople;
});
swipeEl.addEventListener('touchmove', (e) => {
  let restPeople = uiSwipe.onSwipeTo(
    e,
    swipeEl,
    needle,
    frontSidePeopleEl,
    mainStyle,
    persons
  );
  if (restPeople) currentPersons = restPeople;
});

/* ----------------------------------- end ---------------------------------- */
window.addEventListener('mouseup', () => {
  uiSwipe.onSwipeMouseUp();
});
window.addEventListener('touchend', () => {
  uiSwipe.onSwipeTouchEnd();
});

/* -------------------------------------------------------------------------- */
/*                                 side__front                                */
/* -------------------------------------------------------------------------- */

// render FrontSide
uiFrontSide.renderFrontSide(frontSidePeopleEl, mainStyle, persons);

// click to get randomPerson no repeat
btnTurnEl.addEventListener('click', () => {
  currentPersons = uiFrontSide.playSpinner(
    swipeEl,
    needle,
    persons,
    currentPersons
  );
});

/* -------------------------------------------------------------------------- */
/*                                 side__back                                 */
/* -------------------------------------------------------------------------- */

//render Backside People list
uiBackSide.renderBackSide(backSidePeopleEl, persons);

/* ----------------------------- add new person ----------------------------- */

// press Enter: ad new person
backSidePeopleFormEl.addEventListener('keydown', (e) => {
  // Textbox content
  let inputVal = inputEl.value;

  // press Enter: valid text
  if (e.keyCode === 13 && inputVal) {
    e.preventDefault();

    // add new person DT + UI
    uiBackSide.addPerson(
      frontSidePeopleEl,
      backSidePeopleEl,
      backSidePeopleFormEl,
      mainStyle,
      inputVal,
      persons
    );

    // press Enter: invalid text
  } else if (e.keyCode === 13 && !inputVal) {
    e.preventDefault();
  }
});

/* ---------------------------- set attend person --------------------------- */

uiBackSide.setAttendPerson(backSidePeopleEl, persons);

/* ------------------------------ remove person ----------------------------- */

backSidePeopleEl.addEventListener('click', (e) => {
  persons = uiBackSide.removePerson(
    frontSidePeopleEl,
    backSidePeopleEl,
    mainStyle,
    e,
    persons
  );
});

/* -------------------------------------------------------------------------- */
/*                             TODO:  shortcuts                               */
/* -------------------------------------------------------------------------- */
// press 'R' to reset
// window.addEventListener('keydown', (e) => {
//   if (e.keyCode === 82 && !(inputEl === document.activeElement) && !isBack()) {
//     swipeToReset();
//   }
// });

// // press 'F' to flip
// window.addEventListener('keydown', (e) => {
//   if (e.keyCode === 70 && !(inputEl === document.activeElement)) flipPlate();
// });

// // press 'Enter' to turn
// window.addEventListener('keydown', (e) => {
//   if (e.keyCode === 13 && !isBack()) playSpinner();
// });
