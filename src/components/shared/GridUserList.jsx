import React from 'react';
import { Link } from 'react-router-dom';

export default function GridUserList({usersList = []}){

    return(
        <ul className='user-grid'>
            {usersList.map(userDocs => (
                
            <li key={userDocs?.$id} className='w-44 sm:w-56 md:h-52 rounded-xl user-card' style={{backgroundImage: `url(${userDocs?.imageUrl})`}} >
                <Link to={`/user/${userDocs?.$id}`} className='w-full h-full flex flex-col gap-3 items-center border rounded-lg px-1 py-4 bg-zinc-800/70 backdrop-blur-xl sm:justify-around'>
                    <img src={userDocs?.imageUrl} alt='profile pic'  className='rounded-full size-16 ' />
                    <div className='flex flex-col items-center'>
                    <span>&#64;{userDocs?.username}</span>
                    <h3 className='body-medium'>{userDocs?.name}</h3>
                    </div>
                </Link>
            </li>
                ))}
        </ul>
    )
}