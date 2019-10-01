
$(function(){
   	//make connection
	var socket = io.connect('http://192.168.0.120:3000')

	//buttons and inputs
	var message = $("#message")
	var username = $("#username")
	var send_message = $("#send_message")
	var send_username = $("#send_username")
	var chatroom = $("#chatroom")
	var feedback = $("#feedback")
	

	//Emit message
	send_message.click(function(){
		socket.emit('new_message', {message : message.val()})
	})

	//Listen on new_message
	socket.on("new_message", (data) => {
       
			feedback.html('');
			message.val('');
            chatroom.append("<div  class='message'>" +" <span class='userNameChatRoom'>" + data.username + "</span>" + ":" + data.message + "</div>" +"<div>"+ "<span class='time-span'>" + data.date_time.time + "</span>"  + "</div>")
		 
	})

	//Emit a username
	send_username.click(function(){
		socket.emit('change_username', {username : username.val()})
	document.getElementById('change_username').style.display = 'none';
	document.getElementById('welcome-user').style.display = 'block';
	})

	//Emit typing
	message.bind("keypress", () => {
		socket.emit('typing')
	})

	//Listen on typing
	socket.on('typing', (data) => {
		feedback.html("<p><i>" + data.username + " is typing a message..." + "</i></p>")
	})
});


