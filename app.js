const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const port = 3000;

app.use(bodyParser.json());
const jsonParser = bodyParser.json();

var businesses = [];

// Adding business 
app.use(express.json());

app.post('/businesses', jsonParser, (req, res) => {
  if (req.body && req.body.name) {
    const business = {
      name: req.body.name,
      address: req.body.address,
      city: req.body.city,
      state: req.body.state,
      zip: req.body.zip,
      phone: req.body.phone,
      category: req.body.category,
      subcategories: req.body.subcategories,
      website: req.body.website || '',
      email: req.body.email || '',
    };
    businesses.push(business);
    var id = businesses.length - 1;
    res.status(201).json({
      id: id,
      links: {
        business: '/businesses/' + id
      }
    });
  } else {
    res.status(400).json({
      err: "Request needs a JSON body with a name field"
    });
  }
});

// List of businesses 
app.get('/businesses', (req, res) => {
  var page = parseInt(req.query.page) || 1;
  var numPerPage = 10;
  var lastPage = Math.ceil(businesses.length / numPerPage);
  page = page < 1 ? 1 : page;
  page = page > lastPage ? lastPage : page;
  var start = (page - 1) * numPerPage;
  var end = start + numPerPage;
  var pageBusinesses = businesses.slice(start, end);
  var links = {};
  if (page < lastPage) {
      links.nextPage = '/businesses?page=' + (page + 1);
      links.lastPage = '/businesses?page=' + lastPage;
  }
  if (page > 1) {
      links.prevPage = '/businesses?page=' + (page - 1);
      links.firstPage = '/businesses?page=1';
  }  
  res.setHeader('Content-Type', 'application/json');
  res.status(200).send(JSON.stringify({
      pageNumber: page,
      totalPages: lastPage,
      pageSize: numPerPage,
      totalCount: businesses.length,
      businesses: pageBusinesses,
      links: links
  }, null, 2));
});

// List business by id 
app.get('/businesses/:businessID', (req, res, next) => {
  var businessID = parseInt(req.params.businessID);
  if (businesses[businessID]) {
    res.setHeader('Content-Type', 'application/json');
    res.status(200).send(JSON.stringify(businesses[businessID], null, 2));
  } else {
    next();
  }
});

// Edit business by ID 
app.put('/businesses/:id', (req, res, next) => {
  const businessID = parseInt(req.params.id);

  if (businesses[businessID]) {
    if (req.body && req.body.name) {
      businesses[businessID] = req.body;
      res.status(200).json({
        links: {
          business: '/businesses/' + businessID
        }
      });
    } else {
      res.status(400).json({
        err: "Request needs a JSON body with a 'name' field"
      });
    }
  } else {
    next();
  }
});

// delete a business by id
app.delete('/businesses/:id', function (req, res, next) {
  var businessID = parseInt(req.params.id);
  if (businesses[businessID]) {
    businesses[businessID] = null;
    res.status(204).end();
  } else {
    next();
  }
}
);

var reviews = [];

// adding review
app.post('/reviews', jsonParser, (req, res) => {
  if (req.body && req.body.starRating && req.body.dollarRating) {
    const review = {
      starRating: req.body.starRating,
      dollarRating: req.body.dollarRating,
      review: req.body.review || '',
    };
    reviews.push(review);
    const id = reviews.length - 1;
    res.status(201).json({
      id: id,
      links: {
        review: '/reviews/' + id
      }
    });
  } else {
    res.status(400).json({
      err: "Request needs a JSON body with a star rating field and dollar rating field"
    });
  }
});

// edit a review
app.put('/reviews/:reviewID', (req, res, next) => {
  var reviewID = parseInt(req.params.reviewID);
  if (reviews[reviewID]) {
      if (req.body && req.body.starRating && req.body.dollarRating) {
          reviews[reviewID] = req.body;
          res.status(200).json({
              links: {
                  review: '/reviews/' + reviewID
              }
      });
      } else {
          res.status(400).json({
              err: "Request needs a JSON body with a star rating field and dollar rating field"
          });
      }
  } else {
      next();
  }
});


// delete a review by id
app.delete('/reviews/:reviewID', (req, res, next) => {
  var reviewID = parseInt(req.params.reviewID);
  if (reviews[reviewID]) {
      reviews[reviewID] = null;
      res.status(204).end();
  } else {
      next();
  }
});

var photos = [];

// Create a new photo
app.post('/photos', jsonParser, (req, res) => {
  if (req.body && req.body.imageFile) {
    const photo = {
      imageFile: req.body.imageFile,
      caption: req.body.caption || '',
    };
    photos.push(photo);
    const id = photos.length - 1;
    res.status(201).json({
      id: id,
      links: {
        photo: '/photos/' + id
      }
    });
  } else {
    res.status(400).json({
      err: "Request needs a JSON body with an image file field"
    });
  }
});


