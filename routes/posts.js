const router = require("express").Router();
const Post = require("../models/Post");

// Create a post
router.post("/", async (req, res) => {
    const newPost = new Post(req.body)
    try {
        const savedPost = await newPost.save();
        res.status(200).json(savedPost);
    } catch(err) {
        res.status(500).json(err)
    }
});

// Update a post
router.put("/:id", async (req, res) => {
    const post = await Post.findById(req.params.id);
    try {
        if (post.userId === req.body.userId) {
            await post.updateOne({$set:req.body});
            res.status(200).json("The post has been updated");
        } else {
            res.status(403).json("You can't update others posts");
        }
    } catch(err) {
        res.status(500).json(err)
    }
});

// Delete a post
router.delete("/:id", async (req, res) => {
    const post = await Post.findById(req.params.id);
    try {
        if (post.userId === req.body.userId) {
            await post.deleteOne();
            res.status(200).json("The post has been deleted");
        } else {
            res.status(403).json("You can't delete others posts");
        }
    } catch(err) {
        res.status(500).json(err);
    }
});

// Like and dislike a post
router.put("/:id/like", async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post.likes.includes(req.body.userId)) {
            await post.updateOne({ $push: { likes: req.body.userId }});
            res.status(200).json("You liked this post");
        } else {
            await post.updateOne({ $pull: { likes: req.body.userId }});
            res.status(200).json("You disliked this post");
        }
    } catch(err) {
        res.status(500).json(err);
    }
});

// Get a post
router.get("/:id", async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        res.status(200).json(post);
    } catch(err) {
        res.status(500).json(err);
    }
});


// FIX !!!!
// Get timeline posts
router.get("/timeline/all", async (req, res) => {
    try {
        const currentUser = await User.findById(req.body.userId);
        const userPosts = await Post.find({ userId: currentUser._id });
        const friendPosts = await Promise.all(
            currentUser.following.map((friendId) => {
                return Post.find({ userId: friendId });
            })
        );
        res.status(200).json(userPosts.concat(...friendPosts));
    } catch(err) {
        res.status(500).json(err);
    }
});

module.exports = router;