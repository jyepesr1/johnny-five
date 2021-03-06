var http = require('http')
var path = require('path')
var express = require('express')
var five = require('johnny-five')
var pixel = require('node-pixel')
var hexColor = "#127c31"
var board = new five.Board()
var strip
var MAXAUDIO = 190
var MAXSTRIP = 17
var app = express()

app.use(express.static(path.join(__dirname, 'public')))

var server = http.createServer(app)
var io = require('socket.io')(server)

server.listen(9090)

board.on("ready", function(){
  strip = new pixel.Strip({                        
        data: 6,                                         
        length: 18,                                      
        board: this,                                     
        controller: "FIRMATA",                           
  });
                                                  
  strip.on("ready", function() {                       
    console.log("Strip ready, let's go");            
  })

  io.on('connection', function (socket) {
    socket.on('audio', function(audio){
      console.log(audio[0])
      var valor = Math.round((audio[0]*MAXSTRIP)/MAXAUDIO)
      for(i=0; i<=valor; i++){
         var p = strip.pixel(i)
         p.color("blue")
      }
      strip.show()
      setTimeout(function(){
         strip.color("black")
         strip.show()
      }, 200)
    })
  })
})

