import React from 'react';
import GridPostList from './GridPostList';

export default SearchResult = ({searchedPost}) => {

    return <>
        <div className='w-full h-full'>
            <GridPostList postsList={searchedPost} />
        </div>
    </>
}