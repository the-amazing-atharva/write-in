import { useEffect, useState } from 'react';

import Reply from './Reply';
import UserImage from './UserImage';

import { CommentType }  from '../types/commentTypes';
import { useAppDispatch, useAppSelector } from '../hooks/useReactRedux';
import { likeComment, listReply, newReply } from '../app/features/comment/commentSlice';

const Comment = ({  _id, body, author, reply}: CommentType) => {
    const { token } = useAppSelector(state => state.auth);
    const { singlePost } = useAppSelector(state => state.post);
    const [isReplyOpen, setIsReplyOpen] = useState<boolean>(false);
    const [replyText, setReplyText] = useState<string>('');
    const [pages, setPages] = useState<number>(1);
    const [loadReply, setLoadReply] = useState<boolean>(false);

    const { profileImage, fullname } = author;
    
    const dispatch = useAppDispatch();

    const handleLike = () => {
        if(_id && token) {
            dispatch(likeComment({id:_id,token}));
        } else {
            console.log('something\'s not right');
        }
    }
    const handleReply = () => {
        if(_id && token && replyText) {
            setLoadReply(true);
            dispatch(newReply({post_id:singlePost._id,comment_id:_id,token,body:replyText}));
        } else console.log('reply not working');
        setIsReplyOpen(false);
        setReplyText('');
    }

    const handleLoadReply = () => {
        setLoadReply(true);
        setPages(prev => prev+1);
    }
    useEffect(() => {
        if(_id) {
            dispatch(listReply({post_id:_id,pages,rows:5}));
        }
    }, [pages])
	return (
		<div className=''>
			{/* comments  */}
			<div className='flex items-center justify-start text-sm gap-2'>
				<UserImage profileImage={profileImage} fullname={fullname} />
				<h3>{fullname}</h3>
			</div>
			<p>{body}</p>
			<div className='flex items-center justify-start text-sm gap-2'>
				<button onClick={handleLike}>like</button>
				<button onClick={()=>setIsReplyOpen(!isReplyOpen)}>reply</button>
			</div>
			{/* reply input */}
            {isReplyOpen && (
                    <div className='flex items-center justify-start gap-2'>
                        <input value={replyText} onChange={e=>setReplyText(e.target.value)} className='p-2 text-sm border border-gray-300 border-solid outline-none' type='text' placeholder='reply here' />
                        <button onClick={handleReply} className='px-2 py-1 text-white bg-green-500 rounded'>Reply</button>
                    </div>	
            )}
            {/* reply */}
			{(reply.length > 0 && loadReply) && (reply.map(item => {
                if(typeof item !== 'string') {
                    return (<Reply key={item._id} {...item} />)
                }
                return (<div className='hidden'></div>)
			}))}
            { reply.length > 0 && (<button className='px-2 py-1 my-2 text-sm text-white capitalize bg-green-700 rounded w-fit' onClick={handleLoadReply}>load more reply</button>) }
		</div> 
	)
}


export default Comment;
