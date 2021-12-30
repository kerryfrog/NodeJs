var db =require('./db');
var template = require('./template.js');
var qs = require('querystring');
var url = require('url');
var sanitizeHtml =require('sanitize-html');
exports.home = function(request,response){
   db.query(`SELECT * FROM topic`, function(error, topics){
    db.query(`SELECT * FROM author`, function(error2, authors){
        
        var title = 'author';
        var list = template.list(topics);
        var html = template.HTML(title,list,
           `${template.authorTable(authors)}
           <style>
                table{
                    border-collapse: collapse;
                }
                td{
                    border:1px solid black;
                }
            </style>
            <form action="/author/create_process" method="post">
            <p><input type="text" name="name" placeholder="name"></p>        
            <p>
            <textarea name="profile" placeholder="description"></textarea>          
            </p>
            <p>
                <input type="submit" value="create">
            </p>
            </form>

           `,
            ``
        );  //end template.HTML   
        response.writeHead(200);
        response.end(html);
        });
    }); //end query
}

exports.create_process =function(request,response){
    var body='';
    request.on('data',function(data){
      body= body +data;
    }); //end reuqest.om
    request.on('end',function(){
      var name = new URLSearchParams(body).get('name');
      var profile = new URLSearchParams(body).get('profile');  
      db.query(`INSERT INTO author (name, profile) 
            VALUES(?, ?)`, [name, profile],
            function(error, result){
              if(error){
                throw error;
              }
              response.writeHead(302, {Location:`/author`});
              response.end();
          }); //end query 
    }) // end request on  

} //end exports.create process

exports.update = function(request,response){
    
    db.query(`SELECT * FROM topic`, function(error, topics){
     db.query(`SELECT * FROM author`, function(error2, authors){
        var _url = request.url;
        var queryData = url.parse(_url, true).query;
        db.query(`SELECT * FROM author WHERE id=?`,[queryData.id], function(error3, author){
            var title = 'author';
            var list =  template.list(topics);
            var html = template.HTML(title,list,
            `
            ${template.authorTable(authors)}
            <style>
                table{
                    border-collapse: collapse;
                }
                td{
                    border:1px solid black;
                }
            </style>
            <form action="/author/update_process" method="post">
                <p>
                    <input type="hidden" name="id" value="${queryData.id}">
                </p>
                <p>
                    <input type="text" name="name" value="${sanitizeHtml(author[0].name)}" placeholder="name">
                </p>
                <p>
                    <textarea name="profile" placeholder="description">${sanitizeHtml(author[0].profile)}</textarea>
                </p>
                <p>
                    <input type="submit" value="update">
                </p>
            </form>
            `,
             ``
         );  //end template.HTML   
         response.writeHead(200);
         response.end(html);
         });   
        }); //end query          
    }); //end query
}
 
exports.update_process =function(request,response){
    var body='';
    request.on('data',function(data){
      body= body +data;
    }); //end reuqest.om
    request.on('end',function(){
      var name = new URLSearchParams(body).get('name');
      var profile = new URLSearchParams(body).get('profile');
      var id = new URLSearchParams(body).get('id');   
      db.query(`UPDATE author SET name=?, profile=? WHERE id=?`, [name, profile,id],
            function(error, result){
              if(error){
                throw error;
              }
              response.writeHead(302, {Location:`/author`});
              response.end();
          }); //end query 
    }) // end request on  

} //end exports.update process

 
exports.delete_process =function(request,response){
    var body='';
    request.on('data',function(data){
      body= body +data;
    }); //end reuqest.om
    request.on('end',function(){
      var id = new URLSearchParams(body).get('id');
      db.query(`DELETE FROM topic WHERE author_id =?`, [id], 
      function(error1, result1){
        if(error1){
            throw error1;
        }
        db.query(`DELETE FROM author WHERE id=?`, [id],
            function(error2, result2){
              if(error2){
                throw error2;
              }
              response.writeHead(302, {Location:`/author`});
              response.end();
          }); //end query 
      });//end query   
      
    }) // end request on  

} //end exports.update process