// edit an existing photo
app.put('/photos/:photoID', (req, res, next) => {
  var photoID = parseInt(req.params.photoID);
  if (photos[photoID]) {
      if (req.body && req.body.imageFile) {
          photos[photoID] = req.body;
          res.status(200).json({
              links: {
                  photo: '/photos/' + photoID
              }
      });
      } else {
          res.status(400).json({
              err: "Request needs a JSON body with an image file field"
          });
      }
  } else {
      next();
  }
});


//  list of all photos
app.get('/photos', (req, res) => {
  var page = parseInt(req.query.page) || 1;
  var numPerPage = 10;
  var lastPage = Math.ceil(photos.length / numPerPage);
  page = page < 1 ? 1 : page;
  page = page > lastPage ? lastPage : page;
  var start = (page - 1) * numPerPage;
  var end = start + numPerPage;
  var pagephotos = photos.slice(start, end);
  var links = {};
  if (page < lastPage) {
      links.nextPage = '/photos?page=' + (page + 1);
      links.lastPage = '/photos?page=' + lastPage;
  }
  if (page > 1) {
      links.prevPage = '/photos?page=' + (page - 1);
      links.firstPage = '/photos?page=1';
  }  
  res.setHeader('Content-Type', 'application/json');
  res.status(200).send(JSON.stringify({
      pageNumber: page,
      totalPages: lastPage,
      pageSize: numPerPage,
      totalCount: photos.length,
      photos: pagephotos,
      links: links
    }, null, 2)); 
});


// delete a photo by id
app.delete('/photos/:photoID', (req, res, next) => {
  var photoID = parseInt(req.params.photoID);
  if (photos[photoID]) {
      photos[photoID] = null;
      res.status(204).end();
  } else {
      next();
  }
});

// list of businesses by photo id
app.get('/photos/:photoID/businesses', (req, res, next) => {
  var photoID = parseInt(req.params.photoID);
  var page = parseInt(req.query.page) || 1;
  var numPerPage = 10;
  var lastPage = Math.ceil(businesses.length / numPerPage);
  page = page < 1 ? 1 : page;
  page = page > lastPage ? lastPage : page;
  var start = (page - 1) * numPerPage;
  var end = start + numPerPage;
  var pageBusinesses = businesses.slice(start, end);
  var links = {};

  if (page < lastPage) {
      links.nextPage = '/photos/:photoID/businesses?page=' + (page + 1);
      links.lastPage = '/photos/:photoID/businesses?page=' + lastPage;
  }
  if (page > 1) {
      links.prevPage = '/photos/:photoID/businesses?page=' + (page - 1);
      links.firstPage = '/photos/:photoID/businesses?page=1';
  }  
  
  if (photos[photoID]) {
    res.setHeader('Content-Type', 'application/json');
    res.status(200).send(JSON.stringify({
        pageNumber: page,
        totalPages: lastPage,
        pageSize: numPerPage,
        totalCount: businesses.length,
        businesses: pageBusinesses[photoID],
        links: links
    }, null, 2));
} else {
    next();
}
});


// list of reviews by photo id
app.get('/photos/:photoID/reviews', (req, res, next) => {
  var photoID = parseInt(req.params.photoID);
  var page = parseInt(req.query.page) || 1;
  var numPerPage = 10;
  var lastPage = Math.ceil(reviews.length / numPerPage);
  page = page < 1 ? 1 : page;
  page = page > lastPage ? lastPage : page;
  var start = (page - 1) * numPerPage;
  var end = start + numPerPage;
  var pagereviews = reviews.slice(start, end);
  var links = {};

  if (page < lastPage) {
      links.nextPage = '/photos/:photoID/reviews?page=' + (page + 1);
      links.lastPage = '/photos/:photoID/reviews?page=' + lastPage;
  }
  if (page > 1) {
      links.prevPage = '/photos/:photoID/reviews?page=' + (page - 1);
      links.firstPage = '/photos/:photoID/reviews?page=1';
  }  
  
  if (photos[photoID]) {
    res.setHeader('Content-Type', 'application/json');
    res.status(200).send(JSON.stringify({
      pageNumber: page,
      totalPages: lastPage,
      pageSize: numPerPage,
      totalCount: reviews.length,
      reviews: pagereviews[photoID],
      links: links
    }, null, 2));
} else {
    next();
}
});


app.listen(port, () => {
  console.log(`listening on port ${port}`);
});