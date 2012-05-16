/* Author: YOUR NAME HERE
*/

$(document).ready(function() {   

  var socket = io.connect();

  

socket.on('server_message', function(data){
   $('#reciever').append('<li>' + data + '</li>'); 

   console.log('ttring some stuff '); 
  });

 
  $('#sender').on('click', function() {
  	var thetext = $('#textbox').val();
   socket.emit('message', thetext + " at " + new Date());     
  });

  
});