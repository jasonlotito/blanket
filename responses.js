var responses = (function() {

  function response(result, data) {
    data = data || {};
    return {'success': result, 'data': data};
  }

  return {
    'success': function(data) {
      return response(true, data);
    },
    'failure': function(data) {
      return response(false, data);
    }
  }
})();

module.exports = responses;