import { ChevronLeft, Filter, SearchIcon } from "lucide-react";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui";
import { useGetPopularPost } from "@/lib/tanstack-query/posts";
import GridPostList from "@/components/shared/GridPostList";

const Explore = () => {
  const [searchText, setSearchText] = useState("");
  const {
    data: popularPosts,
    isFetchingNextPage: isFetchingNextPopularPost,
    isLoading: isLoadingPopularPost,
    hasNextPage: hasNextpopularPage,
    fetchNextPage,
  } = useGetPopularPost(!!!searchText);

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
  console.log("how much time i am being called");
  return (
    <div className="explore-container">
      <div className="flex-start self-start">
        <Button variant="ghost">
          <ChevronLeft />
        </Button>
        <h2 className="h3-bold dark:text-light-2 text-dark-3 ">Explore</h2>
      </div>
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
        <div className="flex-between w-full px-5">
          <p className="body-bold md:h3-bold ">Popular</p>
          <Button variant="ghost">
            <Filter className="size-5 md:size-6.5" />
          </Button>
        </div>

        {/* Content (popular or search) */}

        {!searchText &&
          // Loading state of popular posts
          (isLoadingPopularPost ? (
            <div className="w-full h-full flex-center">
              <img src="/assets/animation/loading.gif" alt="loading" />
            </div>
          ) : (
            popularPosts.pages.map((page) => (
              <GridPostList postsList={page.documents} key={Date.now()} />
            ))
          ))}
      </div>
    </div>
  );
};

export default Explore;
