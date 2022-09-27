const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');

const Post = require('../models/postModel');
const Comment = require('../models/commentModel');

const newComment = asyncHandler(async (req, res) => {
    const { post_id, body } = req.body;
    if(!post_id || !body) {
        res.status(400);
        throw new Error('some fields are emptpy');
    }
    const decoded = jwt.decode(req.headers.authorization.split('Bearer')[1].trim());

    try {
        let result = await Post.findOne({_id: post_id}).exec();
        if(!result) {
            res.status(401);
            throw new Error('user not authorized');
        }
        const comment_doc = new Comment({
            post: post_id,
            author: decoded._id,
            body
        })
        result = await Comment.save(comment_doc);
        if(!result) {
            throw new Error('comment cannot be saved');
        }
        result = await Post.findOneAndUpdate({_id:post_id},{$push: {comments: result._id}});
        if(!result) {
            throw new Error('comment cannot be saved');
        }
        result = await Post.findOne({id:post_id}).populate('comments').exec();
        res.json({
            message: 'comment created',
            result
        })
    } catch (error) {
        throw new Error(error);
    }
})

const newReply = asyncHandler(async (req, res) => {
    const { post_id, comment_id, body } = req.body;
    if(!post_id || !comment_id || !body) {
        res.status(400);
        throw new Error('some fields are empty');
    }
    const decoded = jwt.decode(req.headers.authorization.split('Bearer')[1].trim());
    try {
        let result = await Post.findById(post_id).exec();
        if(!result) {
            throw new Error('post not found');
        }
        result = await Comment.findById(comment_id).exec();
        if(!result) {
            throw new Error('parent comment not found');
        }
	let doc = new Comment({
		body,
		author:decoded._id,
		post:post_id
	});
	result = await Comment.save(doc);
    result = await Comment.findOneAndUpdate({_id:comment_id},{$push: {reply: result._id}});
	 if(!result) {
		throw new Error('can\'t create new reply');
	 }
    } catch (error) {
        throw new Error(error);
    }
})

const editReply = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { body } = req.body;
    if(!id || !body) {
        res.status(400);
        throw new Error('some fields are empty');
    }
    const decoded = jwt.decode(req.headers.authorization.split('Bearer')[1].trim());
    try {
        let result = await Comment.findOne({_id:id}).exec();
	if(!result || result.author !== decoded._id) {
		res.status(401);
		throw new Error('user not authorized');
	}
	result = await Comment.findOneAndUpdate({_id:id},{$set: {body}});
	res.json({
		message: 'updated successfully',
		result
	});
    } catch (error) {
        throw new Error(error);
    }
})

const deleteComment = asyncHandler(async (req,res) => {
	const { id } = req.params;
	const decoded = jwt.decode(req.headers.authorization.split('Bearer')[1].trim());
	try {
		let doc = await Comment.findOne({_id:id}).exec();
		if(!doc || doc.author !== decoded._id) {
			res.status(401);
			throw new Error('user not authorized');
		doc = await Comment.findOneAndDelete({_id:id}).exec();
		// delete subcomments signature from comments
		res.json({
			message: 'comment deleted',
			result: []
		});
	} catch (error) {
		throw new Error(error);
	}

})



export { newComment, newReply, editComment, deleteComment };
	
	




