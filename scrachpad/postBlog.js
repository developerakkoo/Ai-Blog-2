// const {google} = require('googleapis');
// const blogger = google.blogger('v3');

// // Function to create and publish a blog post
// async function createAndPublishPost() {
//   const postContent = '<p>Your HTML blog content here</p>';

//   const blogId = '4294125131319745938'; // Replace with your actual Blog ID
//   const post = {
//     kind: 'blogger#post',
//     blog: {
//       id: blogId,
//     },
//     title: 'TestTitle',
//     content: postContent,
//   };

//   try {
//     const response = await blogger.posts.insert({
//       auth: 'AIzaSyAsPvY5CaO2-G4tofKcvVLrPE5iDCa9FF0',
//       blogId,
//       resource: post,
//     });

//     console.log('Post published successfully:', response.data);
//   } catch (error) {
//     console.error('Error publishing post:', error);
//   }
// }

// createAndPublishPost();


const axios = require('axios');
let data = JSON.stringify({
  "kind": "blogger#post",
  "blog": {
    "id": "4294125131319745938"
  },
  "title": "A new post",
  "content": "With <b>exciting</b> content..."
});

let config = {
  method: 'post',
  maxBodyLength: Infinity,
  url: 'https://www.googleapis.com/blogger/v3/blogs/8850909923294568640/posts/?key=AIzaSyCCHTMrMgocQxOcnTkajqLL7aaPiQNFr6E',
  headers: { 
    'Content-Type': 'application/json', 
    'Authorization': 'Bearer ya29.a0AfB_byDZPP-hDvn96wGzO4FmxDue1Wl9bIFxTIDUZO5J694J23aEGCxTQJ0meHfJgrrxEd2kSjoLfra8UBCbP6RPZNvVKDM1hEFHWaSvQeKoHv_J4tkNJkTumXP71-2F0rG41AktbCS45rUUshez305aATLShPf9OeZI7QaCgYKAXASARMSFQHsvYlsAymFBYADKwRqAvkq2mszdA0173'
  },
  data : data
};

axios.request(config)
.then((response) => {
  console.log(JSON.stringify(response.data));
})
.catch((error) => {
  console.log(error);
});
