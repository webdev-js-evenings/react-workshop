// @flow weak


(function($) {
// simple button
  function fillCode(result, code) {
    code.html($.trim(result.html()))
  }

  // text
  $(document).on('input', '#simple-button-text', function() {
    var value = $(this).val()

    $('.simple-button-result button').html(value)
    fillCode($('.simple-button-result'), $('.simple-button-row .code-example'))
  })

  // class
  var prevValue = null
  $(document).on('input', '#simple-button-class', function() {
    var value = $(this).val()

    var btn = $('.simple-button-result button')
    btn.removeClass('btn-danger')
    btn.addClass(value)
    btn.removeClass(prevValue || '')

    prevValue = value
    fillCode($('.simple-button-result'), $('.simple-button-row .code-example'))
  })

  // dropdown
  // dropdown text
  var dropdownBtn = $('.btn-dropdown-result button')
  var defaultText = dropdownBtn.html()
  $(document).on('input', '#btn-dropdown-text', function() {
    // hezké zdvojení
    var value = $(this).val() || defaultText
    dropdownBtn.html(value)
    // tady to musí vyplnit
    fillCode($('.btn-dropdown-result'), $('.dropdown-btn-row .code-example'))

    // i tady
    dropdownBtn.html(value)
  })

  // dropping down
  var unfoldCheckbox = $('#btn-dropdown-dropping')
  var handleDropdownUnfold = function() {
    var checked = $(this).prop('checked')

    if (checked) {
      $('.btn-dropdown-result .dropdown-menu').show()
    } else {
      $('.btn-dropdown-result .dropdown-menu').hide()
    }

    fillCode($('.btn-dropdown-result'), $('.dropdown-btn-row .code-example'))
  }
  handleDropdownUnfold.call(unfoldCheckbox)
  $(document).on('change', '#btn-dropdown-dropping', handleDropdownUnfold)


  function addMeal(li) {
    var clLi = li.clone()
    var deleteSpan = $('<span class="label label-danger">x</span>')
    // mazani jidel
    deleteSpan.on('click', function() {
      clLi.remove()

      // kdekoliv, kde se bude pracovat s jidly, tak tam musí být tenhle kod
      $('.btn-dropdown-result .dropdown-menu li').each(function() {
        if (clLi.data('id') === $(this).data('id')) {
          $(this.remove())
        }
      })
    })

    clLi.append(deleteSpan)
    $('.meals-menu').append(clLi)
  }
  // přidávání do dropdown
  $(document).on('keypress', '#btn-dropdown-option', function(event) {
    if (event.keyCode === 13) {
      var li = $('.btn-dropdown-result .dropdown-menu li').last().clone()
      var id = Date.now()
      li.attr('data-id', id)
      li.find('a').html($(this).val())
      $('.btn-dropdown-result .dropdown-menu').append(li)
      $(this).val('')

      // pridat jidlo

      addMeal(li)
    }
    // a ted to zkusit s prázdnym inputem
  })

  // synchronizace


})(window.jQuery)

