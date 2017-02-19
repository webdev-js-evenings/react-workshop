(function($, handlebars) {
  (function() {
    // simple btn
    function render(html, where) {
      where.html(html)
      return where
    }

    function update(template, vars) {
      return handlebars.compile(template)(vars)
    }

    var simpleButtonTpl = $('#simple-btn-template')
    var formTpl = $('#var-template').html()

    var props = simpleButtonTpl.data('props')

    function updateSimpleButton(props, context) {
      var simpleButtonCode = update(simpleButtonTpl.html(), context)
      render(simpleButtonCode, $('.simple-btn-row .code-example'))
      render(simpleButtonCode, $('.simple-btn-row .result'))
    }

    var vars = Object.keys(props).map(function(varName) {
      return { name: varName }
    })

    var defaultComponentContext = {
      type: 'btn-success',
      text: 'default text'
    }
    render(update(formTpl, { vars: vars }), $('.simple-btn-row .api-var-content'))
    updateSimpleButton(props, defaultComponentContext)

    var lastConext = {}
    $(document).on('input', '.simple-btn-row .string-input', function(e) {
      var context = {}
      var varName = this.name
      var value = this.value
      context[varName] = value

      var nextContext = Object.assign(lastConext, context)
      updateSimpleButton(props, Object.assign({},
        defaultComponentContext,
        nextContext
      ))
    })
  })();


  (function() {
    // dropdown
    function render(html) {
      $('.dropdown-btn-row').html(html)
    }

    var dropdownBtnTemplate = handlebars.compile($('#dropdown-btn-template').html())

    function update(template, context) {
      return template(context)
    }

    function renderApp(context, dropdownBtnTemplate) {
      render(update(dropdownBtnTemplate, context))
    }

    var defaultContext = {
      vars: [
        { name: 'text', type: 'string' },
        { name: 'droped', type: 'boolean' }, // tenhle type nepude vyifovat v handlebars, leda přes helper http://stackoverflow.com/questions/24191182/how-to-check-type-of-object-in-handlebars
        { name: 'options', type: [{ name: 'text', type: 'string' }] }
      ],
      text: 'Default text',
      dropped: false
    }

    renderApp(defaultContext, dropdownBtnTemplate)

    var lastContext = {}
    // bum nepude tam psát!
    // mu se udělat submit button
    $(document).on('submit', '#vars-form', function(e) {
      e.preventDefault()
      var context = $(this).serializeArray().reduce(function(field, context) {
        context[field.name] = field.value
        return context
      }, {})

      var nextContext = Object.assign(lastContext, context)
      renderApp(Object.assign({},
        defaultContext,
        nextContext
      ), dropdownBtnTemplate)
    })
  })()
})(window.jQuery, window.Handlebars)
