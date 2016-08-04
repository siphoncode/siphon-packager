
'use strict';

module.exports = {
  validateOptions: function(optionsDeclaration, options) {
    for (var key in optionsDeclaration) {
      var declaration = optionsDeclaration[key];
      var expectedType = declaration.type;
      var required = declaration.required;

      // If the option is not provided and it is required, throw an error
      if (!options.hasOwnProperty(key) && required) {
        throw new Error('Error validating options: ' +
                        'option ' + key + ' required.');
      }

      // If the option is not provided, and it is optional, set the
      // default value.
      if (!options.hasOwnProperty(key) && !required &&
          declaration.hasOwnProperty('default')) {
        options[key] = declaration['default'];
        continue;
      }

      var opt = options[key];

      // If the option is provided but is not of the expected type, throw
      // an error.
      var optType = typeof opt;
      if (optType != expectedType) {
        throw new Error('Error validating options: option ' + key +
                        ' must be ' + expectedType + ', received ' +
                        optType + '.');
      }

      // If an array of choices is specified in the options declation,
      // make sure the provided value appears among them. If not, throw
      // an error
      if (declaration.hasOwnProperty('choices')) {
        var choices = declaration.choices;
        if (choices.indexOf(opt) == -1) {
          throw new Error('Error validation options: option ' + key +
                          'invalid.');
        }
      }
    };

    return options;
  },
};
