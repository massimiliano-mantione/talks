import Reactify from './reactify-dom-element';

export var PaperCheckbox = Reactify('paper-checkbox', {
  'onChange': Reactify.Event('change'),
  'onClick': Reactify.Event('click')
});
export var PaperButton = Reactify('paper-button', {
  'onClick': Reactify.Event('click')
});
export var PaperInput = Reactify('paper-input', {
  'onChange': Reactify.Event('change'),
  'onBlur': Reactify.Event('blur'),
  'onKeyDown': Reactify.Event('keydown', function(event) {
    event.nativeEvent !== undefined ? e : undefined
  }),
  'value': Reactify.Attribute('value', function(node, value) {
    node.inputElement.value = value;
  }, true)
});
