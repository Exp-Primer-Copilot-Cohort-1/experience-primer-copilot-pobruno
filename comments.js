// Create web server
const express = require('express');
const app = express();

// Create body parser
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));

// Create mongoose
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/posts', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false
});

// Create schema
const postSchema = new mongoose.Schema({
  title: String,
  content: String
});

const Post = mongoose.model('Post', postSchema);

// Set view engine
app.set('view engine', 'ejs');

// Set routes
app.get('/', (req, res) => {
  Post.find({}, (err, posts) => {
    res.render('index', {
      posts: posts
    });
  });
});

app.get('/posts/:id', (req, res) => {
  Post.findOne({ _id: req.params.id }, (err, post) => {
    res.render('post', {
      post: post
    });
  });
});

app.post('/posts', (req, res) => {
  const post = new Post({
    title: req.body.postTitle,
    content: req.body.postBody
  });

  post.save(err => {
    if (!err) {
      res.redirect('/');
    }
  });
});

app.post('/posts/:id', (req, res) => {
  Post.findByIdAndUpdate(
    req.params.id,
    { title: req.body.postTitle, content: req.body.postBody },
    err => {
      if (!err) {
        res.redirect('/');
      }
    }
  );
});

app.post('/posts/delete/:id', (req, res) => {
  Post.findByIdAndRemove(req.params.id, err => {
    if (!err) {
      res.redirect('/');
    }
  });
});

// Listen to port
app.listen(3000, () => {
  console.log('Server started on port 3000');
});

