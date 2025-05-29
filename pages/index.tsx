import type { NextPage } from "next";
import Head from "next/head";
import fs from 'fs';
import path from 'path';
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useRef } from "react";
import Bridge from "../components/Icons/Bridge";
import Logo from "../components/Icons/Logo";
import Modal from "../components/Modal";
import getBase64ImageUrl from "../utils/generateBlurPlaceholder";
import type { ImageProps } from "../utils/types";
import { useLastViewedPhoto } from "../utils/useLastViewedPhoto";

const Home: NextPage = ({ images }: { images: ImageProps[] }) => {
  const router = useRouter();
  const { photoId } = router.query;
  const [lastViewedPhoto, setLastViewedPhoto] = useLastViewedPhoto();

  const lastViewedPhotoRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    // This effect keeps track of the last viewed photo in the modal to keep the index page in sync when the user navigates back
    if (lastViewedPhoto && !photoId) {
      lastViewedPhotoRef.current.scrollIntoView({ block: "center" });
      setLastViewedPhoto(null);
    }
  }, [photoId, lastViewedPhoto, setLastViewedPhoto]);

  return (
    <>
      <Head>
        <title>Berthieu</title>
        <meta
          property="og:image"
          content="/thanks.jpg"
        />
        <meta
          name="twitter:image"
          content="/thanks.jpg"
        />
      </Head>
      <main className="mx-auto max-w-[1960px] p-4">
        {photoId && (
          <Modal
            images={images}
            onClose={() => {
              setLastViewedPhoto(photoId);
            }}
          />
        )}
        <div className="columns-1 gap-4 sm:columns-2 xl:columns-3 2xl:columns-4">
          <div className="bg-[url(/thanks.jpg)] bg-right bg-cover after:content relative mb-5 flex h-[629px] flex-col items-center justify-between gap-4 overflow-hidden rounded-lg shadow-highlight after:pointer-events-none after:absolute after:inset-0 after:rounded-lg after:shadow-highlight lg:pt-0">
            <h1 className="px-6 pb-8 pt-16 text-5xl font-bold tracking-widest" style={{ fontFamily: 'Eyesome' }}>
              Berthieu
            </h1>
            <div className="bg-black/75 rounded-lg p-6 m-3 max-w-full">
              <p className="text-white mb-2" style={{fontFamily:'Garamont'}}>
                Merci d’avoir mis le feu, vidé le bar et gravé nos mémoires.
              </p>
              <p className="text-2xl text-white text-right" style={{ fontFamily: 'Eyesome' }}>
                Vous êtés splendides !
              </p>
            </div>
          </div>
          {images.map(({ id, public_id, blurDataUrl }) => (
            <Link
              key={id}
              href={`/?photoId=${id}`}
              as={`/p/${id}`}
              ref={id === Number(lastViewedPhoto) ? lastViewedPhotoRef : null}
              shallow
              className="after:content group relative mb-5 block w-full cursor-zoom-in after:pointer-events-none after:absolute after:inset-0 after:rounded-lg after:shadow-highlight"
            >
              <Image
                alt="Next.js Conf photo"
                className="transform rounded-lg brightness-90 transition will-change-auto group-hover:brightness-110"
                style={{ transform: "translate3d(0, 0, 0)" }}
                placeholder="blur"
                blurDataURL={blurDataUrl}
                src={public_id}
                width={720}
                height={480}
                sizes="(max-width: 640px) 100vw,
                  (max-width: 1280px) 50vw,
                  (max-width: 1536px) 33vw,
                  25vw"
              />
            </Link>
          ))}
        </div>
      </main>
      <footer className="p-6 text-center text-white/80 sm:p-12">
        Merci à{" "}
        <a
          href="https://www.gaetannadin.be/"
          target="_blank"
          className="font-semibold hover:text-white"
          rel="noreferrer"
        >
          Gaetan Nadin
        </a>
        , et{" "}
        <a
          href="https://lovelydays-photography.be/"
          target="_blank"
          className="font-semibold hover:text-white"
          rel="noreferrer"
        >
          Daisy Boulanger
        </a>{" "}
        pour les photos.
      </footer>
    </>
  );
};

export default Home;

export async function getStaticProps() {
  const imagesDirectory = path.join(process.cwd(), 'public/photos');
  const filenames = fs.readdirSync(imagesDirectory);
  const images: ImageProps[] = filenames.map((file) => {
    const name = file.split('.')
    return {
      name: name[0],
      id: Number(name[0].split('_')[1]),
      height: '500',
      width: '500',
      public_id: path.join('/photos', file),
    }
  });

  const blurImagePromises = images.map((image: ImageProps) => {
    return getBase64ImageUrl(image);
  });
  const imagesWithBlurDataUrls = await Promise.all(blurImagePromises);

  for (let i = 0; i < images.length; i++) {
    images[i].blurDataUrl = imagesWithBlurDataUrls[i];
  }

  return {
    props: {
      images,
    },
  };
}
