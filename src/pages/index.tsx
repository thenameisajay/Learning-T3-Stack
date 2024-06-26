import { useState } from "react";
import Head from "next/head";

import Image from "next/image";
import { api } from "~/utils/api";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { type RouterOutputs } from "~/utils/api";

import Loading from "~/components/loading";

import { useUser, SignInButton, SignOutButton } from "@clerk/nextjs";
import toast from "react-hot-toast";

dayjs.extend(relativeTime);

const CreatePostWizard = () => {
  const { user } = useUser();
  const isUserSignedIn = useUser().isSignedIn;
  const [input, setInput] = useState("");

  const utils = api.useUtils();

  const { mutate, isLoading: isPosting } = api.posts.create.useMutation({
    onSettled: async () => {
      await utils.posts.getAll.invalidate();
    },
    onError: (e) => {
      const errorMessage = e.data?.zodError?.fieldErrors?.content;
      toast.error(errorMessage?.[0] ?? "An error occurred");
    },
  });

  if (!user) {
    return false;
  }

  return (
    <div className=" absolute bottom-2.5    flex    w-4/12 rounded-xl bg-white/10 p-4  text-white">
      <div className=" flex w-full">
        <Image
          className="mb-2 mr-2 h-8 w-8 rounded-full border-2 border-white bg-white/10"
          width={100}
          height={100}
          src={
            `${user.imageUrl}` ||
            `data:image/svg+xml;base64,${btoa('<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="#ffffff" viewBox="0 0 256 256"><path d="M230.92,212c-15.23-26.33-38.7-45.21-66.09-54.16a72,72,0,1,0-73.66,0C63.78,166.78,40.31,185.66,25.08,212a8,8,0,1,0,13.85,8c18.84-32.56,52.14-52,89.07-52s70.23,19.44,89.07,52a8,8,0,1,0,13.85-8ZM72,96a56,56,0,1,1,56,56A56.06,56.06,0,0,1,72,96Z"></path></svg>')}`
          }
          alt={user.firstName ?? "User"}
        ></Image>
        {isUserSignedIn === true && (
          <>
            <input
              type="text"
              placeholder="What's on your mind?"
              className="w-full bg-transparent px-1 text-white "
              disabled={isPosting}
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
            <button
              className="ml-2 w-24 rounded-md bg-blue-500 px-2 py-1 text-white"
              disabled={isPosting}
              onClick={() => {
                if (input.length < 1) {
                  toast.error("Please enter a message before posting.");
                  return;
                }

                mutate({
                  content: input,
                });
                setInput("");
              }}
            >
              Post
            </button>
          </>
        )}
      </div>
    </div>
  );
};

const noImageAvatar = `data:image/svg+xml;base64,${btoa('<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="#ffffff" viewBox="0 0 256 256"><path d="M230.92,212c-15.23-26.33-38.7-45.21-66.09-54.16a72,72,0,1,0-73.66,0C63.78,166.78,40.31,185.66,25.08,212a8,8,0,1,0,13.85,8c18.84-32.56,52.14-52,89.07-52s70.23,19.44,89.07,52a8,8,0,1,0,13.85-8ZM72,96a56,56,0,1,1,56,56A56.06,56.06,0,0,1,72,96Z"></path></svg>')}`;

const PostView = ({
  data,
}: {
  data: RouterOutputs["posts"]["getAll"] | undefined;
}) => {
  const { user } = useUser();

  const isUserSignedIn = useUser().isSignedIn;

  console.log("User is going", user);
  return (
    <>
      {data && user && (
        <div id="post">
          {data.length > 0
            ? data.map((post) => (
                <div
                  key={post.id}
                  className=" my-4 rounded-xl bg-white/10 p-4 text-white"
                >
                  <div className="flex  w-full flex-col ">
                    <div className=" flex items-start justify-start ">
                      <Image
                        src={user.imageUrl || noImageAvatar}
                        alt={post.authorId || "User"}
                        width={50}
                        height={50}
                        className="mb-2 mr-2 h-8 w-8 rounded-full border-2 border-white bg-white/10"
                      />
                      <h2 className="mx-1">{post.authorId}</h2>
                      <div className="flex w-full items-end justify-end   text-white">
                        <p className="text-end font-thin">
                          ·<span> </span>
                          {`${dayjs(post.createdAt).fromNow()}`}
                        </p>
                      </div>
                    </div>
                  </div>
                  <p>{post.content}</p>
                </div>
              ))
            : isUserSignedIn && (
                <div>
                  <p>No posts yet</p>
                </div>
              )}
        </div>
      )}
    </>
  );
};

const Feed = () => {
  const { data, isLoading } = api.posts.getAll.useQuery();
  const isUserSignedIn = useUser().isSignedIn;

  if (isLoading) {
    return <Loading />;
  }

  if (!data && isUserSignedIn) {
    return <p>No posts yet</p>;
  }

  return <PostView data={data} />;
};

export default function Home() {
  const { user } = useUser();

  const isUserSignedIn = useUser().isSignedIn;

  const { data, isLoading } = api.posts.getAll.useQuery();

  if (user && isLoading) {
    return <Loading />;
  }

  if (user) {
    console.log("User is logged in", user);
  } else {
    console.log("User is not logged in");
  }

  console.log("Posts", data);

  return (
    <>
      <Head>
        <meta name="description" content="Learning create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex h-screen  items-center justify-center">
        <div className=" flex h-screen w-full flex-col items-center justify-center border-x border-slate-400 md:max-w-2xl">
          <div className="     flex   w-full items-end  justify-center  p-4">
            {user ? (
              <>
                <div className=" absolute    right-24 top-4  w-32 rounded-full  bg-blue-500 p-4  text-center text-base text-white ">
                  <SignOutButton />
                </div>
              </>
            ) : (
              !isLoading && (
                <div className="  absolute bottom-80   w-32   rounded-full  bg-blue-500 p-4 text-center text-base  text-white ">
                  <SignInButton />
                </div>
              )
            )}
          </div>

          <div className="flex  h-fit  w-full flex-col gap-4 p-4 text-center">
            <p className="tex text-2xl text-white">
              {isUserSignedIn === true
                ? `Welcome ${user?.firstName}`
                : isLoading
                  ? ""
                  : "Hello there! Please sign in to continue."}
            </p>

            <div className="flex flex-col gap-4">
              <Feed />

              <CreatePostWizard />
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
