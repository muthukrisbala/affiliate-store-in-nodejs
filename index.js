

var express=require('express');
var cookieParser = require('cookie-parser');
var MongoClient = require('mongodb').MongoClient;
var url = 'mongodb://localhost:27017/affiliate-store';
var compression = require('compression');
var helmet = require('helmet');




var sm = require('sitemap');

var app=express();
app.use(compression());
app.use(cookieParser())
app.use(helmet());
app.set('view engine','ejs');
var path = require ('path');
app.use(express.static(path.join(__dirname + '/public')));

app.set('views', __dirname + '/views');

var bodyParser = require('body-parser')

app.use(express.json());       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({ extended: true }));   // to support URL-encoded bodies


var urlList;  

app.get('/category/:caturl',function(req,res){
    console.log("Inside Category Page "+req.url);
    MongoClient.connect(url,{ useNewUrlParser: true }, function(err, client) {

        if(err) {
            console.log('Error occurred while connecting to MongoDB Atlas...\n',err);
       }
       var categoryurl=req.params.caturl;
       console.log(categoryurl);
        var db=client.db('affiliate-store');
       
        db.collection('products').find({"product_category":categoryurl}).toArray(function(err, results){
            if (err) return console.log(err)
            console.log("result len"+results.length);
            console.log("Cookies: ", req.cookies);

            if(results.length>=1){
                res.render('plp', {results: results})  ;  
            }else{
                res.render('404');
            }
                       
        });      
    });
   
});

app.get('/brand/:brandtext',function(req,res){
    console.log("Inside Category Page "+req.url);
    MongoClient.connect(url,{ useNewUrlParser: true }, function(err, client) {

        if(err) {
            console.log('Error occurred while connecting to MongoDB Atlas...\n',err);
       }
       var brandtext=req.params.brandtext;
       console.log(brandtext);
        var db=client.db('affiliate-store');
       
        db.collection('products').find({"product_brand":brandtext}).toArray(function(err, results){
            if (err) return console.log(err)
            console.log("result len"+results.length);
            console.log("Cookies: ", req.cookies);

            if(results.length>=1){
                res.render('plp', {results: results})  ;  
            }else{
                res.render('404');
            }
            
                       
        });      
    });
   
});

app.get('/blog/:blogurl',function(req,res){
    console.log("Inside Category Page "+req.url);
    MongoClient.connect(url,{ useNewUrlParser: true }, function(err, client) {

        if(err) {
            console.log('Error occurred while connecting to MongoDB Atlas...\n',err);
       }
       var blogurl=req.params.blogurl;
       console.log(blogurl);
        var db=client.db('affiliate-store');
       
        db.collection('blog').find({"blog_url":blogurl}).toArray(function(err, results){
            if (err) return console.log(err)
            console.log("result len"+results.length);
            console.log("Cookies: ", req.cookies);

            if(result.length>=1){
                res.render('blogpdp', {result: results[0]})  ; 
            }else{
                res.render('404');
            }

             
                       
        });      
    });
   
});

app.get('/product/amp/:produrl',function(req,res){
    MongoClient.connect(url,{ useNewUrlParser: true }, function(err, client) {

        if(err) {
            console.log('Error occurred while connecting to MongoDB Atlas...\n',err);
       }
       var producturl=req.params.produrl;
       console.log(producturl);
        var db=client.db('affiliate-store');
       
        db.collection('products').find({"product_url":producturl}).toArray(function(err, result){
            if (err) return console.log(err)
            console.log(result);
            console.log("Cookies: ", req.cookies);

            if(result.length>=1){
                res.render('pdp-amp', {result: result[0]})  ;
            }else{
                res.render('404');
            }
              
                       
        });      
    });     
});


app.get('/product/:produrl',function(req,res){
    MongoClient.connect(url,{ useNewUrlParser: true }, function(err, client) {

        if(err) {
            console.log('Error occurred while connecting to MongoDB Atlas...\n',err);
       }
       var producturl=req.params.produrl;
       console.log(producturl);
        var db=client.db('affiliate-store');
       
        db.collection('products').find({"product_url":producturl}).toArray(function(err, result){
            if (err) return console.log(err)
            console.log(result);
            console.log("Cookies: ", req.cookies);

            if(result.length>=1){
                res.render('pdp', {result: result[0]})  ;
            }else{
                res.render('404');
            }
              
                       
        });      
    });     
});


