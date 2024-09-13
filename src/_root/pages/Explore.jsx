import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, Filter, Loader, SearchIcon, SearchX } from "lucide-react";
import { Button } from "@/components/ui";
import { useGetPopularPost, useSearchPost } from "@/lib/tanstack-query/posts";
import GridPostList from "@/components/shared/GridPostList";
import { useDebounce } from "@/hooks/useDebounce";

const Explore = () => {
  const [searchText, setSearchText] = useState("");
  const debounceSearchText = useDebounce(searchText, 500);
  const {
    data: popularPosts,
    isFetchingNextPage: isFetchingNextPopularPost,
    isLoading: isLoadingPopularPost,
    hasNextPage: hasNextpopularPage,
    fetchNextPage,
  } = useGetPopularPost(!debounceSearchText);
  const {
    data: searchedPost,
    isFetchingNextPage: isFetchingNextSearchedPost,
    isError: isSearchError,
    error: searchError,
    hasNextPage: hasNextSearchPostPage,
  } = useSearchPost(debounceSearchText);
  useEffect(() => {
    console.log({
      popularPosts,
      isFetchingNextPopularPost,
      isLoadingPopularPost,
      hasNextpopularPage,
    });
    if (hasNextpopularPage) {
      console.log("wtf");
    }
  }, [popularPosts, isFetchingNextPopularPost, isLoadingPopularPost]);
  const navigate = useNavigate();

  return (
    <div className="explore-container">
      {/* // * Top Navigation */}
      <div className="flex-start self-start">
        <Button variant="ghost" onClick={() => navigate(-1)}>
          <ChevronLeft />
        </Button>
        <h2 className="h3-bold dark:text-light-2 text-dark-3 ">Explore</h2>
      </div>

      {/* //* Search Bar */}
      <div className="w-full px-3 gap-4 flex-start bg-light-3 dark:bg-dark-4 mt-3 rounded-xl">
        <SearchIcon />
        <input
          type="text"
          className="explore-search flex-1 focus:border-none"
          placeholder="Search"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />
      </div>

      <div className="explore-inner_container">
        {/* //* Content label */}
        <div className="flex-between w-full px-5">
          <p className="body-bold md:h3-bold ">{ searchedPost? 'Search Result' : 'Popular'}</p>
          <Button variant="ghost">
            <Filter className="size-5 md:size-6.5" />
          </Button>
        </div>

        {/* Content (popular or search) */}

        {searchedPost ? searchedPost.pages[0].total === 0 ?
         <div className='w-full h-full flex-center flex-col gap-3 pt-20 text-foreground/70'>
          <SearchX className='size-10' />
          <h2 className='h3-bold'>Not found</h2>
         </div>
          :  (
          searchedPost?.pages.map((postPages) => (
            <GridPostList postsList={postPages.documents} key={Date.now()} />
          ))
        ) : // Loading state of popular posts
        isLoadingPopularPost ? (
          <div className="w-full h-full flex-center">
            <img src="/assets/animation/loading.gif" alt="loading" className="dark:invert" />
          </div>
        ) : (
          popularPosts.pages.map((page) => (
            <GridPostList postsList={page.documents} key={Date.now()} />
          ))
        )}

        {isFetchingNextSearchedPost ||
          (isFetchingNextPopularPost && (
            <div className="w-full p-5">
              <Loader className="animate-spin duration-1000" />
            </div>
          ))}
      </div>
    </div>
  );
};

export default Explore;
