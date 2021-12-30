var db =require('./db');
var template = require('./template.js');
var url = require('url');
var qs = require('querystring');
var sanitizeHtml = require('sanitize-html');

exports.home =function(request,response){

    db.query(`SELECT * FROM topic`, function(error, topics){
        var title = 'Welcome';
        var description = 'Hello, Node.js';
        var list = template.list(topics);
        var html = template.HTML(title,list,`<h2>${title}</h2>${description}`,
            `<a href="/create">create</a>`
        );  //end template.HTML   
        response.writeHead(200);
        response.end(html);

    }); //end query

}

exports.page = function(request,response){
    var _url = request.url;
    var queryData = url.parse(_url, true).query;
    db.query(`SELECT *FROM topic`, function(error, topics){
        if(error){
          throw error;
        } //end if
        db.query(`SELECT *FROM topic T, author A WHERE T.author_id = A.id AND T.id=?`,[queryData.id] ,
        function(error2, topic){
          if(error2){
            throw error2;
          }
          var title = topic[0].title;
          var description =topic[0].description;
          var list = template.list(topics);
          var html =template.HTML(title,list,
                  `<h2>${sanitizeHtml(title)}</h2>
                  ${sanitizeHtml(description)} 
                  <p>by ${sanitizeHtml(topic[0].name)}</p>`,
                  `<a href="/create">create</a>
                  <a href="/update?id=${queryData.id}">update</a>
                    <form action="delete_process" method="post">
                      <input type="hidden" name="id" value="${queryData.id}">
                      <input type="submit" value="delete">
                    </form>`);//end  tmeplate.html
            response.writeHead(200);
            response.end(html);
        });
      });          


}

exports.create =function(request,response){
    db.query(`SELECT * FROM topic`, function(error, topics){
        db.query(`SELECT * FROM author`, function(error2, authors) {        
          var title = 'Create';
          var list = template.list(topics);
          var html = template.HTML(sanitizeHtml(title),list,`
            <form action="/create_process" method="post">
            <p><input type="text" name="title" placeholder="title"></p>        
            <p>
            <textarea name="description" placeholder="description"></textarea>          
            </p>
            <p>
              ${template.authorSelect(authors)}
            </p>

            <p>
                <input type="submit">
            </p>
            </form>`,`<a href="/create">create</a>`);  //end template.HTML   
          response.writeHead(200);
          response.end(html);

        }) // end query 
      }); //end query
}

exports.create_process =function(request,response){
    var body='';
    request.on('data',function(data){
      body= body +data;
    }); //end reuqest.om
    request.on('end',function(){
      var title = new URLSearchParams(body).get('title');
      var description = new URLSearchParams(body).get('description');
      var author = new URLSearchParams(body).get('author');  
      db.query(`INSERT INTO topic (title, description, created , author_id) 
            VALUES(?, ?,now(), ?)`, [title, description,author],
            function(error, result){
              if(error){
                throw error;
              }
              response.writeHead(302, {Location:`/?id=${result.insertId}`});
              response.end();
          }); //end query 
    }) // end request on  

}

exports.update =function(request,response){
    var _url = request.url;
    var queryData = url.parse(_url, true).query;
    db.query(`SELECT * FROM topic`, function(error, topics){
        if(error){
          throw error;
        }  
        db.query(`SELECT *FROM topic WHERE id=?`,[queryData.id] ,function(error2, topic){
          if(error2){
            throw error2;
          }
          db.query(`SELECT * FROM author`, function(error2, authors){
            var title = sanitizeHtml(topic[0].title);
            var description =sanitizeHtml(topic[0].description);
            var list = template.list(topics);
            var html = template.HTML(sanitizeHtml(topic[0].title),list,
            `<form action="/update_process" method="post">
            <input type="hidden" name="id" value="${topic[0].id}">
            <p><input type="text" name="title" placeholder ="title" value="${title}"></p>            
            <p>
              <textarea name="description" placeholder="description">${description}</textarea> 
            </p>
            <p>${template.authorSelect(authors,topic[0].author_id)}</p>
            <p>
                <input type="submit">
            </p>
            </form>`,
            `<a href="/create">create</a> <a href="/update?${topic[0].id}">update</a>`
        );  //end template.HTML   
          response.writeHead(200);
          response.end(html);
          }); //end quert 
        }); //end query
      }); // end query
    
}

exports.update_process =function(request,response){
    var body='';
        request.on('data',function(data){
          body= body +data;
        });
        request.on('end', function(){
          var title = new URLSearchParams(body).get('title');
          var id =  new URLSearchParams(body).get('id');
          var description = new URLSearchParams(body).get('description');
          var author = new URLSearchParams(body).get('author');
         db.query('UPDATE topic SET title=?, description=?, author_id=? WHERE id=?', 
            [title, description,author, id], function(error, result){
            response.writeHead(302, {Location: `/?id=${id}`});
            response.end();
          }); //end db query
        }); //end request.on
    
}

exports.delete_process =function(request,response){
    var body = '';
        request.on('data', function(data){
            body = body + data;
        });   
        request.on('end', function(){
          var post = qs.parse(body);
          db.query('DELETE FROM topic WHERE id =?',[post.id],function(error, result){
            if(error){
              throw error;
            }
            response.writeHead(302, {Location: `/`});
            response.end();
          }); //end query
        }); //end request    



}