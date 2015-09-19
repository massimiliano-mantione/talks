import Reactify from './reactify-dom-element';

export var PaperCheckbox = Reactify('paper-checkbox', {
  'on-change': Reactify.Event('change'),
  'on-click': Reactify.Event('click')
});
export var PaperButton = Reactify('paper-button', {
  'on-click': Reactify.Event('click')
});
export var PaperInput = Reactify('paper-input', {
  'on-change': Reactify.Event('change'),
  'on-blur': Reactify.Event('blur'),
  'on-key-down': Reactify.Event('keydown')
});
