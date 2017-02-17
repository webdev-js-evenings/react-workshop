
function getVars(txt) {
  var regex = /\{([^}]+)\}/g
  var results = []
  var matches = regex.exec(txt)
  while (matches) {
    results.push(matches)
    matches = regex.exec(txt)
  }

  return results.reduce(function(vars, match) {
    var varName = match[1]
    if (!vars[varName]) {
      vars[varName] = []
    }
    vars[varName].push(match['index'])
    return vars
  }, {})
}

function replaceVars(string, variables) {
  var changes = []
  Object.keys(variables).forEach(function(replaced) {
    var position = -1
    while ((position = string.indexOf(replaced, position + 1)) > -1) {
      if (!changes.hasOwnProperty(position)) {
        changes[position] = variables[replaced]
        if (replaced.length > 1) {
          var args = Array(replaced.length + 1)
          args[0] = position + 1
          args[1] = replaced.length - 1;
          [].splice.apply(changes, args)
        }
      }
    }
  })

  var resultArray = string.split('').map(function(letter, index) {
    if (changes.hasOwnProperty(index)) {
      return changes[index] || ''
    }

    return letter
  })

  return resultArray.join('')
}

(function($) {
  function applyVars(elem) {
    $(elem).closest('.row').each(function() {
      var vars = {}

      $('.var-template').each(function() {
        var val = $(this).find('input').val()
        var varName = $(this).data('varname')
        if (val) {
          vars['{' + varName + '}'] = val
        }
      })

      var codeCol = $(this).find('.code-col code xmp.template')
      var resultCol = $(this).find('.result')
      var result = replaceVars(codeCol.html(), vars)
      resultCol.html(result)
      $(this).find('.code-col code xmp').not('.template').html(result)
    })
  }

  $(function() {
    // handlovat change na políčkách pro proměnné (fakt náročný)
    $(document).on('input', '.var-template', function(e) {
      applyVars(this)
      // var val = e.target.value
      // var varName = $(this).data('varname')

      // // console.log('bum', val)
      // // console.log(codeCol.html().replace('{'+ varName +'}', val))
      // var vars = {}
      // vars['{'+ varName +'}'] = val
      // var result = replaceVars(codeCol.html(), vars)
      // resultCol.html(result)
      // $(this).closest('.row').find('.code-col code xmp').not('.template').html(result)

      // ehm ehm
      // codeCol.html(replaceVars(codeCol.html(), vars))
    })

    $('.code-col code xmp').each(function() {
      var element = this
      $(element).parent().append($(element).clone().addClass('template'))
      $(this).closest('.row').find('.result').html($(this).html())

      var html = $(this).html()
      // vyparsovat promměné z textu
      var vars = getVars(html)

      // vytvořit políčka pro proměnné
      Object.keys(vars).forEach(function(varName) {
        var cln = $(element).closest('.row').find('.var-template').first().clone()
        cln.removeClass('template')
        cln.find('label').text(varName)
        cln.attr('data-varname', varName)
        $(element).closest('.row').find('.api-var').append(cln)
      })
    })
  })
})(jQuery)
