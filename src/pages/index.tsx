import Head from "next/head";

import Image from "next/image";
import { api } from "~/utils/api";

import { useUser, SignInButton, SignOutButton } from "@clerk/nextjs";

export default function Home() {
  const { user } = useUser();

  const isUserSignedIn = useUser().isSignedIn;

  if (user) {
    console.log("User is logged in", user);
  } else {
    console.log("User is not logged in");
  }

  const { data } = api.posts.getAll.useQuery();

  console.log("Posts", data);

  return (
    <>
      <Head>
        <title>Learning T3 app</title>

        <meta name="description" content="Learning create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="">
        <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 ">
          {useUser().isSignedIn === false && (
            <>
              <h1 className="text-5xl font-extrabold tracking-tight text-white sm:text-[5rem]">
                Learning <span className="text-[hsl(280,100%,70%)]">T3</span>{" "}
                App
              </h1>
            </>
          )}

          <p className="text-2xl text-white">
            {isUserSignedIn === true
              ? `Welcome ${user?.firstName}`
              : "Hello there! Please sign in to continue."}
          </p>
          {user ? (
            <>
              <div className="  w-32 rounded-full bg-violet-600 p-4  text-center text-base text-white ">
                <SignOutButton />
              </div>
            </>
          ) : (
            <>
              <div className="  w-32 rounded-full  bg-violet-600  p-4 text-center text-base  text-white ">
                <SignInButton />
              </div>
            </>
          )}
          <div className="flex flex-col gap-4">
            {data && user && (
              <>
                <div id="post">
                  {data ? (
                    <>
                      {data.map((post) => (
                        <div
                          key={post.id}
                          className="rounded-xl bg-white/10 p-4 text-white"
                        >
                          <div className="flex">
                            <Image
                              src={
                                `${user.imageUrl}` ||
                                `data:image/svg+xml;base64,${btoa('<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="#ffffff" viewBox="0 0 256 256"><path d="M230.92,212c-15.23-26.33-38.7-45.21-66.09-54.16a72,72,0,1,0-73.66,0C63.78,166.78,40.31,185.66,25.08,212a8,8,0,1,0,13.85,8c18.84-32.56,52.14-52,89.07-52s70.23,19.44,89.07,52a8,8,0,1,0,13.85-8ZM72,96a56,56,0,1,1,56,56A56.06,56.06,0,0,1,72,96Z"></path></svg>')}`
                              }
                              alt={post.authorId || "User"}
                              width={50}
                              height={50}
                              className="mb-2 mr-2 h-8 w-8 rounded-full border-2 border-white bg-white/10"
                            />
                            <h2>{post.authorId}</h2>
                          </div>
                          <p>{post.content}</p>
                        </div>
                      ))}
                    </>
                  ) : (
                    <div>
                      <p>No posts yet</p>
                    </div>
                  )}
                </div>
              </>
            )}
            <div className="flex flex-col gap-4">
              <div className="rounded-xl bg-white/10 p-4 text-white">
                {isUserSignedIn === true && (
                  <input
                    type="text"
                    placeholder="What's on your mind?"
                    className="w-full bg-transparent px-1 text-white "
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
