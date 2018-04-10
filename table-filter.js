var xhr = null;
  var write = false;
  $(document).on('change keyup', '._tf', function(e) {
    if (!url_get($(this).attr('filter')) && !$(this).val() && e.keyCode && (e.keyCode <= 48 || e.keyCode >= 90)) {
      return true;
    }

    if (xhr != null && typeof xhr.readyState !== 'undefined') {
      xhr.abort();
      xhr = null;
    }

    $('._tf').removeClass('active');
    $(this).addClass('active');
    const ID_TABLE = $(this).parent().parent().parent().parent().attr('id');
    url = window.location.protocol + '//' + window.location.hostname + window.location.pathname;
    query_string('page', 1);
    query_string($(this).attr('filter'), $(this).val());

    write = true;
    data = {};
    data[$(this).attr('filter')] = $(this).val();
    data['page'] = 1;
    xhr = $.get(window.location.href, {}, '', 'json').always(function(data) {
      $('#' + ID_TABLE + ' tbody').html(data.message);
      $('.links').html(data.field);
    });
  });
  
  function table_filter() {
  $('._ft').each(function() {
    tr_filter = $(this).find('tr.filter');
    thead = $(this).find('thead');
    th = $(this).find('th');

    html = '<tr class="filter"></tr>';
    $(tr_filter).remove();
    $(thead).append(html);

    tr_filter = $(this).find('tr.filter');
    $(th).each(function() {
      filter = $(this).attr('filter');
      filter_type = $(this).attr('filter_type');
      range = $(this).attr('range');
      if (filter && filter.length) {
        filter_id = filter.replace('.', '_', filter);
        if (filter_type && filter_type == 'date') {
          if (range) {
            html = '<td class="flex"><input placeholder="From" type="text" id="' + filter_id + '--start" filter="' + filter + '--start" class="form-control _dt _tf">';
            html += '<input type="text" placeholder="To" id="' + filter_id + '--end" filter="' + filter + '--end" class="form-control _dt _tf"></td>';
          } else {
            html = '<td><input placeholder="Choose Date" type="text" id="' + filter_id + '--start" filter="' + filter + '--start" class="form-control _dt _tf"></td>';
          }
        } else {
          html = '<td><input type="text" id="' + filter_id + '" filter="' + filter + '" class="form-control _tf" value="' + url_get(filter) + '"></td>';
        }
      } else {
        html = '<td>-</td>';
      }
      $(tr_filter).append(html);
    });
  });
}

$(document).on('click', '._tw_w .pagination a', function(event) {
    event.preventDefault();
    event.stopImmediatePropagation();
    url = $(this).attr('href');
    active_filter = $('._tf');
    const ID_TABLE = $(this).parent().parent().parent().attr('table');
    if (active_filter.length) {
      active_filter.each(function (index, value) {
        if ($(this).val()) {
          vari = $(this).attr('filter');
          valuee = $(this).val();
          url = url + '&' + vari + '=' + valuee;
        }
      });
      redirect(url);
      $.get(url, '', '', 'json').always(function(data) {
        $('#' + ID_TABLE + ' tbody').html(data.message);
        $('.links').html(data.field);
      });
    } else {
      redirect(url);
      $.get(window.location.href, {}, '', 'json').always(function(data) {
        $('#' + ID_TABLE + ' tbody').html(data.message);
        $('.links').html(data.field);
      });
    }
  });

function url_get($param) {
  var geturl = new URLSearchParams(window.location.search);
  var c = geturl.get($param);
  if (c != null) {
    return c;
  }

  return '';
}
