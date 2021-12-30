var http = require('http');
var url = require('url');
var topic = require('./lib/topic');
var author = require("./lib/author");
const { authorSelect } = require('./lib/template.js');

var app = http.createServer(function(request,response){
    var _url = request.url;
    var queryData = url.parse(_url, true).query;
    var pathname = url.parse(_url, true).pathname;
    console.log(pathname);
    if(pathname === '/'){
      if(queryData.id === undefined){ 
        topic.home(request,response);   
      } //end if (queryData.id === undefined)
      else {
       topic.page(request,response);
      } //end else 
    } // end if(pathname === '/') 
    else if(pathname === "/create"){
        topic.create(request,response);
    }// end else if 
    else if (pathname === "/create_process"){
        topic.create_process(request,response);
    }// end else if   
    else if(pathname === "/update"){
      topic.update(request, response);
    } //END else if(pathname === "/update")
    else if(pathname === '/update_process'){
      topic.update_process(request,response);
    } // end if  
    else if(pathname === '/delete_process'){
        topic.delete_process(request,response);        
      } //end else if 
    else if(pathname ==="/author"){
        author.home(request,response);
    } //end else if
    else if(pathname ==="/author/create_process"){
        author.create_process(request,response);
    }
    else if(pathname==='/author/update'){
        author.update(request,response);
    }
    else if(pathname ==='/author/update_process'){
        author.update_process(request,response);
    }
    else if(pathname === '/author/delete_process'){
        author.delete_process(request, response);
    }
    else {
       response.writeHead(404);
       response.end('Not found');
    }
});
app.listen(3000);