app.post('/search/',function(req,res){
    MongoClient.connect(url,{ useNewUrlParser: true }, function(err, client) {

        if(err) {
            console.log('Error occurred while connecting to MongoDB Atlas...\n',err);
       }
       var producttitle=req.body.query;
       var searchregex = new RegExp(["^", producttitle, "$"].join(""), "i");
       console.log(producttitle);
        var db=client.db('affiliate-store');
       
        db.collection('products').find({ $text: { $search: producttitle } }).toArray(function(err, results){
            if (err) return console.log(err)
            console.log(results);
            console.log("Cookies: ", req.cookies);
            if(results.length>=1){
                res.render('plp', {results: results})  ;  
            }else{
                res.render('404');
            }
                       
        });      
    });     
});



app.get('/sitemap.xml', function(req, res) {  


	const { buildSitemapIndex } = require('sitemap')
	const smi = buildSitemapIndex({
	  urls: [{url:'https://www.shopmuthu.com/sitemap-products.xml',lastmod: '2019-09-11'},{ url:'https://www.shopmuthu.com/sitemap-pages.xml',lastmod: '2019-09-10'}],
	  xslUrl:'https://www.shopmuthu.com/css/xml-sitemap.xsl'
	}); 
	console.log("typeof"+typeof(smi));
	
	 
	
	try {
            //const xml = smi.toXML()
            res.header('Content-Type', 'application/xml');
            res.send( smi );
          } catch (e) {
            console.error(e)
            res.status(500).end()
          }  
	
	
	



});

app.get('/sitemap-pages.xml', function(req, res) {    

    var sitemap = sm.createSitemap({
        hostname: 'http://www.shopmuthu.com/product/',
        cacheTime: 600000 ,      // 600 sec - cache purge period
		xslUrl:'https://www.shopmuthu.com/css/xml-sitemap.xsl'


      });
	var urlList;

	sitemap.add({url:'https://www.shopmuthu.com/contact-us',  changefreq: 'monthly', priority: 0.4 });  
	sitemap.add({url:'https://www.shopmuthu.com/terms-conditions',  changefreq: 'monthly', priority: 0.4 });  
	sitemap.add({url:'https://www.shopmuthu.com/privacy',  changefreq: 'monthly', priority: 0.4 });  
	sitemap.add({url:'https://www.shopmuthu.com/about-us',  changefreq: 'monthly', priority: 0.4 });  
	
	
	try {
            const xml = sitemap.toXML()
            res.header('Content-Type', 'application/xml');
            res.send( xml );
          } catch (e) {
            console.error(e)
            res.status(500).end()
          }   


  
    
  });

app.get('/sitemap-products.xml', function(req, res) {    

    var sitemap = sm.createSitemap({
        hostname: 'http://www.shopmuthu.com/product/',
        cacheTime: 600000  ,     // 600 sec - cache purge period  
		xslUrl:'https://www.shopmuthu.com/css/xml-sitemap.xsl'		

      });
var urlList;
MongoClient.connect(url,{ useNewUrlParser: true }, function(err, client) {
    console.log("Inside sitemap generation:");
    if(err) {
        console.log('Error occurred while connecting to MongoDB Atlas...\n',err);
   }
   
   
    var db=client.db('affiliate-store');
   
    db.collection('products').find({}).toArray(function(err, sitemapresult){
        if (err) return console.log(err)        
        urlList="";
        for ( var i=0;i<sitemapresult.length;i++)  {             
            sitemap.add({url:sitemapresult[i].product_url,  changefreq: 'daily', priority: 0.9 ,lastmod: sitemapresult[i].last_updated_time});            
        }   
        try {
            const xml = sitemap.toXML()
            res.header('Content-Type', 'application/xml');
            res.send( xml );
          } catch (e) {
            console.error(e)
            res.status(500).end()
          }   
        
    });      
});



  
    
  });
 

app.get('/createproduct123789',function(req,res){
    res.render('createproduct')  ;  
});

app.get('/about-us',function(req,res){
    res.render('aboutus')  ;  
});

app.get('/contact-us',function(req,res){
    res.render('contactus')  ;  
});
app.get('/terms-conditions',function(req,res){
    res.render('termsconditions')  ;  
});
app.get('/privacy',function(req,res){
    res.render('privacy')  ;  
});

