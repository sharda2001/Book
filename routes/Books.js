const router = require('express').Router();
const bookModel = require('../models/Books');

/** 
 @api {post} /book/books  Create the single book
 * @apiName postBooks
 * @apiGroup books
 *
 * @apiSuccess {String} Bookname get the Bookname
 * @apiSuccess {integer} BookId get the BookId
 * @apiSuccess {integer} Bookprice get the Bookprice
 * @apiSuccess {String} Authorname get the Authorname
 * @apiSuccess {String} CreatedBy get the CreatedBy
 * @apiSuccess {integer} CreatedAt get the date of CreatedAt
 * 
 * @apiError {String} Book book already exist
; */
router.post('/books', async function (req, res) {
    const Bookname= req.body.Bookname;
    const BookId = req.body.BookId;
    const Bookprice = req.body.BookPrice;
    const Authorname = req.body.Authorname;
    const CreatedBy = req.body.CreatedBy;
    const bookExist = await bookModel.findOne({BookId : BookId});
  
    if (bookExist) return res.send('Book already exist');

    var data = await bookModel.create({Bookname,BookId,Bookprice,Authorname,CreatedBy});
    data.save();

    res.send("Book Uploaded");
});


/** 
 @api {get} /book/books get all the books
 * @apiName getAllBooks
 * @apiGroup books
 *
 * @apiSuccess {String} Bookname get the Bookname
 * @apiSuccess {integer} BookId get the BookId
 * @apiSuccess {integer} Bookprice get the Bookprice
 * @apiSuccess {String} Authorname get the Authorname
 * @apiSuccess {String} CreatedBy get the CreatedBy
 * @apiSuccess {integer} CreatedAt get the date of CreatedAt
 * 
 * @apiError {String} 500 server error
; */
router.get('/books', async function (req, res) {
    try{
        let {page, size} = req.query
        if (!page){
            page=1
        }
        if (!size){
            size=10  //default size
        }
        const limit = parseInt(size)
        const users = await bookModel.find().limit(limit)
        res.send(users)
    }catch(error){
        res.sendStatus(500).send(error.massage);
    }
 });
 
 /** 
 @api {get} /book/books/:authorid get the author by id
 * @apiName GetAuthorById
 * @apiGroup book
 *
 * @apiSuccess {String} Bookname get the Bookname
 * @apiSuccess {Number} BookId get the BookId
 * @apiSuccess {Number} Bookprice get the Bookprice
 * @apiSuccess {String} Authorname get the Authorname
 * @apiSuccess {String} CreatedBy get the CreatedBy
 * @apiSuccess {Number} CreatedAt get the date of CreatedAt
 * 
 * @apiError {String} Author author Not Found
; */
 router.get('/books/:authorid', async function (req, res) {
     const { authorid } = req.params;
     const author = await bookModel.findOne({ Authorname : authorid });
     if(!author) return res.send("Author Not Found");
     res.send(author);
 });


/** 
 @api {put} /book/books/:id  update the existing book by id
 * @apiName putBook
 * @apiGroup books
 *
 * @apiSuccess {String} 200 Book Updated
 * 
 * @apiError {String} Book Book Do Not Exist
; */
router.put('/books/:BookId', async function (req, res) {
    const { id } = req.params;
    const {
        Bookname,
        Authorname,
    } = req.body;

    const bookExist = await bookModel.findOne({ BookId: id});
    if (!bookExist) return res.send('Book Do Not Exist');


    const updateField = (val, prev) => !val ? prev : val;

    const updatedBook = {
        ...bookExist ,
        Bookname: updateField(Bookname, bookExist.Bookname),
        Authorname: updateField(Authorname, bookExist.Authorname),
        
    };

    await bookModel.updateOne({BookId: id},{$set :{Bookname : updatedBook.Bookname, Authorname: updatedBook.Authorname}})
    
    res.status(200).send("Book Updated");
});

/** 
 @api {delete} /book/books/:id  delete the existing book by id
 * @apiName deleteBook
 * @apiGroup books
 * 
 * @apisuccess Book Record Deleted Successfully
 * 
 * @apiError Book Do Not exist
; */
router.delete('/books/:id', async function (req, res) {
    const { id } = req.params;

    const bookExist = await bookModel.findOne({BookId : id});
    if (!bookExist) return res.send('Book Do Not exist');

   await bookModel.deleteOne({ BookId: id }).then(function(){
        console.log("Data deleted"); // Success
        res.send("Book Record Deleted Successfully")
    }).catch(function(error){
        console.log(error); // Failure
    });
});

module.exports = router;
