import {useParams} from 'react-router-dom'
import { MouseEvent, useEffect } from 'react'
import { MdEmail, MdLink, MdLocationOn } from 'react-icons/md';

import Navbar from '../components/Navbar'
import HomeBlogs from '../components/HomeBlogs'
import UserImage from '../components/UserImage'

import { tabHandler } from '../utils/tabHandler'
import { getUserProfile, followUser } from '../app/features/auth/authSlice'
import { useAppDispatch, useAppSelector } from '../hooks/useReactRedux'
import {userBlogsList} from '../app/features/post/postSlice'



const User = () => {
    const { id } = useParams();
    const { user, token, userProfile } = useAppSelector(state => state.auth);
    const { userBlogs } = useAppSelector(state => state.post);

    const dispatch = useAppDispatch();

    const handleBlogsTab = (event:MouseEvent<HTMLButtonElement>) => {
        tabHandler(event,'user-blog-tab');
    }

    const handleProfileTab = (event:MouseEvent<HTMLButtonElement>) => {
        tabHandler(event,'user-profile-tab');
    }
    const handleFollow = () => {
        if(token) 
        {
            dispatch(followUser({token,follow_id:user._id}));
        }

    }
    useEffect(() => {
        if(id) {
            dispatch(getUserProfile({id})); 
            dispatch(userBlogsList({pages:1,rows:5,id,filter:'latest'}));
        }
    }, [])
    if(Object.keys(userProfile).length === 0) return <h2>Loading...</h2>
    
  return (
    <>
        <Navbar />
        <main className='flex flex-col max-w-xl m-auto gap-4'>
            <section className='flex items-center justify-start gap-2'>
                <div className='flex flex-col gap-2'>
                    <UserImage profileImage={userProfile.profileImage} fullname={userProfile.fullname} width={300} height={300} />
                    <div className='p-2'>
                        <h3 className='font-normal '>{userProfile.followers.length} followers</h3>
                        <button className='px-2 py-1 text-white bg-green-500 rounded' onClick={handleFollow}>{(userProfile.followers.includes(user._id)) ? 'Unfollow' : 'follow'}</button>
                    </div>
                </div>
                <div className='flex flex-col gap-2'>
                   <div className='flex flex-col'>
                        <h2 className='mb-0 text-xl capitalize'>{userProfile.fullname}</h2>
                      <h3 className='mt-0 italic text-gray-600'>@{userProfile.username}</h3>  
                      <p>{userProfile.bio}</p>
                       <h3 className='flex items-center gap-2'>
                          <MdEmail />
                          <a href={`mailto:${userProfile.email}`}>{userProfile.email}</a> 
                       </h3>
                       <h4 className='flex items-center gap-2'>
                            <MdLink />
                            <a href={userProfile.website}>{userProfile.website}</a>
                       </h4>
                       <h4 className='flex items-center gap-2'>
                            <MdLocationOn />
                            <span>{userProfile.country}</span>
                       </h4>
                   </div> 
                   <div></div> 
                </div>
            </section>
            <section>
                <div className='flex items-center justify-between border-solid border-bottom border-color-slate-400'>
                    <h2>{userProfile.fullname} blogs</h2>
                    <div className='flex items-center justify-start gap-2'>
                        <button onClick={handleBlogsTab} className='user-blog-tab'>Most Recent</button>
                        <button onClick={handleBlogsTab} className='user-blog-tab'>Oldest</button>
                        <button onClick={handleBlogsTab} className='user-blog-tab'>Most Liked</button>
                    </div>
                </div>
                <div className='flex flex-col gap-2'>
                    {
                        userBlogs.length > 0 ? (
                            userBlogs.map(item => {
                                return <HomeBlogs key={item._id} {...item} />
                            })
                        ) : (
                            <p>no items to display</p>
                        )
                    }
                </div>
            </section>
        </main>
    </>
  )
}

export default User
