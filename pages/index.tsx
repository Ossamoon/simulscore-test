import { GetStaticProps } from "next";
import { VFC, useState, useEffect, useContext } from "react";
import Head from "next/head";
import Link from "next/link";

import { getHomeData, HomeData } from "library/getHomeData";
import { AuthContext } from "components/auth";
import { UserCard } from "components/usercard";

type Props = {
  homeData: HomeData;
};

const Home: VFC<Props> = ({ homeData }) => {
  // Auth
  const { currentUser } = useContext(AuthContext);

  // Twitter Script Element
  useEffect(() => {
    const s = document.createElement("script");
    s.setAttribute("src", "https://platform.twitter.com/widgets.js");
    s.setAttribute("async", "true");
    s.setAttribute("charset", "utf-8");
    document.head.appendChild(s);
  }, []);

  // View State
  const [isOpenUserCard, setIsOpenUserCard] = useState<boolean>(false);

  return (
    <>
      <Head>
        <title>SimulScore</title>
        <meta
          name="description"
          content="クラシック音楽のスコアリーディングを支援する動画・楽譜閲覧サイト"
        />
        <link rel="icon" href="/favicon.ico" />
        <link
          rel="apple-touch-icon"
          type="image/png"
          sizes="180x180"
          href="/apple-touch-icon-180x180.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="192x192"
          href="/icon-192x192.png"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#047857" />
        <meta property="og:url" content="https://www.simulscore.net/" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="SimulScore" />
        <meta
          property="og:description"
          content="クラシック音楽のスコアリーディングを支援する動画・楽譜閲覧サイト"
        />
        <meta property="og:site_name" content="SimulScore" />
        <meta
          property="og:image"
          content="https://www.simulscore.net/ogp.png"
        />
        <meta name="twitter:card" content="summary_large_image" />
      </Head>

      <div className="w-screen flex flex-col overflow-auto">
        {isOpenUserCard ? (
          <>
            <div
              className="absolute inset-0 w-full h-full z-30"
              onClick={() => setIsOpenUserCard(false)}
            ></div>
            <div className="absolute top-16 right-4 z-40">
              <UserCard currentUser={currentUser} />
            </div>
          </>
        ) : null}

        <header className="w-full text-warmGray-100 bg-green-800">
          <div className="flex bg-green-900">
            <div className="flex-grow"></div>
            <div className="flex-none pt-4 pb-2 pr-8">
              {currentUser?.photoURL ? (
                <img
                  className="h-10 w-10 rounded-full cursor-pointer"
                  src={currentUser?.photoURL}
                  alt=""
                  onClick={() => setIsOpenUserCard((b) => !b)}
                />
              ) : (
                <Link href="/signIn">
                  <a className="w-max rounded-lg font-bold text-warmGray-100 hover:text-warmGray-300 text-center border-2 border-warmGray-100 hover:border-warmGray-300 px-2 py-1 cursor-pointer">
                    ログイン
                  </a>
                </Link>
              )}
            </div>
          </div>

          <div className="pt-3 pb-8 text-center tracking-wide">
            <div className="text-lg sm:text-xl mx-auto">Welcome to</div>
            <h1 className="font-extrabold text-5xl sm:text-7xl mx-auto">
              SimulScore
            </h1>
            <p className="text-xs sm:text-sm w-max mx-auto pt-8">
              SimulScoreは
              <br />
              クラシック音楽のスコアリーディングを支援する
              <br />
              動画・楽譜閲覧サイトです
            </p>
          </div>
        </header>

        <main className="px-4 py-10 bg-warmGray-100">
          <p className="text-2xl font-black text-center mb-8 text-green-800">
            対応楽曲一覧
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-x-4 gap-y-8">
            {homeData.composer.map((composer) => {
              return (
                <div key={composer.id} className="bg-white rounded">
                  <div className="bg-green-800 p-1 rounded-t">
                    <p className="mx-auto text-center text-white font-bold text-lg sm:text-xl">
                      {composer.name_jp ?? composer.name}
                    </p>
                  </div>
                  <ul className="px-2 py-1">
                    {composer.musics.map((music) => {
                      return (
                        <li key={music.id}>
                          <Link href={`/view/${music.id}`}>
                            <a className="text-sm sm:text-base text-left text-blue-700 hover:text-blue-500 hover:underline">
                              {music.title_jp ?? music.title}{" "}
                              <span className="text-xs sm:text-sm">
                                {music.opus}
                              </span>
                            </a>
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              );
            })}
          </div>
          <p className="text-2xl font-black text-center mt-20 mb-8 text-green-800">
            更新情報
          </p>
          <div className="max-w-max mx-auto">
            <a
              className="twitter-timeline"
              data-lang="en"
              data-width="600"
              data-height="680"
              data-theme="light"
              href="https://twitter.com/simulscore?ref_src=twsrc%5Etfw"
            >
              Tweets by simulscore
            </a>
          </div>
        </main>

        <footer className="text-center bg-green-800 p-4">
          <small>
            <span className="text-warmGray-100 font-light text-xs">
              &copy; SimulScore 2021
            </span>
          </small>
        </footer>
      </div>
    </>
  );
};

export const getStaticProps: GetStaticProps = async () => {
  const homeData: HomeData | null = await getHomeData();

  if (!homeData) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      homeData,
    },
  };
};

export default Home;
