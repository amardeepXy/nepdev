import { useGetRecentPosts } from '@/lib/tanstack-query/posts';
import { Loader } from '@/components/shared';
import PostCard from '@/components/shared/PostCard';

const Home = () => {
  const { data: posts, isLoading: isPostLoading, isError, error } = useGetRecentPosts();
  return (
    <section className='flex flex-1' >
      <div className='home-container' >
          <div className='home-posts' >
            <h2 className="h3-bold md:h2-bold text-left w-full" >Home</h2>
            {isPostLoading && !posts? <div className='flex-center h-96'>
              <Loader/>
            </div> : <>
            <ul className='flex flex-col gap-y-6 sm:px-2 w-full' >
              { isError? <h1 className='h2-bold'> {error.message} </h1> : posts.documents?.map((post) => (
                <li key={post.$id} className='w-full' >
                 <PostCard post={post} />
                </li>
              ))}
            </ul>
            {isPostLoading && <Loader />}
            </> 
              }
          </div>
      </div>
    </section>
  )
}

export default Home