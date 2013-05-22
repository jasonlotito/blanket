var routes = (function() {

  var responses = require('./responses.js');
  var members = require('./members.js');
  var messages = require('./messages.js');

  return {
    "/login": function(params) {
      if(!params.contains(['username','password'])){
        return response.failure("Missing username and/or password");
      }

      return members.MemberList.validateCredentials(params.username, params.password) ?
        responses.success(members.MemberList.getMemberByName(params.username)) :
        responses.failure("user login failed");
    },
    "/addMember": function(params) {
      if (! params.contains(['username','password'])) {
        return responses.failure();
      }

      members.createNewMember(params.username, params.password);

      return responses.success();
    },
    "/listMembers": function(params) {
      return members.getAllMembers();
    },
    "/sendMessage": function(params) {
      if (! params.contains(['from', 'to', 'message'])) {
        return responses.failure("Missing from, to, message arguments");
      }

      return messages.addNewMessage(
        members.getMemberById(params.from),
        members.getMemberById(params.to),
        params.message);
    },
    "/getMemberMessages": function(params){
      if(!params.contains(['owner', 'sender'])){
        return responses.failure("Missing owner and sender arguments");
      }
      var owner = members.getMemberById(params.owner);
      var sender = members.getMemberById(params.sender);

      if(owner && sender){
        return messages.getMemberMessages(owner, sender);
      }
    },
    "/getNewMemberMessages": function(params){
      if(!params.contains(['owner','sender'])) {
        return responses.failure("Missing owner and sender arguments");
      }

      var owner = members.getMemberById(params.owner);
      var sender = members.getMemberById(params.sender);

      if(owner && sender) {
        return responses.success(messages.getNewMemberMessages(owner, sender));
      }
    },
    "/markMessageRead": function(params){
      if(!params.contains(['id'])){
        return response.failure("Missing id argument");
      }

      messages.markMessageRead(params.id);

      return responses.success();
    }
  };
})();

module.exports = routes;