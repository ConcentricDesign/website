
ConcentricSurveyForm = (function() {
  var className = {
    forHasValue: "has-value",
    forHasFocus: "has-focus",
    forHasError: "has-error",
    forFormElementsContainer: "js-formElements",
  };
  
  var attributeName = {
    forRequiredField: "required",
    forValidationCheck: "data-validated"
  };
  
  var selector = {
    forForm: ".js-surveyForm",
    forFormElementsContainer: "." + className.forFormElementsContainer,
    forFieldContainer: ".js-fieldContainer",
    forSubmitButton: ".js-submitForm",
    forBotTrapField: ".js-trapField",
    forEmailField: "input[type='email'][required]",
    forUrlField: "input[type='url']",
    forRequiredFields: "." + className.forFormElementsContainer + " input[" + attributeName.forRequiredField + "], ." + className.forFormElementsContainer + " textarea[" + attributeName.forRequiredField + "]",
    forSubmitContainer: ".js-surveySubmitButtonContainer"
  };

  // Bind to changes for all required fields and HAS ERROR fields to
  // rerun validation and update visual state on each change
  function _setupSurveyFormBindings() {
    var $form = $(selector.forFormElementsContainer);
    var fields = [];
    
    function _cacheElement(i, el) { fields.push($(el)); }
    $form.find("input:not([type='checkbox'])").each(_cacheElement);
    $form.find("textarea").each(_cacheElement);

    fields.forEach(function($el, i) {
      _bindFieldHasValueState($el);
      _bindFieldHasFocusState($el);
    });
    
    $form.on("keyup", "[" + attributeName.forRequiredField + "][" + attributeName.forValidationCheck + "]", _generalRequiredFieldValidations);
    
    // Email field special validation
    $form.on("keyup", selector.forEmailField +"[" + attributeName.forValidationCheck + "]", _emailFieldChangeValidations);
    $form.on("blur", selector.forEmailField, function() {
      if ($(this).val().trim()) {
        _markFirstFieldValidation($(this));
        _emailFieldChangeValidations.call(this);
      }
    });
    
    // Url field special validation
    $form.on("keyup", selector.forUrlField + "[" + attributeName.forValidationCheck + "]", _urlFieldValidations);
    $form.on("blur", selector.forUrlField, function() {
      if ($(this).val().trim()) {
        _markFirstFieldValidation($(this));  
      }
      
      _urlFieldValidations.call(this);
    });
    
    // Submission of form
    $(selector.forSubmitButton).on("click", function() {
      $(selector.forRequiredFields).each(function() {
        _markFirstFieldValidation($(this));
      });
      
      if (_isFormValid()) {
        _submitForm();
      }
    });
  }
  
  function _generalRequiredFieldValidations() {
    var $field = $(this);
    var val = $field.val().trim();
    
    if (val) {
      _removeFieldErrorState($field);
    } else {
      _showFieldErrorState($field);
    }
    
    _handleFormStateUpdate();
  }
  
  // Check for conditions that warrant removing the error
  function _emailFieldChangeValidations(i, el) {
    var $field = $(this);
    var email = $field.val().trim();
    
    if (email && _isValidEmail(email)) {
      _removeFieldErrorState($field);
    } else {
      _showFieldErrorState($field);
    }
    
    _handleFormStateUpdate();
  }
  
  function _emailFieldBlurValidations(i, el) {
    var $field = $(this);
    var email = $field.val().trim();
    
    if (!email) {
      return;
    }
    
    if (!_isValidEmail(email)) {
      _showFieldErrorState($field);
    }
    
    _handleFormStateUpdate();
  }
  
  function _urlFieldValidations(i, el) {
    var $field = $(this);
    var url = $field.val().trim();
    
    if (!url) {
      _removeFieldErrorState($field);
      return;
    }
    
    if (_isValidUrl(url)) {
      _removeFieldErrorState($field);
    } else {
      _showFieldErrorState($field);
    }
    
    _handleFormStateUpdate();
  }

  function _isFormValid() {
    var valid = true;

    if (_isBotTrapped()) {
      return false;
    }
    
    var $emailField = $(selector.forEmailField);
    var email = $emailField.val().trim();
    if (!_isValidEmail(email)) {
      _showFieldErrorState($emailField);
      valid = false;
    }
    
    var $requiredFields = $(selector.forRequiredFields);
    if (!_requiredFieldsReady($requiredFields)) {
      var fieldsWithoutValue = [];
      var $thisField;
      var thisFieldValue;
      
      $requiredFields.each(function(i, el) {
        $thisField = $(el);
        thisFieldValue = $thisField.val().trim();
        
        if (!thisFieldValue) {
          _showFieldErrorState($thisField);
        }
      });
      
      valid = false;
    }
    
    var $urlField = $(selector.forUrlField);
    var url = $urlField.val().trim();
    if (url && !_isValidUrl(url)) {
      _showFieldErrorState($urlField);
      valid = false;
    }
    
    _handleFormStateUpdate();
    return valid;
  }
  
  function _isBotTrapped() {
    return !!$(selector.forBotTrapField).val();
  }
  
  function _isValidUrl(url) {
    return Concentric.Utilities.isValidUrl(url);
  }
  
  function _isValidEmail(email) {
    return Concentric.Utilities.isValidEmail(email);
  }
  
  function _requiredFieldsReady($fields) {
    var $requiredFields = $fields;
    var ready = true;
    
    $requiredFields.each(function(i, el) {
      if (!$(el).val().trim()) {
        ready = false;
      }
    });
    
    return ready;
  }
  
  function _elementHasAttribute($el, attrName) {
    var attributeValue = $el.attr(attrName);
    return typeof attributeValue !== typeof undefined && attributeValue !== false;
  }
  
  function _markFirstFieldValidation($el) {
    $el.attr(attributeName.forValidationCheck, true);
  }
  
  function _showFieldErrorState($field) {
    var $container = _getFieldContainer($field);
    $container.addClass(className.forHasError);
  }
  
  function _removeFieldErrorState($field) {
    var $container = _getFieldContainer($field);
    $container.removeClass(className.forHasError);
  }
  
  function _handleFormStateUpdate() {
    if (_somethingHasAnError()) {
      _showFormErrorState();
    } else {
      _removeFormErrorState();
    }
  }
  
  function _somethingHasAnError() {
    return $(selector.forFormElementsContainer + " ." + className.forHasError).length;
  }
  
  function _showFormErrorState() {
    $(selector.forSubmitContainer).addClass(className.forHasError);
  }
  
  function _removeFormErrorState(fields) {
    $(selector.forSubmitContainer).removeClass(className.forHasError);
  }
  
  function _submitForm() {
    var $form = $(selector.forForm);

    $.ajax({
      url: $form.attr('action'),
      type: $form.attr('method'),
      data: $form.serialize(),
      dataType: 'json',
      contentType: "application/json; charset=utf-8",
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      beforeSend: function() {

      },
      error: function (err) {
        console.log("An error has occurred during survey submission.", err);
      },
      success: function (data) {
        window.location.href = data.next;
      }
    });
  }
  
  function _getFieldContainer($field) {
    return $field.parents(selector.forFieldContainer);  
  }

  function _bindFieldHasValueState($el) {
    $el.blur(function() {
      var value = $(this).val().trim();
      var $container = _getFieldContainer($(this));

      if (value) {
        $container.addClass(className.forHasValue);
      } else {
        $container.removeClass(className.forHasValue);
      }
    });
  };
  
  function _bindFieldHasFocusState($el) {
    $el.focusin(function() {
      var $container = _getFieldContainer($(this));
      $container.addClass(className.forHasFocus);
    });
    
    $el.focusout(function() {
      var $container = _getFieldContainer($(this));
      $container.removeClass(className.forHasFocus);
    });
  };
  
  function init() {
    _setupSurveyFormBindings();
  }
  
  return {
    init: init
  };
}());

$(document).ready(function(){
  ConcentricSurveyForm.init();
});
