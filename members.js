var members = (function(){

  var fs = require('fs');
  var sync = require('./sync.js');

	var memberList = sync.get('memberList', []);
  console.log(memberList);

  function MemberList (){
    this.memberUsernames = sync.get('memberUsernames', {});
    return this;
  }

  MemberList.prototype.addMember = function(member){
    this.memberUsernames[member.getName()] = member;
    this.save();
  };

  MemberList.prototype.save = function(){
    sync.sync('memberUsernames', this.memberUsernames);
  };

  MemberList.prototype.isMemberNameBeingUsed = function(name) {
    return this.memberUsernames.hasOwnProperty(name);
  };

  MemberList.prototype.validateCredentials = function(name, pass) {
    if (!this.isMemberNameBeingUsed(name)) {
      return false;
    }

    return this.memberUsernames[name].validatePassword(pass);
  };

  MemberList.prototype.getMemberByName = function(name){
    if(this.isMemberNameBeingUsed(name)){
      return memberList[this.memberUsernames[name].getId()];
    }

    return false;
  };

  var memberUsernames = new MemberList();

	function Member(name, pass) {
		this.name = name;
    this.password = pass;
		this.id;

		return this;
	}

	Member.prototype.setId = function(id){ this.id = id; return this; };
	Member.prototype.getId = function(){ return this.id; };
  Member.prototype.getName = function(){ return this.name; };
  Member.prototype.validatePassword = function(password){ return this.password === password; }

	return {
		Member: Member,
    MemberList: memberUsernames,
		createNewMember: function(name, password){
			var member = new Member(name, password);

      if(memberUsernames.isMemberNameBeingUsed(member.getName())) {
        return false;
      }

      var memberId = memberList.push(member) - 1;
			member.setId(memberId);
      memberUsernames.addMember(member);
      sync.sync('memberList', memberList);


		},
		getMemberById: function(id){
			return memberList[parseInt(id, 10)];
		},
		getAllMembers: function(){
			return memberList;
		}
	}
})();

module.exports = members;
