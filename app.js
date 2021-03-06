const path = require('path');
const express = require('express');
const ejs = require('ejs');
const bodyParser = require('body-parser');
const app = express();

const mysql = require('mysql');

const connection=mysql.createConnection({
    host:'localhost',
    user:'root',
    password:'',
    database:'node_crud'
});

connection.connect(function(error){
    if(!!error) console.log(error);
    else console.log('Database Connected!');
}); 

//set view file
app.set('views',path.join(__dirname,'views'));
			
//set view engine
app.set('view engine', 'ejs');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));


app.get('/',(req, res) => {
// res.send('CRUD Operation using NodeJS / ExpressJS / MySQL');
    let sql = "SELECT * FROM db_barang";
    let query = connection.query(sql, (err, rows) => {
        if(err) throw err;
            res.render('barang_index', {
                title : 'Aplikasi Stok Barang Bengkel',
                db_barang : rows
            });
        });
});

app.get('/add',(req, res) => {
    res.render('tambah_barang', {
        title : 'Tambah Barang Bengkel'
    });
})

app.post('/save',(req, res) => { 
    let data = {kode: req.body.kode, nama: req.body.nama, merek: req.body.merek, stok: req.body.stok};
    let sql = "INSERT INTO db_barang SET ?";
    let query = connection.query(sql, data,(err, results) => {
      if(err) throw err;
      res.redirect('/');
    });
});

app.get('/edit/:id',(req, res) => {
    const id = req.params.id;
    let sql = `Select * from db_barang where id = ${id}`;
    let query = connection.query(sql,(err, result) => {
        if(err) throw err;
        res.render('edit_barang', {
            title : ' Edit barang ',
            user : result[0]
        });
    });
});

app.post('/update',(req, res) => {
    const userId = req.body.id;
    let sql = "update db_barang SET kode='"+req.body.kode+"',  nama='"+req.body.nama+"',  merek='"+req.body.merek+"',  stok='"+req.body.stok+"' where id ="+userId;
    let query = connection.query(sql,(err, results) => {
      if(err) throw err;
      res.redirect('/');
    });
});

app.get('/delete/:id',(req, res) => {
    const id = req.params.id;
    let sql = `Delete from db_barang where id = ${id}`;
    let query = connection.query(sql,(err, result) => {
        if(err) throw err;
        res.redirect('/');
    });
});

// Server Listening
app.listen(3000, () => {
    console.log('Server is running at port 3000');
});