app.get('/',function(req,res){
    MongoClient.connect(url,{ useNewUrlParser: true }, function(err, client) {

        if(err) {
            console.log('Error occurred while connecting to MongoDB Atlas...\n',err);
       }
       var categoryurl='mobiles';
       console.log(categoryurl);
        var db=client.db('affiliate-store');
       
        db.collection('products').find({"product_category":categoryurl}).toArray(function(err, results){
            if (err) return console.log(err)
            console.log("result len"+results.length);
            console.log("Cookies: ", req.cookies);

            res.render('home', {results: results})  ;  
                       
        });      
    });
});

app.get("/robots.txt", function(req, res) {
	

    res.type('text/plain');
        res.send("User-agent: *\nDisallow: /newpost\nsitemap: http://www.shopmuthu.com/sitemap.xml");	
        
    });


    app.post('/savecontact',function(req,res){
        console.log("Inside save contact");
        MongoClient.connect(url,{ useNewUrlParser: true }, function(err, client) {
    
            if(err) {
                console.log('Error occurred while connecting to MongoDB Atlas...\n',err);
           }
           var name=req.body.name;
           var mailid=req.body.mailid;
           var comment=req.body.comment;

           var db=client.db('affiliate-store');
           var contact_data ={
               "name":name,
               "mailid":mailid,
               "comment":comment
           };

           db.collection('contact').insertOne(contact_data),function(err, result){
            if (err) return console.log(err)
            console.log(result);
            

            res.render('pc-success')  ;  
                       
        };      
    });     
        

    }); 
    app.post('/saveproduct',function(req,res){
        console.log("Inside save product");
        MongoClient.connect(url,{ useNewUrlParser: true }, function(err, client) {
    
            if(err) {
                console.log('Error occurred while connecting to MongoDB Atlas...\n',err);
           }
           var product_title=req.body.product_title;
           var product_category=req.body.product_category;
           var product_image=req.body.product_image;
           var product_url=product_title.replace(/ /g,'-');
           
    
           var key_spec1=req.body.key_spec1;
           var key_spec2=req.body.key_spec2;
           var key_spec3=req.body.key_spec3;
           var key_spec4=req.body.key_spec4;
           var key_spec5=req.body.key_spec5;
           var key_spec6=req.body.key_spec6;
    
           var ram=req.body.ram;
           var storage=req.body.storage;
           var os=req.body.os;
           var color=req.body.color;
           var weight=req.body.weight;
           var battery=req.body.battery;
    
    
           var amazon_price=req.body.amazon_price;
           var amazon_imagepath=req.body.amazon_imagepath;
           var amazon_url=req.body.amazon_url;
           var amazon_shop=req.body.amazon_shop;
    
           var flipkart_price=req.body.flipkart_price;
           var flipkart_imagepath=req.body.flipkart_imagepath;
           var flipkart_url=req.body.flipkart_url;
           var flipkart_shop=req.body.flipkart_shop;
    
           var tatacliq_price=req.body.tatacliq_price;
           var tatacliq_imagepath=req.body.tatacliq_imagepath;
           var tatacliq_url=req.body.tatacliq_url;
           var tatacliq_shop=req.body.tatacliq_shop;
    
           console.log(product_title);
            var db=client.db('affiliate-store');
           var data ={
               "product_title":product_title,
               "product_url":product_url,
               "product_category":product_category,
               "product_image":product_image,
               
               "key_specification":[key_spec1,key_spec2,key_spec3,key_spec4,key_spec5,key_spec6],
               "specification": {"RAM":ram,"Storage":storage,"OS":os,"color":color,"weight":weight,"Battery Power":battery},
               "merchant_list1":[
                   {"price":amazon_price,
                   "image_path":amazon_imagepath,
                   "url":amazon_url,
                   "shop":amazon_shop
                },
                {"price":flipkart_price,
                "image_path":flipkart_imagepath,
                "url":flipkart_url,
                "shop":flipkart_shop
             },
             {"price":tatacliq_price,
             "image_path":tatacliq_imagepath,
             "url":tatacliq_url,
             "shop":tatacliq_shop
          },
            ]};
            db.collection('products').insertOne(data),function(err, result){
                if (err) return console.log(err)
               // console.log(result);
                console.log("Cookies: ", req.cookies);
    
                res.render('pc-success')  ;  
                           
            };      
        });     
    });

    
var server=app.listen(3000,function() {
    console.log('Affiliate store listening at http://127.0.0.1:3000');

});