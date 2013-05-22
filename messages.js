var messages = (function(){
  var moment = require('./moment.js');
  var responses = require('./responses.js');
  var sync = require('./sync.js');

	var messageList = sync.get('messageList', {});
  var allMessages = sync.get('allMessages', []);

	function Message(toMember, fromMember, message) {
		this.toMember = toMember;
		this.fromMember = fromMember;
		this.message = message;
    this.sent = moment();
		this.type = 'text'; // only text messages right now
    this.id = 0;
    this.isRead = false;

    return this;
	}

  Message.prototype.setId = function(id){ this.id = id; return this; }
  Message.prototype.getId = function(){ return this.id; }

  /**
   * @namespace messages
   */
	return {
		Message: Message,
		addNewMessage: function(fromMember, toMember, message){
      if(!fromMember || !toMember || !message){
        return responses.failure(["Missing fromMember, toMember, message arguments", fromMember, toMember, message]);
      }
      var message = new Message(toMember, fromMember, message)
        , id = toMember.getId();

      if(!messageList.hasOwnProperty(id)) {
				messageList[id] = {};
			}

      console.log(id, messageList);

      if (!messageList[id].hasOwnProperty(fromMember.getId())){
        messageList[id][fromMember.getId()] = [];
      }

      message.setId(allMessages.length);
      allMessages.push(message);
      messageList[id][fromMember.getId()].unshift(message);

      sync.sync('allMessages', allMessages);
      sync.sync('messageList', messageList);

      return responses.success(message);
		},
    getMemberMessages: function(owner, sender) {
      if(messageList[owner.getId()] && messageList[owner.getId()][sender.getId()]){
        return responses.success(messageList[owner.getId()][sender.getId()]);
      }

      return responses.failure();
    },
    getNewMemberMessages: function(owner, sender){
      var ret = [];
      if (messageList[owner.getId()] && messageList[owner.getId()][sender.getId()]) {
        var messages = messageList[owner.getId()][sender.getId()];
        for(var x in messages){
          if(!messages.hasOwnProperty(x)){
            continue;
          }
          var msg = messages[x];
          if(!msg.isRead){
            console.log(msg);
            ret.push(msg);
          }
        }
      }

      sync.sync('messageList', messageList);

      return ret;
    },
    markMessageRead: function(id){
      allMessages[id].isRead = true;
    }
	}
})();

module.exports = messages;
