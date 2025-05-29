import type { GetStaticProps, NextPage } from "next";
import Head from "next/head";
import fs from 'fs';
import path from 'path';
import { useRouter } from "next/router";
import Carousel from "../../components/Carousel";
import getBase64ImageUrl from "../../utils/generateBlurPlaceholder";
import type { ImageProps } from "../../utils/types";

const Home: NextPage = ({ currentPhoto }: { currentPhoto: ImageProps }) => {
  const router = useRouter();
  const { photoId } = router.query;
  let index = Number(photoId);

  const currentPhotoUrl = currentPhoto.public_id;

  return (
    <>
      <Head>
        <title>Next.js Conf 2022 Photos</title>
        <meta property="og:image" content={currentPhotoUrl} />
        <meta name="twitter:image" content={currentPhotoUrl} />
      </Head>
      <main className="mx-auto max-w-[1960px] p-4">
        <Carousel currentPhoto={currentPhoto} index={index} />
      </main>
    </>
  );
};

export default Home;

export const getStaticProps: GetStaticProps = async (context) => {
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

  const currentPhoto = images.find(
    (img) => img.id === Number(context.params.photoId),
  );
  currentPhoto.blurDataUrl = await getBase64ImageUrl(currentPhoto);

  return {
    props: {
      currentPhoto: currentPhoto,
    },
  };
};

export async function getStaticPaths() {
  const imagesDirectory = path.join(process.cwd(), 'public/photos');
  const filenames = fs.readdirSync(imagesDirectory);
  const images = filenames.map((file) => {
    const name = file.split('.')
    return {
      name: name[0],
      id: Number(name[0].split('_')[1]),
      height: '300',
      width: '300',
      public_id: path.join('/photos', file),
    }
  });

  let fullPaths = [];
  for (let i = 0; i < images.length; i++) {
    fullPaths.push({ params: { photoId: i.toString() } });
  }

  return {
    paths: fullPaths,
    fallback: false,
  };
}
